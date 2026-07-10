"""
File: backend/app/api/router.py
Module: API
Responsibility: Composes route modules into the application API router
"""

from fastapi import APIRouter

from app.api.routes import analyze, auth, health, settings


api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(settings.router)
api_router.include_router(auth.router)
api_router.include_router(analyze.router)