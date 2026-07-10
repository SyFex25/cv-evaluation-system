"""
File: backend/app/services/ai/deepseek_service.py
Module: AI Services
Responsibility: Contains DeepSeek provider integration boundary
"""

from typing import Any

from openai import AsyncOpenAI

from app.services.ai.base import AIProvider
from app.services.ai.json_parser import parse_json_object


class DeepSeekProvider(AIProvider):
    name = "deepseek"

    def __init__(
        self,
        api_key: str,
        model: str,
        temperature: float = 0.2,
        max_tokens: int = 2000,
        client: AsyncOpenAI | None = None,
    ) -> None:
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.client = client or AsyncOpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com/v1",
        )

    async def analyze(self, prompt: str) -> dict[str, Any]:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        content = response.choices[0].message.content or ""
        return parse_json_object(content)
