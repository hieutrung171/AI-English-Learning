from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    level: str = Field(default="A2", pattern=r"^(A1|A2|B1|B2|C1|C2)$")
    session_id: str = Field(default="guest", max_length=100)


class ChatResponse(BaseModel):
    reply: str
    corrections: list[str] = []
