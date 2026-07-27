from collections import defaultdict, deque


class ConversationMemory:
    """Small in-memory conversation store for development."""

    def __init__(self, max_messages: int = 20) -> None:
        self._messages: dict[str, deque[str]] = defaultdict(
            lambda: deque(maxlen=max_messages)
        )

    def add(self, session_id: str, message: str) -> None:
        self._messages[session_id].append(message)

    def get(self, session_id: str) -> list[str]:
        return list(self._messages[session_id])
