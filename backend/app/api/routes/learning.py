from fastapi import APIRouter

from app.agent.service import EnglishTutorAgent
from app.models.schemas import (
    ExerciseRequest,
    ExerciseResponse,
    FlashcardRequest,
    FlashcardResponse,
    GrammarCheckRequest,
    GrammarCheckResponse,
)

router = APIRouter()
tutor = EnglishTutorAgent()


@router.post("/flashcards/generate", response_model=FlashcardResponse)
async def generate_flashcards(request: FlashcardRequest) -> FlashcardResponse:
    return await tutor.create_flashcards(request)


@router.post("/exercises/generate", response_model=ExerciseResponse)
async def generate_exercise(request: ExerciseRequest) -> ExerciseResponse:
    return await tutor.create_exercise(request)


@router.post("/writing/check", response_model=GrammarCheckResponse)
async def check_writing(request: GrammarCheckRequest) -> GrammarCheckResponse:
    return await tutor.check_grammar(request)
