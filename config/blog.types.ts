// Blog Page Type Definitions

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  author: string;
  authorRole: string;
  date: string;
  readingTime: string;
  category: string;
  featured?: boolean;
}

export interface BlogConfig {
  hero: {
    badge: string;
    title: string;
    highlightText: string;
    description: string;
  };
  featuredBlog: {
    title: string;
    badge: string;
  };
  blogGrid: {
    title: string;
    description: string;
    categories: string[];
    blogs: BlogPost[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
  subscriptionCTA?: {
    badge: string;
    title: string;
    highlightText: string;
    description: string;
    inputPlaceholder: string;
    buttonText: string;
  };
}
