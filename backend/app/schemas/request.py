"""
File: backend/app/schemas/request.py
Module: Schemas
Responsibility: Defines request schemas for CV analysis and authentication
"""

from typing import Literal

from pydantic import BaseModel, Field


ProviderName = Literal["openai", "anthropic", "xai"]


class AnalyzeOptions(BaseModel):
    provider: ProviderName | None = Field(
        default=None,
        description="Optional AI provider override for this request.",
    )


class RegisterRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=128)
    remember: bool = Field(default=False)