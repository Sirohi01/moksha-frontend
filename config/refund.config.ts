import { LegalPageConfig } from "./types";

export const refundConfig: LegalPageConfig = {
  hero: {
    badge: "FINANCIAL POLICY",
    title: "Refund &",
    subtitle: "Cancellation",
    description: "Complete information about donation refunds, cancellations, and our commitment to absolute transparency.",
    lastUpdated: "March 9, 2026"
  },
  trustIndicators: [
    { icon: "CheckCircle", label: "REFUND WINDOW: 7 DAYS" },
    { icon: "Clock", label: "PROCESSING: 5-7 DAYS" },
    { icon: "Shield", label: "100% TRANSPARENT" }
  ],
  sections: [
    {
      title: "1. Donation Refunds",
      icon: "Shield",
      content: "Moksha Sewa takes the utmost care to process donations as per the instructions given by our donors. However, if a donation has been made erroneously, please contact us within 7 days. Refunds will be considered on a case-by-case basis through our verification process. Once an 80G tax receipt has been issued and the financial year has closed, we may not be able to process a refund due to internal revenue compliance requirements."
    },
    {
      title: "2. Missing 80G Certificates",
      icon: "Clock",
      content: "If you have not received your 80G tax exemption certificate within 48 hours of donation, please contact our support team with your transaction details. We will verify the transaction and reissue the certificate immediately. Please ensure your PAN details provided during donation are accurate."
    },
    {
        title: "3. Mode of Refund",
        icon: "CheckCircle",
        content: "All refunds will be credited back to the original payment source (Credit Card, Debit Card, or Bank Account). The processing time depends on the banking partner and usually takes 5-7 working days after approval."
    }
  ],
  footer: {
    title: "Accounts Department",
    content: "For refund-related queries or financial concerns, please email our financial nodal office. We strive to resolve all queries within 48 business hours.",
    contactEmail: "accounts@mokshasewa.org"
  },
  cta: {
    title: "Honoring Every Contribution",
    description: "Your donation directly supports dignified last rites for unclaimed souls. Together, we ensure no one is forgotten.",
    primaryButton: { text: "Make a Donation", href: "/donate" },
    secondaryButton: { text: "Contact Support", href: "/contact" }
  }
};
