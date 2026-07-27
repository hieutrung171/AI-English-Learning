from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.core.database import Base, engine
from main import app

Base.metadata.create_all(bind=engine)


@pytest.fixture()
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def authenticated_client(client: TestClient) -> TestClient:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": f"learner-{uuid4()}@example.com",
            "full_name": "Test Learner",
            "password": "SafePassword123!",
            "preferred_language": "vi",
        },
    )
    assert response.status_code == 201
    return client


def test_health_check(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_and_read_profile(authenticated_client: TestClient) -> None:
    response = authenticated_client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["role"] == "learner"
    assert response.json()["preferred_language"] == "vi"


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "missing@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_protected_chat_requires_authentication(client: TestClient) -> None:
    response = client.post(
        "/api/v1/chat",
        json={"message": "Help me order coffee", "level": "A2"},
    )
    assert response.status_code == 401


def test_chat(authenticated_client: TestClient) -> None:
    response = authenticated_client.post(
        "/api/v1/chat",
        json={"message": "Help me order coffee", "level": "A2"},
    )
    assert response.status_code == 200
    assert "reply" in response.json()


def test_generate_flashcards(authenticated_client: TestClient) -> None:
    response = authenticated_client.post(
        "/api/v1/flashcards/generate",
        json={"level": "B1", "topic": "Travel", "count": 5},
    )
    assert response.status_code == 200
    assert len(response.json()["cards"]) == 5


def test_generate_exercise(authenticated_client: TestClient) -> None:
    response = authenticated_client.post(
        "/api/v1/exercises/generate",
        json={"level": "B1", "topic": "Everyday grammar", "count": 5},
    )
    assert response.status_code == 200
    assert len(response.json()["questions"]) == 5


def test_check_writing(authenticated_client: TestClient) -> None:
    response = authenticated_client.post(
        "/api/v1/writing/check",
        json={"level": "A2", "text": "I am agree with you"},
    )
    assert response.status_code == 200
    assert response.json()["corrected_text"] == "I agree with you."


def test_learner_cannot_access_admin(authenticated_client: TestClient) -> None:
    response = authenticated_client.get("/api/v1/admin/users")
    assert response.status_code == 403
