import type {
  UnidentifiedBody,
  CremationRecord,
  ImpactStats,
  GovernmentScheme,
  FAQ,
} from "@/types";

export const mockStats: ImpactStats = {
  totalCremations: 2847,
  activeCases: 23,
  activeVolunteers: 412,
  citiesCovered: 38,
  familiesHelped: 1563,
  totalDonations: 4250000,
};

export const mockBodies: UnidentifiedBody[] = [
  {
    id: "1",
    bodyId: "MS-2024-001",
    locationFound: "Near Yamuna Ghat, Delhi",
    dateFound: "2024-01-15",
    cremationDate: "2024-01-17",
    status: "cremated",
    clothesDescription: "Blue shirt, grey trousers, black sandals",
    marksOrTattoos: "Small tattoo on left wrist",
    age: "35-45",
    gender: "Male",
    certificateUrl: "#",
  },
  {
    id: "2",
    bodyId: "MS-2024-002",
    locationFound: "Sarai Kale Khan, New Delhi",
    dateFound: "2024-01-22",
    cremationDate: "2024-01-24",
    status: "cremated",
    clothesDescription: "White kurta, beige dhoti",
    age: "60-70",
    gender: "Male",
    certificateUrl: "#",
  },
  {
    id: "3",
    bodyId: "MS-2024-003",
    locationFound: "Nizamuddin Railway Station",
    dateFound: "2024-02-03",
    status: "pending",
    clothesDescription: "Pink saree with green border",
    marksOrTattoos: "Scar on right arm",
    age: "25-35",
    gender: "Female",
  },
  {
    id: "4",
    bodyId: "MS-2024-004",
    locationFound: "Anand Vihar Bus Terminal",
    dateFound: "2024-02-10",
    cremationDate: "2024-02-12",
    status: "cremated",
    clothesDescription: "Grey hoodie, blue jeans",
    age: "20-30",
    gender: "Male",
    certificateUrl: "#",
  },
  {
    id: "5",
    bodyId: "MS-2024-005",
    locationFound: "Kashmiri Gate, Old Delhi",
    dateFound: "2024-02-18",
    status: "identified",
    clothesDescription: "Red t-shirt, black pants",
    marksOrTattoos: "Birthmark on neck",
    age: "40-50",
    gender: "Male",
  },
  {
    id: "6",
    bodyId: "MS-2024-006",
    locationFound: "Connaught Place, New Delhi",
    dateFound: "2024-03-01",
    cremationDate: "2024-03-03",
    status: "cremated",
    clothesDescription: "Saffron robes",
    age: "55-65",
    gender: "Male",
    certificateUrl: "#",
  },
];

export const mockCremationRecords: CremationRecord[] = [
  {
    id: "1",
    bodyId: "MS-2024-001",
    locationFound: "Near Yamuna Ghat, Delhi",
    dateFound: "15 Jan 2024",
    cremationDate: "17 Jan 2024",
    certificateNumber: "CERT-DEL-2024-001",
    cremationGround: "Nigambodh Ghat, Delhi",
    officerInCharge: "Sh. Ramesh Kumar",
    witness: "Volunteer Team - North Delhi",
  },
  {
    id: "2",
    bodyId: "MS-2024-002",
    locationFound: "Sarai Kale Khan",
    dateFound: "22 Jan 2024",
    cremationDate: "24 Jan 2024",
    certificateNumber: "CERT-DEL-2024-002",
    cremationGround: "Lodi Road Cremation Ground",
    officerInCharge: "Sh. Suresh Yadav",
    witness: "South Delhi Volunteer Team",
  },
  {
    id: "3",
    bodyId: "MS-2024-004",
    locationFound: "Anand Vihar Bus Terminal",
    dateFound: "10 Feb 2024",
    cremationDate: "12 Feb 2024",
    certificateNumber: "CERT-DEL-2024-003",
    cremationGround: "Shastri Park Cremation Ground",
    officerInCharge: "Sh. Vijay Singh",
    witness: "East Delhi Volunteer Team",
  },
  {
    id: "4",
    bodyId: "MS-2024-006",
    locationFound: "Connaught Place",
    dateFound: "1 Mar 2024",
    cremationDate: "3 Mar 2024",
    certificateNumber: "CERT-DEL-2024-004",
    cremationGround: "Yamuna Ghat Cremation Ground",
    officerInCharge: "Sh. Mahesh Sharma",
    witness: "Central Delhi Volunteer Team",
  },
];

export const mockSchemes: GovernmentScheme[] = [
  {
    id: "1",
    name: "Antyodaya Anna Yojana",
    authority: "Ministry of Consumer Affairs",
    description:
      "Food security scheme for the poorest families including support during funeral rites.",
    eligibility: "BPL families, homeless individuals",
    benefits: "Free ration, funeral assistance",
    applicationProcess:
      "Visit nearest ration shop or Gram Panchayat with Aadhaar card.",
    state: "All India",
  },
  {
    id: "2",
    name: "Rashtriya Pariwar Sahayata Yojana",
    authority: "Ministry of Rural Development",
    description:
      "One-time financial assistance to BPL families on death of the bread earner.",
    eligibility: "BPL families where primary earner has died",
    benefits: "₹20,000 one-time grant",
    applicationProcess: "Apply at District Social Welfare Office.",
    state: "All India",
  },
  {
    id: "3",
    name: "Mukhyamantri Antim Sanskar Yojana",
    authority: "Delhi Government",
    description: "Free cremation services for unidentified and unclaimed bodies.",
    eligibility: "Unclaimed bodies, destitute individuals",
    benefits: "Free cremation, death certificate",
    applicationProcess: "Contact nearest police station or Delhi Jal Board.",
    state: "Delhi",
  },
];

export const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "What is Moksha Sewa?",
    answer:
      "Moksha Sewa is a humanitarian platform that provides dignified cremation services for unclaimed bodies, homeless individuals, and poor families who cannot afford funeral rites. We work in coordination with police departments, hospitals, and municipal authorities.",
    category: "General",
  },
  {
    id: "2",
    question: "How do I report an unclaimed body?",
    answer:
      "You can report an unclaimed body through our 'Report Unclaimed Body' page. Fill in the location, description, and your contact details. Our team will coordinate with local authorities within 24 hours.",
    category: "Reporting",
  },
  {
    id: "3",
    question: "Is Moksha Sewa a government organization?",
    answer:
      "Moksha Sewa is an NGO working in partnership with government authorities. We operate with official approvals and work alongside police departments, municipalities, and health authorities.",
    category: "General",
  },
  {
    id: "4",
    question: "How can I volunteer?",
    answer:
      "You can register as a volunteer through our Volunteer Registration page. We accept volunteers for various roles including transportation, documentation, cremation support, family counseling, and awareness campaigns.",
    category: "Volunteering",
  },
  {
    id: "5",
    question: "How is the donation money used?",
    answer:
      "100% of donations go toward cremation services, documentation costs, transportation, and operational expenses. We publish monthly transparency reports so donors can see exactly how funds are used.",
    category: "Donations",
  },
  {
    id: "6",
    question: "Can families access the transparency dashboard?",
    answer:
      "Yes, our public transparency dashboard shows all cremation records including body ID, location found, date, and certificate numbers. Family members can search for their loved ones.",
    category: "Transparency",
  },
  {
    id: "7",
    question: "What happens to personal belongings?",
    answer:
      "All personal belongings are documented, photographed, and stored safely for 3 years in case family members come forward to claim them. After 3 years, unclaimed belongings are donated to charitable organizations.",
    category: "Process",
  },
  {
    id: "8",
    question: "How long does it take from reporting to cremation?",
    answer:
      "We aim to complete documentation and cremation within 72 hours of a reported case, following all legal procedures. In urgent cases where identification is confirmed impossible, we may proceed within 48 hours.",
    category: "Process",
  },
];
