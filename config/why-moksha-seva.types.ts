// Type definitions for Why Moksha Sewa page configuration

export interface WhyMokshaSewaReasonConfig {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface WhyMokshaSewaStatConfig {
  number: string;
  label: string;
}

export interface WhyMokshaSewaHeroConfig {
  title: string;
  titleHighlight: string;
  description: string;
  stats: WhyMokshaSewaStatConfig[];
  image: string;
  imageAlt: string;
}

export interface WhyMokshaSewaImpactConfig {
  title: string;
  stats: WhyMokshaSewaStatConfig[];
}

export interface WhyMokshaSewaCallToActionConfig {
  title: string;
  description: string;
  buttons: {
    volunteer: {
      text: string;
      href: string;
    };
    donate: {
      text: string;
      href: string;
    };
  };
}

export interface WhyMokshaSewaPageConfig {
  hero: WhyMokshaSewaHeroConfig;
  reasons: WhyMokshaSewaReasonConfig[];
  impact: WhyMokshaSewaImpactConfig;
  callToAction: WhyMokshaSewaCallToActionConfig;
  metadata: {
    title: string;
  };
}