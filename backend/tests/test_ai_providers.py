"""
File: backend/tests/test_ai_providers.py
Module: Tests
Responsibility: Verifies AI providers parse SDK responses into the shared provider contract
"""

import pytest

from app.core.config import Settings
from app.services.ai.claude_service import ClaudeProvider
from app.services.ai.deepseek_service import DeepSeekProvider
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
    provider = OpenAIProvider(
        api_key="test-key",
        model="test-openai-model",
        temperature=0.4,
        max_tokens=1500,
        client=client,
    )

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 75}
    assert client.chat.completions.kwargs["model"] == "test-openai-model"
    assert client.chat.completions.kwargs["response_format"] == {"type": "json_object"}
    assert client.chat.completions.kwargs["temperature"] == 0.4
    assert client.chat.completions.kwargs["max_tokens"] == 1500


@pytest.mark.asyncio
async def test_xai_provider_uses_configured_model_and_parses_json():
    client = FakeOpenAIClient()
    provider = XAIProvider(
        api_key="test-key",
        model="test-xai-model",
        temperature=0.5,
        max_tokens=1600,
        client=client,
    )

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 75}
    assert client.chat.completions.kwargs["model"] == "test-xai-model"
    assert client.chat.completions.kwargs["response_format"] == {"type": "json_object"}
    assert client.chat.completions.kwargs["temperature"] == 0.5
    assert client.chat.completions.kwargs["max_tokens"] == 1600


@pytest.mark.asyncio
async def test_deepseek_provider_uses_configured_model_and_parses_json():
    client = FakeOpenAIClient()
    provider = DeepSeekProvider(
        api_key="test-key",
        model="test-deepseek-model",
        temperature=0.5,
        max_tokens=1600,
        client=client,
    )

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 75}
    assert client.chat.completions.kwargs["model"] == "test-deepseek-model"
    assert client.chat.completions.kwargs["response_format"] == {"type": "json_object"}
    assert client.chat.completions.kwargs["temperature"] == 0.5
    assert client.chat.completions.kwargs["max_tokens"] == 1600


@pytest.mark.asyncio
async def test_claude_provider_uses_configured_model_and_parses_json():
    client = FakeClaudeClient()
    provider = ClaudeProvider(
        api_key="test-key",
        model="test-claude-model",
        temperature=0.6,
        max_tokens=1700,
        client=client,
    )

    result = await provider.analyze("prompt")

    assert result == {"overall_score": 82}
    assert client.messages.kwargs["model"] == "test-claude-model"
    assert client.messages.kwargs["temperature"] == 0.6
    assert client.messages.kwargs["max_tokens"] == 1700


def test_factory_passes_env_keys_models_and_generation_settings_to_providers():
    settings = Settings(
        openai_api_key="openai-key",
        anthropic_api_key="anthropic-key",
        xai_api_key="xai-key",
        deepseek_api_key="deepseek-key",
        openai_model="openai-model",
        anthropic_model="anthropic-model",
        xai_model="xai-model",
        deepseek_model="deepseek-model",
        openai_temperature=0.1,
        anthropic_temperature=0.2,
        xai_temperature=0.3,
        deepseek_temperature=0.4,
        openai_max_tokens=1100,
        anthropic_max_tokens=1200,
        xai_max_tokens=1300,
        deepseek_max_tokens=1400,
    )

    openai_provider = get_ai_provider("openai", settings)
    anthropic_provider = get_ai_provider("anthropic", settings)
    xai_provider = get_ai_provider("xai", settings)
    deepseek_provider = get_ai_provider("deepseek", settings)

    assert openai_provider.model == "openai-model"
    assert openai_provider.temperature == 0.1
    assert openai_provider.max_tokens == 1100
    assert anthropic_provider.model == "anthropic-model"
    assert anthropic_provider.temperature == 0.2
    assert anthropic_provider.max_tokens == 1200
    assert xai_provider.model == "xai-model"
    assert xai_provider.temperature == 0.3
    assert xai_provider.max_tokens == 1300
    assert deepseek_provider.model == "deepseek-model"
    assert deepseek_provider.temperature == 0.4
    assert deepseek_provider.max_tokens == 1400
