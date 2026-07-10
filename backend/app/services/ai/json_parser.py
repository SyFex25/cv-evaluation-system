"""
File: backend/app/services/ai/json_parser.py
Module: AI Services
Responsibility: Parses JSON objects returned by AI provider responses
"""

import json
from typing import Any

from fastapi import HTTPException, status


def parse_json_object(content: str) -> dict[str, Any]:
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider returned invalid JSON.",
        ) from exc

    if not isinstance(parsed, dict):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider returned JSON that is not an object.",
        )

    return parsed