// Press Page Configuration
// All text, images, and content for the press page

import { PressPageConfig } from './press.types';

export const pressConfig: PressPageConfig = {
  // Page Metadata
  metadata: {
    title: "Press"
  },

  // Hero Section
  hero: {
    badge: "Official Media Syndicate . Prime",
    title: "GLOBAL",
    subtitle: "PRESS ROOM",
    description: "The centralized depository for authorized statements, media protocols, and official institutional announcements."
  },

  // Press Coverage
  pressCoverage: {
    items: [
      {
        source: "The Atlantic",
        date: "April 2024",
        title: "The Indian NGO giving a name to the nameless",
        type: "Feature Story"
      },
      {
        source: "BBC World",
        date: "March 2024",
        title: "Dignity in Departure: A 24/7 mission for the forgotten",
        type: "Video Interview"
      },
      {
        source: "Times of India",
        date: "February 2024",
        title: "Moksha Sewa's Saathi Force expands to 38 cities",
        type: "News Report"
      },
      {
        source: "Forbes India",
        date: "January 2024",
        title: "Innovation in Humanitarian Response: Social Impact models",
        type: "Article"
      }
    ],
    readButton: "Read Publication"
  },

  // Asset Library
  assetLibrary: {
    title: "ASSET LIBRARY",
    assets: [
      {
        name: "Brand & Logo Pack",
        format: "PNG / SVG / PDF",
        size: "12.4 MB"
      },
      {
        name: "High-Res Photo Gallery",
        format: "JPEG (4K Quality)",
        size: "450 MB"
      },
      {
        name: "Press Release Template",
        format: "DOCX / PDF",
        size: "1.2 MB"
      },
      {
        name: "Annual Performance Audit",
        format: "PDF",
        size: "4.5 MB"
      }
    ]
  },

  // Media Contact
  mediaContact: {
    title: "FOR",
    subtitle: "PRESS",
    description: "Are you a journalist or storyteller? Our communications team provides exclusive access to field operations and founder interviews.",
    contacts: [
      {
        icon: "Mail",
        label: "EMAIL US",
        value: "media@MokshaSewa.org",
        href: "mailto:media@MokshaSewa.org"
      },
      {
        icon: "Phone",
        label: "CALL PRESS OFFICE",
        value: "+91 98765 43210",
        href: "tel:+919876543210"
      }
    ]
  },

  // Footer Section
  footer: {
    title: "REPOSITORY_ALPHA",
    protocolLabel: "PROTOCOL",
    categories: ['INTEGRITY', 'JURISDICTION', 'SYSTEM', 'ACCESS']
  }
};

export default pressConfig;