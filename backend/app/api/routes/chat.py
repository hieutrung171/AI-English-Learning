from fastapi import APIRouter

from app.agent.service import EnglishTutorAgent
from app.models.schemas import ChatRequest, ChatResponse

router = APIRouter()
tutor = EnglishTutorAgent()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    return await tutor.respond(request)
