"""
File: backend/app/api/routes/settings.py
Module: API Routes
Responsibility: Exposes safe runtime settings needed by the frontend
"""

from fastapi import APIRouter, Depends

from app.core.config import ProviderName, Settings, get_settings
from app.schemas.request import ProviderRuntimeSettingsUpdate
from app.schemas.response import SettingsResponse
from app.services.settings_service import build_settings_response, update_provider_runtime_settings


router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
async def read_settings(settings: Settings = Depends(get_settings)) -> SettingsResponse:
    return build_settings_response(settings)


@router.put("/providers/{provider_name}", response_model=SettingsResponse)
async def update_provider_settings(
    provider_name: ProviderName,
    payload: ProviderRuntimeSettingsUpdate,
    settings: Settings = Depends(get_settings),
) -> SettingsResponse:
    return update_provider_runtime_settings(provider_name, payload, settings)
