// Contact Page Configuration
// All text, images, and content for the contact page

import { ContactPageConfig } from './contact.types';

export const contactConfig: ContactPageConfig = {
  // Page Metadata
  metadata: {
    title: "Contact"
  },

  // Hero Section
  hero: {
    badge: "✦ Get in Touch ✦",
    title: "Contact Us",
    description: "We are here to help — for emergencies, partnerships, media queries, or any other matter."
  },

  // Contact Information
  contactInfo: [
    {
      icon: "Phone",
      title: "Helpline (24/7)",
      info: "9220147229",
      sub: "Toll Free · All India",
      href: "tel:+919220147229"
    },
    {
      icon: "Mail",
      title: "Email",
      info: "help@MokshaSewa.org",
      sub: "Response within 24 hours",
      href: "mailto:help@MokshaSewa.org"
    },
    {
      icon: "MapPin",
      title: "Head Office",
      info: "12, Seva Marg, New Delhi",
      sub: "Delhi 110001",
      href: "#"
    },
    {
      icon: "Clock",
      title: "Office Hours",
      info: "Mon–Sat: 9am–6pm",
      sub: "Emergency line: 24/7",
      href: "#"
    }
  ],

  // Regional Coordinators
  regionalCoordinators: {
    title: "Regional Coordinators",
    coordinators: [
      {
        city: "Mumbai",
        name: "Priya Iyer",
        phone: "+91 98765 00001"
      },
      {
        city: "Chennai",
        name: "Kavitha Rajan",
        phone: "+91 98765 00002"
      }
    ]
  },

  // Contact Form
  form: {
    title: "Send a Message",
    labels: {
      yourName: "Your Name",
      email: "Email",
      phone: "Phone",
      subject: "Subject",
      message: "Message"
    },
    placeholders: {
      fullName: "Full name",
      email: "you@email.com",
      phone: "+91 ...",
      selectSubject: "Select subject...",
      message: "How can we help you?"
    },
    subjectOptions: [
      { value: "general", label: "General Inquiry" },
      { value: "partnership", label: "NGO / Government Partnership" },
      { value: "media", label: "Media & Press" },
      { value: "volunteer", label: "Volunteering" },
      { value: "donation", label: "Donation Query" },
      { value: "other", label: "Other" }
    ],
    submitButton: "Send Message",
    validation: {
      fillRequiredFields: "Please fill in all required fields",
      networkError: "Network error. Please check your connection and try again.",
      submitError: "Failed to send message. Please try again."
    },
    success: {
      title: "Message Sent!",
      description: "We will respond within 24 hours.",
      sendAnotherButton: "Send another message"
    }
  },

  // Section Titles
  sections: {
    reachUsDirectly: "Reach Us Directly"
  }
};

export default contactConfig;