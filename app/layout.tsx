import type { Metadata } from "next";
import "./globals.css";
import RootLayoutContent from "@/components/layout/RootLayoutContent";
import { Toaster } from "sonner";
import { headers } from "next/headers";

async function getSEO(pageName: string = 'homepage') {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/seo/page/${pageName}`, {
      cache: 'no-store'
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
  const heads = headers();
  const pathname = heads.get('x-url') || '/';
  let slug = 'homepage';
  if (pathname && pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean);
    slug = segments[0] || 'homepage';
    if (pathname.includes('/blog/') || pathname.includes('/documentaries/')) {
      slug = pathname.replace(/^\//, '').replace(/\/$/, '');
    }
  }

  const seo = await getSEO(slug);

  const siteName = "Moksha Sewa";
  const defaultTitle = "Moksha Sewa — Dignity in Departure";
  const defaultDesc = "Moksha Sewa provides dignified cremation services for unclaimed bodies and poor families across India.";

  return {
    metadataBase: new URL('https://mokshasewa.org'),
    title: {
      default: seo?.metaTitle || defaultTitle,
      template: `%s | ${siteName}`,
    },
    description: seo?.metaDescription || defaultDesc,
    keywords: seo?.metaKeywords ? seo.metaKeywords.split(',').map((k: string) => k.trim()) : [],
    alternates: {
      canonical: seo?.canonicalUrl || "https://mokshasewa.org",
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
    const response = await fetch(`${API_BASE_URL}/api/seo/settings`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const result = await response.json();
      return result.data || null;
    }
  } catch (error) {
    console.error('Failed to fetch global SEO settings:', error);
  }
  return null;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const globalSeo = await getGlobalSEO();
  const heads = headers();
  const pathname = heads.get('x-url') || '/';
  let slug = 'homepage';
  if (pathname && pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean);
    slug = segments[0] || 'homepage';
    if (pathname.includes('/blog/') || pathname.includes('/documentaries/')) {
      slug = pathname.replace(/^\//, '').replace(/\/$/, '');
    }
  }
  const pageSeo = await getSEO(slug);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {globalSeo?.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${globalSeo.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${globalSeo.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
        {pageSeo?.schemaMarkup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: typeof pageSeo.schemaMarkup === 'string'
                ? pageSeo.schemaMarkup
                : JSON.stringify(pageSeo.schemaMarkup)
            }}
          />
        )}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B4513" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moksha Sewa" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B4513" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="min-h-screen antialiased">
        {/* Header Injectors (Moved from head to start of body to avoid hydration error) */}
        {globalSeo?.headerScripts && (
          <div dangerouslySetInnerHTML={{ __html: globalSeo.headerScripts }} />
        )}
        {pageSeo?.headCode && (
          <div dangerouslySetInnerHTML={{ __html: pageSeo.headCode }} />
        )}
        {/* Global Footer Scripts */}
        {globalSeo?.footerScripts && (
          <div dangerouslySetInnerHTML={{ __html: globalSeo.footerScripts }} />
        )}

        {/* Page-Specific Body Code */}
        {pageSeo?.bodyCode && (
          <div dangerouslySetInnerHTML={{ __html: pageSeo.bodyCode }} />
        )}

        <RootLayoutContent>{children}</RootLayoutContent>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}