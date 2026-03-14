// Type definitions for Report page configuration

export interface ReportHeroConfig {
  badge: string;
  title: string;
  description: string;
}

export interface ReportSuccessConfig {
  title: string;
  description: string;
  referencePrefix: string;
  urgentAssistanceText: string;
  phoneNumber: string;
  phoneLabel: string;
  submitAnotherText: string;
}

export interface ReportFormSectionConfig {
  number: number;
  title: string;
  icon?: string;
}

export interface ReportFormLabelsConfig {
  // Reporter Details
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  reporterAddress: string;
  reporterRelation: string;
  
  // Location Details
  exactLocation: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  locationType: string;
  gpsCoordinates: string;
  
  // Time Details
  dateFound: string;
  timeFound: string;
  approximateDeathTime: string;
  
  // Body Details
  gender: string;
  approximateAge: string;
  height: string;
  weight: string;
  complexion: string;
  hairColor: string;
  eyeColor: string;
  
  // Identification Marks
  tattoos: string;
  scars: string;
  birthmarks: string;
  jewelry: string;
  clothing: string;
  personalBelongings: string;
  
  // Physical Condition
  bodyCondition: string;
  visibleInjuries: string;
  causeOfDeathSuspected: string;
  
  // Authority Details
  policeInformed: string;
  policeStationName: string;
  firNumber: string;
  hospitalName: string;
  postMortemDone: string;
  
  // Additional Information
  identityDocumentsFound: string;
  documentDetails: string;
  suspectedIdentity: string;
  familyContacted: string;
  additionalNotes: string;
  
  // Witness Information
  witnessName: string;
  witnessPhone: string;
  witnessAddress: string;
  
  // Document Uploads
  bplCardNumber: string;
  bplCardPhoto: string;
  aadhaarNumber: string;
  aadhaarPhoto: string;
  nocDetails: string;
  nocPhoto: string;
  panNumber: string;
  panPhoto: string;
  
  // Consent
  agreeToTerms: string;
  consentToShare: string;
  
  // Submit
  submitButton: string;
  confidentialityText: string;
}

export interface ReportFormPlaceholdersConfig {
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  reporterAddress: string;
  exactLocation: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  gpsCoordinates: string;
  approximateDeathTime: string;
  approximateAge: string;
  height: string;
  weight: string;
  complexion: string;
  hairColor: string;
  eyeColor: string;
  tattoos: string;
  scars: string;
  birthmarks: string;
  jewelry: string;
  clothing: string;
  personalBelongings: string;
  visibleInjuries: string;
  causeOfDeathSuspected: string;
  policeStationName: string;
  firNumber: string;
  hospitalName: string;
  documentDetails: string;
  suspectedIdentity: string;
  additionalNotes: string;
  witnessName: string;
  witnessPhone: string;
  witnessAddress: string;
  bplCardNumber: string;
  aadhaarNumber: string;
  nocDetails: string;
  panNumber: string;
}

export interface ReportSelectOption {
  value: string;
  label: string;
}

export interface ReportSelectOptionsConfig {
  reporterRelation: ReportSelectOption[];
  locationType: ReportSelectOption[];
  gender: ReportSelectOption[];
  bodyCondition: ReportSelectOption[];
  states: string[];
}

export interface ReportSelectPlaceholdersConfig {
  state: string;
}

export interface ReportEmergencyConfig {
  title: string;
  phoneNumber: string;
  phoneLabel: string;
  description: string;
}

export interface ReportPageConfig {
  hero: ReportHeroConfig;
  success: ReportSuccessConfig;
  sections: ReportFormSectionConfig[];
  labels: ReportFormLabelsConfig;
  placeholders: ReportFormPlaceholdersConfig;
  selectOptions: ReportSelectOptionsConfig;
  selectPlaceholders: ReportSelectPlaceholdersConfig;
  emergency: ReportEmergencyConfig;
  importantNotice: {
    title: string;
    message: string;
  };
  formHeader: {
    title: string;
    subtitle: string;
  };
  documentSections: {
    title: string;
    description: string;
    bplCard: string;
    aadhaarCard: string;
    nocCertificate: string;
    panCard: string;
  };
  sectionTitles: {
    physicalCondition: string;
    authorityDetails: string;
    additionalInformation: string;
    witnessInformation: string;
    uploadPhotos: string;
    consentAgreement: string;
  };
  uploadTexts: {
    clickToUpload: string;
    dragAndDrop: string;
    fileTypes: string;
    multipleFiles: string;
  };
  metadata: {
    title: string;
  };
}