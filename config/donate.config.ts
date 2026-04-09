import { DonatePageConfig } from "./types";

export const donateConfig: DonatePageConfig = {
  hero: {
    badge: { icon: "Heart", text: "Every Life Deserves Dignity" },
    title: { line1: "Your", line2: "Compassion", line3: "Changes Lives" },
    subtitle: "Just ₹500 provides a complete dignified cremation service. Your donation ensures no soul is forgotten, regardless of their circumstances.",
    impactStats: [
      { value: "15,000+", label: "Lives Honored" },
      { value: "50+", label: "Cities Served" },
      { value: "100%", label: "Transparency" }
    ],
    ctaButtons: { primary: "Donate Now", secondary: "See Our Impact" },
    startingAmount: "Starting ₹500"
  },
  trustSignals: [
    "80G Tax Exempt",
    "Secure Payments",
    "Public Documentation",
    "Verified Impact"
  ],
  amountSelection: {
    title: "Select Donation Amount",
    subtitle: "Choose an amount that fits your budget. Every rupee helps.",
    customAmountLabel: "Or Enter Custom Amount",
    customAmountPlaceholder: "Enter amount (min ₹100)"
  },
  donationTiers: [
    { amount: 500, label: "One Soul", desc: "Covers complete costs for one dignified cremation." },
    { amount: 2500, label: "Community", desc: "Supports dignified rites for 5 families." },
    { amount: 5000, label: "City Impact", desc: "Ensures mission stability in one district." },
    { amount: 10000, label: "Sacred Guardian", desc: "Supports operational costs for one mission center." }
  ],
  form: {
    title: "Donor Information",
    subtitle: "Please provide your details for 80G tax benefits and documentation.",
    sections: {
      personalInfo: {
        title: "Personal Information",
        fields: {
          fullName: { label: "Full Name", placeholder: "As per PAN card" },
          email: { label: "Email Address", placeholder: "For donation receipt" },
          phone: { label: "Phone Number", placeholder: "WhatsApp number preferred" }
        }
      },
      address: {
        title: "Address for 80G Receipt",
        fields: {
          address: { label: "Mailing Address", placeholder: "Full address for tax receipt" },
          city: { label: "City", placeholder: "Your city" },
          pincode: { label: "Pincode", placeholder: "6-digit code" },
          state: { label: "State", placeholder: "Select state" }
        }
      },
      taxDetails: {
        title: "Tax Details (Optional)",
        fields: {
          panNumber: { label: "PAN Number", placeholder: "Required for 80G receipt" },
          note: "Required for 80G compliance"
        }
      },
      preferences: {
        title: "Donation Purpose",
        frequency: { 
            label: "Frequency",
            types: [
                { label: "One-Time", value: "one-time" },
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" }
            ]
        },
        purpose: {
            label: "Purpose",
            options: [
                { label: "General Donation", value: "general" },
                { label: "Unclaimed Bodies Cremation", value: "cremation" },
                { label: "Ambulance Support", value: "ambulance" },
                { label: "Emergency Relief", value: "emergency" }
            ]
        }
      }
    },
    preferences: {
      anonymous: "Make this donation anonymous",
      taxReceipt: "I need an 80G tax receipt",
      terms: { text: "I agree to the", link: "/legal/terms", linkText: "Terms & Conditions" },
      refund: { text: "I accept the", link: "/donate/refund-policy", linkText: "Refund Policy" }
    },
    buttonText: "DONATE {amount} NOW",
    secureLabel: "SECURE SSL ENCRYPTION",
    taxLabel: "80G TAX EXEMPTION"
  },
  success: {
    title: "Thank You for Your Generosity",
    message: "Your donation of {amount} has been received. Thank you for helping us provide a dignified farewell to those in need.",
    receiptNote: "Your 80G Tax Receipt has been emailed to you.",
    fallbackAmount: "₹500",
    homeButton: "Back to Home"
  },
  validation: {
    minAmount: "Please select or enter a donation amount (minimum ₹100)",
    requiredFields: "Please fill in all required fields",
    agreeTerms: "Please agree to the terms and conditions"
  },
  states: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry", "Chandigarh", "Ladakh",
    "Jammu & Kashmir", "Dadra and Nagar Haveli & Daman and Diu", "Andaman and Nicobar Islands", "Lakshadweep"
  ]
};