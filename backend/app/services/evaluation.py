"""
File: backend/app/services/evaluation.py
Module: Services
Responsibility: Orchestrates upload validation, document parsing, prompting, AI analysis, response validation, and cleanup
"""

from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import HTTPException, UploadFile, status

from app.core.config import ProviderName, Settings
from app.core.constants import (
    MAX_UPLOAD_SIZE_BYTES,
    SUPPORTED_CONTENT_TYPES,
    SUPPORTED_FILE_EXTENSIONS,
)
from app.prompts.hr_prompt import build_hr_evaluation_prompt
from app.schemas.response import AnalyzeResponse
from app.services.ai.factory import get_ai_provider
from app.services.parser.document_parser import extract_document_text
from app.services.report.formatter import build_evaluation_report


async def evaluate_cv(
    file: UploadFile,
    job_description: str,
    settings: Settings,
    provider_name: ProviderName | None = None,
) -> AnalyzeResponse:
    _validate_job_description(job_description)
    _validate_upload(file)

    selected_provider = provider_name or settings.default_ai_provider
    ai_provider = get_ai_provider(selected_provider, settings)
    temp_path = await _write_upload_to_temp_file(file)

    try:
        cv_text = extract_document_text(temp_path)
        if not cv_text:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Could not extract text from the uploaded CV.",
            )

        prompt = build_hr_evaluation_prompt(
            job_description=job_description.strip(),
            cv_text=cv_text,
        )
        raw_report = await ai_provider.analyze(prompt)
        report = build_evaluation_report(raw_report)

        return AnalyzeResponse(provider=ai_provider.name, report=report)
    finally:
        temp_path.unlink(missing_ok=True)


def _validate_job_description(job_description: str) -> None:
    if not job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is required.",
        )


def _validate_upload(file: UploadFile) -> None:
    filename = file.filename or ""
    extension = Path(filename).suffix.lower()

    if extension not in SUPPORTED_FILE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported.",
        )

    if file.content_type and file.content_type not in SUPPORTED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported.",
        )


async def _write_upload_to_temp_file(file: UploadFile) -> Path:
    suffix = Path(file.filename or "").suffix.lower()
    total_size = 0

    with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_path = Path(temp_file.name)

        while chunk := await file.read(1024 * 1024):
            total_size += len(chunk)
            if total_size > MAX_UPLOAD_SIZE_BYTES:
                temp_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Uploaded file is too large.",
                )
            temp_file.write(chunk)

    return temp_path
