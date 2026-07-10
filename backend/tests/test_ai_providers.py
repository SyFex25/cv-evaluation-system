"""
File: backend/tests/test_ai_providers.py
Module: Tests
Responsibility: Verifies AI providers parse SDK responses into the shared provider contract
"""

import pytest

from app.core.config import Settings
from app.services.ai.claude_service import ClaudeProvider
from app.services.ai.factory import get_ai_provider
from app.services.ai.openai_service import OpenAIProvider
from app.services.ai.xai_service import XAIProvider


class FakeOpenAIMessage:
    content = '{"overall_score": 75}'


class FakeOpenAIChoice:
    message = FakeOpenAIMessage()


class FakeOpenAIResponse:
    choices = [FakeOpenAIChoice()]


class FakeChatCompletions:
    def __init__(self):
        self.kwargs = None

    async def create(self, **kwargs):
        self.kwargs = kwargs
        return FakeOpenAIResponse()


class FakeChat:
    def __init__(self):
        self.completions = FakeChatCompletions()


class FakeOpenAIClient:
    def __init__(self):
        self.chat = FakeChat()


class FakeClaudeTextBlock:
    type = "text"
    text = '{"overall_score": 82}'


class FakeClaudeResponse:
    content = [FakeClaudeTextBlock()]


class FakeClaudeMessages:
    def __init__(self):
        self.kwargs = None

    async def create(self, **kwargs):
        self.kwargs = kwargs
        return FakeClaudeResponse()


class FakeClaudeClient:
    def __init__(self):
        self.messages = FakeClaudeMessages()


@pytest.mark.asyncio
async def test_openai_provider_uses_configured_model_and_parses_json():
    client = FakeOpenAIClient()
    provider = OpenAIProvider(api_key="test-key", model="test-openai-model", client=client)

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 75}
    assert client.chat.completions.kwargs["model"] == "test-openai-model"
    assert client.chat.completions.kwargs["response_format"] == {"type": "json_object"}


@pytest.mark.asyncio
async def test_xai_provider_uses_configured_model_and_parses_json():
    client = FakeOpenAIClient()
    provider = XAIProvider(api_key="test-key", model="test-xai-model", client=client)

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 75}
    assert client.chat.completions.kwargs["model"] == "test-xai-model"
    assert client.chat.completions.kwargs["response_format"] == {"type": "json_object"}


@pytest.mark.asyncio
async def test_claude_provider_uses_configured_model_and_parses_json():
    client = FakeClaudeClient()
    provider = ClaudeProvider(api_key="test-key", model="test-claude-model", client=client)

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 82}
    assert client.messages.kwargs["model"] == "test-claude-model"


def test_factory_passes_env_keys_and_models_to_providers():
    settings = Settings(
        openai_api_key="openai-key",
        anthropic_api_key="anthropic-key",
        xai_api_key="xai-key",
        openai_model="openai-model",
        anthropic_model="anthropic-model",
        xai_model="xai-model",
    )

    assert get_ai_provider("openai", settings).model == "openai-model"
    assert get_ai_provider("anthropic", settings).model == "anthropic-model"
    assert get_ai_provider("xai", settings).model == "xai-model"