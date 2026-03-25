// Why Moksha Sewa Page Configuration
// All text, images, and content for the why Moksha Sewa page

import { WhyMokshaSewaPageConfig } from './why-moksha-seva.types';

export const whyMokshaSewaConfig: WhyMokshaSewaPageConfig = {
  // Page Metadata
  metadata: {
    title: "Why Moksha Sewa"
  },

  // Hero Section
  hero: {
    title: "Why Choose",
    titleHighlight: "Moksha Sewa",
    description: "When dignity matters most, trust the organization that has served with compassion for over 8 years",
    stats: [
      { number: "2,840+", label: "Lives Honored" },
      { number: "38+", label: "Cities" },
      { number: "8+", label: "Years" }
    ],
    image: "/gallery/image0010.png",
    imageAlt: "Moksha Sewa service"
  },

  // Main Reasons Section
  reasons: [
    {
      icon: "Heart",
      title: "COMPASSIONATE CARE",
      description: "Every soul deserves dignity in their final journey. We treat each case with utmost respect and traditional Hindu rites.",
      color: "text-red-500"
    },
    {
      icon: "Shield",
      title: "TRUSTED LEGACY",
      description: "8+ years of dedicated service with 100% transparency and government partnerships across 38+ cities.",
      color: "text-blue-500"
    },
    {
      icon: "Users",
      title: "COMMUNITY DRIVEN",
      description: "400+ trained volunteers and local partnerships ensure we're always ready to serve when needed most.",
      color: "text-[#20b2aa]"
    },
    {
      icon: "Clock",
      title: "24/7 AVAILABILITY",
      description: "Our helpline and emergency response team operates round the clock, ensuring no soul is left unclaimed.",
      color: "text-orange-500"
    },
    {
      icon: "Award",
      title: "RECOGNIZED EXCELLENCE",
      description: "Featured in national media and recognized by government bodies for our humanitarian service.",
      color: "text-purple-500"
    },
    {
      icon: "CheckCircle",
      title: "COMPLETE COMPLIANCE",
      description: "All services follow legal protocols with proper documentation and 80G tax-exempt donations.",
      color: "text-green-500"
    }
  ],

  // Impact Statistics Section
  impact: {
    title: "Our Impact Speaks",
    stats: [
      { number: "2,840+", label: "Sacred Rites Completed" },
      { number: "38+", label: "Cities Served" },
      { number: "400+", label: "Active Volunteers" },
      { number: "100%", label: "Legal Compliance" }
    ]
  },

  // Call to Action Section
  callToAction: {
    title: "Join Our Sacred Mission",
    description: "Be part of a movement that ensures every soul receives the dignity they deserve in their final journey.",
    buttons: {
      volunteer: {
        text: "Become a Volunteer",
        href: "/volunteer"
      },
      donate: {
        text: "Support Our Cause",
        href: "/donate"
      }
    }
  }
};

export default whyMokshaSewaConfig;