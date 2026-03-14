// Corporate Page Configuration
// All text, images, and content for the corporate page

import { CorporatePageConfig } from './corporate.types';

export const corporateConfig: CorporatePageConfig = {
  // Page Metadata
  metadata: {
    title: "Corporate"
  },

  // Hero Section
  hero: {
    badge: "STRATEGIC PARTNERSHIPS",
    title: "CORPORATE",
    subtitle: "IMPACT",
    partnersText: "PARTNERS",
    description: "Scale your CSR impact by supporting the most fundamental human right: the right to a dignified departure. Partner with India's largest response network."
  },

  // Partnership Models
  models: [
    {
      title: "City Sponsorship",
      desc: "Adopt an entire city's operations for a year. Cover fuel, rituals, and logistics for every case in that region.",
      icon: "Globe"
    },
    {
      title: "Employee Giving",
      desc: "Enable payroll giving where your employees can contribute a small amount monthly to the 'Dignity Fund'.",
      icon: "Heart"
    },
    {
      title: "Infrastructure Grant",
      desc: "Help us build 'Moksha Kendras'—dignified storage and response centers in cities with high needs.",
      icon: "Briefcase"
    },
    {
      title: "CSR Reporting",
      desc: "We provide comprehensive Impact Reports, Audit Certificates, and 80G documentation for your board.",
      icon: "BarChart3"
    }
  ],

  // Trust Section
  trust: {
    icon: "ShieldCheck",
    title: "ABSOLUTE",
    subtitle: "TRANS- PARENCY",
    forCSRText: "FOR CSR",
    description: "We provide real-time dashboards for our corporate partners. Track every rupee and every case sponsored by your organization.",
    certifications: {
      taxExemption: {
        value: "80G",
        label: "Tax Exemption"
      },
      permanentReg: {
        value: "12A",
        label: "Permanent Reg."
      }
    },
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop",
    imageAlt: "Corporate Partnership",
    videoButtonLink: "/documentaries"
  },

  // Buttons
  buttons: {
    getPartnershipDeck: "Get Partnership Deck",
    contactLink: "/contact"
  }
};

export default corporateConfig;