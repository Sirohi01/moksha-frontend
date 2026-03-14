import { AboutPageConfig } from './about.types';

export const aboutConfig: AboutPageConfig = {
  // Page Metadata
  metadata: {
    title: "About Moksha Seva"
  },

  // Hero Section
  hero: {
    badge: "✦ Our Story ✦",
    title: "About Moksha Seva",
    description: "Founded in 2018, Moksha Seva began with a simple conviction: that every human being — regardless of identity, wealth, or social status — deserves a respectful and dignified farewell.",
    stats: [
      { number: "2,847", label: "Lives Honored" },
      { number: "38+", label: "Cities Served" },
      { number: "6", label: "Years of Service" }
    ],
    image: "/gallery/image007.png",
    cardTitle: "Serving with Dignity",
    cardDescription: "Every soul deserves respect in their final journey"
  },

  // Mission & Vision Section
  missionVision: {
    mission: {
      title: "Our Mission",
      description: "To ensure every unclaimed body and destitute individual receives a dignified cremation with proper rites, complete documentation, and public accountability — in partnership with police departments, hospitals, and municipal authorities.",
      icon: "Target"
    },
    vision: {
      title: "Our Vision", 
      description: "A society where no person is left without dignified last rites — where technology, compassion, and civic duty unite to ensure that death does not discriminate, and neither does our response to it.",
      icon: "Eye"
    }
  },

  // Our Story Section
  story: {
    tag: "Journey",
    title: "How Moksha Seva Began",
    paragraphs: [
      "In 2017, our founder Suresh Narayan witnessed an unclaimed body lying uncremated near a Delhi railway station for three days due to bureaucratic delays and lack of resources. That experience became the seed of Moksha Seva.",
      "Starting with just 5 volunteers and a small fund, the organization began documenting and coordinating cremations in partnership with Delhi Police. Within a year, we had performed 200 cremations and helped 50 families navigate government processes.",
      "Today, Moksha Seva operates in 38 cities with 412 active volunteers, and has performed 2,847 cremations — each one documented and publicly accessible. We work in formal partnership with 12 police districts, 8 hospitals, and 25 NGOs."
    ],
    stats: [
      { number: "2,847", label: "Cremations Performed" },
      { number: "38", label: "Cities Served" },
      { number: "412", label: "Active Volunteers" },
      { number: "8+", label: "Years of Service" }
    ],
    image: "/gallery/image009.png",
    imageAlt: "Our Journey"
  },

  // Values Section
  values: {
    tag: "Values",
    title: "What We Stand For",
    values: [
      {
        icon: "Heart",
        title: "Compassion First",
        description: "Every individual, regardless of identity or status, deserves care and dignity in their final moments."
      },
      {
        icon: "Eye",
        title: "Radical Transparency",
        description: "All cases, finances, and operations are publicly documented. No hidden practices."
      },
      {
        icon: "Users",
        title: "Community Powered",
        description: "Our strength lies in our volunteer network, partner NGOs, and generous donors."
      },
      {
        icon: "Award",
        title: "Accountability",
        description: "We are accountable to every family, donor, and the public through open data."
      }
    ]
  },

  // Team Section
  team: {
    tag: "Team",
    title: "The People Behind Moksha Seva",
    members: [
      {
        name: "Suresh Narayan",
        role: "Founder & Director",
        city: "Delhi",
        years: "6 years"
      },
      {
        name: "Priya Iyer",
        role: "Operations Head",
        city: "Mumbai",
        years: "4 years"
      },
      {
        name: "Mohammed Rafiq",
        role: "Legal & Compliance",
        city: "Delhi",
        years: "5 years"
      },
      {
        name: "Kavitha Rajan",
        role: "Volunteer Coordinator",
        city: "Chennai",
        years: "3 years"
      },
      {
        name: "Arjun Bhatia",
        role: "Technology Lead",
        city: "Bangalore",
        years: "2 years"
      },
      {
        name: "Sunita Devi",
        role: "Community Outreach",
        city: "Lucknow",
        years: "4 years"
      }
    ]
  },

  // Certifications Section
  certifications: {
    title: "Official Registrations & Certifications",
    certifications: [
      { text: "Registered NGO under Societies Act" },
      { text: "12A Income Tax Exemption" },
      { text: "80G Donation Tax Benefit" },
      { text: "FCRA Registered" }
    ]
  }
};

export default aboutConfig;