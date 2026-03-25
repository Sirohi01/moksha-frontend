// Legacy Giving Page Configuration
// All text, images, and content for the legacy giving page

import { LegacyGivingPageConfig } from './legacy-giving.types';

export const legacyGivingConfig: LegacyGivingPageConfig = {
  // Page Metadata
  metadata: {
    title: "Legacy Giving"
  },

  // Hero Section
  hero: {
    badge: "THE 100-YEAR MISSION",
    title: "LEGACY",
    subtitle: "GIVING",
    description: "Your kindness can be immortal. By including Moksha Sewa in your long-term planning, you ensure no individual dies alone or without dignity for the next century."
  },

  // Legacy Options
  options: [
    {
      title: "Legacy in Wills",
      desc: "A bequest in your will ensures that your kindness lives on even after you're gone. Help a soul depart with the same dignity you would want for yourself.",
      icon: "Scale"
    },
    {
      title: "Endowment Giving",
      desc: "A significant one-time contribution to our Permanent Fund that generates income for years to come, ensuring our 24/7 mission never stops.",
      icon: "Banknote"
    },
    {
      title: "The Family Legacy",
      desc: "Start a collective family fund where your children can honor their ancestors by serving the most forgotten people in our society.",
      icon: "ShieldCheck"
    },
    {
      title: "Property Bequest",
      desc: "Donate property to build response centers or volunteer housing in cities where help is needed most.",
      icon: "Flower"
    }
  ],

  // Personal Message Section
  message: {
    icon: "ShieldCheck",
    title: "LEAVE A LEGACY",
    subtitle: "OF",
    subtitleHighlight: "DIGNITY",
    description: "Every soul we honor in 2124 will be because of the visionaries of 2024. Be the light for the generations you will never see.",
    buttons: {
      talkToFounder: "TALK TO OUR FOUNDER",
      talkToFounderLink: "/contact",
      downloadPDF: "DAWN OF THE SECOND CENTURY PDF",
      downloadPDFLink: "/legacy-giving/request-info"
    }
  },

  // Common Buttons
  buttons: {
    requestInfoPack: "REQUEST INFO PACK",
    requestInfoLink: "/legacy-giving/request-info"
  }
};

export default legacyGivingConfig;