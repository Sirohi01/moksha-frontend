// Documentaries Page Type Definitions
// TypeScript interfaces for all documentaries page configuration

export interface Film {
  title: string;
  duration: string;
  type: string;
  year: string;
  desc: string;
  image: string;
  youtubeId: string;
}

export interface Festival {
  name: string;
  subtitle: string;
  year: string;
}

export interface FestivalStats {
  awards: number;
  selections: number;
}

export interface DocumentariesPageConfig {
  // Page Metadata
  metadata: {
    title: string;
  };

  // Hero Section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };

  // Films
  films: {
    items: Film[];
    watchButton: string;
    newBadge: string;
  };

  // Festival Selections
  festivalSelections: {
    title: string;
    subtitle: string;
    description: string;
    festivals: Festival[];
    recognitionText: string;
    stats: FestivalStats;
    statsLabels: {
      awards: string;
      selections: string;
    };
  };
  footer?: {
    title: string;
    hubLabel: string;
    cities: string[];
  };
}

export default DocumentariesPageConfig;