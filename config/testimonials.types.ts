// Type definitions for Testimonials page configuration

export interface TestimonialsHeroConfig {
  title: string;
  highlightText: string;
  description: string;
}

export interface TestimonialStatConfig {
  number: string;
  label: string;
}

export interface TestimonialConfig {
  name: string;
  role: string;
  location: string;
  rating: number;
  quote: string;
  image: string;
}

export interface TestimonialsGridConfig {
  title: string;
  testimonials: TestimonialConfig[];
}

export interface VideoTestimonialConfig {
  title: string;
  duration: string;
  thumbnail: string;
  alt: string;
}

export interface VideoTestimonialsConfig {
  title: string;
  description: string;
  videos: VideoTestimonialConfig[];
}

export interface CallToActionConfig {
  title: string;
  description: string;
  actions: {
    shareStory: {
      text: string;
      href: string;
    };
    joinMission: {
      text: string;
      href: string;
    };
  };
}

export interface TestimonialsPageConfig {
  metadata: {
    title: string;
  };
  hero: TestimonialsHeroConfig;
  stats: TestimonialStatConfig[];
  testimonialsGrid: TestimonialsGridConfig;
  videoTestimonials: VideoTestimonialsConfig;
  callToAction: CallToActionConfig;
}