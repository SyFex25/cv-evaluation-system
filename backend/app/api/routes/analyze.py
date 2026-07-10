"""
File: backend/app/api/routes/analyze.py
Module: API Routes
Responsibility: Defines the authenticated CV analysis upload endpoint and delegates workflow logic to services
"""

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.dependencies import get_current_user
from app.core.config import ProviderName, Settings, get_settings
from app.schemas.response import AnalyzeResponse, UserResponse
from app.services.evaluation import evaluate_cv


router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=AnalyzeResponse)
async def analyze_cv(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    provider: ProviderName | None = Form(default=None),
    settings: Settings = Depends(get_settings),
    current_user: UserResponse = Depends(get_current_user),
) -> AnalyzeResponse:
    return await evaluate_cv(
        file=file,
        job_description=job_description,
        provider_name=provider,
        settings=settings,
    )
