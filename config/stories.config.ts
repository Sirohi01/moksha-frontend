// Stories Page Configuration
// All text, images, and content for the stories page

import { StoriesPageConfig } from './stories.types';

export const storiesConfig: StoriesPageConfig = {
  // Page Metadata
  metadata: {
    title: "Stories"
  },

  // Hero Section
  hero: {
    badge: "STORIES OF RESILIENCE",
    title: "NARRATIVES OF",
    highlightText: "DIGNITY",
    description: "Every person we serve has a story that was almost lost. We document these journeys to ensure their humanity is never forgotten."
  },

  // Stories Grid Section
  storiesGrid: {
    stories: [
      {
        title: "The Man with the Silver Key",
        duration: "4:15",
        type: "Short Film",
        description: "A forgotten watchmaker in Varanasi and the Saathi who became his son for one final hour.",
        image: "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=2000&auto=format&fit=crop",
        imageAlt: "The Man with the Silver Key story"
      },
      {
        title: "Night Shift Dignity",
        duration: "6:30",
        type: "Documentary",
        description: "Follow our Lucknow response unit through a midnight call that changed their lives forever.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2000&auto=format&fit=crop",
        imageAlt: "Night Shift Dignity documentary"
      },
      {
        title: "Naming the Nameless",
        duration: "3:45",
        type: "Cinematic Short",
        description: "The deep investigation process we follow to find the identity of those forgotten by society.",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop",
        imageAlt: "Naming the Nameless cinematic short"
      }
    ],
    buttons: {
      watchNow: "WATCH NOW",
      favorite: "Add to favorites"
    }
  },

  // Newsletter Section
  newsletter: {
    title: "GET STORIES IN YOUR",
    highlightText: "INBOX",
    description: "Subscribe to 'The Dignity Dispatch'—a monthly long-form narrative series about the souls we serve. No spam, just humanity.",
    placeholder: "YOUR EMAIL ADDRESS",
    buttonText: "SUBSCRIBE"
  }
};

export default storiesConfig;