"use client";

import { FormEvent, useState } from "react";

import { AppUser, loginAccount, registerAccount } from "@/services/api";

type Language = "vi" | "en";

const copy = {
  vi: {
    badge: "GIA SƯ TIẾNG ANH CÁ NHÂN",
    title: "Học tiếng Anh theo cách phù hợp với bạn.",
    subtitle: "Luyện hội thoại, từ vựng và ngữ pháp với lộ trình được AI điều chỉnh theo trình độ.",
    login: "Đăng nhập",
    register: "Tạo tài khoản",
    name: "Họ và tên",
    email: "Email",
    password: "Mật khẩu",
    passwordHint: "Tối thiểu 8 ký tự",
    submitLogin: "Đăng nhập vào FluentAI",
    submitRegister: "Tạo tài khoản miễn phí",
    switchRegister: "Chưa có tài khoản?",
    switchLogin: "Đã có tài khoản?",
    benefits: ["Hội thoại AI theo trình độ", "Flashcard lặp lại ngắt quãng", "Bài tập và phản hồi tức thì"],
    error: "Không thể xử lý yêu cầu. Vui lòng kiểm tra lại thông tin.",
    welcome: "Chào mừng bạn trở lại",
    welcomeRegister: "Bắt đầu hành trình của bạn",
    formSubtitle: "Đăng nhập để tiếp tục lộ trình học tập cá nhân hóa.",
    formSubtitleRegister: "Tạo tài khoản và nhận lộ trình phù hợp với trình độ của bạn.",
    secure: "Thông tin của bạn được bảo vệ an toàn",
    previewTitle: "Buổi học hôm nay",
    previewTopic: "Hội thoại tại sân bay",
    previewMessage: "Could you tell me where gate 24 is?",
    previewFeedback: "Tuyệt vời! Câu hỏi tự nhiên và lịch sự.",
    streakLabel: "chuỗi ngày",
    progressLabel: "mục tiêu tuần",
  },
  en: {
    badge: "YOUR PERSONAL ENGLISH TUTOR",
    title: "Learn English in a way that fits you.",
    subtitle: "Practise conversation, vocabulary and grammar with an AI-adapted learning path.",
    login: "Sign in",
    register: "Create account",
    name: "Full name",
    email: "Email",
    password: "Password",
    passwordHint: "At least 8 characters",
    submitLogin: "Sign in to FluentAI",
    submitRegister: "Create a free account",
    switchRegister: "New to FluentAI?",
    switchLogin: "Already have an account?",
    benefits: ["Level-adaptive AI conversation", "Spaced-repetition flashcards", "Exercises with instant feedback"],
    error: "We could not process that request. Please check your details.",
    welcome: "Welcome back",
    welcomeRegister: "Start your learning journey",
    formSubtitle: "Sign in to continue your personalised learning path.",
    formSubtitleRegister: "Create an account and get a learning path matched to your level.",
    secure: "Your information is safely protected",
    previewTitle: "Today's lesson",
    previewTopic: "Conversation at the airport",
    previewMessage: "Could you tell me where gate 24 is?",
    previewFeedback: "Excellent! That question sounds natural and polite.",
    streakLabel: "day streak",
    progressLabel: "weekly goal",
  },
};

export function AuthScreen({
  language,
  onLanguageChange,
  onAuthenticated,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onAuthenticated: (user: AppUser) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = copy[language];

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response =
        mode === "login"
          ? await loginAccount(email, password)
          : await registerAccount({
              email,
              full_name: fullName,
              password,
              preferred_language: language,
            });
      onAuthenticated(response.user);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />
      <section className="auth-story">
        <a className="auth-logo" href="#" aria-label="FluentAI home">
          <span>F</span><span>Fluent<strong>AI</strong></span>
        </a>
        <div className="auth-story-copy">
          <span className="kicker light">{t.badge}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="auth-benefits">
            {t.benefits.map((benefit, index) => (
              <div key={benefit}><span>0{index + 1}</span><p>{benefit}</p></div>
            ))}
          </div>
        </div>

        <div className="learning-preview" aria-hidden="true">
          <div className="preview-top">
            <div><span>{t.previewTitle}</span><strong>{t.previewTopic}</strong></div>
            <em>B1</em>
          </div>
          <div className="preview-chat">
            <span className="preview-avatar">AI</span>
            <p>{t.previewMessage}</p>
          </div>
          <div className="preview-feedback"><span>✓</span><p>{t.previewFeedback}</p></div>
          <div className="preview-metrics">
            <div><strong>12</strong><span>{t.streakLabel}</span></div>
            <div><strong>78%</strong><span>{t.progressLabel}</span></div>
            <div className="mini-progress"><span /></div>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-side-top">
          <span>FluentAI</span>
          <div className="language-switch" aria-label="Language">
            <button className={language === "vi" ? "active" : ""} onClick={() => onLanguageChange("vi")}>VI</button>
            <button className={language === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>EN</button>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>{t.login}</button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>{t.register}</button>
          </div>
          <div className="auth-heading">
            <span className="auth-heading-mark">{mode === "login" ? "→" : "+"}</span>
            <div>
              <h2>{mode === "login" ? t.welcome : t.welcomeRegister}</h2>
              <p>{mode === "login" ? t.formSubtitle : t.formSubtitleRegister}</p>
            </div>
          </div>
          <form onSubmit={submit}>
            {mode === "register" && (
              <label>{t.name}<input required minLength={2} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" /></label>
            )}
            <label>{t.email}<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
            <label>{t.password}<input required minLength={mode === "register" ? 8 : 1} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /><small>{mode === "register" ? t.passwordHint : ""}</small></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" disabled={loading}>{loading ? "..." : mode === "login" ? t.submitLogin : t.submitRegister}</button>
          </form>
          <p className="auth-switch">{mode === "login" ? t.switchRegister : t.switchLogin} <button onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? t.register : t.login}</button></p>
          <div className="auth-security"><span>◆</span>{t.secure}</div>
        </div>
        <p className="auth-copyright">© 2026 FluentAI · Personalised English learning</p>
      </section>
    </main>
  );
}
