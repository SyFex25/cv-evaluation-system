"""
File: backend/app/services/parser/docx_parser.py
Module: Parser Services
Responsibility: Extracts plain text from DOCX files
"""

from pathlib import Path

from docx import Document


def extract_docx_text(file_path: Path) -> str:
    document = Document(str(file_path))
    return "\n".join(paragraph.text for paragraph in document.paragraphs).strip()