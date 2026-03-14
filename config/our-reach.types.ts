// Type definitions for Our Reach page configuration

export interface OurReachRegionConfig {
  name: string;
  cities: string[];
  density: string;
  stats: string;
}

export interface OurReachStatConfig {
  number: string;
  label: string;
}

export interface OurReachHeroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface OurReachNetworkStatsConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  stats: OurReachStatConfig[];
}

export interface OurReachExpansionCardConfig {
  title: string;
  description: string;
  buttonText: string;
}

export interface OurReachFormConfig {
  title: string;
  titleHighlight: string;
  description: string;
  successTitle: string;
  successDescription: string;
  successRequestId: string;
  whatWeProvideText: string;
  submitButtonText: string;
  loadingText: string;
  footerText: string;
  closeButtonText: string;
  labels: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    population: string;
    organization: string;
    localSupport: string;
    whyNeeded: string;
  };
  placeholders: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    selectState: string;
    population: string;
    organization: string;
    whyNeeded: string;
  };
  supportTypes: Array<{
    value: string;
    label: string;
  }>;
  validationMessages: {
    populationMinimum: string;
    populationTooSmall: string;
    whyNeededMinimum: string;
    whyNeededCounter: string;
  };
  states: string[];
}

export interface OurReachModalConfig {
  regionModalDescription: string;
  expansionButtonText: string;
  badge: string;
}

export interface OurReachLabelsConfig {
  activeCities: string;
  permanentImpact: string;
  activeCitiesCount: string;
  totalServices: string;
  expansionRequestBadge: string;
}

export interface OurReachPageConfig {
  hero: OurReachHeroConfig;
  regions: OurReachRegionConfig[];
  expansionCard: OurReachExpansionCardConfig;
  networkStats: OurReachNetworkStatsConfig;
  form: OurReachFormConfig;
  modal: OurReachModalConfig;
  labels: OurReachLabelsConfig;
  metadata: {
    title: string;
  };
}