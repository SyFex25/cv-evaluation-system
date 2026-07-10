"""
File: backend/app/core/config.py
Module: Core
Responsibility: Loads application configuration and environment variables
"""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


ProviderName = Literal["openai", "anthropic", "xai", "deepseek"]
BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    app_name: str = "CV Evaluation System"
    api_prefix: str = "/api"
    default_ai_provider: ProviderName = "openai"

    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    xai_api_key: str | None = None
    deepseek_api_key: str | None = None

    openai_model: str = "gpt-4o-mini"
    anthropic_model: str = "claude-3-5-haiku-20241022"
    xai_model: str = "grok-4"
    deepseek_model: str = "deepseek-chat"
    openai_temperature: float = Field(default=0.2, ge=0, le=1)
    anthropic_temperature: float = Field(default=0.2, ge=0, le=1)
    xai_temperature: float = Field(default=0.2, ge=0, le=1)
    deepseek_temperature: float = Field(default=0.2, ge=0, le=1)
    openai_max_tokens: int = Field(default=2000, ge=512, le=4096)
    anthropic_max_tokens: int = Field(default=2000, ge=512, le=4096)
    xai_max_tokens: int = Field(default=2000, ge=512, le=4096)
    deepseek_max_tokens: int = Field(default=2000, ge=512, le=4096)

    auth_database_path: Path = BACKEND_DIR / "database" / "auth.db"
    auth_token_secret: str = "development-only-change-this-secret"
    auth_token_expire_minutes: int = 60
    auth_remember_expire_minutes: int = 60 * 24 * 30
    auth_allowed_email_domain: str = "calvin.ac.id"
    auth_cookie_secure: bool = False

    cors_allow_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("auth_database_path", mode="after")
    @classmethod
    def resolve_auth_database_path(cls, value: Path) -> Path:
        if value.is_absolute():
            return value
        return BACKEND_DIR / value


@lru_cache
def get_settings() -> Settings:
    return Settings()
