"""
File: backend/app/services/ai/base.py
Module: AI Services
Responsibility: Defines the shared interface all AI providers must implement
"""

from abc import ABC, abstractmethod
from typing import Any


class AIProvider(ABC):
    name: str

    @abstractmethod
    async def analyze(self, prompt: str) -> dict[str, Any]:
        """Return provider output as a JSON-compatible dictionary."""