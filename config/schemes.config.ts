// Schemes Page Configuration
// All text, images, and content for the schemes page

import { SchemesPageConfig } from './schemes.types';

export const schemesConfig: SchemesPageConfig = {
  // Page Metadata
  metadata: {
    title: "Schemes"
  },

  // Hero Section
  hero: {
    badge: "GOVERNMENT RESOURCES",
    title: "FUNERAL ASSISTANCE",
    subtitle: "SCHEMES",
    description: "Complete guide to Central and State government schemes providing financial assistance for funeral expenses and family support"
  },

  // Navigation Tabs
  tabs: {
    central: "Central Government Schemes",
    state: "State-Wise Schemes"
  },

  // Central Government Schemes
  centralSchemes: [
    {
      title: "National Family Benefit Scheme (NFBS)",
      authority: "National Social Assistance Programme",
      benefit: "₹20,000 lump sum",
      eligibility: "BPL family, Breadwinner death (age 18-64)",
      purpose: "Family को death के बाद financial help",
      status: "Active",
      icon: "Users",
      color: "text-[#f4c430]"
    },
    {
      title: "Antyesti / Antim Sanskar Assistance",
      authority: "Central Government",
      benefit: "₹3,000 – ₹5,000 funeral expense",
      eligibility: "Poor / destitute families",
      purpose: "Implemented mostly through state governments",
      status: "Active",
      icon: "BookOpen",
      color: "text-[#20b2aa]"
    }
  ],

  // State-Wise Schemes
  stateSchemes: [
    {
      state: "Uttar Pradesh",
      schemes: [
        {
          title: "Raja Harishchandra Antyeshti Sahayata Yojana",
          benefit: "₹3,000 funeral expense",
          eligibility: "Poor families",
          icon: "Building2",
          description: "UP government की यह योजना गरीब परिवारों को अंतिम संस्कार के लिए वित्तीय सहायता प्रदान करती है।"
        },
        {
          title: "Dattopant Thengadi Mratak Shramik Sahayata",
          benefit: "Financial help for construction workers",
          eligibility: "Construction workers के death पर",
          icon: "Users",
          description: "निर्माण श्रमिकों की मृत्यु पर उनके परिवार को वित्तीय सहायता प्रदान की जाती है।"
        }
      ]
    },
    {
      state: "Rajasthan",
      schemes: [
        {
          title: "Antyesti Sahayata Yojana",
          benefit: "₹5,000 funeral expense",
          eligibility: "BPL families",
          icon: "IndianRupee",
          description: "राजस्थान सरकार द्वारा BPL परिवारों को अंतिम संस्कार हेतु वित्तीय सहायता।"
        }
      ]
    },
    {
      state: "Madhya Pradesh",
      schemes: [
        {
          title: "Antyeshti Sahayata Yojana",
          benefit: "₹5,000",
          eligibility: "Poor families",
          icon: "BookOpen",
          description: "मध्य प्रदेश में गरीब परिवारों के लिए अंतिम संस्कार सहायता योजना।"
        }
      ]
    },
    {
      state: "Bihar",
      schemes: [
        {
          title: "Kabir Antyeshti Anudan Yojana",
          benefit: "₹3,000",
          eligibility: "BPL families - Direct payment family को",
          icon: "Users",
          description: "बिहार सरकार की यह योजना BPL परिवारों को सीधे भुगतान के रूप में सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Jharkhand",
      schemes: [
        {
          title: "Mukhyamantri Antyeshti Sahayata",
          benefit: "₹3,000 – ₹5,000",
          eligibility: "Poor families",
          icon: "Building2",
          description: "झारखंड के मुख्यमंत्री अंतिम संस्कार सहायता योजना।"
        }
      ]
    },
    {
      state: "Chhattisgarh",
      schemes: [
        {
          title: "Antyeshti Sahayata Scheme",
          benefit: "₹2,000 – ₹5,000",
          eligibility: "BPL families",
          icon: "IndianRupee",
          description: "छत्तीसगढ़ सरकार की अंतिम संस्कार सहायता योजना।"
        }
      ]
    },
    {
      state: "West Bengal",
      schemes: [
        {
          title: "Samobyathi Scheme",
          benefit: "₹2,000 funeral assistance",
          eligibility: "Poor families",
          icon: "BookOpen",
          description: "पश्चिम बंगाल की समोब्यथी योजना गरीब परिवारों को अंतिम संस्कार सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Odisha",
      schemes: [
        {
          title: "Harischandra Sahayata Yojana",
          benefit: "₹2,000 cash + Free cremation facilities",
          eligibility: "Destitute families",
          icon: "Users",
          description: "ओडिशा की हरिश्चंद्र सहायता योजना नकद राशि और मुफ्त दाह संस्कार की सुविधा प्रदान करती है।"
        }
      ]
    },
    {
      state: "Gujarat",
      schemes: [
        {
          title: "Manav Garima / Funeral Assistance",
          benefit: "Funeral cost support",
          eligibility: "Poor families",
          icon: "Building2",
          description: "गुजरात की मानव गरिमा योजना गरीब परिवारों को अंतिम संस्कार की लागत में सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Maharashtra",
      schemes: [
        {
          title: "Sanjay Gandhi Niradhar Anudan Yojana",
          benefit: "Death assistance + funeral support",
          eligibility: "Destitute families",
          icon: "IndianRupee",
          description: "महाराष्ट्र की संजय गांधी निराधार अनुदान योजना मृत्यु सहायता और अंतिम संस्कार सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Tamil Nadu",
      schemes: [
        {
          title: "Perunthalaivar Kamarajar Funeral Assistance Scheme",
          benefit: "₹15,000 funeral expense",
          eligibility: "Poor families",
          icon: "BookOpen",
          description: "तमिलनाडु की पेरुंथलैवर कामराज अंतिम संस्कार सहायता योजना सबसे अधिक राशि प्रदान करती है।"
        }
      ]
    },
    {
      state: "Karnataka",
      schemes: [
        {
          title: "Sandhya Suraksha / Death Assistance",
          benefit: "Financial help",
          eligibility: "Poor families",
          icon: "Users",
          description: "कर्नाटक की संध्या सुरक्षा योजना गरीब परिवारों को मृत्यु सहायता प्रदान करती है।"
        }
      ]
    },
    {
      state: "Delhi",
      schemes: [
        {
          title: "Municipal Cremation Support",
          benefit: "Electric / CNG crematorium free या subsidized",
          eligibility: "Poor families को free cremation facility",
          icon: "Building2",
          description: "दिल्ली नगर निगम गरीब परिवारों को मुफ्त या सब्सिडी वाली दाह संस्कार सुविधा प्रदान करता है।"
        }
      ]
    }
  ],

  // Other Schemes
  otherSchemes: [
    {
      title: "Construction Worker Welfare Board",
      benefit: "₹5,000-₹10,000 funeral assistance",
      eligibility: "Registered construction workers",
      description: "निर्माण श्रमिक कल्याण बोर्ड के तहत पंजीकृत श्रमिकों को अंतिम संस्कार सहायता।",
      icon: "Users"
    },
    {
      title: "SC/ST Welfare Department",
      benefit: "₹2,000-₹5,000 funeral assistance",
      eligibility: "SC/ST families",
      description: "अनुसूचित जाति/जनजाति कल्याण विभाग द्वारा अंतिम संस्कार सहायता।",
      icon: "Users"
    },
    {
      title: "Panchayat Relief Fund",
      benefit: "Emergency death assistance",
      eligibility: "Village level support",
      description: "पंचायत राहत कोष से आपातकालीन मृत्यु सहायता प्रदान की जाती है।",
      icon: "Building2"
    }
  ],

  // Assistance Types
  assistanceTypes: [
    { type: "BPL funeral assistance", amount: "₹2,000 – ₹5,000" },
    { type: "Labour welfare funeral", amount: "₹5,000 – ₹10,000" },
    { type: "State special schemes", amount: "₹3,000 – ₹15,000" },
    { type: "National Family Benefit", amount: "₹20,000" }
  ],

  // Help Sources
  helpSources: [
    "Panchayat",
    "Municipal Corporation",
    "District Magistrate office",
    "Social Welfare Department"
  ],

  // Section Titles
  sections: {
    centralTitle: "Central Government Schemes (All India)",
    stateTitle: "🗺️ State-Wise Funeral / Cremation Schemes",
    otherAssistanceTitle: "Other Government Funeral Assistance",
    assistanceAmountsTitle: "💰 Typical Government Funeral Assistance (India)",
    helpSourcesTitle: "✅ Where to Get Help",
    helpSourcesDescription: "Poor families को usually help milti hai through these government offices:"
  },

  // Buttons
  buttons: {
    applyForScheme: "Apply for this scheme",
    applyForAssistance: "Apply for assistance"
  },

  // Table Headers
  tableHeaders: {
    schemeType: "Scheme Type",
    amount: "Amount"
  },

  // Form Configuration
  form: {
    labels: {
      fullName: "FULL NAME",
      emailAddress: "EMAIL ADDRESS",
      phoneNumber: "PHONE NUMBER",
      fullAddress: "FULL ADDRESS",
      city: "CITY",
      state: "STATE",
      pincode: "PINCODE",
      additionalDetails: "ADDITIONAL DETAILS (OPTIONAL)",
      selectState: "Select state"
    },
    placeholders: {
      fullName: "Enter your full name",
      email: "your.email@example.com",
      phone: "+91 98765 43210",
      address: "Complete address",
      city: "City name",
      pincode: "123456",
      message: "Any specific questions or urgent requirements..."
    },
    validation: {
      fillRequiredFields: "Please fill in all required fields"
    },
    success: {
      title: "REQUEST RECEIVED!",
      description: "Thank you for reaching out. Our schemes assistance team will contact you within 24 hours to help you with the application process.",
      closeButton: "CLOSE",
      submitAnotherButton: "SUBMIT ANOTHER REQUEST"
    },
    formHeader: {
      badge: "SCHEME ASSISTANCE",
      title: "REQUEST HELP FOR",
      subtitle: "",
      description: "Fill in your details and our team will guide you through the entire application process."
    },
    note: "Note: Our team will contact you within 24 hours to verify your eligibility and guide you through the documentation process. All assistance is completely free.",
    submitButton: "SUBMIT REQUEST",
    confidentialityNote: "Your information is confidential and will only be used for scheme assistance."
  },

  // Help Section
  help: {
    title: "NEED HELP",
    subtitle: "FOR APPLYING?",
    description: "Dealing with government paperwork can be overwhelming during a crisis. Our trained volunteers will help you navigate the entire process, 100% free.",
    phone: "9220147229",
    email: "schemes@MokshaSewa.org",
    callLabel: "CALL US",
    emailLabel: "EMAIL SUPPORT"
  },

  // States List
  states: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
    "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
  ]
};

export default schemesConfig;