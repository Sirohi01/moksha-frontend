import type { Metadata } from "next";
import "./globals.css";
import "../styles/admin.css";
import RootLayoutContent from "@/components/layout/RootLayoutContent";

export const metadata: Metadata = {
  metadataBase: new URL('https://moksha-seva.org'),
  title: {
    default: "Moksha Seva — Dignity in Departure",
    template: "%s | Moksha Seva",
  },
  description:
    "Moksha Seva provides dignified cremation services for unclaimed bodies, homeless individuals, and poor families across India. Transparency, compassion, and service.",
  keywords: [
    "cremation", "unclaimed bodies", "humanitarian", "NGO", "India", "dignity",
    "charity", "donation", "volunteer", "social service", "death care", "funeral services",
    "homeless support", "community service", "transparency", "compassion"
  ],
  authors: [{ name: "Moksha Seva Foundation" }],
  creator: "Moksha Seva Foundation",
  publisher: "Moksha Seva Foundation",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Moksha Seva — Dignity in Departure",
    description: "Providing dignified cremation services for unclaimed bodies and poor families across India.",
    type: "website",
    locale: "en_IN",
    url: "https://moksha-seva.org",
    siteName: "Moksha Seva",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moksha Seva - Dignity in Departure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moksha Seva — Dignity in Departure",
    description: "Providing dignified cremation services for unclaimed bodies and poor families.",
    images: ["/twitter-image.png"],
    creator: "@moksha_seva",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://moksha-seva.org",
    languages: {
      'en-IN': 'https://moksha-seva.org',
      'hi-IN': 'https://moksha-seva.org/hi',
    },
  },
  category: 'social',
  classification: 'Non-profit organization',
  other: {
    'google-site-verification': 'your-google-site-verification',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#8B4513" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moksha Seva" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B4513" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": "Moksha Seva Foundation",
              "alternateName": "Moksha Seva",
              "url": "https://moksha-seva.org",
              "logo": "https://moksha-seva.org/logo.png",
              "description": "Providing dignified cremation services for unclaimed bodies and poor families across India",
              "foundingDate": "2020",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "India"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-XXXXXXXXXX",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://facebook.com/moksha-seva",
                "https://twitter.com/moksha_seva",
                "https://instagram.com/moksha_seva",
                "https://linkedin.com/company/moksha-seva"
              ],
              "areaServed": "India",
              "knowsAbout": ["Cremation Services", "Humanitarian Aid", "Social Work"],
              "memberOf": {
                "@type": "Organization",
                "name": "Indian NGO Network"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}