// Type definitions for Services page configuration

export interface ServiceConfig {
  icon: string;
  title: string;
  badge: string;
  badgeVariant: "primary" | "secondary";
  desc: string;
  includes: string[];
}

export interface EligibilityItemConfig {
  icon: string;
  title: string;
  desc: string;
  image: string;
}

export interface ServicesHeroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface EligibilityConfig {
  badge: string;
  title: string;
  description: string;
  items: EligibilityItemConfig[];
  mainImage: string;
  mainImageAlt: string;
}

export interface ServicesPageConfig {
  hero: ServicesHeroConfig;
  mainServices: ServiceConfig[];
  eligibility: EligibilityConfig;
  metadata: {
    title: string;
  };
}