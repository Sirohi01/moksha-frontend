// Type definitions for Stories page configuration

export interface StoriesHeroConfig {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
}

export interface StoryConfig {
  title: string;
  duration: string;
  type: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface StoriesGridConfig {
  stories: StoryConfig[];
  buttons: {
    watchNow: string;
    favorite: string;
  };
}

export interface NewsletterConfig {
  title: string;
  highlightText: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

export interface StoriesPageConfig {
  metadata: {
    title: string;
  };
  hero: StoriesHeroConfig;
  storiesGrid: StoriesGridConfig;
  newsletter: NewsletterConfig;
}