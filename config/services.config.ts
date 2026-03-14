// Services Page Configuration
// All text, images, and content for the services page

import { ServicesPageConfig } from './services.types';

export const servicesConfig: ServicesPageConfig = {
  // Page Metadata
  metadata: {
    title: "Services"
  },

  // Hero Section
  hero: {
    badge: "✦ Our Services ✦",
    title: "Our",
    titleHighlight: "Services",
    description: "End-to-end humanitarian services — from cremation to documentation to family support — all at no cost to destitute individuals and families."
  },

  // Main Services
  mainServices: [
    {
      icon: "Flame",
      title: "Dignified Cremation Services",
      badge: "Core Service",
      badgeVariant: "primary",
      desc: "We perform complete cremation rituals for unclaimed bodies, homeless individuals, and destitute families. Services include transportation, preparation, religious rites (per deceased's religion), and disposal of ashes in a sacred water body.",
      includes: [
        "Body transportation to cremation ground",
        "Ritual preparation and last rites",
        "Religious rites as per tradition",
        "Ash immersion ceremony"
      ]
    },
    {
      icon: "FileText",
      title: "Documentation & Legal Support",
      badge: "Admin",
      badgeVariant: "secondary",
      desc: "Full legal documentation including official death certificates, police NOC, case registration, and post-cremation certificates — all handled by our trained documentation team.",
      includes: [
        "Death certificate (official)",
        "Police NOC coordination",
        "Case registration & body ID",
        "Post-cremation certificate"
      ]
    },
    {
      icon: "Users",
      title: "Family Support & Counseling",
      badge: "Support",
      badgeVariant: "primary",
      desc: "For poor families who cannot afford funeral costs, we provide full support at no charge. We also assist in identifying government schemes and financial aid available.",
      includes: [
        "Free service for destitute families",
        "Grief counseling sessions",
        "Government scheme guidance",
        "Legal heir certificate help"
      ]
    },
    {
      icon: "Camera",
      title: "Body Identification Services",
      badge: "Investigation",
      badgeVariant: "secondary",
      desc: "We maintain a photographic and descriptive database to assist in identifying unclaimed bodies. We coordinate with hospitals, police, and social media to reunite families.",
      includes: [
        "Photographic documentation",
        "Database listing for 90 days",
        "Social media outreach",
        "DNA coordination (partner labs)"
      ]
    },
    {
      icon: "BookOpen",
      title: "Awareness & Training Programs",
      badge: "Education",
      badgeVariant: "secondary",
      desc: "We train police officers, hospital staff, and municipal workers on protocols for handling unclaimed bodies with dignity, proper documentation, and legal compliance.",
      includes: [
        "Police department training",
        "Hospital staff workshops",
        "Municipal worker orientation",
        "NGO capacity building"
      ]
    },
    {
      icon: "Shield",
      title: "Government Liaison Services",
      badge: "Compliance",
      badgeVariant: "primary",
      desc: "We act as a bridge between families and government authorities — helping navigate bureaucracy, apply for aid, and ensure legal rights are protected.",
      includes: [
        "Government scheme applications",
        "Compensation claim support",
        "Legal heir documentation",
        "Pension and welfare follow-up"
      ]
    }
  ],

  // Eligibility Section
  eligibility: {
    badge: "✦ Eligibility ✦",
    title: "Who Can Access Our Services?",
    description: "Our services are completely free and available to anyone in need. We believe dignity in death is a fundamental right, not a privilege.",
    mainImage: "/gallery/image6.png",
    mainImageAlt: "Moksha Seva services",
    items: [
      {
        icon: "UserCheck",
        title: "Unclaimed Bodies",
        desc: "Bodies reported by police, hospitals, or public with no family to claim them",
        image: "/gallery/image1.png"
      },
      {
        icon: "Heart",
        title: "Homeless Individuals",
        desc: "People without family or support system who need dignified final rites",
        image: "/gallery/image2.png"
      },
      {
        icon: "Users",
        title: "Destitute Families",
        desc: "Families who cannot afford cremation costs - we provide complete support",
        image: "/gallery/image3.png"
      },
      {
        icon: "Shield",
        title: "Hospital Referrals",
        desc: "Bodies referred by government and private hospitals across our service areas",
        image: "/gallery/image4.png"
      },
      {
        icon: "MapPin",
        title: "Municipal Cases",
        desc: "Cases reported by municipal authorities and local government bodies",
        image: "/gallery/image5.png"
      }
    ]
  }
};

export default servicesConfig;