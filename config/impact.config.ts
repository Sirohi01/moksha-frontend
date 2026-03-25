import { ImpactPageConfig } from './impact.types';

export const impactConfig: ImpactPageConfig = {
  // Page Metadata
  metadata: {
    title: "Impact"
  },

  // Hero Section
  hero: {
    title: "Our",
    highlightText: "Impact",
    description: "Measuring the difference we make in ensuring dignity for every soul's final journey across India",
    image: "/gallery/image2.png",
    imageAlt: "Our impact in serving communities",
    keyStats: {
      livesHonored: {
        number: "2,840+",
        label: "Lives Honored"
      },
      cities: {
        number: "38+",
        label: "Cities"
      },
      years: {
        number: "8+",
        label: "Years"
      }
    },
    missionImpact: {
      title: "Our Mission Impact",
      description: "Every number represents a family we've supported, a community we've served, and a life we've honored with dignity and respect.",
      features: {
        freeService: "100% Free Service",
        available247: "24/7 Available"
      }
    },
    actions: {
      joinMission: {
        text: "Join Our Mission",
        href: "/volunteer"
      },
      supportWork: {
        text: "Support Our Work",
        href: "/donate"
      }
    },
    floatingStats: {
      volunteers: {
        number: "400+",
        label: "Volunteers"
      },
      compliance: {
        number: "100%",
        label: "Compliance"
      }
    }
  },

  // Impact Statistics Section
  impactStats: {
    title: "Our Impact in Numbers",
    description: "Every number represents a life touched, a family supported, and dignity restored in the most sacred moments.",
    stats: [
      {
        icon: "Heart",
        number: "2,840+",
        label: "Sacred Rites Completed",
        description: "Sacred rites performed with dignity and respect",
        color: "text-red-500"
      },
      {
        icon: "MapPin",
        number: "38+",
        label: "Cities Actively Served",
        description: "Cities where we actively serve communities",
        color: "text-blue-500"
      },
      {
        icon: "Users",
        number: "400+",
        label: "Trained Volunteers",
        description: "Dedicated volunteers across India",
        color: "text-[#20b2aa]"
      },
      {
        icon: "Calendar",
        number: "8+",
        label: "Years of Service",
        description: "Years of compassionate service",
        color: "text-orange-500"
      },
      {
        icon: "Award",
        number: "100%",
        label: "Legal Compliance",
        description: "Adherence to legal and ethical standards",
        color: "text-green-500"
      },
      {
        icon: "TrendingUp",
        number: "24/7",
        label: "Emergency Response",
        description: "Round-the-clock emergency response",
        color: "text-purple-500"
      }
    ],
    additionalMetrics: {
      freeService: {
        symbol: "₹0",
        title: "Free Service",
        description: "No cost to families in need"
      },
      certified: {
        symbol: "✓",
        title: "80G Certified",
        description: "Tax exemption for donors"
      },
      available247: {
        symbol: "∞",
        title: "24/7 Available",
        description: "Always ready to serve"
      },
      withDignity: {
        symbol: "♥",
        title: "With Dignity",
        description: "Every soul honored equally"
      }
    }
  },

  // Growth Timeline Section
  growthTimeline: {
    title: "Our Growth Journey",
    description: "From humble beginnings in 2018 to serving 38+ cities today, our journey reflects the growing trust communities place in our mission of dignity and compassion.",
    image: "/gallery/image3.png",
    imageAlt: "Our growth across cities",
    yearlyData: [
      { year: "2018", rites: 45, cities: 1, volunteers: 5 },
      { year: "2019", rites: 180, cities: 3, volunteers: 25 },
      { year: "2020", rites: 520, cities: 8, volunteers: 60 },
      { year: "2021", rites: 890, cities: 15, volunteers: 120 },
      { year: "2022", rites: 1240, cities: 22, volunteers: 200 },
      { year: "2023", rites: 1680, cities: 30, volunteers: 300 },
      { year: "2024", rites: 2150, cities: 35, volunteers: 380 },
      { year: "2025", rites: 2840, cities: 38, volunteers: 400 }
    ],
    highlightedYears: [
      { year: "2018", rites: 45, cities: 1 },
      { year: "2021", rites: 890, cities: 15 },
      { year: "2024", rites: 2150, cities: 35 },
      { year: "2025", rites: 2840, cities: 38 }
    ]
  },

  // Testimonials Section
  testimonials: {
    title: "Voices of Impact",
    testimonials: [
      {
        quote: "Moksha Sewa gave my father the dignified farewell he deserved when we had nowhere else to turn.",
        author: "Priya Sharma, Delhi",
        role: "Beneficiary Family",
        image: "/gallery/image4.png"
      },
      {
        quote: "Working with Moksha Sewa has been the most fulfilling experience of my life. Every soul matters.",
        author: "Rajesh Kumar, Volunteer",
        role: "5 Years of Service",
        image: "/gallery/image5.png"
      },
      {
        quote: "Their transparency and dedication to traditional rites is unmatched in humanitarian work.",
        author: "Dr. Anita Verma",
        role: "Social Worker",
        image: "/gallery/image6.png"
      }
    ]
  },

  // Call to Action Section
  callToAction: {
    title: "Be Part of Our Impact",
    description: "Every contribution, every volunteer hour, every shared story amplifies our impact in serving humanity.",
    image: "/gallery/image1.png",
    imageAlt: "Join our mission",
    actions: {
      joinMission: {
        text: "Join Our Mission",
        href: "/volunteer"
      },
      supportWork: {
        text: "Support Our Work",
        href: "/donate"
      }
    }
  }
};

export default impactConfig;