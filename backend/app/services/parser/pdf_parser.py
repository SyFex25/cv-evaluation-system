"""
File: backend/app/services/parser/pdf_parser.py
Module: Parser Services
Responsibility: Extracts plain text from text-based PDF files
"""

from pathlib import Path

from fastapi import HTTPException, status
from pypdf import PdfReader


def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    page_texts = [page.extract_text() or "" for page in reader.pages]
    text = "\n".join(page_texts).strip()

    if text:
        return text

    image_count = sum(len(page.images) for page in reader.pages)
    if image_count > 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=(
                "This PDF appears to be image-only or scanned. "
                "Please upload a text-based PDF or DOCX file."
            ),
        )

    return ""