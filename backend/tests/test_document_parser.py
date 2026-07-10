"""
File: backend/tests/test_document_parser.py
Module: Tests
Responsibility: Verifies document parser dispatch rejects unsupported or non-extractable files
"""

from pathlib import Path

import pytest
from fastapi import HTTPException

from app.services.parser.document_parser import extract_document_text
from app.services.parser.pdf_parser import extract_pdf_text


SCANNED_SAMPLE_PDF = (
    Path(__file__).resolve().parents[2]
    / "notebooks"
    / "datasets"
    / "ResumesV2"
    / "Accountant"
    / "0.pdf"
)


def test_extract_document_text_rejects_unknown_extension():
    with pytest.raises(HTTPException) as exc_info:
        extract_document_text(Path("cv.txt"))

    assert exc_info.value.status_code == 400


def test_extract_pdf_text_rejects_scanned_pdf():
    with pytest.raises(HTTPException) as exc_info:
        extract_pdf_text(SCANNED_SAMPLE_PDF)

    assert exc_info.value.status_code == 422
    assert "text-based PDF or DOCX" in exc_info.value.detail