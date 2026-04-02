import type { Metadata } from "next";
import "./globals.css";
import RootLayoutContent from "@/components/layout/RootLayoutContent";

async function getSEO(pageName: string = 'homepage') {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const result = await response.json();
      return result.data || null;
    }
  } catch (error) {
    console.error(`Failed to fetch SEO for ${pageName}:`, error);
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO('homepage');
  
  const siteName = "Moksha Sewa";
  const defaultTitle = "Moksha Sewa — Dignity in Departure";
  const defaultDesc = "Moksha Sewa provides dignified cremation services for unclaimed bodies and poor families across India.";
  
  return {
    metadataBase: new URL('https://moksha-seva.org'),
    title: {
      default: seo?.metaTitle || defaultTitle,
      template: `%s | ${siteName}`,
    },
    description: seo?.metaDescription || defaultDesc,
    keywords: seo?.metaKeywords ? seo.metaKeywords.split(',').map((k: string) => k.trim()) : [],
    alternates: {
      canonical: seo?.canonicalUrl || "https://moksha-seva.org",
    },
    robots: seo?.robots || 'index, follow',
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || defaultTitle,
      description: seo?.ogDescription || seo?.metaDescription || defaultDesc,
      images: [{ url: seo?.ogImage || "/og-image.png" }],
      type: 'website' as const,
      siteName: siteName,
    },
    twitter: {
      card: (seo?.twitterCard || "summary_large_image") as any,
      title: seo?.ogTitle || seo?.metaTitle || defaultTitle,
      description: seo?.ogDescription || seo?.metaDescription || defaultDesc,
      images: [seo?.ogImage || "/twitter-image.png"],
    },
  };
}

async function getGlobalSEO() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/seo/page/homepage`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const result = await response.json();
      return result.data || null;
    }
  } catch (error) {
    console.error('Failed to fetch global SEO scripts:', error);
  }
  return null;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await getGlobalSEO();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {seo?.gtmCode && (
          <script
            dangerouslySetInnerHTML={{
              __html: seo.gtmCode.replace(/<\/?script>/g, '')
            }}
          />
        )}
        {seo?.analyticsCode && (
          <script
            dangerouslySetInnerHTML={{
              __html: seo.analyticsCode.replace(/<\/?script>/g, '')
            }}
          />
        )}
        {seo?.headCode && (
          <div dangerouslySetInnerHTML={{ __html: seo.headCode }} />
        )}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icon.png?v=3" />
        <meta name="theme-color" content="#8B4513" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moksha Sewa" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B4513" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo?.schemaMarkup || {
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": "Moksha Sewa Foundation",
              "alternateName": "Moksha Sewa",
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
        {/* Body Injection for Tag Managers */}
        {seo?.bodyCode && (
          <div dangerouslySetInnerHTML={{ __html: seo.bodyCode }} />
        )}
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}