"""
File: backend/app/services/ai/claude_service.py
Module: AI Services
Responsibility: Contains Anthropic Claude provider integration boundary
"""

from typing import Any

from anthropic import AsyncAnthropic

from app.services.ai.base import AIProvider
from app.services.ai.json_parser import parse_json_object


class ClaudeProvider(AIProvider):
    name = "anthropic"

    def __init__(
        self,
        api_key: str,
        model: str,
        client: AsyncAnthropic | None = None,
    ) -> None:
        self.model = model
        self.client = client or AsyncAnthropic(api_key=api_key)

    async def analyze(self, prompt: str) -> dict[str, Any]:
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            temperature=0.2,
            messages=[{"role": "user", "content": prompt}],
        )
        content = "".join(
            block.text for block in response.content if getattr(block, "type", None) == "text"
        )
        return parse_json_object(content)