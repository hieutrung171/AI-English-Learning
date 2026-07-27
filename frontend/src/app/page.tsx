import { TutorChat } from "@/components/TutorChat";

const lessons = [
  { icon: "💬", title: "Daily conversation", detail: "Speak naturally in everyday situations" },
  { icon: "🧠", title: "Smart vocabulary", detail: "Learn words in context, not in isolation" },
  { icon: "✍️", title: "Instant feedback", detail: "Improve grammar and clarity as you practice" },
];

export default function Home() {
  return (
    <main>
      <nav>
        <a className="brand" href="#">Fluent<span>AI</span></a>
        <a className="nav-link" href="#practice">Practice now</a>
      </nav>

      <section className="hero">
        <div className="eyebrow">Your personal English coach</div>
        <h1>Speak English with <em>confidence.</em></h1>
        <p className="lead">
          Practice real conversations, get patient feedback, and build a learning
          path that adapts to your goals.
        </p>
        <div className="features">
          {lessons.map((lesson) => (
            <article key={lesson.title}>
              <div className="feature-icon">{lesson.icon}</div>
              <div>
                <h2>{lesson.title}</h2>
                <p>{lesson.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TutorChat />
    </main>
  );
}
