"""
File: backend/tests/test_api_routes.py
Module: Tests
Responsibility: Verifies public API routes return expected structured responses
"""

from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
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
    assert body["provider_settings"][0]["provider"] == "openai"
    assert "available_models" in body["provider_settings"][0]
    assert "temperature" in body["provider_settings"][0]
    assert "max_tokens" in body["provider_settings"][0]
    assert "openai_api_key" not in body


def test_settings_route_updates_provider_runtime_settings():
    runtime_settings = Settings(openai_api_key="test-key")

    def override_settings() -> Settings:
        return runtime_settings

    app.dependency_overrides[get_settings] = override_settings
    client = TestClient(app)

    try:
        response = client.put(
            "/api/settings/providers/openai",
            json={
                "model": "gpt-4o",
                "temperature": 0.6,
                "max_tokens": 1536,
                "set_as_default": True,
            },
        )

        assert response.status_code == 200
        body = response.json()
        openai_settings = body["provider_settings"][0]
        assert body["default_provider"] == "openai"
        assert openai_settings["model"] == "gpt-4o"
        assert openai_settings["temperature"] == 0.6
        assert openai_settings["max_tokens"] == 1536
        assert runtime_settings.openai_model == "gpt-4o"
        assert runtime_settings.openai_temperature == 0.6
        assert runtime_settings.openai_max_tokens == 1536
    finally:
        app.dependency_overrides.clear()
