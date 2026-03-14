// Type definitions for How It Works page configuration

export interface HowItWorksStepConfig {
  icon: string;
  step: string;
  title: string;
  description: string;
  timeline: string;
  actions: string[];
}

export interface HowItWorksHeroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface HowItWorksCallToActionConfig {
  title: string;
  description: string;
  buttons: {
    reportOnline: {
      text: string;
      href: string;
    };
    callButton: {
      text: string;
      phoneNumber: string;
    };
  };
}

export interface HowItWorksPageConfig {
  hero: HowItWorksHeroConfig;
  steps: HowItWorksStepConfig[];
  callToAction: HowItWorksCallToActionConfig;
  metadata: {
    title: string;
  };
}