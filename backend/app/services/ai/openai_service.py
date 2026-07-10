"""
File: backend/app/services/ai/openai_service.py
Module: AI Services
Responsibility: Contains OpenAI provider integration boundary
"""

from typing import Any

from openai import AsyncOpenAI

from app.services.ai.base import AIProvider
from app.services.ai.json_parser import parse_json_object


class OpenAIProvider(AIProvider):
    name = "openai"

    def __init__(
        self,
        api_key: str,
        model: str,
        client: AsyncOpenAI | None = None,
    ) -> None:
        self.model = model
        self.client = client or AsyncOpenAI(api_key=api_key)

    async def analyze(self, prompt: str) -> dict[str, Any]:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        content = response.choices[0].message.content or ""
        return parse_json_object(content)