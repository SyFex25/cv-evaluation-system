"""
File: backend/database/seed_auth.py
Module: Database
Responsibility: Seeds the local SQLite authentication database with an initial user
"""

import argparse
import getpass
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import Settings  # noqa: E402
from app.services.auth.auth_service import register_user  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed a local authentication user.")
    parser.add_argument("--email", required=True, help="User email address.")
    parser.add_argument("--full-name", default=None, help="Optional full name.")
    parser.add_argument(
        "--password",
        default=None,
        help="User password. If omitted, you will be prompted securely.",
    )
    args = parser.parse_args()

    password = args.password or getpass.getpass("Password: ")
    user = register_user(
        email=args.email,
        password=password,
        full_name=args.full_name,
        settings=Settings(),
    )

    print(f"Seeded user {user.email} into {Settings().auth_database_path}")


if __name__ == "__main__":
    main()