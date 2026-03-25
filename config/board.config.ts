// Board Page Configuration
// All text, images, and content for the board page

import { BoardPageConfig } from './board.types';

export const boardConfig: BoardPageConfig = {
  // Page Metadata
  metadata: {
    title: "Board & Advisors"
  },

  // Hero Section
  hero: {
    badge: "OUR LEADERSHIP",
    title: "OUR BOARD &",
    titleHighlight: "ADVISORS",
    description: "Moksha Sewa is guided by a collective of experts in legal, medical, and spiritual domains. Together, we ensure the mission remains pure and powerful."
  },

  // Leadership Team
  leadership: [
    {
      name: "Saurabh Dev",
      role: "Managing Trustee",
      desc: "Founder and Lead for all field operations in 38+ cities.",
      icon: "Users",
      id: "saurabh-dev"
    },
    {
      name: "Dr. Ananya Sharma",
      role: "Medical Compliance Officer",
      desc: "Expert in legal post-mortem and forensic clearance processes.",
      icon: "ShieldCheck",
      id: "dr-ananya-sharma"
    },
    {
      name: "Pandit Ravi Shastri",
      role: "Sacred Rites Advisor",
      desc: "Ensures every ritual is conducted as per Vedic traditions with absolute dignity.",
      icon: "Users",
      id: "pandit-ravi-shastri"
    },
    {
      name: "Rajesh Khanna",
      role: "Operational Logistics",
      desc: "Coordinates the 400+ Saathi force and volunteer response units.",
      icon: "BarChart3",
      id: "rajesh-khanna"
    },
    {
      name: "Sunita Reddy",
      role: "Legal & Transparency lead",
      desc: "Oversees 80G filings, government relations, and audit reports.",
      icon: "ShieldCheck",
      id: "sunita-reddy"
    }
  ],

  // Join Advisory Council Card
  joinCard: {
    title: "JOIN THE ADVISORY COUNCIL",
    description: "We are looking for experts in law, spirituality, and medicine to help us scale the mission across 100+ cities.",
    buttonText: "APPLY TO BOARD",
    buttonHref: "/board/apply"
  },

  // Advisory Statistics
  stats: [
    { number: "12", label: "Active Advisors" },
    { number: "38", label: "City Heads" },
    { number: "100%", label: "Transparency" },
    { number: "24/7", label: "Field Support" }
  ],

  // Labels and Static Text
  labels: {
    viewProfile: "VIEW PROFILE"
  }
};

export default boardConfig;