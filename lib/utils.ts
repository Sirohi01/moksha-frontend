import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSafeSrc(imgSource: any, fallback = '/gallery/hero_moksha_1.png'): string {
  if (!imgSource) return fallback;
  if (typeof imgSource === 'string') return imgSource;
  if (typeof imgSource === 'object') {
    if (typeof imgSource.src === 'string') return imgSource.src;
    if (typeof imgSource.url === 'string') return imgSource.url;
    if (typeof imgSource.src === 'object') return getSafeSrc(imgSource.src, fallback);
    if (typeof imgSource.url === 'object') return getSafeSrc(imgSource.url, fallback);
  }
  return fallback;
}

export function getAlt(url: any, seoMappings: any, fallback = 'Moksha Sewa'): string {
  if (!url) return fallback;
  const rawSrc = typeof url === 'string' ? url : (url.src || url.url || '');
  if (!rawSrc) return fallback;

  // Normalize URL to handle Cloudinary transformations/versions
  const normalizeUrl = (s: string) => {
    // Basic normalization: remove protocol and versioning v1235456/
    return s.replace(/^https?:\/\//, '').replace(/\/v\d+\//, '/');
  };

  const src = normalizeUrl(rawSrc);
  
  // 1. Check SEO Mappings from Page Configuration
  if (seoMappings?.imageAltMappings) {
    // Try exact match first
    if (seoMappings.imageAltMappings[rawSrc]) return seoMappings.imageAltMappings[rawSrc];
    
    // Try normalized match
    const mappingKeys = Object.keys(seoMappings.imageAltMappings);
    const matchedKey = mappingKeys.find(k => normalizeUrl(k) === src);
    if (matchedKey) return seoMappings.imageAltMappings[matchedKey];
  }
  
  // 2. Check if alt is embedded in the object itself
  if (typeof url === 'object' && url.alt) {
    return url.alt;
  }
  
  return fallback;
}
