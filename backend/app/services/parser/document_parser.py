"""
File: backend/app/services/parser/document_parser.py
Module: Parser Services
Responsibility: Dispatches document text extraction to the parser for the uploaded file type
"""

from pathlib import Path

from fastapi import HTTPException, status

from app.services.parser.docx_parser import extract_docx_text
from app.services.parser.pdf_parser import extract_pdf_text


def extract_document_text(file_path: Path) -> str:
    extension = file_path.suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    if extension == ".docx":
        return extract_docx_text(file_path)

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported file type.",
    )