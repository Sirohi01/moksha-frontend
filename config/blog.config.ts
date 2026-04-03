import { BlogConfig } from "./blog.types";

export const blogConfig: BlogConfig = {
  hero: {
    badge: "MOKSHA INSIGHTS",
    title: "SACRED",
    highlightText: "REVELATIONS",
    description: "A curated documentation of our humanitarian impact, legislative progress, and the philosophy of dignity."
  },
  featuredBlog: {
    title: "FEATURED INSIGHT",
    badge: "EDITOR'S PICK"
  },
  blogGrid: {
    title: "MORE FROM OUR MISSION",
    description: "Read updates, success stories, and thought-provoking pieces on humanitarian service.",
    categories: ["All", "Impact", "Stories", "Updates", "Reflections"],
    blogs: [
      {
        id: "1",
        title: "The Silent Service: Providing Dignity for the Forgotten",
        slug: "the-silent-service",
        excerpt: "Inside the daily mission of Moksha Sewa, where we ensure no one departs this world alone or without honor.",
        image: "/gallery/gallery_peaceful_departure_1772861335733.png",
        imageAlt: "Peaceful departure service",
        author: "Dr. Aryan Sharma",
        authorRole: "Founder, Moksha Sewa",
        date: "March 15, 2026",
        readingTime: "5 min read",
        category: "Reflections",
        featured: true
      },
      {
        id: "2",
        title: "A City Transformed: How Varanasi Embraces Change",
        slug: "varanasi-transformation",
        excerpt: "Exploring our sacred river initiative and how community awareness is bringing a new level of dignity to funeral rites.",
        image: "/gallery/gallery_cremation_ceremony_1772861295131.png",
        imageAlt: "Varanasi sacred rites",
        author: "Priya Varma",
        authorRole: "Field Coordinator",
        date: "March 10, 2026",
        readingTime: "8 min read",
        category: "Impact"
      },
      {
        id: "3",
        title: "The Technology of Transparency: Monitoring 500+ Missions",
        slug: "transparency-tech",
        excerpt: "A look into how our dashboard uses real-time updates to maintain the highest levels of trust with our donors.",
        image: "/gallery/gallery_memorial_site_1772862535416.png",
        imageAlt: "Transparency in action",
        author: "Vikram Das",
        authorRole: "CTO",
        date: "March 5, 2026",
        readingTime: "6 min read",
        category: "Updates"
      },
      {
        id: "4",
        title: "Dignity Beyond Borders: Our Vision for 2027",
        slug: "vision-2027",
        excerpt: "How we plan to scale the 'Force of Dignity' to over 100 cities across India, leveraging local communities.",
        image: "/gallery/gallery_community_support_1772861359875.png",
        imageAlt: "Community outreach mission",
        author: "Dr. Aryan Sharma",
        authorRole: "Founder, Moksha Sewa",
        date: "Feb 28, 2026",
        readingTime: "10 min read",
        category: "Reflections"
      },
      {
        id: "5",
        title: "The Psychology of Grief: Supporting Destitute Families",
        slug: "psychology-of-grief",
        excerpt: "Understanding the unique challenges faced by families who cannot afford the final rites of their loved ones.",
        image: "/gallery/gallery_volunteer_service_1772861316550.png",
        imageAlt: "Volunteer providing support",
        author: "Sneha Gupta",
        authorRole: "Lead Counselor",
        date: "Feb 20, 2026",
        readingTime: "7 min read",
        category: "Stories"
      },
      {
        id: "6",
        title: "Sustainable Rites: Eco-friendly Cremation Practices",
        slug: "sustainable-rites",
        excerpt: "Reducing the environmental footprint of traditional funeral ceremonies without compromising on sanctity.",
        image: "/gallery/gallery_ambulance_unit_1772862517482.png",
        imageAlt: "Eco-friendly specialized unit",
        author: "Rajesh Mehra",
        authorRole: "Sustainability Consultant",
        date: "Feb 15, 2026",
        readingTime: "6 min read",
        category: "Updates"
      }
    ]
  },
  cta: {
    title: "BRING DIGNITY TO SOMEONE TODAY",
    description: "Your small contribution can provide a peaceful and dignified departure for those who have no one else.",
    buttonText: "DONATE NOW",
    buttonHref: "/donate"
  },
  subscriptionCTA: {
    badge: "The Sacred Digest",
    title: "STAY IN THE",
    highlightText: "SACRED LOOP",
    description: "Join a community of souls dedicated to dignity. Get monthly mission updates delivered to your sanctum.",
    inputPlaceholder: "ENTER EMAIL ADDRESS",
    buttonText: "SUBSCRIBE"
  }
};

export default blogConfig;
