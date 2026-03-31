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
