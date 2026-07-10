"""
File: backend/app/api/dependencies.py
Module: API
Responsibility: Provides shared FastAPI dependencies for authenticated routes
"""

from fastapi import Cookie, Depends, Header, HTTPException, status

from app.core.config import Settings, get_settings
from app.schemas.response import UserResponse
from app.services.auth.auth_service import get_user_from_token


def get_current_user(
    access_token: str | None = Cookie(default=None),
    authorization: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> UserResponse:
    token = access_token or _extract_bearer_token(authorization)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication is required.",
        )

    return get_user_from_token(token, settings)


def _extract_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    return token