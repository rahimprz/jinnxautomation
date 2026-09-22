import type { Metadata } from "next";
import "./globals.css";
import "./reference.css";

export const metadata: Metadata = {
  title: "Jinnx Automation | AI Agents & Automation for Your Business",
  description: "AI agents and automation for owner-run businesses: lead discovery, AI-drafted replies with your approval, CRM pipelines, campaigns, invoicing and reporting, plus custom software when you need it.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/jinnx-automation-logo.png",
    shortcut: "/images/jinnx-automation-logo.png",
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
