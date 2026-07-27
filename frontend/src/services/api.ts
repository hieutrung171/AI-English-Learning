const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ChatResponse = {
  reply: string;
  corrections: string[];
  suggested_reply: string;
  intent: string;
};

export type Flashcard = {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  interval_days: number;
};

export type ExerciseQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error("API request failed");
  return response.json();
}

export function sendChatMessage(
  message: string,
  level = "B1",
  topic = "Daily conversation",
): Promise<ChatResponse> {
  return post("/api/v1/chat", { message, level, topic });
}

export async function generateFlashcards(
  level = "B1",
  topic = "Travel",
): Promise<{ cards: Flashcard[] }> {
  return post("/api/v1/flashcards/generate", { level, topic, count: 5 });
}

export async function generateExercise(
  level = "B1",
  topic = "Present simple",
): Promise<{ title: string; questions: ExerciseQuestion[] }> {
  return post("/api/v1/exercises/generate", { level, topic, count: 5 });
}

export async function checkWriting(
  text: string,
  level = "B1",
): Promise<{
  score: number;
  corrected_text: string;
  feedback: string;
  issues: Array<{ original: string; correction: string; explanation: string }>;
}> {
  return post("/api/v1/writing/check", { text, level });
}

export async function healthCheck(): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/v1/chat`, {
    method: "OPTIONS",
  });
  return response.ok;
}
