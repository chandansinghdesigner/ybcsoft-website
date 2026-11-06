import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/data";

const TITLE = "Software, Web & Mobile App Development Company | YBCSOFT";
const DESC =
  "YBCSOFT delivers custom software, web and mobile app development, freelancing & IT services, UI/UX design and professional video editing for businesses, startups and entrepreneurs worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: "%s | YBCSOFT" },
  description: DESC,
  alternates: { canonical: "/" },
  keywords: ["software development company", "web development", "mobile app development", "freelancing services", "IT solutions", "video editing", "UI/UX design", "YBCSOFT"],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE.url,
    siteName: "YBCSOFT",
    type: "website",
    images: [{ url: "/assets/logo/ybcsoft-logo.jpg", width: 1991, height: 2048, alt: "YBCSOFT logo" }],
  },
  twitter: { card: "summary", title: TITLE, description: DESC, images: ["/assets/logo/ybcsoft-logo.jpg"] },
  icons: { icon: "/assets/logo/ybcsoft-logo.jpg", apple: "/assets/logo/ybcsoft-logo.jpg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#242424",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "YBCSOFT",
  alternateName: "YBCSOFT Software Solutions",
  url: SITE.url,
  logo: `${SITE.url}/assets/logo/ybcsoft-logo.jpg`,
  email: SITE.email,
  telephone: "+917992497677",
  sameAs: [SITE.facebook],
  description: DESC,
  contactPoint: [{ "@type": "ContactPoint", telephone: "+917992497677", email: SITE.email, contactType: "sales", availableLanguage: ["English", "Hindi"] }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
