"use client";

import { FormEvent, useMemo, useState } from "react";

import {
  ExerciseQuestion,
  Flashcard,
  generateExercise,
  generateFlashcards,
  sendChatMessage,
} from "@/services/api";

type View = "home" | "chat" | "flashcards" | "grammar";
type Message = { role: "tutor" | "learner"; text: string; note?: string };

const navigation: Array<{ id: View; icon: string; label: string }> = [
  { id: "home", icon: "HM", label: "Overview" },
  { id: "chat", icon: "CH", label: "AI conversation" },
  { id: "flashcards", icon: "FC", label: "Flashcards" },
  { id: "grammar", icon: "GR", label: "Grammar practice" },
];

const skills = [
  { label: "Speaking", value: 68, tone: "blue" },
  { label: "Listening", value: 54, tone: "amber" },
  { label: "Reading", value: 81, tone: "green" },
  { label: "Writing", value: 62, tone: "violet" },
];

export function LearningDashboard() {
  const [view, setView] = useState<View>("home");
  const [dark, setDark] = useState(false);
  const [level, setLevel] = useState("B1");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tutor",
      text: "Hi Alex! Ready for a short English warm-up?",
      note: "Today we can practise travel, work, or daily conversation.",
    },
  ]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [questions, setQuestions] = useState<ExerciseQuestion[]>([]);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  const currentCard = cards[cardIndex];
  const currentQuestion = questions[0];
  const accuracy = useMemo(() => Math.round(skills.reduce((sum, item) => sum + item.value, 0) / skills.length), []);

  async function submitChat(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;
    setMessages((current) => [...current, { role: "learner", text }]);
    setMessage("");
    setLoading(true);
    try {
      const result = await sendChatMessage(text, level, "Travel");
      setMessages((current) => [
        ...current,
        {
          role: "tutor",
          text: result.reply,
          note: result.corrections[0] ?? `Try: ${result.suggested_reply}`,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "tutor", text: "I cannot reach the learning service yet. Start the FastAPI backend and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCards() {
    setLoading(true);
    try {
      const result = await generateFlashcards(level, "Travel");
      setCards(result.cards);
      setCardIndex(0);
      setShowMeaning(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadExercise() {
    setLoading(true);
    try {
      const result = await generateExercise(level, "Everyday grammar");
      setQuestions(result.questions);
      setAnswer("");
      setChecked(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={dark ? "app-shell dark" : "app-shell"}>
      <aside className="sidebar">
        <button className="logo" onClick={() => setView("home")} aria-label="Go to overview">
          <span className="logo-mark">F</span>
          <span>Fluent<span className="brand-accent">AI</span></span>
        </button>
        <nav className="side-nav" aria-label="Main navigation">
          <p>LEARN</p>
          {navigation.map((item) => (
            <button
              className={view === item.id ? "active" : ""}
              key={item.id}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <p>COMING NEXT</p>
          <button disabled><span className="nav-icon">SP</span>Pronunciation</button>
          <button disabled><span className="nav-icon">WR</span>Writing grader</button>
          <button disabled><span className="nav-icon">EX</span>Exam prep</button>
        </nav>
        <div className="sidebar-profile">
          <div className="avatar">AT</div>
          <div><strong>Alex Tran</strong><span>{level} learner</span></div>
          <button aria-label="Open profile menu">···</button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <span className="mobile-brand">FluentAI</span>
            <span className="online"><i /> AI tutor online</span>
          </div>
          <div className="top-actions">
            <label>
              <span className="sr-only">English level</span>
              <select value={level} onChange={(event) => setLevel(event.target.value)}>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="Toggle colour theme">
              {dark ? "LT" : "DK"}
            </button>
            <div className="streak"><span>◆</span><strong>12</strong> day streak</div>
          </div>
        </header>

        {view === "home" && (
          <div className="content">
            <section className="welcome">
              <div>
                <span className="kicker">MONDAY · YOUR DAILY PLAN</span>
                <h1>Good morning, Alex.</h1>
                <p>Small steps, real progress. You are 18 minutes away from today&apos;s goal.</p>
              </div>
              <div className="daily-ring">
                <div><strong>12</strong><span>/ 30 min</span></div>
                <small>Daily goal</small>
              </div>
            </section>

            <section className="stats-grid">
              <article><span className="stat-icon blue">XP</span><div><small>Total XP</small><strong>2,840</strong><em>+120 this week</em></div></article>
              <article><span className="stat-icon amber">ST</span><div><small>Current streak</small><strong>12 days</strong><em>Personal best: 18</em></div></article>
              <article><span className="stat-icon green">AC</span><div><small>Average accuracy</small><strong>{accuracy}%</strong><em>+4% this month</em></div></article>
              <article><span className="stat-icon violet">LV</span><div><small>Current level</small><strong>{level}</strong><em>Intermediate</em></div></article>
            </section>

            <section className="dashboard-grid">
              <div className="panel continue-panel">
                <div className="panel-heading"><div><span className="kicker">RECOMMENDED</span><h2>Continue learning</h2></div><button onClick={() => setView("chat")}>View all</button></div>
                <div className="lesson-card">
                  <div className="lesson-visual"><span>TRAVEL ENGLISH</span><strong>At the airport</strong><small>Conversation · 10 min</small></div>
                  <div className="lesson-copy">
                    <span className="difficulty">B1 · INTERMEDIATE</span>
                    <h3>Handle airport conversations confidently</h3>
                    <p>Practise check-in, security, boarding and asking for help with your AI tutor.</p>
                    <div className="progress-line"><span style={{ width: "42%" }} /></div>
                    <div className="lesson-footer"><small>42% complete</small><button onClick={() => setView("chat")}>Continue lesson →</button></div>
                  </div>
                </div>
              </div>

              <div className="panel skills-panel">
                <div className="panel-heading"><div><span className="kicker">YOUR PROFILE</span><h2>Skill balance</h2></div><span className="level-chip">{level}</span></div>
                {skills.map((skill) => (
                  <div className="skill-row" key={skill.label}>
                    <div><span>{skill.label}</span><strong>{skill.value}%</strong></div>
                    <div className="skill-track"><span className={skill.tone} style={{ width: `${skill.value}%` }} /></div>
                  </div>
                ))}
                <p className="coach-note"><strong>AI insight</strong> Your reading is strong. Focus on listening this week to build a more balanced profile.</p>
              </div>
            </section>

            <section className="quick-section">
              <div className="section-title"><div><span className="kicker">PRACTISE YOUR WAY</span><h2>Quick practice</h2></div><p>AI-generated activities adapted to your {level} level</p></div>
              <div className="quick-grid">
                <button onClick={() => setView("chat")}><span className="quick-icon blue">CH</span><strong>Start a conversation</strong><small>Real-life roleplay with instant feedback</small><em>5–10 min →</em></button>
                <button onClick={() => { setView("flashcards"); void loadCards(); }}><span className="quick-icon green">FC</span><strong>Review flashcards</strong><small>12 vocabulary cards due today</small><em>6 min →</em></button>
                <button onClick={() => { setView("grammar"); void loadExercise(); }}><span className="quick-icon violet">GR</span><strong>Grammar challenge</strong><small>Personalised questions from weak areas</small><em>8 min →</em></button>
              </div>
            </section>
          </div>
        )}

        {view === "chat" && (
          <section className="workspace">
            <div className="workspace-head"><div><span className="kicker">CONVERSATIONAL TUTOR</span><h1>Airport roleplay</h1><p>Your tutor adapts every response to level {level}.</p></div><button className="secondary" onClick={() => setMessages(messages.slice(0, 1))}>New chat</button></div>
            <div className="chat-card">
              <div className="chat-messages">
                {messages.map((item, index) => (
                  <div className={`message ${item.role}`} key={`${item.role}-${index}`}>
                    <span>{item.role === "tutor" ? "AI" : "YOU"}</span>
                    <div><p>{item.text}</p>{item.note && <small>{item.note}</small>}</div>
                  </div>
                ))}
                {loading && <div className="typing">FluentAI is thinking <span>···</span></div>}
              </div>
              <form className="chat-form" onSubmit={submitChat}>
                <label className="sr-only" htmlFor="chat-message">Your English message</label>
                <textarea id="chat-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Reply in English..." rows={3} />
                <div><small>Press the button to send · Feedback appears after each reply</small><button disabled={!message.trim() || loading}>Send message →</button></div>
              </form>
            </div>
          </section>
        )}

        {view === "flashcards" && (
          <section className="workspace">
            <div className="workspace-head"><div><span className="kicker">SPACED REPETITION</span><h1>Travel vocabulary</h1><p>Review cards at the right moment to build long-term memory.</p></div><button onClick={() => void loadCards()}>{loading ? "Generating..." : "Generate new set"}</button></div>
            {!currentCard ? (
              <div className="empty-state"><span>FC</span><h2>Your smart deck is ready</h2><p>Generate a personalised set of {level} travel words.</p><button onClick={() => void loadCards()}>Generate flashcards</button></div>
            ) : (
              <div className="flashcard-wrap">
                <div className="card-count">Card {cardIndex + 1} of {cards.length}</div>
                <button className="flashcard" onClick={() => setShowMeaning((value) => !value)}>
                  <span>{showMeaning ? "MEANING" : "WORD"}</span>
                  <h2>{showMeaning ? currentCard.meaning : currentCard.word}</h2>
                  <p>{showMeaning ? currentCard.example : currentCard.phonetic}</p>
                  <small>Click card to {showMeaning ? "see the word" : "reveal meaning"}</small>
                </button>
                <div className="review-actions">
                  <button className="again" onClick={() => setShowMeaning(false)}>Again · 1 day</button>
                  <button className="hard" onClick={() => setCardIndex((cardIndex + 1) % cards.length)}>Hard · 3 days</button>
                  <button className="good" onClick={() => setCardIndex((cardIndex + 1) % cards.length)}>Good · 7 days</button>
                  <button className="easy" onClick={() => setCardIndex((cardIndex + 1) % cards.length)}>Easy · 14 days</button>
                </div>
              </div>
            )}
          </section>
        )}

        {view === "grammar" && (
          <section className="workspace">
            <div className="workspace-head"><div><span className="kicker">ADAPTIVE EXERCISES</span><h1>Grammar challenge</h1><p>Questions focus on patterns that matter at level {level}.</p></div><button onClick={() => void loadExercise()}>{loading ? "Generating..." : "New challenge"}</button></div>
            {!currentQuestion ? (
              <div className="empty-state"><span>GR</span><h2>Build a personalised challenge</h2><p>Get instant explanations after every answer.</p><button onClick={() => void loadExercise()}>Generate exercise</button></div>
            ) : (
              <div className="quiz-card">
                <div className="quiz-meta"><span>Question 1 of {questions.length}</span><strong>{level}</strong></div>
                <h2>{currentQuestion.prompt}</h2>
                <div className="options">
                  {currentQuestion.options.map((option) => (
                    <button className={answer === option ? "selected" : ""} key={option} onClick={() => { setAnswer(option); setChecked(false); }}>{option}</button>
                  ))}
                </div>
                {checked && (
                  <div className={answer === currentQuestion.answer ? "result correct" : "result incorrect"}>
                    <strong>{answer === currentQuestion.answer ? "Correct!" : `Correct answer: ${currentQuestion.answer}`}</strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}
                <button className="check-button" disabled={!answer} onClick={() => setChecked(true)}>Check answer</button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
