from fastapi import APIRouter, Depends

from app.agent.service import EnglishTutorAgent
from app.core.security import get_current_user
from app.models.schemas import ChatRequest, ChatResponse
from app.models.user import User

router = APIRouter()
tutor = EnglishTutorAgent()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    _: User = Depends(get_current_user),
) -> ChatResponse:
    return await tutor.respond(request)
