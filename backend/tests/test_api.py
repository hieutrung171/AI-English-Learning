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


def test_generate_flashcards() -> None:
    response = client.post(
        "/api/v1/flashcards/generate",
        json={"level": "B1", "topic": "Travel", "count": 5},
    )
    assert response.status_code == 200
    assert len(response.json()["cards"]) == 5


def test_generate_exercise() -> None:
    response = client.post(
        "/api/v1/exercises/generate",
        json={"level": "B1", "topic": "Everyday grammar", "count": 5},
    )
    assert response.status_code == 200
    assert len(response.json()["questions"]) == 5


def test_check_writing() -> None:
    response = client.post(
        "/api/v1/writing/check",
        json={"level": "A2", "text": "I am agree with you"},
    )
    assert response.status_code == 200
    assert response.json()["corrected_text"] == "I agree with you."
    assert response.json()["issues"]
