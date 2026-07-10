"""
File: backend/app/api/routes/auth.py
Module: API Routes
Responsibility: Defines local authentication endpoints backed by SQLite users
"""

from fastapi import APIRouter, Depends, Response, status

from app.api.dependencies import get_current_user
from app.core.config import Settings, get_settings
from app.schemas.request import LoginRequest, RegisterRequest
from app.schemas.response import AuthResponse, UserResponse
from app.services.auth.auth_service import login_user, register_user


router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_COOKIE = "access_token"


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    settings: Settings = Depends(get_settings),
) -> UserResponse:
    return register_user(
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
        settings=settings,
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    settings: Settings = Depends(get_settings),
) -> AuthResponse:
    auth_response = login_user(
        email=payload.email,
        password=payload.password,
        settings=settings,
        remember=payload.remember,
    )
    _set_auth_cookie(response, auth_response.access_token, settings, remember=payload.remember)
    return auth_response


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    settings: Settings = Depends(get_settings),
) -> None:
    _clear_auth_cookie(response, settings)


@router.get("/me", response_model=UserResponse)
async def me(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return current_user


def _set_auth_cookie(
    response: Response,
    token: str,
    settings: Settings,
    remember: bool,
) -> None:
    # httpOnly so browser JavaScript cannot read the token (mitigates XSS token theft).
    # Persistent cookie when "remember me" is checked, otherwise a session cookie.
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
        path="/",
        max_age=settings.auth_remember_expire_minutes * 60 if remember else None,
    )


def _clear_auth_cookie(response: Response, settings: Settings) -> None:
    response.delete_cookie(
        key=ACCESS_TOKEN_COOKIE,
        path="/",
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
    )