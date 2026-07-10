"""
File: backend/app/services/report/formatter.py
Module: Report Services
Responsibility: Validates raw AI output into the structured evaluation report schema
"""

from typing import Any

from app.schemas.response import EvaluationReport


def build_evaluation_report(raw_report: dict[str, Any]) -> EvaluationReport:
    return EvaluationReport.model_validate(raw_report)