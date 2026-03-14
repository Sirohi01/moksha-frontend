// Layout Components Configuration
// All text, links, and content for navbar, footer, and social floating components

import { LayoutConfig } from './layout.types';

export const layoutConfig: LayoutConfig = {
  // Navbar Configuration
  navbar: {
    logo: {
      src: "/logo.png",
      alt: "Moksha Seva Logo",
      title: "Moksha Seva",
      subtitle: "Liberation Through Service"
    },
    navigation: [
      { href: "/", label: "Home", icon: "Home" },
      {
        label: "About",
        icon: "Info",
        subLinks: [
          { href: "/about", label: "About Us", icon: "Info" },
          { href: "/how-it-works", label: "How It Works", icon: "FileText" },
          { href: "/why-moksha-seva", label: "Why Choose Us", icon: "Target" },
          { href: "/our-reach", label: "Our Reach", icon: "Map" },
          { href: "/board", label: "Leadership", icon: "Users" },
        ]
      },
      {
        label: "Services",
        icon: "Flame",
        subLinks: [
          { href: "/services", label: "Cremation Services", icon: "Flame" },
          { href: "/report", label: "Report Unclaimed Body", icon: "Megaphone" },
        ]
      },
      {
        label: "Campaigns",
        icon: "Target",
        subLinks: [
          { href: "/campaigns", label: "All Campaigns", icon: "Target" },
          { href: "/campaigns/dignity-for-all", label: "Dignity For All", icon: "Heart" },
          { href: "/campaigns/adopt-a-city", label: "Adopt a City", icon: "Globe" },
          { href: "/campaigns/sacred-river", label: "Sacred River Initiative", icon: "Anchor" },
          { href: "/campaigns/home-for-saathis", label: "Saathi Shelter", icon: "Tent" },
        ]
      },
      {
        label: "Impact",
        icon: "TrendingUp",
        subLinks: [
          { href: "/impact", label: "Our Impact", icon: "TrendingUp" },
          { href: "/stories", label: "Stories of Change", icon: "Video" },
          { href: "/remembrance", label: "Wall of Remembrance", icon: "Bookmark" },
          { href: "/testimonials", label: "Testimonials", icon: "Heart" },
          { href: "/gallery", label: "Gallery", icon: "Video" },
          { href: "/feedback", label: "Share Feedback", icon: "MessageSquare" },
        ]
      },
      {
        label: "Get Involved",
        icon: "Users",
        subLinks: [
          { href: "/volunteer", label: "Volunteer", icon: "Users" },
          { href: "/corporate", label: "Corporate Partnerships", icon: "Globe" },
          { href: "/legacy-giving", label: "Legacy Giving", icon: "Heart" },
          { href: "/tribute", label: "In Memory Of", icon: "Heart" },
        ]
      },
      {
        label: "Trust",
        icon: "ShieldCheck",
        subLinks: [
          { href: "/transparency", label: "Transparency Dashboard", icon: "BarChart3" },
          { href: "/schemes", label: "Government Schemes", icon: "BookOpen" },
        ]
      },
      {
        label: "Contact",
        icon: "Mail",
        subLinks: [
          { href: "/contact", label: "Contact Us", icon: "Mail" },
          { href: "/press", label: "Press Room", icon: "Megaphone" },
          { href: "/documentaries", label: "Documentaries", icon: "Video" },
        ]
      },
    ],
    actions: {
      search: {
        label: "Search",
        shortcut: "Ctrl+K"
      },
      donate: {
        label: "Donate",
        mobileLabel: "Donate Now"
      }
    },
    mobile: {
      openLabel: "Open menu",
      closeLabel: "Close menu",
      moreLabel: "More"
    }
  },

  // Footer Configuration
  footer: {
    brand: {
      logo: {
        src: "/logo.png",
        alt: "Moksha Seva Logo"
      },
      title: "Moksha Seva",
      subtitle: "THE FINAL DIGNITY",
      description: "A world-class humanitarian force dedicated to the restoration of dignity for the forgotten dead. Powered by devotion and the vision of a society where no one departs alone."
    },
    emergency: {
      status: "EMERGENCY STATUS: 24/7 ACTIVE RESPONSE",
      reportLink: {
        text: "REPORT UNCLAIMED BODY",
        href: "/report"
      }
    },
    contact: {
      phone: {
        number: "tel:1800123456",
        display: "1800-123-456"
      },
      email: {
        address: "mailto:info@mokshaseva.org",
        display: "info@mokshaseva.org"
      }
    },
    links: {
      Mission: [
        { label: "Our Story", href: "/about" },
        { label: "Cremation Services", href: "/services" },
        { label: "The Reach", href: "/our-reach" },
        { label: "Transparency", href: "/transparency" },
      ],
      Engagement: [
        { label: "Report a Body", href: "/report" },
        { label: "Volunteer Portal", href: "/volunteer" },
        { label: "Stories of Change", href: "/stories" },
        { label: "Remembrance Wall", href: "/remembrance" },
      ],
      Legacy: [
        { label: "Donate Now", href: "/donate" },
        { label: "Legacy Giving", href: "/legacy-giving" },
        { label: "Sponsor a Tribute", href: "/tribute" },
        { label: "Documentaries", href: "/documentaries" },
      ],
      Trust: [
        { label: "Audit & Compliance", href: "/compliance" },
        { label: "Govt. Schemes", href: "/schemes" },
        { label: "Press Room", href: "/press" },
        { label: "FAQ & Support", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    bottom: {
      missionStatus: "MISSION SCALE: 12+ CITIES ACTIVE",
      copyright: "MOKSHA SEVA",
      legalLinks: [
        { label: "TAX EXEMPT (80G)", href: "/compliance" },
        { label: "Privacy Policy", href: "/privacy" }
      ],
      socialPlatforms: ["Facebook", "Twitter", "Instagram", "Youtube"]
    }
  },

  // Social Floating Configuration
  socialFloating: {
    gallery: {
      label: "View Image Gallery",
      href: "/gallery",
      tooltip: "GALLERY"
    },
    socialLinks: [
      {
        name: "Facebook",
        icon: "Facebook",
        url: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://facebook.com/mokshaseva",
        color: "hover:bg-blue-600",
      },
      {
        name: "X (Twitter)",
        icon: "Twitter",
        url: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "https://x.com/mokshaseva",
        color: "hover:bg-black",
      },
      {
        name: "Instagram",
        icon: "Instagram",
        url: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://instagram.com/mokshaseva",
        color: "hover:bg-pink-600",
      },
      {
        name: "YouTube",
        icon: "Youtube",
        url: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "https://youtube.com/@mokshaseva",
        color: "hover:bg-red-600",
      },
      {
        name: "LinkedIn",
        icon: "Linkedin",
        url: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/company/mokshaseva",
        color: "hover:bg-blue-700",
      },
    ]
  }
};

export default layoutConfig;