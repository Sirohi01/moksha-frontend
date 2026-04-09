import { HomepageConfig } from './types';

export const homepageConfig: HomepageConfig = {
  hero: {
    slides: [
      "/gallery/image1.png",
      "/gallery/image02.png",
      "/gallery/image03.png",
      "/gallery/image2.png",
      "/gallery/image3.png",
      "/gallery/image6.png",
    ],
    autoSlideInterval: 5000,
    mobileAspectRatio: "square",
    aspectRatio: "hero"
  },

  // Action Banner
  actionBanner: {
    title: "Free Sacred Rites for Unclaimed Souls • Dignity for the Forgotten",
    buttons: [
      {
        text: "Report a Case",
        href: "/report",
        variant: "primary"
      },
      {
        text: "Donate Now",
        href: "/donate",
        variant: "secondary"
      }
    ]
  },

  // About Section
  about: {
    badge: "About Moksha Sewa",
    title: "Restoring Dignity to the",
    titleHighlight: "Final Journey",
    description: "Moksha Sewa is dedicated to ensuring that no soul departs this world without the sacred rites and dignity they deserve. We serve as guardians of humanity's final chapter, providing compassionate care when families cannot.",
    secondaryDescription: "Founded on the principle that every life has value, we have transformed the way unclaimed souls are honored across India. Through traditional Hindu rites, modern logistics, and unwavering compassion, we bridge the gap between abandonment and sacred departure.",
    stats: [
      { number: "5000+", label: "Souls Served" },
      { number: "38+", label: "Cities" },
      { number: "24/7", label: "Service" }
    ],
    buttons: [
      {
        text: "Explore Our Legacy",
        href: "/about",
        variant: "primary"
      },
      {
        text: "Join Our Mission",
        href: "/volunteer",
        variant: "ghost"
      }
    ],
    image: "/gallery/image001.png",
    alt: "Moksha Sewa About Image",
    mobileAspectRatio: "aspect-[4/3]",
    aspectRatio: "lg:aspect-square",
    floatingBadge: {
      text: "Serving with Dignity",
      subtext: "Since 2026"
    }
  },

  // Our Seva Section
  ourSeva: {
    badge: "Our Sacred Services",
    title: "Our Seva",
    description: "We provide comprehensive support with compassion and dignity, ensuring every soul receives the respect they deserve in their final journey.",
    programmes: [
      {
        title: "Final Journey",
        icon: "Heart",
        description: "Providing dignified transportation and sacred final rites for unclaimed souls with complete respect and traditional ceremonies.",
        image: "/gallery/image001.png",
        alt: "Final Journey Service Image",
        href: "/services",
        linkText: "Explore Final Journey Services"
      },
      {
        title: "Compassionate Care",
        icon: "Heart",
        description: "Supporting families in need with emotional, logistical and financial assistance during their most difficult times.",
        image: "/gallery/image002.png",
        alt: "Compassionate Care Service Image",
        href: "/services",
        linkText: "Discover Compassionate Care"
      },
      {
        title: "Community Outreach",
        icon: "Users",
        description: "Educating communities about dignity in death and building awareness for those who have no one to care.",
        image: "/gallery/image003.png",
        alt: "Community Outreach - Building Awareness",
        href: "/services",
        linkText: "View Community Initiatives"
      },
      {
        title: "Sacred Documentation",
        icon: "FileText",
        description: "Maintaining proper records and ensuring legal compliance while honoring the memory of every soul we serve.",
        image: "/gallery/image004.png",
        alt: "Sacred Documentation - Record Keeping",
        href: "/services",
        linkText: "Read About Documentation"
      }
    ]
  },

  // Where We Serve Section
  whereWeServe: {
    badge: "Our Presence",
    title: "Where We Serve",
    description: "From the sacred ghats of Kashi to the holy waters of Haridwar, we bring dignity and compassion to every corner where souls seek their final peace.",
    carousel: {
      slides: [
        {
          src: "/gallery/image001.png",
          alt: "Sacred Kashi Ghats",
          title: "Sacred Kashi",
          description: "Where eternal souls find liberation",
          location: "Primary Hub"
        },
        {
          src: "/gallery/image002.png",
          alt: "Holy Haridwar River",
          title: "Holy Haridwar",
          description: "Gateway to divine blessings",
          location: "Regional Center"
        },
        {
          src: "/gallery/image003.png",
          title: "Sacred Prayagraj",
          description: "Confluence of holy rivers",
          location: "Active Hub"
        },
        {
          src: "/gallery/image004.png",
          title: "Peaceful Service",
          description: "Compassionate care for all souls",
          location: "Service Network"
        }
      ],
      autoSlideInterval: 4000
    },
    activeNetwork: {
      title: "Active Network",
      locations: [
        { city: "Haridwar", status: "24/7 Active" },
        { city: "Prayagraj", status: "Full Service" },
        { city: "Rishikesh", status: "Active Hub" }
      ],
      stats: [
        { number: "38+", label: "Sacred Cities" },
        { number: "24/7", label: "Service" }
      ]
    },
    extendedNetwork: {
      title: "Complete Network Coverage",
      cities: ["Lucknow", "Patna", "Ujjain", "Gaya", "Agra", "Kanpur", "Allahabad", "Varanasi"]
    }
  },

  // Mission Pillars Section
  missionPillars: {
    badge: "Core Values",
    title: "Mission Pillars",
    description: "Five sacred principles guiding our mission",
    pillars: [
      { title: "Final Dignity", icon: "Heart", number: "01" },
      { title: "Sacred Rites", icon: "Flame", number: "02" },
      { title: "Restoring Humanity", icon: "Users", number: "03" },
      { title: "Legal Sanctity", icon: "ShieldCheck", number: "04" },
      { title: "Mission Unity", icon: "Handshake", number: "05" }
    ],
    bottomStatement: "United in Service, Guided by Compassion"
  },

  // Stories in Motion Section
  storiesInMotion: {
    title: "STORIES IN MOTION",
    stories: [
      { image: "/gallery/image005.png", title: "SACRED KASHI RITES" },
      { image: "/gallery/image006.png", title: "MISSION PRAYAGRAJ" },
      { image: "/gallery/image007.png", title: "FINAL JOURNEY" },
      { image: "/gallery/image008.png", title: "AMBULANCE SERVICE" },
      { image: "/gallery/image009.png", title: "DIGNIFIED FAREWELL" }
    ]
  },

  // Join The Mission Section
  joinMission: {
    badge: "MISSION SAATHI PORTAL",
    title: "STAND WITH US",
    titleHighlight: "IN THE FINAL JOURNEY",
    description: "Whether you have an hour a week or a lifetime to give, your presence can bring dignity to a soul forgotten by the world. Join our specialized hubs in 38+ cities.",
    backgroundImage: "/gallery/image4.png",
    alt: "Stand with Us - Background Image",
    buttons: [
      {
        text: "JOIN OUR FORCE",
        href: "/volunteer",
        variant: "primary"
      },
      {
        text: "VIEW OPPORTUNITIES",
        href: "/contact",
        variant: "secondary"
      }
    ],
    stats: [
      { number: "400+", label: "ON-GROUND SATHIS" },
      { number: "24/7", label: "MISSION SUPPORT" }
    ]
  },

  // Urgent Campaigns Section
  urgentCampaigns: {
    badge: "Active Missions",
    title: "Urgent Campaigns",
    description: "Support our sacred missions across India",
    campaigns: [
      {
        title: "KASHI GHAT MISSION",
        description: "Revitalizing the final rites facilities at the sacred Manikarnika Ghat.",
        targeted: "₹5,00,000",
        raised: "₹3,20,000",
        percentage: "64%",
        image: "/gallery/image1.png",
        alt: "Kashi Ghat Mission Campaign"
      },
      {
        title: "NEW ANTIM YATRA VAN",
        description: "Aiding the purchase of a specialized mobile unit for the Delhi-NCR hub.",
        targeted: "₹12,00,000",
        raised: "₹7,80,000",
        percentage: "65%",
        image: "/gallery/hero_moksha_1.png",
        alt: "Antim Yatra Van Project"
      },
      {
        title: "SACRED OIL FUND",
        description: "Ensuring a steady supply of traditional oils and materials for unclaimed rites.",
        targeted: "₹1,00,000",
        raised: "₹85,000",
        percentage: "85%",
        image: "/gallery/gallery_peaceful_departure_1772861335733.png",
        alt: "Sacred Oil Fund Materials"
      }
    ],
    autoSlideInterval: 6000,
    labels: {
      activeCampaign: "Active Campaign",
      raised: "Raised: ",
      donateNow: "Donate Now",
      viewCampaign: "View Campaign"
    }
  },

  // Sacred Journey Timeline Section
  sacredJourney: {
    badge: "THE CHRONICLE",
    title: "OUR SACRED JOURNEY",
    timeline: [
      {
        year: "2018",
        event: "Mission started in a single city with 1 volunteer.",
        icon: "Star",
        description: "A humble beginning focused on the unclaimed souls of a single city hub."
      },
      {
        year: "2020",
        event: "Reached the milestone of 500+ dignified cremations.",
        icon: "Heart",
        description: "Establishing ourselves as a beacon of hope for the destitute during times of loss."
      },
      {
        year: "2023",
        event: "Expanded to 30+ cities across Northern India.",
        icon: "Globe",
        description: "Scaling our specialized mobile units to serve a wider humanitarian landscape."
      },
      {
        year: "2026",
        event: "Operating in 38 cities with 400+ active volunteers.",
        icon: "Users",
        description: "A national force for terminal dignity, powered by thousands of supporters."
      }
    ]
  },

  // Transparency Section
  transparency: {
    title: "TRANSPARENCY",
    titleHighlight: "IS OUR SANCTITY",
    description: "Every rupee donated to Moksha Sewa is a sacred trust. We maintain 100% visibility on all our mission operational costs and final rites expenditures.",
    stats: [
      { label: "Direct Mission Costs", percentage: "82%" },
      { label: "Service Maintenance", percentage: "12%" },
      { label: "Administrative Support", percentage: "6%" }
    ],
    trustSection: {
      title: "YOUR TRUST MATTERS",
      description: "We are committed to the values of absolute accountability as established by our founding charter.",
      badges: [
        { text: "80G", subtext: "TAX EXEMPT READY", color: "text-[#f4c430]" },
        { text: "100%", subtext: "MISSION FOCUSED", color: "text-orange-600" }
      ]
    }
  },

  // Media Recognition Section
  mediaRecognition: {
    badge: "IN NATIONAL MEDIA",
    logos: ["TIMES OF INDIA", "DAINIK BHASKAR", "AAJ TAK", "NDTV", "HINDUSTAN TIMES"]
  },

  // Testimonials Section
  testimonials: {
    badge: "WHISPERED VOICES",
    slides: [
      {
        quote: "Moksha Sewa provided a dignified farewell when we had no one else to turn to.",
        author: "Rajesh K., Beneficiary"
      },
      {
        quote: "Their dedication to the sacred rites of unclaimed souls is truly divine work.",
        author: "Pritam S., Local Partner"
      },
      {
        quote: "A world-class organization that treats every human being with ultimate respect.",
        author: "Anita D., Volunteer"
      }
    ],
    autoSlideInterval: 6000
  },

  // Government Partners Section
  governmentPartners: {
    title: "GOVERNMENT & INSTITUTIONAL PARTNERS",
    partners: [
      { name: "MCG", label: "MUNICIPAL CORPORATION" },
      { name: "UP GOVT", label: "DEPARTMENT OF HEALTH" },
      { name: "DELHI POLICE", label: "INSTITUTIONAL PARTNER" },
      { name: "NRHM", label: "NATIONAL HEALTH MISSION" }
    ]
  },

  // FAQ Section
  faq: {
    title: "FREQUENT QUESTIONS",
    questions: [
      {
        question: "HOW ARE CASES REPORTED?",
        answer: "Our 24/7 mission helpline receives calls from police departments, hospitals, and kind-hearted citizens."
      },
      {
        question: "ARE TRADITIONAL RITES FOLLOWED?",
        answer: "Yes. Every 'Antyesti' is performed strictly according to sacred Hindu traditions by our staff priests."
      },
      {
        question: "IS THE DONATION TAX-EXEMPT?",
        answer: "Yes, Moksha Sewa is a registered entity and all donations are 80G tax-exempted according to regulations."
      }
    ]
  },

  // Global Labels and Alt Texts
  labels: {
    heroAltText: "Moksha Sewa Sacred Mission",
    joinMissionAltText: "Join the Mission",
    learnMore: "Learn More"
  }
};

export default homepageConfig;