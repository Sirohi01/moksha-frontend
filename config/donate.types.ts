// Donate Page Type Definitions
// TypeScript interfaces for all donate page configuration

export interface DonationTier {
  amount: number;
  label: string;
  desc: string;
  impact: string;
}

export interface ImpactStat {
  value: string;
  label: string;
}

export interface TrustIndicator {
  icon: string;
  text: string;
}

export interface DonationType {
  value: string;
  label: string;
  desc: string;
}

export interface DonationPurpose {
  value: string;
  label: string;
}

export interface PaymentMethod {
  value: string;
  label: string;
  icon: string;
  desc: string;
}

export interface BankOption {
  value: string;
  label: string;
}

export interface WalletOption {
  value: string;
  label: string;
}

export interface DonatePageConfig {
  // Page Metadata
  metadata: {
    title: string;
  };

  // Hero Section
  hero: {
    badge: {
      icon: string;
      text: string;
    };
    title: {
      line1: string;
      line2: string;
      line3: string;
    };
    subtitle: string;
    impactStats: ImpactStat[];
    ctaButtons: {
      primary: string;
      secondary: string;
    };
    trustIndicators: TrustIndicator[];
    startingAmount: string;
    trustMessage: string;
  };

  // Trust Signals
  trustSignals: string[];

  // Donation Tiers
  donationTiers: DonationTier[];

  // Amount Selection
  amountSelection: {
    title: string;
    subtitle: string;
    customAmountLabel: string;
    customAmountPlaceholder: string;
    impactTitle: string;
  };

  // Trust Badges
  trustBadges: {
    title: string;
    badges: TrustIndicator[];
  };

  // Form Configuration
  form: {
    title: string;
    subtitle: string;
    defaultCountry: string;
    sections: {
      personalInfo: {
        title: string;
        stepNumber: number;
        fields: {
          fullName: {
            label: string;
            placeholder: string;
          };
          email: {
            label: string;
            placeholder: string;
          };
          phone: {
            label: string;
            placeholder: string;
          };
        };
      };
      address: {
        title: string;
        stepNumber: number;
        fields: {
          address: {
            label: string;
            placeholder: string;
          };
          city: {
            label: string;
            placeholder: string;
          };
          pincode: {
            label: string;
            placeholder: string;
          };
          state: {
            label: string;
            placeholder: string;
          };
        };
      };
      taxDetails: {
        title: string;
        stepNumber: number;
        fields: {
          panNumber: {
            label: string;
            placeholder: string;
          };
          aadharNumber: {
            label: string;
            placeholder: string;
          };
        };
      };
      preferences: {
        title: string;
        stepNumber: number;
        frequency: {
          label: string;
          types: DonationType[];
        };
        purpose: {
          label: string;
          options: DonationPurpose[];
        };
        tribute: {
          memorialLabel: string;
          honorLabel: string;
          nameLabel: string;
          messagePlaceholder: string;
        };
      };
      payment: {
        title: string;
        stepNumber: number;
        methods: PaymentMethod[];
        upi: {
          label: string;
          placeholder: string;
          helpText: string;
        };
        card: {
          cardNumber: {
            label: string;
            placeholder: string;
          };
          cardName: {
            label: string;
            placeholder: string;
          };
          expiry: {
            label: string;
            placeholder: string;
          };
          cvv: {
            label: string;
            placeholder: string;
          };
        };
        netbanking: {
          label: string;
          placeholder: string;
          helpText: string;
          banks: BankOption[];
        };
        wallet: {
          label: string;
          mobileLabel: string;
          mobilePlaceholder: string;
          wallets: WalletOption[];
        };
      };
    };
    preferences: {
      anonymous: string;
      updates: string;
      taxReceipt: string;
    };
    terms: {
      termsLabel: string;
      refundLabel: string;
    };
    submitButton: string;
    securityNote: string;
    policyLink: string;
    tribute: {
      messageLabel: string;
    };
  };

  // Success Page
  success: {
    title: string;
    message: string;
    receiptNote: string;
    anotherDonationButton: string;
    fallbackAmount: string;
  };

  // Validation Messages
  validation: {
    minAmount: string;
    requiredFields: string;
    agreeTerms: string;
    upiRequired: string;
    cardRequired: string;
    bankRequired: string;
    walletRequired: string;
  };

  // States List
  states: string[];
}

export default DonatePageConfig;