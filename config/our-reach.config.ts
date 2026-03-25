// Our Reach Page Configuration
// All text, images, and content for the our reach page

import { OurReachPageConfig } from './our-reach.types';

export const ourReachConfig: OurReachPageConfig = {
  // Page Metadata
  metadata: {
    title: "Our Reach"
  },

  // Hero Section
  hero: {
    badge: "OUR SERVICE NETWORK",
    title: "OUR GLOBAL",
    titleHighlight: "REACH",
    description: "Moksha Sewa operates across 38+ major cities in India, with a dedicated Force of 400+ Saathis ready to respond to any call for dignity."
  },

  // Regional Coverage
  regions: [
    {
      name: "North India",
      cities: ["Delhi", "Lucknow", "Ghaziabad", "Kanpur", "Varanasi"],
      density: "High Response Hub",
      stats: "1,200+ Served"
    },
    {
      name: "South India",
      cities: ["Bangalore", "Chennai", "Hyderabad", "Kochi", "Mysore"],
      density: "Tier 1 Center",
      stats: "800+ Served"
    },
    {
      name: "West India",
      cities: ["Mumbai", "Pune", "Ahmedabad", "Nashik", "Surat"],
      density: "State Command Center",
      stats: "1,500+ Served"
    },
    {
      name: "East India",
      cities: ["Kolkata", "Patna", "Ranchi", "Bhubaneswar", "Guwahati"],
      density: "Growing Hub",
      stats: "400+ Served"
    },
    {
      name: "Central India",
      cities: ["Bhopal", "Indore", "Nagpur", "Jabalpur", "Raipur"],
      density: "Response Center",
      stats: "600+ Served"
    }
  ],

  // Expansion Request Card
  expansionCard: {
    title: "WANT US IN YOUR CITY?",
    description: "Help us expand the 'Force of Dignity' to your city. We provide infrastructure, training, and legal support.",
    buttonText: "REQUEST EXPANSION"
  },

  // Network Statistics Section
  networkStats: {
    badge: "TOTAL SERVICE REACH",
    title: "THE LARGEST RESPONSE",
    titleHighlight: "FORGOTTEN",
    stats: [
      { number: "38+", label: "Active Cities" },
      { number: "400+", label: "Saathi Force" },
      { number: "8,500+", label: "Total Services" },
      { number: "24/7", label: "Response Units" }
    ]
  },

  // Form Configuration
  form: {
    title: "BRING Moksha Sewa",
    titleHighlight: "TO YOUR CITY",
    description: "Help us expand our mission of dignity. We'll work with local partners, volunteers, and authorities to establish operations in your city.",
    successTitle: "REQUEST RECEIVED!",
    successDescription: "Thank you for your interest in bringing Moksha Sewa to your city. Our expansion team will review your request and contact you within 5-7 business days.",
    successRequestId: "Request ID:",
    whatWeProvideText: "What we provide: Training for volunteers, ambulance coordination, legal support, and ongoing operational guidance. All services remain 100% free for beneficiaries.",
    submitButtonText: "SUBMIT EXPANSION REQUEST",
    loadingText: "SUBMITTING...",
    footerText: "Our expansion team will review your request and contact you within 5-7 business days.",
    closeButtonText: "CLOSE",
    labels: {
      fullName: "FULL NAME *",
      email: "EMAIL ADDRESS *",
      phone: "PHONE NUMBER *",
      city: "CITY NAME *",
      state: "STATE *",
      population: "POPULATION (OPTIONAL)",
      organization: "ORGANIZATION (OPTIONAL)",
      localSupport: "LOCAL SUPPORT TYPE",
      whyNeeded: "WHY YOUR CITY NEEDS US? *"
    },
    placeholders: {
      fullName: "Enter your full name",
      email: "your.email@example.com",
      phone: "+91 98765 43210",
      city: "Enter city name",
      selectState: "Select state",
      population: "e.g., 5 lakhs, 2 million (minimum 1000)",
      organization: "NGO, Trust, or Community Group",
      whyNeeded: "Tell us about the need for dignified cremation services in your city... (minimum 50 characters)"
    },
    supportTypes: [
      { value: "individual", label: "Individual" },
      { value: "organization", label: "Organization" },
      { value: "government", label: "Government" },
      { value: "community", label: "Community" },
      { value: "multiple", label: "Multiple" }
    ],
    validationMessages: {
      populationMinimum: "Minimum population: 1,000 people",
      populationTooSmall: "Too small: {population} (need 1000+)",
      whyNeededMinimum: "Minimum 50 characters required",
      whyNeededCounter: "{current}/2000 {remaining}"
    },
    states: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Delhi",
      "Jammu and Kashmir",
      "Ladakh",
      "Puducherry",
      "Chandigarh"
    ]
  },

  // Modal Configuration
  modal: {
    regionModalDescription: "Our {regionName} operations serve as a critical hub in our national network, providing 24/7 dignified cremation services across multiple cities. Each region is supported by dedicated volunteers, ambulance units, and partnerships with local authorities.",
    expansionButtonText: "REQUEST EXPANSION IN THIS REGION",
    badge: "REGIONAL HUB"
  },

  // Labels and Static Text
  labels: {
    activeCities: "ACTIVE SERVICE CITIES:",
    permanentImpact: "Permanent Impact",
    activeCitiesCount: "Active Cities",
    totalServices: "Total Services",
    expansionRequestBadge: "EXPANSION REQUEST"
  }
};

export default ourReachConfig;