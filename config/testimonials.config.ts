// Testimonials Page Configuration
// All text, images, and content for the testimonials page

import { TestimonialsPageConfig } from './testimonials.types';

export const testimonialsConfig: TestimonialsPageConfig = {
  // Page Metadata
  metadata: {
    title: "Testimonials"
  },

  // Hero Section
  hero: {
    title: "",
    highlightText: "Testimonials",
    description: "Hear from the families, volunteers, and partners who have experienced our compassionate service"
  },

  // Statistics Section
  stats: [
    { number: "2,840+", label: "Families Served" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "400+", label: "Volunteer Testimonials" },
    { number: "38+", label: "Cities Covered" }
  ],

  // Testimonials Grid Section
  testimonialsGrid: {
    title: "Stories of Gratitude",
    testimonials: [
      {
        name: "Rajesh Kumar",
        role: "Beneficiary Family",
        location: "Delhi",
        rating: 5,
        quote: "When my father passed away and we had no resources for proper rites, Moksha Seva stepped in like angels. They performed every ritual with such care and respect, following all Hindu traditions perfectly. I will be forever grateful.",
        image: "/gallery/image1.png"
      },
      {
        name: "Dr. Priya Sharma",
        role: "Hospital Administrator",
        location: "Mumbai",
        rating: 5,
        quote: "We work closely with Moksha Seva for unclaimed bodies at our hospital. Their professionalism, speed of response, and adherence to legal protocols is exemplary. They treat every case with dignity.",
        image: "/gallery/image2.png"
      },
      {
        name: "Anita Verma",
        role: "Volunteer",
        location: "Varanasi",
        rating: 5,
        quote: "Being a volunteer with Moksha Seva for 3 years has been the most fulfilling experience of my life. Every soul we serve reminds me why this work is so sacred and important.",
        image: "/gallery/image3.png"
      },
      {
        name: "Suresh Patel",
        role: "Corporate Partner",
        location: "Ahmedabad",
        rating: 5,
        quote: "Our company has been supporting Moksha Seva for 2 years. Their transparency in fund utilization and regular impact reports give us complete confidence in their mission.",
        image: "/gallery/image4.png"
      },
      {
        name: "Maya Singh",
        role: "Social Worker",
        location: "Lucknow",
        rating: 5,
        quote: "I've referred many families to Moksha Seva during their most difficult times. The compassion and support they provide goes beyond just the final rites - they truly care for the families.",
        image: "/gallery/image5.png"
      },
      {
        name: "Ramesh Gupta",
        role: "Government Official",
        location: "Patna",
        rating: 5,
        quote: "Moksha Seva has been an invaluable partner in our efforts to ensure dignified treatment of unclaimed bodies. Their systematic approach and documentation is commendable.",
        image: "/gallery/image6.png"
      }
    ]
  },

  // Video Testimonials Section
  videoTestimonials: {
    title: "Video Stories",
    description: "Watch heartfelt stories from families and volunteers who have experienced our compassionate service firsthand.",
    videos: [
      {
        title: "Family Testimonial 1",
        duration: "2 minutes",
        thumbnail: "/gallery/image1.png",
        alt: "Video testimonial 1",
        youtubeId: "vB3P0p_Y0ks"
      },
      {
        title: "Family Testimonial 2",
        duration: "2 minutes",
        thumbnail: "/gallery/image2.png",
        alt: "Video testimonial 2",
        youtubeId: "Jm_X9J-J9yY"
      },
      {
        title: "Family Testimonial 3",
        duration: "2 minutes",
        thumbnail: "/gallery/image3.png",
        alt: "Video testimonial 3",
        youtubeId: "4RzH8l3gE14"
      }
    ]
  },

  // Call to Action Section
  callToAction: {
    title: "Share Your Story",
    description: "Have you been touched by our service? We'd love to hear your story and share it with others who might need hope.",
    actions: {
      shareStory: {
        text: "Share Your Story",
        href: "/contact"
      },
      joinMission: {
        text: "Join Our Mission",
        href: "/volunteer"
      }
    }
  }
};

export default testimonialsConfig;