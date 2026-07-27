import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "FluentAI — Your Personal English Tutor",
  description:
    "Adaptive English conversation, smart flashcards and personalised grammar practice.",
  openGraph: {
    title: "FluentAI — Your Personal English Tutor",
    description: "Adaptive conversation, smart flashcards and personalised grammar practice.",
    images: [{ url: "/og.png", width: 1744, height: 912, alt: "FluentAI learning dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FluentAI — Your Personal English Tutor",
    description: "Adaptive English practice built around your level and goals.",
    images: ["/og.png"],
  },
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
