"""
File: backend/app/core/security.py
Module: Core
Responsibility: Provides password hashing and signed bearer token helpers for authentication
"""

import base64
import hashlib
import hmac
import json
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any


PASSWORD_HASH_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_HASH_ITERATIONS,
    )
    return ":".join(
        [
            "pbkdf2_sha256",
            str(PASSWORD_HASH_ITERATIONS),
            _base64url_encode(salt),
            _base64url_encode(password_hash),
        ]
    )


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations, salt, expected_hash = stored_hash.split(":", 3)
    except ValueError:
        return False

    if algorithm != "pbkdf2_sha256":
        return False

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        _base64url_decode(salt),
        int(iterations),
    )
    return hmac.compare_digest(_base64url_encode(password_hash), expected_hash)


def create_access_token(subject: str, secret_key: str, expire_minutes: int) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    expires_at = datetime.now(UTC) + timedelta(minutes=expire_minutes)
    payload = {"sub": subject, "exp": int(expires_at.timestamp())}

    encoded_header = _base64url_encode_json(header)
    encoded_payload = _base64url_encode_json(payload)
    signing_input = f"{encoded_header}.{encoded_payload}"
    signature = _sign(signing_input, secret_key)
    return f"{signing_input}.{signature}"


def decode_access_token(token: str, secret_key: str) -> dict[str, Any] | None:
    try:
        encoded_header, encoded_payload, signature = token.split(".", 2)
    except ValueError:
        return None

    signing_input = f"{encoded_header}.{encoded_payload}"
    expected_signature = _sign(signing_input, secret_key)
    if not hmac.compare_digest(signature, expected_signature):
        return None

    payload = json.loads(_base64url_decode(encoded_payload))
    expires_at = int(payload.get("exp", 0))
    if expires_at < int(datetime.now(UTC).timestamp()):
        return None

    return payload


def _sign(value: str, secret_key: str) -> str:
    digest = hmac.new(
        secret_key.encode("utf-8"),
        value.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _base64url_encode(digest)


def _base64url_encode_json(value: dict[str, Any]) -> str:
    return _base64url_encode(json.dumps(value, separators=(",", ":")).encode("utf-8"))


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)