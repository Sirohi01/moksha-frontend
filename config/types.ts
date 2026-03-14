// Type definitions for homepage configuration

export interface ButtonConfig {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
}

export interface StatConfig {
  number: string;
  label: string;
}

export interface ProgrammeConfig {
  title: string;
  icon: string;
  description: string;
  image: string;
  href: string;
}

export interface CarouselSlideConfig {
  src: string;
  title: string;
  description: string;
  location: string;
}

export interface LocationConfig {
  city: string;
  status: string;
}

export interface PillarConfig {
  title: string;
  icon: string;
  number: string;
}

export interface StoryConfig {
  image: string;
  title: string;
}

export interface CampaignConfig {
  title: string;
  description: string;
  targeted: string;
  raised: string;
  percentage: string;
  image: string;
}

export interface TimelineItemConfig {
  year: string;
  event: string;
  icon: string;
  description: string;
}

export interface TransparencyStatConfig {
  label: string;
  percentage: string;
}

export interface BadgeConfig {
  text: string;
  subtext: string;
  color?: string;
}

export interface TestimonialConfig {
  quote: string;
  author: string;
}

export interface PartnerConfig {
  name: string;
  label: string;
}

export interface FAQConfig {
  question: string;
  answer: string;
}

export interface HomepageConfig {
  hero: {
    slides: string[];
    autoSlideInterval: number;
  };
  actionBanner: {
    title: string;
    buttons: ButtonConfig[];
  };
  about: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    secondaryDescription: string;
    stats: StatConfig[];
    buttons: ButtonConfig[];
    image: string;
    floatingBadge: {
      text: string;
      subtext: string;
    };
  };
  ourSeva: {
    badge: string;
    title: string;
    description: string;
    programmes: ProgrammeConfig[];
  };
  whereWeServe: {
    badge: string;
    title: string;
    description: string;
    carousel: {
      slides: CarouselSlideConfig[];
      autoSlideInterval: number;
    };
    activeNetwork: {
      title: string;
      locations: LocationConfig[];
      stats: StatConfig[];
    };
    extendedNetwork: {
      title: string;
      cities: string[];
    };
  };
  missionPillars: {
    badge: string;
    title: string;
    description: string;
    pillars: PillarConfig[];
    bottomStatement: string;
  };
  storiesInMotion: {
    title: string;
    stories: StoryConfig[];
  };
  joinMission: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    backgroundImage: string;
    buttons: ButtonConfig[];
    stats: StatConfig[];
  };
  urgentCampaigns: {
    badge: string;
    title: string;
    description: string;
    campaigns: CampaignConfig[];
    autoSlideInterval: number;
    labels: {
      activeCampaign: string;
      raised: string;
      donateNow: string;
      viewCampaign: string;
    };
  };
  sacredJourney: {
    badge: string;
    title: string;
    timeline: TimelineItemConfig[];
  };
  transparency: {
    title: string;
    titleHighlight: string;
    description: string;
    stats: TransparencyStatConfig[];
    trustSection: {
      title: string;
      description: string;
      badges: BadgeConfig[];
    };
  };
  mediaRecognition: {
    badge: string;
    logos: string[];
  };
  testimonials: {
    badge: string;
    slides: TestimonialConfig[];
    autoSlideInterval: number;
  };
  governmentPartners: {
    title: string;
    partners: PartnerConfig[];
  };
  faq: {
    title: string;
    questions: FAQConfig[];
  };
  labels: {
    heroAltText: string;
    joinMissionAltText: string;
    learnMore: string;
  };
}