from dataclasses import dataclass


@dataclass(frozen=True)
class VocabularyEntry:
    word: str
    definition: str
    example: str


def lookup_word(word: str) -> VocabularyEntry:
    """Development dictionary tool; replace with a real provider later."""
    normalized = word.strip().lower()
    return VocabularyEntry(
        word=normalized,
        definition=f"A learner-friendly definition for '{normalized}'.",
        example=f"Try using '{normalized}' in a sentence about your day.",
    )


def create_exercise(topic: str, level: str) -> str:
    return f"Write three {level}-level sentences about {topic}."
