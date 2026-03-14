// Type definitions for Impact page configuration

export interface ImpactHeroConfig {
  title: string;
  highlightText: string;
  description: string;
  image: string;
  imageAlt: string;
  keyStats: {
    livesHonored: {
      number: string;
      label: string;
    };
    cities: {
      number: string;
      label: string;
    };
    years: {
      number: string;
      label: string;
    };
  };
  missionImpact: {
    title: string;
    description: string;
    features: {
      freeService: string;
      available247: string;
    };
  };
  actions: {
    joinMission: {
      text: string;
      href: string;
    };
    supportWork: {
      text: string;
      href: string;
    };
  };
  floatingStats: {
    volunteers: {
      number: string;
      label: string;
    };
    compliance: {
      number: string;
      label: string;
    };
  };
}

export interface ImpactStatConfig {
  icon: string;
  number: string;
  label: string;
  description: string;
  color: string;
}

export interface ImpactStatsConfig {
  title: string;
  description: string;
  stats: ImpactStatConfig[];
  additionalMetrics: {
    freeService: {
      symbol: string;
      title: string;
      description: string;
    };
    certified: {
      symbol: string;
      title: string;
      description: string;
    };
    available247: {
      symbol: string;
      title: string;
      description: string;
    };
    withDignity: {
      symbol: string;
      title: string;
      description: string;
    };
  };
}

export interface GrowthDataPoint {
  year: string;
  rites: number;
  cities: number;
  volunteers?: number;
}

export interface GrowthTimelineConfig {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  yearlyData: GrowthDataPoint[];
  highlightedYears: GrowthDataPoint[];
}

export interface TestimonialConfig {
  quote: string;
  author: string;
  role: string;
  image: string;
}

export interface TestimonialsConfig {
  title: string;
  testimonials: TestimonialConfig[];
}

export interface CallToActionConfig {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  actions: {
    joinMission: {
      text: string;
      href: string;
    };
    supportWork: {
      text: string;
      href: string;
    };
  };
}

export interface ImpactPageConfig {
  metadata: {
    title: string;
  };
  hero: ImpactHeroConfig;
  impactStats: ImpactStatsConfig;
  growthTimeline: GrowthTimelineConfig;
  testimonials: TestimonialsConfig;
  callToAction: CallToActionConfig;
}