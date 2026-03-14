// Type definitions for Tribute page configuration

export interface TributeOptionConfig {
  title: string;
  desc: string;
  icon: string;
}

export interface TributeHeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  titleSuffix: string;
  description: string;
}

export interface TributeQuoteConfig {
  icon: string;
  title: string;
  subtitle: string;
  quote: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
}

export interface TributePageConfig {
  metadata: {
    title: string;
  };
  hero: TributeHeroConfig;
  options: TributeOptionConfig[];
  quote: TributeQuoteConfig;
  buttons: {
    sponsorTribute: string;
    donateLink: string;
  };
}