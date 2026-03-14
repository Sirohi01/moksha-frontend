// Gallery Page Configuration
// All text, images, and content for the gallery page

import { GalleryPageConfig } from './gallery.types';

export const galleryConfig: GalleryPageConfig = {
  // Page Metadata
  metadata: {
    title: "Gallery"
  },

  // Hero Section
  hero: {
    badge: "Visual Journey",
    title: {
      line1: "Moments",
      line2: "of",
      line3: "Grace"
    },
    description: "Every frame captures the essence of compassion, dignity, and the sacred bond between humanity and service",
    stats: {
      momentsCaptured: {
        number: "2,840+",
        label: "Moments Captured"
      },
      categories: {
        number: "16",
        label: "Photo Categories"
      },
      citiesDocumented: {
        number: "38+",
        label: "Cities Documented"
      },
      storiesTold: {
        number: "400+",
        label: "Stories Told"
      }
    },
    backgroundImages: [
      "/gallery/image1.png", "/gallery/image2.png", "/gallery/image3.png", 
      "/gallery/image4.png", "/gallery/image5.png", "/gallery/image6.png",
      "/gallery/gallery_cremation_ceremony_1772861295131.png",
      "/gallery/gallery_volunteer_service_1772861316550.png",
      "/gallery/gallery_peaceful_departure_1772861335733.png",
      "/gallery/gallery_ambulance_unit_1772862517482.png",
      "/gallery/gallery_community_support_1772861359875.png",
      "/gallery/gallery_volunteer_meeting_1772862633347.png",
      "/gallery/gallery_memorial_site_1772862535416.png",
      "/gallery/hero_ambulance.png", "/gallery/hero_mission_1.png",
      "/gallery/hero_moksha_1.png"
    ]
  },

  // Gallery Grid Section
  gallery: {
    categories: ["All", "Services", "Team", "Community", "Spirituality", "Infrastructure"],
    loadMoreText: "Load More Images",
    images: [
      {
        src: "/gallery/gallery_cremation_ceremony_1772861295131.png",
        title: "Dignified Farewell Ceremony",
        category: "Services",
        location: "Nigambodh Ghat, Delhi",
        date: "Jan 2024",
        height: 400
      },
      {
        src: "/gallery/gallery_volunteer_service_1772861316550.png",
        title: "Compassionate Volunteers",
        category: "Team",
        location: "Community Center, Delhi",
        date: "Feb 2024",
        height: 280
      },
      {
        src: "/gallery/gallery_peaceful_departure_1772861335733.png",
        title: "Serene Landscapes of Peace",
        category: "Spirituality",
        location: "Yamuna Bank",
        date: "Mar 2024",
        height: 350
      },
      {
        src: "/gallery/gallery_ambulance_unit_1772862517482.png",
        title: "Moksha Seva Mobile Unit",
        category: "Infrastructure",
        location: "Service Station",
        date: "Feb 2024",
        height: 320
      },
      {
        src: "/gallery/gallery_community_support_1772861359875.png",
        title: "Community of Support",
        category: "Community",
        location: "Ghaziabad Hub",
        date: "Mar 2024",
        height: 250
      },
      {
        src: "/gallery/gallery_volunteer_meeting_1772862633347.png",
        title: "The Heart of Service",
        category: "Team",
        location: "Ghaziabad Office",
        date: "Dec 2023",
        height: 380
      },
      {
        src: "/gallery/gallery_memorial_site_1772862535416.png",
        title: "Sacred Memorial Space",
        category: "Spirituality",
        location: "Memorial Park",
        date: "Jan 2024",
        height: 300
      },
      {
        src: "/gallery/hero_ambulance.png",
        title: "Emergency Response Vehicle",
        category: "Infrastructure",
        location: "Delhi NCR",
        date: "Nov 2023",
        height: 260
      },
      {
        src: "/gallery/hero_mission_1.png",
        title: "Our Mission in Action",
        category: "Services",
        location: "Multiple Cities",
        date: "2023",
        height: 420
      },
      {
        src: "/gallery/hero_moksha_1.png",
        title: "Moksha Seva Team",
        category: "Team",
        location: "Head Office",
        date: "Oct 2023",
        height: 290
      },
      {
        src: "/gallery/image1.png",
        title: "Serving with Dignity",
        category: "Services",
        location: "Varanasi",
        date: "Sep 2023",
        height: 340
      },
      {
        src: "/gallery/image2.png",
        title: "Community Outreach",
        category: "Community",
        location: "Mumbai",
        date: "Aug 2023",
        height: 310
      },
      {
        src: "/gallery/image3.png",
        title: "Volunteer Training",
        category: "Team",
        location: "Bangalore",
        date: "Jul 2023",
        height: 270
      },
      {
        src: "/gallery/image4.png",
        title: "Sacred Rituals",
        category: "Spirituality",
        location: "Haridwar",
        date: "Jun 2023",
        height: 390
      },
      {
        src: "/gallery/image5.png",
        title: "Support Network",
        category: "Community",
        location: "Pune",
        date: "May 2023",
        height: 330
      },
      {
        src: "/gallery/image6.png",
        title: "Compassionate Care",
        category: "Services",
        location: "Kolkata",
        date: "Apr 2023",
        height: 360
      }
    ]
  }
};

export default galleryConfig;