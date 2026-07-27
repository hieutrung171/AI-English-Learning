"use client";

import { useEffect, useState } from "react";

import { AuthScreen } from "@/components/AuthScreen";
import { LearningDashboard } from "@/components/LearningDashboard";
import {
  AppUser,
  getCurrentUser,
  logoutAccount,
  updateLanguage,
} from "@/services/api";

type Language = "vi" | "en";

export function FluentAIApp() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("vi");

  useEffect(() => {
    const saved = window.localStorage.getItem("fluentai-language");
    if (saved === "vi" || saved === "en") setLanguage(saved);
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        if (currentUser) setLanguage(currentUser.preferred_language);
      })
      .finally(() => setLoading(false));
  }, []);

  async function changeLanguage(next: Language) {
    setLanguage(next);
    window.localStorage.setItem("fluentai-language", next);
    if (user) {
      const updated = await updateLanguage(next);
      setUser(updated);
    }
  }

  async function logout() {
    await logoutAccount();
    setUser(null);
  }

  if (loading) return <div className="app-loading"><span>F</span><p>FluentAI</p></div>;
  if (!user) {
    return (
      <AuthScreen
        language={language}
        onLanguageChange={(next) => void changeLanguage(next)}
        onAuthenticated={(authenticatedUser) => {
          setUser(authenticatedUser);
          setLanguage(authenticatedUser.preferred_language);
        }}
      />
    );
  }

  return (
    <LearningDashboard
      user={user}
      language={language}
      onLanguageChange={(next) => void changeLanguage(next)}
      onLogout={() => void logout()}
    />
  );
}
