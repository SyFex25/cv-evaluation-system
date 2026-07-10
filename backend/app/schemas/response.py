"""
File: backend/app/schemas/response.py
Module: Schemas
Responsibility: Defines structured API response models for CV evaluation and authentication
"""

from pydantic import BaseModel, Field


class SkillAssessment(BaseModel):
    name: str
    score: int = Field(ge=0, le=100)
    evidence: str


class EvaluationReport(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    skills: list[SkillAssessment]
    recommendation: str


class AnalyzeResponse(BaseModel):
    provider: str
    report: EvaluationReport


class HealthResponse(BaseModel):
    status: str


class SettingsResponse(BaseModel):
    default_provider: str
    available_providers: list[str]
    max_upload_size_bytes: int
    supported_file_extensions: list[str]


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse