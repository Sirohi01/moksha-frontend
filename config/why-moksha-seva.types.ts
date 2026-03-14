// Type definitions for Why Moksha Seva page configuration

export interface WhyMokshaSevaReasonConfig {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface WhyMokshaSevaStatConfig {
  number: string;
  label: string;
}

export interface WhyMokshaSevaHeroConfig {
  title: string;
  titleHighlight: string;
  description: string;
  stats: WhyMokshaSevaStatConfig[];
  image: string;
  imageAlt: string;
}

export interface WhyMokshaSevaImpactConfig {
  title: string;
  stats: WhyMokshaSevaStatConfig[];
}

export interface WhyMokshaSevaCallToActionConfig {
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

export interface WhyMokshaSevaPageConfig {
  hero: WhyMokshaSevaHeroConfig;
  reasons: WhyMokshaSevaReasonConfig[];
  impact: WhyMokshaSevaImpactConfig;
  callToAction: WhyMokshaSevaCallToActionConfig;
  metadata: {
    title: string;
  };
}