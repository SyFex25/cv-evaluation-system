"""
File: backend/tests/test_auth_routes.py
Module: Tests
Responsibility: Verifies local SQLite authentication registration, login, and token lookup
"""

from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import app


TEST_DATABASE_PATH = Path(__file__).resolve().parent / "auth-test.db"


def override_settings() -> Settings:
    return Settings(
        auth_database_path=TEST_DATABASE_PATH,
        auth_token_secret="test-secret",
        auth_token_expire_minutes=15,
    )


def setup_function():
    TEST_DATABASE_PATH.unlink(missing_ok=True)
    app.dependency_overrides[get_settings] = override_settings


def teardown_function():
    app.dependency_overrides.clear()
    TEST_DATABASE_PATH.unlink(missing_ok=True)


def test_register_login_and_me_flow():
    client = TestClient(app)
    email = f"hr-{uuid4()}@calvin.ac.id"

    register_response = client.post(
        "/api/auth/register",
        json={"email": email, "password": "password123", "full_name": "HR User"},
    )

    assert register_response.status_code == 201
    assert register_response.json()["email"] == email
    assert TEST_DATABASE_PATH.exists()

    login_response = client.post(
        "/api/auth/login",
        json={"email": email, "password": "password123"},
    )

    assert login_response.status_code == 200
    body = login_response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["user"]["email"] == email

    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )

    assert me_response.status_code == 200
    assert me_response.json()["email"] == email


def test_register_rejects_duplicate_email():
    client = TestClient(app)
    payload = {"email": "duplicate@calvin.ac.id", "password": "password123"}

    assert client.post("/api/auth/register", json=payload).status_code == 201
    duplicate_response = client.post("/api/auth/register", json=payload)

    assert duplicate_response.status_code == 409


def test_login_rejects_invalid_password():
    client = TestClient(app)
    email = "login@calvin.ac.id"
    client.post(
        "/api/auth/register",
        json={"email": email, "password": "password123"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_register_rejects_non_institutional_email():
    client = TestClient(app)

    response = client.post(
        "/api/auth/register",
        json={"email": "outsider@gmail.com", "password": "password123"},
    )

    assert response.status_code == 403


def test_login_rejects_non_institutional_email():
    client = TestClient(app)

    response = client.post(
        "/api/auth/login",
        json={"email": "outsider@gmail.com", "password": "password123"},
    )

    assert response.status_code == 403


def test_login_sets_auth_cookie_usable_by_me():
    client = TestClient(app)
    email = "cookie@calvin.ac.id"
    client.post("/api/auth/register", json={"email": email, "password": "password123"})

    login_response = client.post(
        "/api/auth/login",
        json={"email": email, "password": "password123"},
    )

    assert login_response.status_code == 200
    assert "access_token" in login_response.cookies

    # No Authorization header: the persisted cookie must authenticate /me on its own.
    me_response = client.get("/api/auth/me")

    assert me_response.status_code == 200
    assert me_response.json()["email"] == email


def test_logout_clears_auth_cookie():
    client = TestClient(app)
    email = "logout@calvin.ac.id"
    client.post("/api/auth/register", json={"email": email, "password": "password123"})
    client.post("/api/auth/login", json={"email": email, "password": "password123"})

    logout_response = client.post("/api/auth/logout")

    assert logout_response.status_code == 204
    assert client.get("/api/auth/me").status_code == 401