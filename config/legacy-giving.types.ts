// Type definitions for Legacy Giving page configuration

export interface LegacyGivingOptionConfig {
  title: string;
  desc: string;
  icon: string;
}

export interface LegacyGivingHeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface LegacyGivingMessageConfig {
  icon: string;
  title: string;
  subtitle: string;
  subtitleHighlight: string;
  description: string;
  buttons: {
    talkToFounder: string;
    talkToFounderLink: string;
    downloadPDF: string;
    downloadPDFLink: string;
  };
}

export interface LegacyGivingPageConfig {
  metadata: {
    title: string;
  };
  hero: LegacyGivingHeroConfig;
  options: LegacyGivingOptionConfig[];
  message: LegacyGivingMessageConfig;
  buttons: {
    requestInfoPack: string;
    requestInfoLink: string;
  };
}