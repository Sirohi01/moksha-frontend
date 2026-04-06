// Type definitions for Gallery page configuration

export interface GalleryHeroConfig {
  badge: string;
  title: {
    line1: string;
    line2: string;
    line3: string;
  };
  description: string;
  stats: {
    momentsCaptured: {
      number: string;
      label: string;
    };
    categories: {
      number: string;
      label: string;
    };
    citiesDocumented: {
      number: string;
      label: string;
    };
    storiesTold: {
      number: string;
      label: string;
    };
  };
  backgroundImages: string[];
}

export interface GalleryImageConfig {
  src: string;
  title: string;
  category: string;
  location: string;
  date: string;
  height: number;
}

export interface GalleryGridConfig {
  categories: string[];
  images: GalleryImageConfig[];
  loadMoreText: string;
}

export interface GalleryPageConfig {
  metadata: {
    title: string;
  };
  hero: GalleryHeroConfig;
  gallery: GalleryGridConfig;
  modal?: {
    badge: string;
    description: string;
    zoneLabel: string;
    dateLabel: string;
    returnButton: string;
  };
}