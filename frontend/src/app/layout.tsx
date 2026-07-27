import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FluentAI — English Learning",
  description: "Practice English with an adaptive AI tutor.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
