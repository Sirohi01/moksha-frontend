// Transparency Page Configuration
// All text, images, and content for the transparency page

import { TransparencyPageConfig } from './transparency.types';

export const transparencyConfig: TransparencyPageConfig = {
  // Page Metadata
  metadata: {
    title: "Transparency Dashboard"
  },

  // Hero Section
  hero: {
    badge: "✦ Public Record ✦",
    title: "Transparency Dashboard",
    description: "Every cremation performed by Moksha Seva is publicly documented. Search, verify, and download certificates freely.",
    icon: "Shield"
  },

  // Statistics Section
  stats: {
    labels: {
      totalCremations: "Total Cremations",
      certificatesIssued: "Certificates Issued",
      activeCases: "Active Cases",
      citiesCovered: "Cities Covered"
    }
  },

  // Records Section
  records: {
    title: "Cremation Records",
    downloadButton: "Download CSV",
    tableHeaders: [
      "Body ID",
      "Location Found", 
      "Date Found",
      "Cremation Date",
      "Cremation Ground",
      "Officer",
      "Certificate No.",
      "Status"
    ],
    statusBadge: "✓ Issued",
    footerText: "All data is verified and legally certified",
    tableAriaLabel: "Complete cremation records",
    viewCertificateLabel: "View certificate for",
    showingRecordsText: "Showing",
    certificateIssuedBadge: "✓ Certificate Issued"
  },

  // Reports Section
  reports: {
    title: "Monthly Transparency Reports",
    description: "We publish detailed monthly reports including fund utilization, case statistics, and operational updates. All reports are free to download.",
    downloadButton: "Download Latest Report",
    reportMonth: "March 2024"
  }
};

export default transparencyConfig;