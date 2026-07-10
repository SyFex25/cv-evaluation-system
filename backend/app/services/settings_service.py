"""
File: backend/app/services/settings_service.py
Module: Services
Responsibility: Manages safe runtime application settings exposed through the API
"""

from fastapi import HTTPException, status

from app.core.config import ProviderName, Settings
from app.core.constants import MAX_UPLOAD_SIZE_BYTES, SUPPORTED_FILE_EXTENSIONS
from app.schemas.request import ProviderRuntimeSettingsUpdate
from app.schemas.response import SettingsResponse


AVAILABLE_MODELS: dict[ProviderName, list[str]] = {
    "openai": ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"],
    "anthropic": [
        "claude-haiku-4-6",
        "claude-sonnet-4-6",
        "claude-opus-4-6",
    ],
    "xai": ["grok-4"],
    "deepseek": ["deepseek-chat"],
}


def build_settings_response(settings: Settings) -> SettingsResponse:
    return SettingsResponse(
        default_provider=settings.default_ai_provider,
        available_providers=["openai", "anthropic", "xai", "deepseek"],
        provider_settings=[
            {
                "provider": "openai",
                "model": settings.openai_model,
                "available_models": AVAILABLE_MODELS["openai"],
                "temperature": settings.openai_temperature,
                "max_tokens": settings.openai_max_tokens,
            },
            {
                "provider": "anthropic",
                "model": settings.anthropic_model,
                "available_models": AVAILABLE_MODELS["anthropic"],
                "temperature": settings.anthropic_temperature,
                "max_tokens": settings.anthropic_max_tokens,
            },
            {
                "provider": "xai",
                "model": settings.xai_model,
                "available_models": AVAILABLE_MODELS["xai"],
                "temperature": settings.xai_temperature,
                "max_tokens": settings.xai_max_tokens,
            },
            {
                "provider": "deepseek",
                "model": settings.deepseek_model,
                "available_models": AVAILABLE_MODELS["deepseek"],
                "temperature": settings.deepseek_temperature,
                "max_tokens": settings.deepseek_max_tokens,
            },
        ],
        max_upload_size_bytes=MAX_UPLOAD_SIZE_BYTES,
        supported_file_extensions=sorted(SUPPORTED_FILE_EXTENSIONS),
    )


def update_provider_runtime_settings(
    provider_name: ProviderName,
    payload: ProviderRuntimeSettingsUpdate,
    settings: Settings,
) -> SettingsResponse:
    if payload.model not in AVAILABLE_MODELS[provider_name]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model tidak tersedia untuk provider yang dipilih.",
        )

    if provider_name == "anthropic":
        settings.anthropic_model = payload.model
        settings.anthropic_temperature = payload.temperature
        settings.anthropic_max_tokens = payload.max_tokens
    elif provider_name == "xai":
        settings.xai_model = payload.model
        settings.xai_temperature = payload.temperature
        settings.xai_max_tokens = payload.max_tokens
    elif provider_name == "deepseek":
        settings.deepseek_model = payload.model
        settings.deepseek_temperature = payload.temperature
        settings.deepseek_max_tokens = payload.max_tokens
    else:
        settings.openai_model = payload.model
        settings.openai_temperature = payload.temperature
        settings.openai_max_tokens = payload.max_tokens

    if payload.set_as_default:
        settings.default_ai_provider = provider_name

    return build_settings_response(settings)
