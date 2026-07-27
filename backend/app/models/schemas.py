from typing import Literal

from pydantic import BaseModel, Field

Level = Literal["A1", "A2", "B1", "B2", "C1", "C2"]


class RegisterRequest(BaseModel):
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", max_length=320)
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=8, max_length=128)
    preferred_language: Literal["vi", "en"] = "vi"


class LoginRequest(BaseModel):
    email: str = Field(max_length=320)
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: Literal["learner", "admin"]
    preferred_language: Literal["vi", "en"]
    is_active: bool


class AuthResponse(BaseModel):
    user: UserResponse
    message: str


class LanguageUpdate(BaseModel):
    preferred_language: Literal["vi", "en"]


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    level: Level = "A2"
    session_id: str = Field(default="guest", max_length=100)
    topic: str = Field(default="Daily conversation", max_length=100)


class ChatResponse(BaseModel):
    reply: str
    corrections: list[str] = []
    suggested_reply: str = ""
    intent: str = "conversation"


class Flashcard(BaseModel):
    id: str
    word: str
    phonetic: str
    meaning: str
    example: str
    interval_days: int = 1


class FlashcardRequest(BaseModel):
    level: Level = "A2"
    topic: str = Field(default="Travel", min_length=1, max_length=100)
    count: int = Field(default=5, ge=3, le=12)


class FlashcardResponse(BaseModel):
    cards: list[Flashcard]


class ExerciseQuestion(BaseModel):
    id: str
    prompt: str
    options: list[str]
    answer: str
    explanation: str


class ExerciseRequest(BaseModel):
    level: Level = "A2"
    topic: str = Field(default="Present simple", min_length=1, max_length=100)
    count: int = Field(default=5, ge=3, le=10)


class ExerciseResponse(BaseModel):
    title: str
    questions: list[ExerciseQuestion]


class GrammarCheckRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    level: Level = "A2"


class GrammarIssue(BaseModel):
    original: str
    correction: str
    explanation: str


class GrammarCheckResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    corrected_text: str
    feedback: str
    issues: list[GrammarIssue]
