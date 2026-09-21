import type { Metadata } from "next";
import "./globals.css";
import "./reference.css";

export const metadata: Metadata = {
  title: "Jinnx Automation | Product Launch, AI & Automation",
  description: "AI-accelerated product development and business automation. Explore the process, build your package, and plan your next product.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/jinnx-automation-logo.webp",
    shortcut: "/images/jinnx-automation-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
