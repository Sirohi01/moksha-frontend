// Body / Case types
export interface UnidentifiedBody {
  id: string;
  bodyId: string;
  locationFound: string;
  dateFound: string;
  cremationDate?: string;
  status: "pending" | "identified" | "cremated";
  clothesDescription: string;
  marksOrTattoos?: string;
  age?: string;
  gender?: string;
  photoUrl?: string;
  certificateUrl?: string;
  reportedBy?: string;
  policeStation?: string;
}

export interface CremationRecord {
  id: string;
  bodyId: string;
  locationFound: string;
  dateFound: string;
  cremationDate: string;
  certificateNumber: string;
  cremationGround: string;
  officerInCharge: string;
  witness?: string;
}

// Volunteer types
export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  roleInterest: VolunteerRole[];
  availability: Availability;
  joinedDate: string;
  status: "active" | "inactive" | "pending";
}

export type VolunteerRole =
  | "transport"
  | "documentation"
  | "cremation_support"
  | "family_counseling"
  | "fundraising"
  | "awareness"
  | "medical_support";

export type Availability = "weekdays" | "weekends" | "full_time" | "on_call";

// Report types
export interface BodyReport {
  id?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  contactNumber: string;
  dateTimeFound: string;
  imageUrl?: string;
  reporterName?: string;
  submittedAt?: string;
}

// Donation types
export interface Donation {
  id: string;
  amount: number;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  date: string;
  paymentStatus: "success" | "pending" | "failed";
  purpose?: string;
}

// Stats types
export interface ImpactStats {
  totalCremations: number;
  activeCases: number;
  activeVolunteers: number;
  citiesCovered: number;
  familiesHelped: number;
  totalDonations: number;
}

// Government scheme types
export interface GovernmentScheme {
  id: string;
  name: string;
  authority: string;
  description: string;
  eligibility: string;
  benefits: string;
  applicationProcess: string;
  contactInfo?: string;
  state?: string;
}

// FAQ types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Board Application types
export interface BoardApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  currentPosition: string;
  organization: string;
  experience: number;
  expertise?: string[];
  qualifications: string;
  positionInterested: 'board_member' | 'advisory_member' | 'treasurer' | 'secretary' | 'any';
  motivationStatement: string;
  previousBoardExperience?: string;
  timeCommitment: '5_hours_month' | '10_hours_month' | '15_hours_month' | '20_plus_hours_month';
  references?: Array<{
    name: string;
    position?: string;
    organization?: string;
    phone?: string;
    email?: string;
    relationship?: string;
  }>;
  resumeUrl?: string;
  coverLetterUrl?: string;
  applicationId: string;
  status: 'submitted' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Legacy Giving types
export interface LegacyGiving {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  legacyType: 'will_bequest' | 'life_insurance' | 'retirement_plan' | 'charitable_trust' | 'other';
  estimatedValue?: string;
  timeframe?: 'immediate' | '1_2_years' | '3_5_years' | '5_plus_years' | 'uncertain';
  specificPurpose?: string;
  additionalInfo?: string;
  preferredContact: 'phone' | 'email' | 'mail' | 'in_person';
  bestTimeToContact?: string;
  requestId: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'completed' | 'declined';
  assignedTo?: string;
  followUpDate?: string;
  notes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Expansion Request types
export interface ExpansionRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  position?: string;
  requestedCity: string;
  requestedState: string;
  region?: string;
  population?: number;
  currentServices?: string;
  needAssessment?: string;
  localSupport: 'individual' | 'organization' | 'government' | 'community' | 'multiple';
  supportDetails?: string;
  volunteerAvailability?: string;
  fundingSupport?: string;
  whyNeeded: string;
  expectedImpact?: string;
  challenges?: string;
  timeline?: string;
  requestId: string;
  status: 'submitted' | 'under_review' | 'feasibility_study' | 'approved' | 'rejected' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvalDate?: string;
  rejectionReason?: string;
  feasibilityScore?: number;
  estimatedCost?: number;
  estimatedTimeline?: string;
  notes?: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
