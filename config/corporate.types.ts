// Type definitions for Corporate page configuration

export interface CorporateModelConfig {
  title: string;
  desc: string;
  icon: string;
}

export interface CorporateHeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  partnersText: string;
  description: string;
}

export interface CorporateTrustConfig {
  icon: string;
  title: string;
  subtitle: string;
  forCSRText: string;
  description: string;
  certifications: {
    taxExemption: {
      value: string;
      label: string;
    };
    permanentReg: {
      value: string;
      label: string;
    };
  };
  imageUrl: string;
  imageAlt: string;
  videoButtonLink: string;
}

export interface CorporatePageConfig {
  metadata: {
    title: string;
  };
  hero: CorporateHeroConfig;
  models: CorporateModelConfig[];
  trust: CorporateTrustConfig;
  buttons: {
    getPartnershipDeck: string;
    contactLink: string;
  };
}