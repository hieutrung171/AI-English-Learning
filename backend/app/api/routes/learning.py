from fastapi import APIRouter, Depends

from app.agent.service import EnglishTutorAgent
from app.core.security import get_current_user
from app.models.schemas import (
    ExerciseRequest,
    ExerciseResponse,
    FlashcardRequest,
    FlashcardResponse,
    GrammarCheckRequest,
    GrammarCheckResponse,
)
from app.models.user import User

router = APIRouter()
tutor = EnglishTutorAgent()


@router.post("/flashcards/generate", response_model=FlashcardResponse)
async def generate_flashcards(
    request: FlashcardRequest,
    _: User = Depends(get_current_user),
) -> FlashcardResponse:
    return await tutor.create_flashcards(request)


@router.post("/exercises/generate", response_model=ExerciseResponse)
async def generate_exercise(
    request: ExerciseRequest,
    _: User = Depends(get_current_user),
) -> ExerciseResponse:
    return await tutor.create_exercise(request)


@router.post("/writing/check", response_model=GrammarCheckResponse)
async def check_writing(
    request: GrammarCheckRequest,
    _: User = Depends(get_current_user),
) -> GrammarCheckResponse:
    return await tutor.check_grammar(request)
