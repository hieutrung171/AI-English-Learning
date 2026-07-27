const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: "learner" | "admin";
  preferred_language: "vi" | "en";
  is_active: boolean;
};

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
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "API request failed" }));
    throw new Error(payload.detail ?? "API request failed");
  }
  return response.json();
}

export async function registerAccount(input: {
  email: string;
  full_name: string;
  password: string;
  preferred_language: "vi" | "en";
}): Promise<{ user: AppUser; message: string }> {
  return post("/api/v1/auth/register", input);
}

export async function loginAccount(
  email: string,
  password: string,
): Promise<{ user: AppUser; message: string }> {
  return post("/api/v1/auth/login", { email, password });
}

export async function logoutAccount(): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok && response.status !== 204) throw new Error("Unable to sign out");
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Unable to load account");
  return response.json();
}

export async function updateLanguage(
  preferred_language: "vi" | "en",
): Promise<AppUser> {
  const response = await fetch(`${API_URL}/api/v1/auth/language`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ preferred_language }),
  });
  if (!response.ok) throw new Error("Unable to update language");
  return response.json();
}

export async function listUsers(): Promise<AppUser[]> {
  const response = await fetch(`${API_URL}/api/v1/admin/users`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Admin access required");
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
  const response = await fetch(`${API_URL}/api/v1/health`);
  return response.ok;
}
