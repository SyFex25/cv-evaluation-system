"""
File: backend/tests/test_analyze_auth.py
Module: Tests
Responsibility: Verifies CV analysis route requires authentication before evaluation
"""

from pathlib import Path

from fastapi.testclient import TestClient

from app.api.routes import analyze
from app.core.config import Settings, get_settings
from app.main import app
from app.schemas.response import AnalyzeResponse, EvaluationReport


TEST_DATABASE_PATH = Path(__file__).resolve().parent / "analyze-auth-test.db"


def override_settings() -> Settings:
    return Settings(
        auth_database_path=TEST_DATABASE_PATH,
        auth_token_secret="test-secret",
        auth_token_expire_minutes=15,
        openai_api_key="test-key",
    )


def setup_function():
    TEST_DATABASE_PATH.unlink(missing_ok=True)
    app.dependency_overrides[get_settings] = override_settings


def teardown_function():
    app.dependency_overrides.clear()
    TEST_DATABASE_PATH.unlink(missing_ok=True)


def test_analyze_rejects_missing_bearer_token():
    client = TestClient(app)

    response = client.post(
        "/api/analyze",
        files={"file": ("candidate.pdf", b"pdf bytes", "application/pdf")},
        data={"provider": "openai"},
    )

    assert response.status_code == 401


def test_analyze_accepts_authenticated_user(monkeypatch):
    async def fake_evaluate_cv(file, settings, provider_name=None):
        return AnalyzeResponse(
            provider="openai",
            report=EvaluationReport(
                overall_score=80,
                summary="Good fit.",
                strengths=["Python"],
                weaknesses=["Limited leadership evidence"],
                skills=[
                    {
                        "name": "Python",
                        "score": 85,
                        "evidence": "Project experience",
                    }
                ],
                recommendation="Proceed",
            ),
        )

    monkeypatch.setattr(analyze, "evaluate_cv", fake_evaluate_cv)
    client = TestClient(app)
    client.post(
        "/api/auth/register",
        json={"email": "hr@calvin.ac.id", "password": "password123"},
    )
    login_response = client.post(
        "/api/auth/login",
        json={"email": "hr@calvin.ac.id", "password": "password123"},
    )
    token = login_response.json()["access_token"]

    response = client.post(
        "/api/analyze",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("candidate.pdf", b"pdf bytes", "application/pdf")},
        data={"provider": "openai"},
    )

    assert response.status_code == 200
    assert response.json()["provider"] == "openai"