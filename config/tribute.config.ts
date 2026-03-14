// Tribute Page Configuration
// All text, images, and content for the tribute page

import { TributePageConfig } from './tribute.types';

export const tributeConfig: TributePageConfig = {
  // Page Metadata
  metadata: {
    title: "Tribute"
  },

  // Hero Section
  hero: {
    badge: "A SACRED GIFT",
    title: "IN",
    subtitle: "MEMORY",
    titleSuffix: "OF...",
    description: "Donate in the name of your private loved ones to provide a final farewell to those who have been forgotten by the rest of the world."
  },

  // Tribute Options
  options: [
    {
      title: "Honor a Special Day",
      desc: "Celebrate your own birthday or anniversary by sponsoring the last rites of a person who has no one left.",
      icon: "Calendar"
    },
    {
      title: "In Loving Memory",
      desc: "Remember your own parents or loved ones by donor-sponsoring a dignified cremation on their death anniversary.",
      icon: "Flower"
    },
    {
      title: "Tribute Fund",
      desc: "Start a collective drive with your community or office teammates to honor a coworker or elder who has passed.",
      icon: "Heart"
    },
    {
      title: "Memorial Plaque",
      desc: "For significant tribute donations, we will place a physical or digital plaque in our next response center in your loved one's name.",
      icon: "ShieldCheck"
    }
  ],

  // Quote Section
  quote: {
    icon: "Flower",
    title: "THE BEAUTY OF",
    subtitle: "REMEMBRANCE",
    quote: "Giving a forgotten soul a name and a prayer is the highest form of service. When we do it in the name of our own ancestors, we create a circle of divinity that heals the entire world.",
    imageUrl: "/gallery/gallery_peaceful_departure_1772861335733.png",
    imageAlt: "Dignified Offering",
    buttonText: "START A TRIBUTE NOW",
    buttonLink: "/donate"
  },

  // Common Buttons
  buttons: {
    sponsorTribute: "Sponsor This Tribute",
    donateLink: "/donate"
  }
};

export default tributeConfig;