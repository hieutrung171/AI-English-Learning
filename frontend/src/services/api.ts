const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ChatResponse = {
  reply: string;
  corrections: string[];
};

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, level: "A2" }),
  });

  if (!response.ok) {
    throw new Error("Unable to reach the tutor");
  }

  return response.json();
}
