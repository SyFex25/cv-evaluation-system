"""
File: backend/app/services/auth/auth_service.py
Module: Auth Services
Responsibility: Manages local SQLite users, password verification, and access token creation
"""

import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from fastapi import HTTPException, status

from app.core.config import Settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.schemas.response import AuthResponse, UserResponse


EMAIL_VALIDATION_MESSAGE = "A valid email address is required."


def register_user(
    email: str,
    password: str,
    full_name: str | None,
    settings: Settings,
) -> UserResponse:
    normalized_email = _normalize_email(email)
    _ensure_allowed_email_domain(normalized_email, settings.auth_allowed_email_domain)
    initialize_auth_database(settings.auth_database_path)

    try:
        with _connect(settings.auth_database_path) as connection:
            cursor = connection.execute(
                """
                INSERT INTO users (email, password_hash, full_name)
                VALUES (?, ?, ?)
                """,
                (normalized_email, hash_password(password), _normalize_name(full_name)),
            )
            connection.commit()
            user_id = int(cursor.lastrowid)
    except sqlite3.IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        ) from exc

    return UserResponse(id=user_id, email=normalized_email, full_name=_normalize_name(full_name))


def login_user(
    email: str,
    password: str,
    settings: Settings,
    remember: bool = False,
) -> AuthResponse:
    normalized_email = _normalize_email(email)
    _ensure_allowed_email_domain(normalized_email, settings.auth_allowed_email_domain)
    initialize_auth_database(settings.auth_database_path)

    user_row = _get_user_by_email(normalized_email, settings.auth_database_path)
    if user_row is None or not verify_password(password, user_row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user = _row_to_user_response(user_row)
    expire_minutes = (
        settings.auth_remember_expire_minutes if remember else settings.auth_token_expire_minutes
    )
    token = create_access_token(
        subject=str(user.id),
        secret_key=settings.auth_token_secret,
        expire_minutes=expire_minutes,
    )
    return AuthResponse(access_token=token, user=user)


def get_user_from_token(token: str, settings: Settings) -> UserResponse:
    payload = decode_access_token(token, settings.auth_token_secret)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        )

    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not user_id.isdigit():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
        )

    initialize_auth_database(settings.auth_database_path)
    with _connect(settings.auth_database_path) as connection:
        user_row = connection.execute(
            "SELECT id, email, full_name, password_hash FROM users WHERE id = ?",
            (int(user_id),),
        ).fetchone()

    if user_row is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
        )

    return _row_to_user_response(user_row)


def initialize_auth_database(database_path: Path) -> None:
    database_path.parent.mkdir(parents=True, exist_ok=True)
    with _connect(database_path) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()


def _get_user_by_email(email: str, database_path: Path) -> sqlite3.Row | None:
    with _connect(database_path) as connection:
        return connection.execute(
            "SELECT id, email, full_name, password_hash FROM users WHERE email = ?",
            (email,),
        ).fetchone()


@contextmanager
def _connect(database_path: Path) -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
    finally:
        connection.close()


def _row_to_user_response(row: sqlite3.Row) -> UserResponse:
    return UserResponse(id=row["id"], email=row["email"], full_name=row["full_name"])


def _normalize_email(email: str) -> str:
    normalized_email = email.strip().lower()
    if "@" not in normalized_email or normalized_email.startswith("@") or normalized_email.endswith("@"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=EMAIL_VALIDATION_MESSAGE,
        )
    return normalized_email


def _ensure_allowed_email_domain(email: str, allowed_domain: str) -> None:
    normalized_domain = allowed_domain.strip().lower()
    if not email.endswith(f"@{normalized_domain}"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Hanya email dengan domain @{normalized_domain} yang diizinkan untuk masuk.",
        )


def _normalize_name(full_name: str | None) -> str | None:
    if full_name is None:
        return None
    normalized_name = full_name.strip()
    return normalized_name or None