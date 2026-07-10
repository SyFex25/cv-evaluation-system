"""
File: backend/app/core/constants.py
Module: Core
Responsibility: Defines shared backend constants for upload validation
"""

SUPPORTED_FILE_EXTENSIONS = {".pdf", ".docx"}
SUPPORTED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024