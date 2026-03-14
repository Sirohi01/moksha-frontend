// Type definitions for Feedback page configuration

export interface FeedbackHeroConfig {
  badge: string;
  title: string;
  description: string;
  icon: string;
}

export interface FeedbackSuccessConfig {
  title: string;
  description: string;
  referencePrefix: string;
  submitAnotherText: string;
}

export interface FeedbackAlertConfig {
  title: string;
  message: string;
}

export interface FeedbackSectionConfig {
  number: number;
  title: string;
  icon: string;
}

export interface FeedbackFormLabelsConfig {
  // Personal Details
  yourName: string;
  emailAddress: string;
  phoneNumber: string;
  
  // Feedback Type
  typeOfFeedback: string;
  serviceUsed: string;
  
  // Experience Rating
  overallExperienceRating: string;
  
  // Detailed Feedback
  subject: string;
  detailedMessage: string;
  
  // Suggestions
  suggestionsForImprovement: string;
  wouldRecommend: string;
  
  // Consent
  consentToPublish: string;
  
  // Submit
  submitButton: string;
  confidentialityText: string;
}

export interface FeedbackFormPlaceholdersConfig {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  detailedMessage: string;
  suggestions: string;
}

export interface FeedbackSelectOptionConfig {
  value: string;
  label: string;
}

export interface FeedbackSelectOptionsConfig {
  feedbackType: FeedbackSelectOptionConfig[];
  serviceUsed: FeedbackSelectOptionConfig[];
  recommendation: FeedbackSelectOptionConfig[];
}

export interface FeedbackRatingLabelsConfig {
  excellent: string;
  veryGood: string;
  good: string;
  fair: string;
  poor: string;
}

export interface FeedbackContactConfig {
  title: string;
  phone: {
    number: string;
    display: string;
  };
  email: {
    address: string;
    display: string;
  };
}

export interface FeedbackFormHeaderConfig {
  title: string;
  subtitle: string;
}

export interface FeedbackValidationMessagesConfig {
  fillRequiredFields: string;
  selectRating: string;
  submitFailed: string;
}

export interface FeedbackPageConfig {
  metadata: {
    title: string;
  };
  hero: FeedbackHeroConfig;
  success: FeedbackSuccessConfig;
  alert: FeedbackAlertConfig;
  formHeader: FeedbackFormHeaderConfig;
  sections: FeedbackSectionConfig[];
  labels: FeedbackFormLabelsConfig;
  placeholders: FeedbackFormPlaceholdersConfig;
  selectOptions: FeedbackSelectOptionsConfig;
  ratingLabels: FeedbackRatingLabelsConfig;
  validationMessages: FeedbackValidationMessagesConfig;
  contact: FeedbackContactConfig;
}