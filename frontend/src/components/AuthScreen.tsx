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
    offer: "Bắt đầu hành trình tiếng Anh cùng gia sư AI cá nhân",
    offerAction: "Tạo tài khoản miễn phí",
    heroTitle: "Học tiếng Anh thú vị và hiệu quả cùng AI!",
    heroBody: "FluentAI biến trí tuệ nhân tạo thành gia sư tiếng Anh cá nhân của bạn — luyện hội thoại, từ vựng và ngữ pháp theo đúng trình độ.",
    startFree: "Bắt đầu miễn phí",
    freeNote: "Không cần thẻ thanh toán",
    trusted: "LỘ TRÌNH HỌC CÁ NHÂN HÓA",
    levelText: "Tự động điều chỉnh theo trình độ A1–C2",
    feedbackText: "Nhận phản hồi ngay sau mỗi câu trả lời",
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
    offer: "Start your English journey with a personal AI tutor",
    offerAction: "Create a free account",
    heroTitle: "Learn English in a fun and effective way with AI!",
    heroBody: "FluentAI turns artificial intelligence into your personal English tutor — practise conversation, vocabulary and grammar at exactly the right level.",
    startFree: "Start for free",
    freeNote: "No payment card required",
    trusted: "PERSONALISED LEARNING PATH",
    levelText: "Automatically adapts from A1 to C2",
    feedbackText: "Get feedback after every answer",
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
    <main className="landing-auth">
      <div className="landing-offer">
        <span>{t.offer}</span>
        <button onClick={() => setMode("register")}>{t.offerAction} <b>→</b></button>
      </div>

      <header className="landing-header">
        <div className="landing-nav">
          <a className="landing-logo" href="#" aria-label="FluentAI home">
            <span>F</span>Fluent<strong>AI</strong>
          </a>
          <div className="landing-actions">
            <div className="language-switch landing-language" aria-label="Language">
              <button className={language === "vi" ? "active" : ""} onClick={() => onLanguageChange("vi")}>VI</button>
              <button className={language === "en" ? "active" : ""} onClick={() => onLanguageChange("en")}>EN</button>
            </div>
            <button className="nav-login" onClick={() => setMode("login")}>{t.login}</button>
            <button className="nav-start" onClick={() => setMode("register")}>{t.startFree}</button>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-eyebrow">{t.trusted}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <div className="landing-cta">
            <button onClick={() => setMode("register")}>{t.startFree} <span>→</span></button>
            <small><i>✓</i>{t.freeNote}</small>
          </div>
          <div className="landing-benefits">
            <div><span>A1</span><p>{t.levelText}</p></div>
            <div><span>AI</span><p>{t.feedbackText}</p></div>
          </div>
        </div>

        <div className="landing-auth-panel">
          <div className="landing-orbit orbit-one" />
          <div className="landing-orbit orbit-two" />
          <div className="auth-card landing-card">
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
        </div>
      </section>

      <section className="landing-modes">
        {t.benefits.map((benefit, index) => (
          <article key={benefit}>
            <span>{index === 0 ? "◌" : index === 1 ? "▤" : "ϟ"}</span>
            <div><strong>{benefit}</strong><small>{index === 0 ? "Real-life topics" : index === 1 ? "Smart review" : "Instant coaching"}</small></div>
          </article>
        ))}
      </section>
    </main>
  );
}
