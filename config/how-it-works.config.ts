// How It Works Page Configuration
// All text, images, and content for the how it works page

import { HowItWorksPageConfig } from './how-it-works.types';

export const howItWorksConfig: HowItWorksPageConfig = {
  // Page Metadata
  metadata: {
    title: "How It Works"
  },

  // Hero Section
  hero: {
    badge: "✦ Our Sacred Process ✦",
    title: "How",
    titleHighlight: "Moksha Sewa",
    description: "A transparent, humane, and legally compliant 6-step process — from the first report to a permanent public record."
  },

  // Process Steps
  steps: [
    {
      icon: "Phone",
      step: "Step 1",
      title: "Report an Unclaimed Body",
      description: "A body is reported through our 24/7 helpline, online form, by police, hospital staff, or a member of the public. Every report is logged with a unique Case ID.",
      timeline: "0 - 2 hours",
      actions: [
        "Report received via helpline/form/police",
        "Case ID generated instantly",
        "Notification sent to nearest volunteer team"
      ]
    },
    {
      icon: "Shield",
      step: "Step 2",
      title: "Police Coordination & Verification",
      description: "Our team coordinates with the nearest police station within 2 hours of the report. Police file an FIR, and we register the case in our system.",
      timeline: "2 - 6 hours",
      actions: [
        "FIR filed with police",
        "Body transported to safe location",
        "Documentation begins"
      ]
    },
    {
      icon: "Search",
      step: "Step 3",
      title: "Identification Attempt",
      description: "We make every effort to identify the deceased — using our database, social media outreach, Missing Persons helplines, and hospital records. Family is notified if found.",
      timeline: "24 - 72 hours",
      actions: [
        "Photo added to public database",
        "Social media outreach",
        "Hospital & missing persons cross-check",
        "DNA sample preserved"
      ]
    },
    {
      icon: "FileText",
      step: "Step 4",
      title: "Documentation & Legal Process",
      description: "All necessary legal documentation is completed — death certificate application, NOC from police, case records, and next-of-kin search documentation.",
      timeline: "During 72-hour window",
      actions: [
        "Death certificate filed",
        "Police NOC obtained",
        "All documentation digitized",
        "Legal compliance verified"
      ]
    },
    {
      icon: "Flame",
      step: "Step 5",
      title: "Dignified Cremation",
      description: "If the person remains unidentified after 72 hours (or if family requests), we conduct a full cremation with proper religious rites at an approved cremation ground.",
      timeline: "Within 72 96 hours",
      actions: [
        "Cremation with religious rites",
        "Ash immersion in sacred water body",
        "Volunteer team in attendance",
        "Video documentation for records"
      ]
    },
    {
      icon: "Award",
      step: "Step 6",
      title: "Certificate & Public Record",
      description: "An official cremation certificate is issued. The case is published on our public Transparency Dashboard with all details — permanently accessible.",
      timeline: "Within 48 hours post-cremation",
      actions: [
        "Official certificate issued",
        "Record published on dashboard",
        "Case archived for 25 years",
        "Family can access records anytime"
      ]
    }
  ],

  // Call to Action Section
  callToAction: {
    title: "Have a Case to Report?",
    description: "Our team is available 24/7. Every report is taken seriously and acted upon immediately.",
    buttons: {
      reportOnline: {
        text: "Report Online",
        href: "/report"
      },
      callButton: {
        text: "Call 9220147229",
        phoneNumber: "+919220147229"
      }
    }
  }
};

export default howItWorksConfig;