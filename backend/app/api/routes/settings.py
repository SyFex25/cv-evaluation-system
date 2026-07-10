"""
File: backend/app/api/routes/settings.py
Module: API Routes
Responsibility: Exposes safe runtime settings needed by the frontend
"""

from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.core.constants import MAX_UPLOAD_SIZE_BYTES, SUPPORTED_FILE_EXTENSIONS
from app.schemas.response import SettingsResponse


router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
async def read_settings(settings: Settings = Depends(get_settings)) -> SettingsResponse:
    return SettingsResponse(
        default_provider=settings.default_ai_provider,
        available_providers=["openai", "anthropic", "xai"],
        max_upload_size_bytes=MAX_UPLOAD_SIZE_BYTES,
        supported_file_extensions=sorted(SUPPORTED_FILE_EXTENSIONS),
    )