// Feedback Page Configuration
// All text, images, and content for the feedback page

import { FeedbackPageConfig } from './feedback.types';

export const feedbackConfig: FeedbackPageConfig = {
  // Page Metadata
  metadata: {
    title: "Feedback"
  },

  // Hero Section
  hero: {
    badge: "Your Voice Matters",
    title: "Share Your Feedback",
    description: "Help us improve our services and serve you better. Your feedback is invaluable to us.",
    icon: "MessageSquare"
  },

  // Success Page
  success: {
    title: "Thank You!",
    description: "Your feedback has been received and is valuable to us.",
    referencePrefix: "FB-2024-",
    submitAnotherText: "Submit another feedback"
  },

  // Alert Section
  alert: {
    title: "We Value Your Opinion",
    message: "Your feedback helps us improve our services and better serve those in need. All responses are confidential."
  },

  // Form Header
  formHeader: {
    title: "Feedback Form",
    subtitle: "Please share your experience and suggestions with us"
  },

  // Form Sections
  sections: [
    { number: 1, title: "Your Details", icon: "User" },
    { number: 2, title: "Feedback Type", icon: "MessageSquare" },
    { number: 3, title: "Rate Your Experience", icon: "Star" },
    { number: 4, title: "Your Feedback", icon: "MessageSquare" },
    { number: 5, title: "Suggestions & Recommendations", icon: "Star" },
    { number: 6, title: "Privacy & Consent", icon: "Shield" }
  ],

  // Form Labels
  labels: {
    // Personal Details
    yourName: "Your Name *",
    emailAddress: "Email Address *",
    phoneNumber: "Phone Number",

    // Feedback Type
    typeOfFeedback: "Type of Feedback *",
    serviceUsed: "Service Used",

    // Experience Rating
    overallExperienceRating: "Overall Experience Rating *",

    // Detailed Feedback
    subject: "Subject *",
    detailedMessage: "Detailed Message *",

    // Suggestions
    suggestionsForImprovement: "Suggestions for Improvement",
    wouldRecommend: "Would you recommend Moksha Sewa to others? *",

    // Consent
    consentToPublish: "I consent to Moksha Sewa using my feedback (anonymously) for testimonials and service improvement purposes",

    // Submit
    submitButton: "Submit Feedback",
    confidentialityText: "Your feedback is confidential and helps us serve better."
  },

  // Form Placeholders
  placeholders: {
    fullName: "Full name",
    email: "your@email.com",
    phone: "+91 98765 43210",
    subject: "Brief subject of your feedback",
    detailedMessage: "Please share your detailed feedback, experience, or suggestions...",
    suggestions: "How can we improve our services?"
  },

  // Select Options
  selectOptions: {
    feedbackType: [
      { value: "", label: "Select type" },
      { value: "service_experience", label: "Service Experience" },
      { value: "website", label: "Website Feedback" },
      { value: "volunteer", label: "Volunteer Experience" },
      { value: "donation", label: "Donation Process" },
      { value: "complaint", label: "Complaint" },
      { value: "suggestion", label: "Suggestion" },
      { value: "appreciation", label: "Appreciation" },
      { value: "other", label: "Other" }
    ],
    serviceUsed: [
      { value: "", label: "Select service" },
      { value: "cremation", label: "Cremation Services" },
      { value: "report", label: "Report Unclaimed Body" },
      { value: "volunteer", label: "Volunteer Program" },
      { value: "donation", label: "Donation" },
      { value: "helpline", label: "24/7 Helpline" },
      { value: "website", label: "Website" },
      { value: "other", label: "Other" }
    ],
    recommendation: [
      { value: "yes", label: "Yes, definitely" },
      { value: "maybe", label: "Maybe" },
      { value: "no", label: "No" }
    ]
  },

  // Rating Labels
  ratingLabels: {
    excellent: "Excellent",
    veryGood: "Very Good",
    good: "Good",
    fair: "Fair",
    poor: "Poor"
  },

  // Validation Messages
  validationMessages: {
    fillRequiredFields: "Please fill in all required fields",
    selectRating: "Please select a rating between 1 and 5 stars",
    submitFailed: "Failed to submit feedback"
  },

  // Contact Information
  contact: {
    title: "Have questions? Contact us:",
    phone: {
      number: "+919220147229",
      display: "📞 9220147229"
    },
    email: {
      address: "feedback@MokshaSewa.org",
      display: "✉️ feedback@MokshaSewa.org"
    }
  }
};

export default feedbackConfig;