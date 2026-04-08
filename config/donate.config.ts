// Donate Page Configuration
// All text, images, and content for the donate page

import { DonatePageConfig } from './donate.types';

export const donateConfig: DonatePageConfig = {
  // Page Metadata
  metadata: {
    title: "Donate"
  },

  // Hero Section
  hero: {
    badge: {
      icon: "Heart",
      text: "Every Life Deserves Dignity"
    },
    title: {
      line1: "Your",
      line2: "Compassion",
      line3: "Changes Lives"
    },
    subtitle: "Just ₹500 provides a complete dignified cremation service. Your donation ensures no soul is forgotten, regardless of their circumstances.",
    impactStats: [
      { value: "15,000+", label: "Lives Honored" },
      { value: "50+", label: "Cities Served" },
      { value: "100%", label: "Transparency" }
    ],
    ctaButtons: {
      primary: "Donate Now",
      secondary: "See Our Impact"
    },
    trustIndicators: [
      { icon: "ShieldCheck", text: "80G Tax Exemption" },
      { icon: "CheckCircle", text: "Government Registered" },
      { icon: "Heart", text: "100% Fund Utilization" },
      { icon: "ShieldCheck", text: "Secure Payments" }
    ],
    startingAmount: "Starting ₹500",
    trustMessage: "Trusted by thousands • Verified by government"
  },

  // Trust Signals
  trustSignals: [
    "80G Tax Exemption",
    "100% Transparent Fund Use",
    "Registered NGO",
    "No Platform Fee"
  ],

  // Donation Tiers
  donationTiers: [
    {
      amount: 500,
      label: "One Cremation",
      desc: "Covers basic cremation services for one person",
      impact: "1 person's dignified farewell"
    },
    {
      amount: 2000,
      label: "Family Support Package",
      desc: "Cremation + documentation + family counseling",
      impact: "1 family fully supported"
    },
    {
      amount: 5000,
      label: "Full Case Management",
      desc: "End-to-end case from reporting to certification",
      impact: "Complete case handled"
    },
    {
      amount: 10000,
      label: "Monthly Sponsor",
      desc: "Fund one month of operations in a city",
      impact: "A city's operations for 1 month"
    }
  ],

  // Amount Selection
  amountSelection: {
    title: "Select Donation Amount",
    subtitle: "Choose a preset amount or enter your own",
    customAmountLabel: "Or Enter Custom Amount",
    customAmountPlaceholder: "Enter amount (min ₹100)",
    impactTitle: "Your Impact"
  },

  // Trust Badges
  trustBadges: {
    title: "Why Donate to Moksha Sewa?",
    badges: [
      { icon: "✓", text: "80G Tax Exemption" },
      { icon: "✓", text: "100% Transparent" },
      { icon: "✓", text: "Govt. Registered" },
      { icon: "✓", text: "No Fees" },
      { icon: "✓", text: "Instant Receipt" },
      { icon: "✓", text: "Secure Payment" }
    ]
  },

  // Form Configuration
  form: {
    title: "Complete Your Donation",
    subtitle: "Fill in your details • Fields marked with * are required",
    defaultCountry: "India",
    sections: {
      personalInfo: {
        title: "Personal Information",
        stepNumber: 1,
        fields: {
          fullName: {
            label: "Full Name",
            placeholder: "As per PAN card"
          },
          email: {
            label: "Email",
            placeholder: "your@email.com"
          },
          phone: {
            label: "Phone",
            placeholder: "+91 98765 43210"
          }
        }
      },
      address: {
        title: "Address",
        stepNumber: 2,
        fields: {
          address: {
            label: "Complete Address",
            placeholder: "House/Flat No., Building, Street"
          },
          city: {
            label: "City",
            placeholder: "Mumbai"
          },
          pincode: {
            label: "PIN Code",
            placeholder: "400001"
          },
          state: {
            label: "State",
            placeholder: "Select State"
          }
        }
      },
      taxDetails: {
        title: "Tax Details (Optional)",
        stepNumber: 3,
        fields: {
          panNumber: {
            label: "PAN Number",
            placeholder: "ABCDE1234F"
          },
          aadharNumber: {
            label: "Aadhar Number",
            placeholder: "1234 5678 9012"
          }
        }
      },
      preferences: {
        title: "Donation Preferences",
        stepNumber: 4,
        frequency: {
          label: "Frequency",
          types: [
            { value: "one-time", label: "One Time", desc: "Single donation" },
            { value: "monthly", label: "Monthly", desc: "Recurring monthly" },
            { value: "yearly", label: "Yearly", desc: "Recurring yearly" }
          ]
        },
        purpose: {
          label: "Purpose",
          options: [
            { value: "general", label: "General Fund" },
            { value: "specific_campaign", label: "Specific Campaign" },
            { value: "memorial", label: "In Memory Of" },
            { value: "tribute", label: "In Honor Of" },
            { value: "ambulance", label: "Ambulance Service" },
            { value: "cremation", label: "Cremation Services" }
          ]
        },
        tribute: {
          memorialLabel: "In Memory Of",
          honorLabel: "In Honor Of",
          nameLabel: "Name",
          messagePlaceholder: "Your message..."
        }
      },
      payment: {
        title: "Payment Method",
        stepNumber: 5,
        methods: [
          { value: "upi", label: "UPI", icon: "📱", desc: "PhonePe, GPay, Paytm" },
          { value: "card", label: "Card", icon: "💳", desc: "Debit/Credit Card" },
          { value: "netbanking", label: "Net Banking", icon: "🏦", desc: "Online Banking" },
          { value: "wallet", label: "Wallet", icon: "👛", desc: "Digital Wallets" }
        ],
        upi: {
          label: "UPI ID",
          placeholder: "yourname@upi",
          helpText: "Enter your UPI ID (e.g., 9876543210@paytm, name@oksbi)"
        },
        card: {
          cardNumber: {
            label: "Card Number",
            placeholder: "1234 5678 9012 3456"
          },
          cardName: {
            label: "Cardholder Name",
            placeholder: "Name on card"
          },
          expiry: {
            label: "Expiry Date",
            placeholder: "MM/YY"
          },
          cvv: {
            label: "CVV",
            placeholder: "123"
          }
        },
        netbanking: {
          label: "Select Bank",
          placeholder: "Choose your bank",
          helpText: "You will be redirected to your bank's secure login page",
          banks: [
            { value: "sbi", label: "State Bank of India" },
            { value: "hdfc", label: "HDFC Bank" },
            { value: "icici", label: "ICICI Bank" },
            { value: "axis", label: "Axis Bank" },
            { value: "pnb", label: "Punjab National Bank" },
            { value: "kotak", label: "Kotak Mahindra Bank" },
            { value: "bob", label: "Bank of Baroda" },
            { value: "canara", label: "Canara Bank" },
            { value: "union", label: "Union Bank" },
            { value: "idbi", label: "IDBI Bank" },
            { value: "other", label: "Other" }
          ]
        },
        wallet: {
          label: "Select Wallet",
          mobileLabel: "Mobile Number",
          mobilePlaceholder: "+91 98765 43210",
          wallets: [
            { value: "paytm", label: "Paytm" },
            { value: "phonepe", label: "PhonePe" },
            { value: "googlepay", label: "Google Pay" }
          ]
        }
      }
    },
    preferences: {
      anonymous: "Make my donation anonymous",
      updates: "Send me updates about our work",
      taxReceipt: "I need 80G tax receipt"
    },
    terms: {
      termsLabel: "I agree to the Terms & Conditions",
      refundLabel: "I have read the Refund Policy"
    },
    submitButton: "Donate",
    securityNote: "Secure Payment • 80G Receipt • No Fees",
    policyLink: "View Refund & Cancellation Policy",
    tribute: {
      messageLabel: "Message"
    }
  },

  // Success Page
  success: {
    title: "Thank You for Your Generosity",
    message: "Your donation of {amount} has been received.",
    receiptNote: "An 80G tax exemption receipt will be sent to your email within 24 hours.",
    anotherDonationButton: "Make another donation",
    fallbackAmount: "your amount"
  },

  // Validation Messages
  validation: {
    minAmount: "Please select or enter a donation amount (minimum ₹100)",
    requiredFields: "Please fill in all required fields",
    agreeTerms: "Please agree to the terms and conditions",
    upiRequired: "Please enter your UPI ID",
    cardRequired: "Please fill in all card details",
    bankRequired: "Please select your bank",
    walletRequired: "Please select wallet type and enter mobile number"
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

export default donateConfig;