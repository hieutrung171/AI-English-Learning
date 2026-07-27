from app.agent.memory import ConversationMemory
from app.models.schemas import ChatRequest, ChatResponse


class EnglishTutorAgent:
    def __init__(self) -> None:
        self.memory = ConversationMemory()

    async def respond(self, request: ChatRequest) -> ChatResponse:
        self.memory.add(request.session_id, request.message)
        reply = (
            f"Great choice! Let’s practice at {request.level} level. "
            f"You wrote: “{request.message}” Start with one short sentence, "
            "and I’ll help you make it sound more natural."
        )
        return ChatResponse(reply=reply, corrections=[])
