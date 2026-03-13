import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://moksha-seva.org';
  const currentDate = new Date();

  const staticPages = [
    '',
    '/about',
    '/donate',
    '/contact',
    '/gallery',
    '/campaigns',
    '/volunteer',
    '/transparency',
    '/impact',
    '/how-it-works',
    '/our-reach',
    '/services',
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
    '/legal/terms',
  ];

  const campaignPages = [
    '/campaigns/adopt-a-city',
    '/campaigns/dignity-for-all',
    '/campaigns/home-for-saathis',
    '/campaigns/sacred-river',
  ];

  const legalPages = [
    '/donate/refund-policy',
    '/legacy-giving/request-info',
  ];

  const allPages = [...staticPages, ...campaignPages, ...legalPages];

  return allPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: currentDate,
    changeFrequency: page === '' ? 'daily' : 
                    page.includes('/campaigns') ? 'weekly' : 
                    page.includes('/legal') ? 'monthly' : 'weekly',
    priority: page === '' ? 1.0 : 
             page.includes('/donate') || page.includes('/contact') ? 0.9 :
             page.includes('/campaigns') || page.includes('/volunteer') ? 0.8 :
             page.includes('/legal') ? 0.3 : 0.7,
  }));
}