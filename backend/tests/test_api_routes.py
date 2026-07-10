"""
File: backend/tests/test_api_routes.py
Module: Tests
Responsibility: Verifies public API routes return expected structured responses
"""

from fastapi.testclient import TestClient

from app.main import app


def test_health_route_returns_ok():
    client = TestClient(app)

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_settings_route_exposes_safe_runtime_settings():
    client = TestClient(app)

    response = client.get("/api/settings")

    assert response.status_code == 200
    body = response.json()
    assert body["available_providers"] == ["openai", "anthropic", "xai"]
    assert "openai_api_key" not in body