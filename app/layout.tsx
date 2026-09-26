import type { Metadata } from "next";
import "./globals.css";
import "./reference.css";
import { SITE_URL, SITE_NAME, keywords, pageMetadata } from "@/lib/seo";

const title = "Jinnx Automation | AI Automation Agency: AI Agents & Workflow Automation";
const description = "AI automation agency for owner-run businesses: AI agents, lead discovery, AI-drafted replies with your approval, CRM pipelines, voice AI, invoicing and reporting, plus custom software.";

export const metadata: Metadata = {
  ...pageMetadata("/", title, description),
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/jinnx-automation-logo.png",
    shortcut: "/images/jinnx-automation-logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": SITE_URL + "/#organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_URL + "/images/jinnx-automation-logo.png",
      image: SITE_URL + "/images/jinnx-automation-logo.png",
      description,
      email: "info@jinnxautomation.com",
      telephone: "+1-888-486-3840",
      priceRange: "$$",
      areaServed: ["US", "GB"],
      knowsAbout: keywords.slice(0, 20),
      openingHours: "Mo-Fr 09:00-18:00",
      address: [
        { "@type": "PostalAddress", streetAddress: "1016 W Jackson Blvd", addressLocality: "Chicago", addressRegion: "IL", postalCode: "60607", addressCountry: "US" },
        { "@type": "PostalAddress", streetAddress: "3 Fitzroy Pl, Finnieston", addressLocality: "Glasgow", postalCode: "G3 7RH", addressCountry: "GB" },
      ],
      contactPoint: [
        { "@type": "ContactPoint", telephone: "+1-888-486-3840", contactType: "sales", areaServed: "US", availableLanguage: "English" },
        { "@type": "ContactPoint", telephone: "+44-20-3349-7819", contactType: "sales", areaServed: "GB", availableLanguage: "English" },
      ],
    },
    { "@type": "WebSite", "@id": SITE_URL + "/#website", url: SITE_URL, name: SITE_NAME, publisher: { "@id": SITE_URL + "/#organization" } },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
