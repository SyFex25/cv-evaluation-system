"""
File: backend/app/services/ai/factory.py
Module: AI Services
Responsibility: Selects and configures AI providers from application settings
"""

from fastapi import HTTPException, status

from app.core.config import ProviderName, Settings
from app.services.ai.base import AIProvider
from app.services.ai.claude_service import ClaudeProvider
from app.services.ai.openai_service import OpenAIProvider
from app.services.ai.xai_service import XAIProvider


def get_ai_provider(provider_name: ProviderName, settings: Settings) -> AIProvider:
    if provider_name == "openai":
        if not settings.openai_api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="OpenAI provider is not configured.",
            )
        return OpenAIProvider(settings.openai_api_key, settings.openai_model)

    if provider_name == "anthropic":
        if not settings.anthropic_api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Anthropic provider is not configured.",
            )
        return ClaudeProvider(settings.anthropic_api_key, settings.anthropic_model)

    if provider_name == "xai":
        if not settings.xai_api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="xAI provider is not configured.",
            )
        return XAIProvider(settings.xai_api_key, settings.xai_model)

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported AI provider.",
    )