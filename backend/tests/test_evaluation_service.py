"""
File: backend/tests/test_evaluation_service.py
Module: Tests
Responsibility: Verifies the evaluation workflow uses temporary files and returns validated reports
"""

from pathlib import Path
from types import SimpleNamespace

import pytest

from app.core.config import Settings
from app.schemas.response import EvaluationReport
from app.services import evaluation


class FakeUploadFile:
    filename = "candidate.pdf"
    content_type = "application/pdf"

    def __init__(self, content: bytes):
        self._content = content
        self._read = False

    async def read(self, size: int = -1) -> bytes:
        if self._read:
            return b""
        self._read = True
        return self._content


class FakeProvider:
    name = "openai"

    async def analyze(self, prompt: str) -> dict:
        assert "Frontend Developer" in prompt
        assert "Candidate CV text" in prompt
        return {
            "overall_score": 80,
            "summary": "Kandidat cukup sesuai untuk posisi ini.",
            "strengths": ["Python"],
            "weaknesses": ["Belum ada pengalaman manajemen"],
            "skills": [
                {"name": "Python", "score": 85, "evidence": "Project experience"}
            ],
            "recommendation": "Layak diproses ke tahap berikutnya.",
        }


@pytest.mark.asyncio
async def test_evaluate_cv_uses_tempfile_and_returns_valid_report(monkeypatch):
    captured_path = SimpleNamespace(value=None)

    def fake_extract_document_text(file_path: Path) -> str:
        captured_path.value = file_path
        assert file_path.exists()
        return "Candidate CV text"

    def fake_get_ai_provider(provider_name, settings):
        return FakeProvider()

    monkeypatch.setattr(evaluation, "extract_document_text", fake_extract_document_text)
    monkeypatch.setattr(evaluation, "get_ai_provider", fake_get_ai_provider)

    response = await evaluation.evaluate_cv(
        file=FakeUploadFile(b"pdf bytes"),
        job_description="Frontend Developer",
        settings=Settings(openai_api_key="test-key"),
    )

    assert response.provider == "openai"
    assert isinstance(response.report, EvaluationReport)
    assert captured_path.value is not None
    assert not captured_path.value.exists()
