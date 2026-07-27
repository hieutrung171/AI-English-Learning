import re
from uuid import uuid4

from app.agent.memory import ConversationMemory
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    ExerciseQuestion,
    ExerciseRequest,
    ExerciseResponse,
    Flashcard,
    FlashcardRequest,
    FlashcardResponse,
    GrammarCheckRequest,
    GrammarCheckResponse,
    GrammarIssue,
)

TOPIC_VOCABULARY = {
    "travel": [
        ("itinerary", "/aɪˈtɪnəreri/", "a plan for a journey", "Our itinerary includes three cities."),
        ("departure", "/dɪˈpɑːrtʃər/", "the act of leaving", "Our departure is at nine o'clock."),
        ("destination", "/ˌdestɪˈneɪʃn/", "the place you are travelling to", "Tokyo is our final destination."),
        ("reservation", "/ˌrezərˈveɪʃn/", "an arrangement to keep a seat or room", "I made a hotel reservation."),
        ("luggage", "/ˈlʌɡɪdʒ/", "bags used when travelling", "My luggage is quite heavy."),
    ],
    "work": [
        ("deadline", "/ˈdedlaɪn/", "the latest time work must be finished", "The project deadline is Friday."),
        ("colleague", "/ˈkɑːliːɡ/", "a person you work with", "My colleague helped with the report."),
        ("feedback", "/ˈfiːdbæk/", "comments that help someone improve", "Thank you for your helpful feedback."),
        ("schedule", "/ˈskedʒuːl/", "a plan of activities and times", "My schedule is full this afternoon."),
        ("achievement", "/əˈtʃiːvmənt/", "something completed successfully", "Finishing the course was an achievement."),
    ],
}


class EnglishTutorAgent:
    def __init__(self) -> None:
        self.memory = ConversationMemory()

    async def respond(self, request: ChatRequest) -> ChatResponse:
        self.memory.add(request.session_id, request.message)
        corrections = self._quick_corrections(request.message)
        clean_topic = request.topic.lower()
        if "interview" in clean_topic:
            follow_up = "What is one strength you would bring to this role?"
        elif "restaurant" in clean_topic:
            follow_up = "What would you like to order, and how would you ask politely?"
        elif "airport" in clean_topic or "travel" in clean_topic:
            follow_up = "Where are you travelling, and what do you need at the airport?"
        else:
            follow_up = "Can you add one more detail using a complete sentence?"

        reply = (
            f"Good start. We are practising {request.topic} at {request.level} level. "
            f"{follow_up}"
        )
        return ChatResponse(
            reply=reply,
            corrections=corrections,
            suggested_reply="I would like to practise this situation step by step.",
            intent=self._classify_intent(request.message),
        )

    async def create_flashcards(self, request: FlashcardRequest) -> FlashcardResponse:
        source = TOPIC_VOCABULARY.get(request.topic.lower(), TOPIC_VOCABULARY["travel"])
        cards = [
            Flashcard(
                id=str(uuid4()),
                word=word,
                phonetic=phonetic,
                meaning=meaning,
                example=example,
            )
            for word, phonetic, meaning, example in source[: request.count]
        ]
        return FlashcardResponse(cards=cards)

    async def create_exercise(self, request: ExerciseRequest) -> ExerciseResponse:
        templates = [
            ExerciseQuestion(
                id=str(uuid4()),
                prompt="She ___ to English class every Tuesday.",
                options=["go", "goes", "going", "gone"],
                answer="goes",
                explanation="Use the third-person singular form with 'she' in the present simple.",
            ),
            ExerciseQuestion(
                id=str(uuid4()),
                prompt="I have lived here ___ 2022.",
                options=["for", "since", "during", "from"],
                answer="since",
                explanation="Use 'since' with a specific starting point.",
            ),
            ExerciseQuestion(
                id=str(uuid4()),
                prompt="Choose the most polite request.",
                options=[
                    "Give me water.",
                    "Water now.",
                    "Could I have some water, please?",
                    "I want water.",
                ],
                answer="Could I have some water, please?",
                explanation="'Could I...' and 'please' make the request polite.",
            ),
            ExerciseQuestion(
                id=str(uuid4()),
                prompt="If it rains, we ___ at home.",
                options=["stay", "stayed", "will stay", "staying"],
                answer="will stay",
                explanation="The first conditional uses will + base verb in the result clause.",
            ),
            ExerciseQuestion(
                id=str(uuid4()),
                prompt="This book is ___ than the last one.",
                options=["interesting", "more interesting", "most interesting", "interest"],
                answer="more interesting",
                explanation="Use 'more' to form the comparative of longer adjectives.",
            ),
        ]
        return ExerciseResponse(
            title=f"{request.level} · {request.topic}",
            questions=templates[: request.count],
        )

    async def check_grammar(self, request: GrammarCheckRequest) -> GrammarCheckResponse:
        corrected = request.text.strip()
        issues: list[GrammarIssue] = []
        replacements = [
            (r"\bI am agree\b", "I agree", "'Agree' is a verb, so it does not use 'am'."),
            (r"\bHe go\b", "He goes", "Use 'goes' with he/she/it in the present simple."),
            (r"\bShe go\b", "She goes", "Use 'goes' with he/she/it in the present simple."),
            (r"\bI have (\d+) years old\b", r"I am \1 years old", "Use 'be' to talk about age."),
        ]
        for pattern, replacement, explanation in replacements:
            match = re.search(pattern, corrected, flags=re.IGNORECASE)
            if match:
                original = match.group(0)
                new_value = re.sub(pattern, replacement, original, flags=re.IGNORECASE)
                corrected = re.sub(pattern, replacement, corrected, flags=re.IGNORECASE)
                issues.append(
                    GrammarIssue(
                        original=original,
                        correction=new_value,
                        explanation=explanation,
                    )
                )

        if corrected and corrected[-1] not in ".!?":
            corrected += "."
            issues.append(
                GrammarIssue(
                    original=request.text[-20:],
                    correction=corrected[-21:],
                    explanation="Finish a complete sentence with punctuation.",
                )
            )

        score = max(55, 100 - len(issues) * 12)
        feedback = (
            "Clear message. Review the highlighted points, then rewrite it once from memory."
            if issues
            else "Excellent work. Your sentence is clear and grammatically accurate."
        )
        return GrammarCheckResponse(
            score=score,
            corrected_text=corrected,
            feedback=feedback,
            issues=issues,
        )

    @staticmethod
    def _classify_intent(message: str) -> str:
        lowered = message.lower()
        if any(word in lowered for word in ("correct", "grammar", "writing")):
            return "grammar_check"
        if any(word in lowered for word in ("quiz", "exercise", "practice test")):
            return "exercise_generation"
        return "conversation"

    @staticmethod
    def _quick_corrections(message: str) -> list[str]:
        corrections = []
        if re.search(r"\bI am agree\b", message, flags=re.IGNORECASE):
            corrections.append("Use 'I agree', not 'I am agree'.")
        if message and message[-1] not in ".!?":
            corrections.append("Add punctuation at the end of the sentence.")
        return corrections
