// Documentaries Page Configuration
// All text, images, and content for the documentaries page

import { DocumentariesPageConfig } from './documentaries.types';

export const documentariesConfig: DocumentariesPageConfig = {
  // Page Metadata
  metadata: {
    title: "Documentaries"
  },

  // Hero Section
  hero: {
    badge: "Theatrical Collection . Prime",
    title: "CINEMA",
    subtitle: "MANIFESTO",
    description: "Documenting high-integrity narratives of human dignity and institutional impact across the globe."
  },

  // Films
  films: {
    items: [
      {
        title: "One Last Rite",
        duration: "18:00",
        type: "Main Feature",
        year: "2024",
        desc: "A cinematic deep-dive into the founding philosophy of Moksha Sewa and the people who make it possible.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2000&auto=format&fit=crop",
        youtubeId: "Jm_X9J-J9yY"
      },
      {
        title: "The City of Shadows",
        duration: "12:45",
        type: "City Series",
        year: "2023",
        desc: "Exploring the life and death of those in the busiest hubs of Mumbai, and how our teams respond in the urban chaos.",
        image: "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=2000&auto=format&fit=crop",
        youtubeId: "vB3P0p_Y0ks"
      },
      {
        title: "Ganga's Quiet Tears",
        duration: "15:30",
        type: "Regional Story",
        year: "2023",
        desc: "A spiritual exploration of final rites in Varanasi and the transition from identified to unidentified cases.",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop",
        youtubeId: "4RzH8l3gE14"
      }
    ],
    watchButton: "WATCH FILM",
    newBadge: "New"
  },

  // Festival Selections
  festivalSelections: {
    title: "Festival",
    subtitle: "Selections",
    description: "Our documentaries have been recognized at prestigious film festivals worldwide",
    festivals: [
      {
        name: "Sundance",
        subtitle: "Official Selection",
        year: "2024"
      },
      {
        name: "Cannes",
        subtitle: "Impact Award",
        year: "2023"
      },
      {
        name: "Human Rights",
        subtitle: "Best Documentary",
        year: "2024"
      },
      {
        name: "Docs World",
        subtitle: "Audience Choice",
        year: "2023"
      }
    ],
    recognitionText: "Recognized for authentic storytelling and humanitarian impact",
    stats: {
      awards: 4,
      selections: 12
    },
    statsLabels: {
      awards: "Awards",
      selections: "Selections"
    }
  },

  // Footer Section
  footer: {
    title: "THEATER_OF_DIGNITY",
    hubLabel: "HUB",
    cities: ['VARANASI', 'NEW DELHI', 'NEW YORK', 'GENEVA']
  }
};

export default documentariesConfig;