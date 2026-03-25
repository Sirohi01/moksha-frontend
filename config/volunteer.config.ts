// Volunteer Page Configuration
// All text, images, and content for the volunteer page

import { VolunteerPageConfig } from './volunteer.types';

export const volunteerConfig: VolunteerPageConfig = {
  // Page Metadata
  metadata: {
    title: "Volunteer"
  },

  // Hero Section
  hero: {
    badge: "✦ Join Us ✦",
    title: "Become a Volunteer",
    description: "Join 412 volunteers across 38 cities. No special qualifications needed — only compassion and a few hours a month."
  },

  // Success Page
  success: {
    title: "Welcome to the Moksha Sewa Family!",
    description: "Thank you for registering as a volunteer. Our coordination team will reach out to you within 2–3 business days.",
    registerAnotherText: "Register another volunteer"
  },

  // Why Volunteer Section
  whyVolunteer: [
    {
      icon: "Heart",
      title: "Make a Difference",
      desc: "Directly help ensure dignified last rites for those who have none."
    },
    {
      icon: "Users",
      title: "Join a Community",
      desc: "Be part of a compassionate, purpose-driven volunteer network."
    },
    {
      icon: "Clock",
      title: "Flexible Commitment",
      desc: "Even a few hours a month creates real impact."
    }
  ],

  // Volunteer Types
  volunteerTypes: [
    {
      value: "field_volunteer",
      label: "Field Volunteer",
      desc: "On-ground support for cremation services",
      icon: "Users",
      commitment: "10-15 hours/month"
    },
    {
      value: "transport_logistics",
      label: "Transportation & Logistics",
      desc: "Vehicle support and body transportation",
      icon: "MapPin",
      commitment: "Flexible, on-call"
    },
    {
      value: "documentation",
      label: "Documentation Support",
      desc: "Help with paperwork and legal formalities",
      icon: "FileText",
      commitment: "5-10 hours/month"
    },
    {
      value: "counseling",
      label: "Grief Counseling",
      desc: "Emotional support for families",
      icon: "Heart",
      commitment: "8-12 hours/month"
    },
    {
      value: "medical_support",
      label: "Medical Support",
      desc: "Healthcare professionals for medical assistance",
      icon: "Shield",
      commitment: "On-call basis"
    },
    {
      value: "fundraising",
      label: "Fundraising & Donor Relations",
      desc: "Help raise funds and manage donors",
      icon: "Briefcase",
      commitment: "Flexible"
    },
    {
      value: "awareness",
      label: "Social Media & Awareness",
      desc: "Content creation and online campaigns",
      icon: "Users",
      commitment: "5-8 hours/month"
    },
    {
      value: "tech_support",
      label: "Tech & IT Support",
      desc: "Website, app, and technical assistance",
      icon: "GraduationCap",
      commitment: "Flexible, remote"
    },
    {
      value: "event_coordinator",
      label: "Event Coordinator",
      desc: "Organize awareness events and campaigns",
      icon: "Calendar",
      commitment: "Project-based"
    },
    {
      value: "training",
      label: "Training & Mentorship",
      desc: "Train new volunteers and provide guidance",
      icon: "GraduationCap",
      commitment: "8-10 hours/month"
    }
  ],

  // Form Header
  formHeader: {
    title: "Volunteer Registration Form",
    subtitle: "Complete all sections • Fields marked with * are required"
  },

  // Form Sections
  sections: [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Address Details" },
    { number: 3, title: "Professional Background" },
    { number: 4, title: "Social Media Profiles (Optional)", subtitle: "Help us connect with you and share volunteer opportunities" },
    { number: 5, title: "Volunteer Preferences" },
    { number: 6, title: "Emergency Contact" },
    { number: 7, title: "Additional Information" }
  ],

  // Registration Types
  registrationTypes: {
    individual: {
      title: "Individual Volunteer",
      description: "Register as a single volunteer",
      icon: "User"
    },
    group: {
      title: "Group Volunteer",
      description: "Register as a group/organization",
      icon: "Users"
    }
  },

  // Form Labels
  labels: {
    // Volunteer Types
    selectVolunteerTypes: "Select Volunteer Type(s)",
    selectVolunteerTypesDesc: "Choose one or more areas where you'd like to contribute",

    // Registration Type
    registrationType: "Registration Type",
    asRepresentative: "(as representative)",

    // Group Details
    groupName: "Group/Organization Name",
    groupSize: "Number of Members",
    groupType: "Group Type",
    groupLeaderDetails: "Group Leader/Coordinator Details",
    groupLeaderName: "Leader Name",
    groupLeaderPhone: "Leader Phone",
    groupLeaderEmail: "Leader Email",

    // Personal Details
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    alternatePhone: "Alternate Phone",
    dateOfBirth: "Date of Birth",
    gender: "Gender",

    // Address
    completeAddress: "Complete Address",
    city: "City",
    state: "State",
    pinCode: "PIN Code",

    // Professional
    currentOccupation: "Current Occupation",
    organizationInstitution: "Organization/Institution",
    experienceLevel: "Experience Level",
    specialSkills: "Special Skills",

    // Social Media
    socialMediaNote: "Help us connect with you and share volunteer opportunities",
    facebookProfile: "Facebook Profile",
    instagramHandle: "Instagram Handle",
    twitterHandle: "Twitter/X Handle",
    linkedinProfile: "LinkedIn Profile",

    // Volunteer Preferences
    availability: "Availability",
    preferredLocation: "Preferred Location",
    languagesKnown: "Languages Known",
    hasVehicle: "I have my own vehicle",
    vehicleType: "Vehicle Type",

    // Emergency Contact
    emergencyContactName: "Contact Name",
    emergencyContactPhone: "Contact Phone",
    emergencyContactRelation: "Relationship",

    // Additional Information
    whyVolunteer: "Why do you want to volunteer with us?",
    previousVolunteerWork: "Previous Volunteer Experience (if any)",
    medicalConditions: "Any Medical Conditions we should know about?",

    // Terms & Agreements
    agreeToTerms: "I agree to the",
    termsAndConditions: "Terms & Conditions",
    termsLink: "/legal/terms",
    andText: "and",
    privacyPolicy: "Privacy Policy",
    privacyLink: "/privacy",
    agreeToBackgroundCheck: "I consent to a background verification check for volunteer safety",

    // Submit
    submitButton: "Register as Volunteer",
    reviewNote: "Our team will review your application and contact you within 3-5 business days"
  },

  // Form Placeholders
  placeholders: {
    // Group Details
    groupName: "e.g., ABC College, XYZ Company",
    groupSize: "e.g., 10",
    groupLeaderName: "Full name",
    groupLeaderPhone: "+91 98765 43210",
    groupLeaderEmail: "leader@email.com",

    // Personal Details
    fullName: "As per government ID",
    email: "your@email.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 98765 43210",

    // Address
    completeAddress: "House/Flat No., Building, Street, Locality",
    city: "Mumbai",
    pinCode: "400001",

    // Professional
    occupation: "e.g., Teacher, Engineer, Student",
    organization: "Company or school name",
    skills: "e.g., Communication, Leadership, Technical",

    // Social Media
    facebook: "https://facebook.com/yourprofile",
    instagram: "@yourusername",
    twitter: "@yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",

    // Volunteer Preferences
    preferredLocation: "Area or locality",
    languagesKnown: "e.g., Hindi, English, Marathi",
    vehicleType: "e.g., Car, Bike, Van",

    // Emergency Contact
    emergencyName: "Full name",
    emergencyPhone: "+91 98765 43210",
    emergencyRelation: "e.g., Father, Spouse",

    // Additional Information
    whyVolunteerPlaceholder: "Share your motivation...",
    previousWorkPlaceholder: "Describe your previous volunteer work...",
    medicalConditionsPlaceholder: "Optional - helps us ensure your safety"
  },

  // Select Options
  selectOptions: {
    groupTypes: [
      { value: "", label: "Select Group Type" },
      { value: "corporate", label: "Corporate/Company" },
      { value: "college", label: "College/University" },
      { value: "school", label: "School" },
      { value: "ngo", label: "NGO/Non-Profit" },
      { value: "community", label: "Community Group" },
      { value: "religious", label: "Religious Organization" },
      { value: "other", label: "Other" }
    ],
    genders: [
      { value: "", label: "Select Gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "prefer_not_to_say", label: "Prefer not to say" }
    ],
    experienceLevels: [
      { value: "", label: "Select Experience" },
      { value: "no_experience", label: "No Prior Experience" },
      { value: "some_experience", label: "Some Experience (1-2 years)" },
      { value: "experienced", label: "Experienced (3-5 years)" },
      { value: "expert", label: "Expert (5+ years)" }
    ],
    availabilityOptions: [
      { value: "", label: "Select Availability" },
      { value: "weekdays_morning", label: "Weekdays Morning (9 AM - 1 PM)" },
      { value: "weekdays_evening", label: "Weekdays Evening (5 PM - 9 PM)" },
      { value: "weekends", label: "Weekends (Sat-Sun)" },
      { value: "full_time", label: "Full Time (Mon-Fri)" },
      { value: "on_call", label: "On Call (Emergency basis)" },
      { value: "flexible", label: "Flexible (As per availability)" }
    ],
    stateSelectLabel: "Select State",
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
      "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
      "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
    ]
  },

  // Validation Messages
  validationMessages: {
    fillRequiredFields: "Please fill in all required fields and select at least one volunteer type",
    selectVolunteerType: "Please select at least one volunteer type",
    submitFailed: "Failed to submit volunteer application"
  }
};

export default volunteerConfig;