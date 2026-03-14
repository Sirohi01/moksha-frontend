// Type definitions for Remembrance page configuration

export interface RemembranceHeroConfig {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
}

export interface MemorialConfig {
  name: string;
  date: string;
  city: string;
  tribute: string;
}

export interface SearchConfig {
  placeholder: string;
  buttonText: string;
}

export interface MemorialGridConfig {
  search: SearchConfig;
  memorials: MemorialConfig[];
  actions: {
    offerFlower: string;
    viewCase: string;
  };
  stats: {
    number: string;
    description: string;
    sponsorButton: string;
    sponsorLink: string;
  };
}

export interface MemorialMessageConfig {
  title: string;
  highlightText: string;
  description: string;
  actions: {
    leaveTribute: {
      text: string;
      href: string;
    };
    missionStory: {
      text: string;
      href: string;
    };
  };
}

export interface RemembrancePageConfig {
  metadata: {
    title: string;
  };
  hero: RemembranceHeroConfig;
  memorialGrid: MemorialGridConfig;
  memorialMessage: MemorialMessageConfig;
}