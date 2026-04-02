import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://moksha-seva.org';
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const currentDate = new Date();
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/donate',
    '/contact',
    '/gallery',
    '/volunteer',
    '/transparency',
    '/impact',
    '/how-it-works',
    '/our-reach',
    '/services',
    '/blog',
    '/campaigns',
    '/stories',
    '/testimonials',
    '/faq',
    '/press',
    '/board',
    '/compliance',
    '/corporate',
    '/documentaries',
    '/legacy-giving',
    '/remembrance',
    '/report',
    '/schemes',
    '/tribute',
    '/why-moksha-seva',
    '/privacy',
  ];

  let dynamicPages: any[] = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/content/public/slugs`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        dynamicPages = result.data.map((item: any) => ({
          url: `${baseUrl}/${item.type}/${item.slug}`,
          lastModified: new Date(item.updatedAt),
          changeFrequency: 'weekly',
          priority: item.type === 'blog' ? 0.8 : item.type === 'campaign' ? 0.9 : 0.7
        }));
      }
    }
  } catch (error) {
    console.error('Sitemap dynamic fetch failed:', error);
  }

  const sitemaps = [
    ...staticPages.map(page => ({
      url: `${baseUrl}${page}`,
      lastModified: currentDate,
      changeFrequency: (page === '' ? 'daily' : 'weekly') as any,
      priority: page === '' ? 1.0 : (page.includes('/donate') || page.includes('/contact') ? 0.9 : 0.7)
    })),
    ...dynamicPages
  ];

  return sitemaps;
}