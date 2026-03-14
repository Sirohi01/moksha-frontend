// Report Page Configuration
// All text, images, and content for the report page

import { ReportPageConfig } from './report.types';

export const reportConfig: ReportPageConfig = {
  // Page Metadata
  metadata: {
    title: "Report"
  },

  // Hero Section
  hero: {
    badge: "Emergency Report",
    title: "Report an Unclaimed Body",
    description: "If you have found an unclaimed or unidentified body, please fill this form immediately. Our team responds within 24 hours."
  },

  // Success Page
  success: {
    title: "Report Submitted",
    description: "Your report has been received. Our team will contact you within 24 hours.",
    referencePrefix: "MS-2024-",
    urgentAssistanceText: "For urgent assistance, call:",
    phoneNumber: "+911800123456",
    phoneLabel: "1800-123-456 (24/7)",
    submitAnotherText: "Submit another report"
  },

  // Important Notice
  importantNotice: {
    title: "Important Notice",
    message: "Please also inform your nearest police station. Moksha Seva works in coordination with law enforcement. Do not move or disturb the body."
  },

  // Form Header
  formHeader: {
    title: "Case Report Form",
    subtitle: "Please provide as much detail as possible to help us respond quickly"
  },

  // Form Sections
  sections: [
    { number: 1, title: "Reporter Details", icon: "User" },
    { number: 2, title: "Location Details", icon: "MapPin" },
    { number: 3, title: "Time Details", icon: "Clock" },
    { number: 4, title: "Body Details", icon: "FileText" },
    { number: 5, title: "Identification Marks", icon: "Camera" },
    { number: 6, title: "Physical Condition" },
    { number: 7, title: "Authority Details" },
    { number: 8, title: "Additional Information" },
    { number: 9, title: "Witness Information (Optional)" },
    { number: 10, title: "Document Details (Optional)", icon: "FileText" },
    { number: 11, title: "Upload Photos (Optional)" },
    { number: 12, title: "Consent & Agreement" }
  ],
  // Form Labels
  labels: {
    // Reporter Details
    reporterName: "Your Name",
    reporterPhone: "Contact Number *",
    reporterEmail: "Email Address",
    reporterAddress: "Your Address",
    reporterRelation: "Relation to Case",
    
    // Location Details
    exactLocation: "Exact Location *",
    landmark: "Landmark",
    area: "Area/Locality *",
    city: "City *",
    state: "State *",
    pincode: "Pincode",
    locationType: "Location Type *",
    gpsCoordinates: "GPS Coordinates (if available)",
    
    // Time Details
    dateFound: "Date Found *",
    timeFound: "Time Found *",
    approximateDeathTime: "Approximate Time of Death (if known)",
    
    // Body Details
    gender: "Gender *",
    approximateAge: "Approximate Age",
    height: "Height (approx.)",
    weight: "Weight (approx.)",
    complexion: "Complexion",
    hairColor: "Hair Color",
    eyeColor: "Eye Color",
    
    // Identification Marks
    tattoos: "Tattoos",
    scars: "Scars",
    birthmarks: "Birthmarks",
    jewelry: "Jewelry",
    clothing: "Clothing Description",
    personalBelongings: "Personal Belongings",
    
    // Physical Condition
    bodyCondition: "Body Condition *",
    visibleInjuries: "Visible Injuries",
    causeOfDeathSuspected: "Suspected Cause of Death",
    
    // Authority Details
    policeInformed: "Police has been informed",
    policeStationName: "Police Station Name",
    firNumber: "FIR Number (if filed)",
    hospitalName: "Hospital Name (if body is at hospital)",
    postMortemDone: "Post-mortem has been conducted",
    
    // Additional Information
    identityDocumentsFound: "Identity documents found with body",
    documentDetails: "Document Details",
    suspectedIdentity: "Suspected Identity",
    familyContacted: "Family members have been contacted",
    additionalNotes: "Additional Notes",
    
    // Witness Information
    witnessName: "Witness Name",
    witnessPhone: "Witness Phone",
    witnessAddress: "Witness Address",
    
    // Document Uploads
    bplCardNumber: "BPL Card Number",
    bplCardPhoto: "Upload BPL Card Photo",
    aadhaarNumber: "Aadhaar Number",
    aadhaarPhoto: "Upload Aadhaar Card Photo",
    nocDetails: "Certificate Details",
    nocPhoto: "Upload Certificate Photo",
    panNumber: "PAN Number",
    panPhoto: "Upload PAN Card Photo",
    
    // Consent
    agreeToTerms: "I confirm that the information provided is accurate to the best of my knowledge *",
    consentToShare: "I consent to share this information with authorities and Moksha Seva team *",
    
    // Submit
    submitButton: "Submit Emergency Report",
    confidentialityText: "Your information is confidential and used only for case resolution."
  },
  // Form Placeholders
  placeholders: {
    reporterName: "Full name",
    reporterPhone: "+91 98765 43210",
    reporterEmail: "your@email.com",
    reporterAddress: "Complete address",
    exactLocation: "Street address, building name, etc.",
    landmark: "Nearby landmark",
    area: "Area name",
    city: "City",
    pincode: "000000",
    gpsCoordinates: "Lat, Long",
    approximateDeathTime: "e.g., 2-3 hours ago, yesterday evening",
    approximateAge: "e.g., 30-35 years",
    height: "e.g., 5'6'' or 168 cm",
    weight: "e.g., 65 kg",
    complexion: "Fair, Wheatish, Dark",
    hairColor: "Black, Brown, Grey",
    eyeColor: "Brown, Black, etc.",
    tattoos: "Describe any tattoos",
    scars: "Describe any scars",
    birthmarks: "Describe any birthmarks",
    jewelry: "Rings, chains, watches, etc.",
    clothing: "Describe clothing in detail",
    personalBelongings: "Wallet, phone, documents, bags, etc.",
    visibleInjuries: "Describe any visible injuries or wounds",
    causeOfDeathSuspected: "If you have any suspicion (accident, natural, etc.)",
    policeStationName: "Station name",
    firNumber: "FIR number",
    hospitalName: "Hospital name",
    documentDetails: "Aadhaar, PAN, Driving License, etc.",
    suspectedIdentity: "If you suspect who the person might be",
    additionalNotes: "Any other relevant information...",
    witnessName: "Name of another witness",
    witnessPhone: "+91 98765 43210",
    witnessAddress: "Address",
    bplCardNumber: "Enter BPL card number",
    aadhaarNumber: "Enter Aadhaar number",
    nocDetails: "Enter certificate type and details",
    panNumber: "Enter PAN number"
  },

  // Select Options
  selectOptions: {
    reporterRelation: [
      { value: "", label: "Select relation" },
      { value: "witness", label: "Witness" },
      { value: "relative", label: "Relative" },
      { value: "police", label: "Police Personnel" },
      { value: "hospital", label: "Hospital Staff" },
      { value: "passerby", label: "Passerby" },
      { value: "other", label: "Other" }
    ],
    locationType: [
      { value: "", label: "Select type" },
      { value: "road", label: "Road/Highway" },
      { value: "hospital", label: "Hospital" },
      { value: "home", label: "Residential Area" },
      { value: "public_place", label: "Public Place" },
      { value: "river", label: "River/Water Body" },
      { value: "railway", label: "Railway Track/Station" },
      { value: "forest", label: "Forest/Rural Area" },
      { value: "other", label: "Other" }
    ],
    gender: [
      { value: "", label: "Select gender" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "unknown", label: "Unable to Determine" }
    ],
    bodyCondition: [
      { value: "", label: "Select condition" },
      { value: "recent", label: "Recent (less than 24 hours)" },
      { value: "decomposed", label: "Decomposed (1-7 days)" },
      { value: "advanced", label: "Advanced Decomposition (7+ days)" },
      { value: "skeletal", label: "Skeletal Remains" },
      { value: "unknown", label: "Unable to Determine" }
    ],
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
      "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "ladakh", "Puducherry",
      "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
    ]
  },

  // Placeholders for select dropdowns
  selectPlaceholders: {
    state: "Select state"
  },
  // Document Sections
  documentSections: {
    title: "Document Details (Optional)",
    description: "If available, please provide details and upload photos of the following documents",
    bplCard: "BPL Card (Below Poverty Line)",
    aadhaarCard: "Aadhaar Card",
    nocCertificate: "NOC from Family / Government Certificate / Pradhan Certificate",
    panCard: "PAN Card"
  },

  // Section Titles
  sectionTitles: {
    physicalCondition: "Physical Condition",
    authorityDetails: "Authority Details",
    additionalInformation: "Additional Information",
    witnessInformation: "Witness Information (Optional)",
    uploadPhotos: "Upload Photos (Optional)",
    consentAgreement: "Consent & Agreement"
  },

  // Upload Texts
  uploadTexts: {
    clickToUpload: "Click to upload or drag and drop",
    dragAndDrop: "Click to upload or drag and drop",
    fileTypes: "JPG, PNG up to 5MB",
    multipleFiles: "JPG, PNG up to 10MB (Multiple files allowed)"
  },

  // Emergency Contact
  emergency: {
    title: "For immediate assistance:",
    phoneNumber: "1800-123-456",
    phoneLabel: "Toll Free · 24/7 · All India",
    description: "For immediate assistance:"
  }
};

export default reportConfig;