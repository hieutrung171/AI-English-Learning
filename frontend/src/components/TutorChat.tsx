"use client";

import { FormEvent, useState } from "react";

import { sendChatMessage } from "@/services/api";

export function TutorChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await sendChatMessage(message);
      setReply(response.reply);
    } catch {
      setReply("The tutor is unavailable right now. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="practice" id="practice">
      <div className="status"><span /> AI tutor online</div>
      <h2>What would you like to practice?</h2>
      <p>Try: “Help me order coffee” or “Correct my job interview answer.”</p>
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="message">
          Message for your English tutor
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message in English..."
          rows={4}
        />
        <button disabled={loading || !message.trim()} type="submit">
          {loading ? "Thinking…" : "Start practicing →"}
        </button>
      </form>
      {reply && (
        <div className="reply">
          <strong>FluentAI</strong>
          <p>{reply}</p>
        </div>
      )}
    </section>
  );
}
