"""
File: backend/app/api/routes/health.py
Module: API Routes
Responsibility: Defines the health check endpoint
"""

from fastapi import APIRouter

from app.schemas.response import HealthResponse


router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok")