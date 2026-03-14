// Remembrance Page Configuration
// All text, images, and content for the remembrance page

import { RemembrancePageConfig } from './remembrance.types';

export const remembranceConfig: RemembrancePageConfig = {
  // Page Metadata
  metadata: {
    title: "Remembrance"
  },

  // Hero Section
  hero: {
    badge: "DIGITAL MEMORIAL",
    title: "WALL OF",
    highlightText: "REMEMBRANCE",
    description: "We \"Name the Nameless.\" This is a sacred digital space for the souls we have served—because every single person deserves a legacy of dignity."
  },

  // Memorial Grid Section
  memorialGrid: {
    search: {
      placeholder: "SEARCH BY NAME, CASE ID, OR CITY...",
      buttonText: "FIND SOUL"
    },
    memorials: [
      {
        name: "John Doe (Case #MS-104)",
        date: "March 15, 2023",
        city: "Delhi",
        tribute: "A soul that lived behind the shadows of Connaught Place. Found peace at the banks of Yamuna."
      },
      {
        name: "Unknown Woman (#MS-105)",
        date: "March 16, 2023",
        city: "Lucknow",
        tribute: "Dignity was her name when we met her at Charbagh. Her last journey was a sacred one."
      },
      {
        name: "Baba Ji (#MS-106)",
        date: "March 18, 2023",
        city: "Varanasi",
        tribute: "A life of devotion, a departure of dignity. We were his family at the final hour."
      },
      {
        name: "Elder Man (#MS-107)",
        date: "March 20, 2023",
        city: "Mumbai",
        tribute: "The city of speed stopped for 5 minutes during his final farewell. He wasn't alone."
      },
      {
        name: "Case #MS-108",
        date: "March 22, 2023",
        city: "Pune",
        tribute: "A quiet soul found in the outskirts. His memory now lives in the hearts of his Saathi family."
      }
    ],
    actions: {
      offerFlower: "Offer a Flower",
      viewCase: "VIEW CASE"
    },
    stats: {
      number: "8,500+",
      description: "SOULS REMEMBERED ON THIS WALL",
      sponsorButton: "SPONSOR A TRIBUTE",
      sponsorLink: "/donate"
    }
  },

  // Memorial Message Section
  memorialMessage: {
    title: "\"NO SOUL SHOULD BE",
    highlightText: "FORGOTTEN\"",
    description: "The Wall of Remembrance is not just a database; it is our commitment to ensure that even those who left this world with nothing, leave it with a memory.",
    actions: {
      leaveTribute: {
        text: "LEAVE A TRIBUTE",
        href: "/donate"
      },
      missionStory: {
        text: "OUR MISSION STORY",
        href: "/how-it-works"
      }
    }
  }
};

export default remembranceConfig;