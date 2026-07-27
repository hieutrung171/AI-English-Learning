from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_chat() -> None:
    response = client.post(
        "/api/v1/chat",
        json={"message": "Help me order coffee", "level": "A2"},
    )
    assert response.status_code == 200
    assert "reply" in response.json()
