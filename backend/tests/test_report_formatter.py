"""
File: backend/tests/test_report_formatter.py
Module: Tests
Responsibility: Verifies report validation accepts valid provider output and rejects invalid scores
"""

import pytest
from fastapi import HTTPException

from app.schemas.response import EvaluationReport
from app.services.report.formatter import build_evaluation_report


def test_build_evaluation_report_validates_raw_provider_output():
    report = build_evaluation_report(
        {
            "overall_score": 85,
            "summary": "Strong candidate.",
            "strengths": ["Python"],
            "weaknesses": ["Limited leadership evidence"],
            "skills": [
                {"name": "Python", "score": 90, "evidence": "Listed in experience"}
            ],
            "recommendation": "Proceed",
        }
    )

    assert isinstance(report, EvaluationReport)
    assert report.overall_score == 85


def test_build_evaluation_report_rejects_invalid_score():
    with pytest.raises(Exception):
        build_evaluation_report(
            {
                "overall_score": 101,
                "summary": "Invalid.",
                "strengths": [],
                "weaknesses": [],
                "skills": [],
                "recommendation": "Reject",
            }
        )