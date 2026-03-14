// Type definitions for Volunteer page configuration

export interface VolunteerTypeConfig {
  value: string;
  label: string;
  desc: string;
  icon: string;
  commitment: string;
}

export interface VolunteerSelectOptionConfig {
  value: string;
  label: string;
}

export interface VolunteerHeroConfig {
  badge: string;
  title: string;
  description: string;
}

export interface VolunteerSuccessConfig {
  title: string;
  description: string;
  registerAnotherText: string;
}

export interface VolunteerWhyVolunteerConfig {
  icon: string;
  title: string;
  desc: string;
}

export interface VolunteerFormHeaderConfig {
  title: string;
  subtitle: string;
}

export interface VolunteerSectionConfig {
  number: number;
  title: string;
  subtitle?: string;
}

export interface VolunteerRegistrationTypeConfig {
  individual: {
    title: string;
    description: string;
    icon: string;
  };
  group: {
    title: string;
    description: string;
    icon: string;
  };
}

export interface VolunteerFormLabelsConfig {
  // Volunteer Types
  selectVolunteerTypes: string;
  selectVolunteerTypesDesc: string;
  
  // Registration Type
  registrationType: string;
  asRepresentative: string;
  
  // Group Details
  groupName: string;
  groupSize: string;
  groupType: string;
  groupLeaderDetails: string;
  groupLeaderName: string;
  groupLeaderPhone: string;
  groupLeaderEmail: string;
  
  // Personal Details
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  alternatePhone: string;
  dateOfBirth: string;
  gender: string;
  
  // Address
  completeAddress: string;
  city: string;
  state: string;
  pinCode: string;
  
  // Professional
  currentOccupation: string;
  organizationInstitution: string;
  experienceLevel: string;
  specialSkills: string;
  
  // Social Media
  socialMediaNote: string;
  facebookProfile: string;
  instagramHandle: string;
  twitterHandle: string;
  linkedinProfile: string;
  
  // Volunteer Preferences
  availability: string;
  preferredLocation: string;
  languagesKnown: string;
  hasVehicle: string;
  vehicleType: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Additional Information
  whyVolunteer: string;
  previousVolunteerWork: string;
  medicalConditions: string;
  
  // Terms & Agreements
  agreeToTerms: string;
  termsAndConditions: string;
  termsLink: string;
  andText: string;
  privacyPolicy: string;
  privacyLink: string;
  agreeToBackgroundCheck: string;
  
  // Submit
  submitButton: string;
  reviewNote: string;
}

export interface VolunteerFormPlaceholdersConfig {
  // Group Details
  groupName: string;
  groupSize: string;
  groupLeaderName: string;
  groupLeaderPhone: string;
  groupLeaderEmail: string;
  
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Address
  completeAddress: string;
  city: string;
  pinCode: string;
  
  // Professional
  occupation: string;
  organization: string;
  skills: string;
  
  // Social Media
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  
  // Volunteer Preferences
  preferredLocation: string;
  languagesKnown: string;
  vehicleType: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  
  // Additional Information
  whyVolunteerPlaceholder: string;
  previousWorkPlaceholder: string;
  medicalConditionsPlaceholder: string;
}

export interface VolunteerSelectOptionsConfig {
  groupTypes: VolunteerSelectOptionConfig[];
  genders: VolunteerSelectOptionConfig[];
  experienceLevels: VolunteerSelectOptionConfig[];
  availabilityOptions: VolunteerSelectOptionConfig[];
  stateSelectLabel: string;
  states: string[];
}

export interface VolunteerValidationMessagesConfig {
  fillRequiredFields: string;
  selectVolunteerType: string;
  submitFailed: string;
}

export interface VolunteerPageConfig {
  metadata: {
    title: string;
  };
  hero: VolunteerHeroConfig;
  success: VolunteerSuccessConfig;
  whyVolunteer: VolunteerWhyVolunteerConfig[];
  volunteerTypes: VolunteerTypeConfig[];
  formHeader: VolunteerFormHeaderConfig;
  sections: VolunteerSectionConfig[];
  registrationTypes: VolunteerRegistrationTypeConfig;
  labels: VolunteerFormLabelsConfig;
  placeholders: VolunteerFormPlaceholdersConfig;
  selectOptions: VolunteerSelectOptionsConfig;
  validationMessages: VolunteerValidationMessagesConfig;
}