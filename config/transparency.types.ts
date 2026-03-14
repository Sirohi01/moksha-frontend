// Type definitions for Transparency page configuration

export interface TransparencyHeroConfig {
  badge: string;
  title: string;
  description: string;
  icon: string;
}

export interface TransparencyStatConfig {
  label: string;
  value: string;
}

export interface TransparencyStatsConfig {
  totalCremations: string;
  certificatesIssued: string;
  activeCases: string;
  citiesCovered: string;
}

export interface TransparencyRecordsConfig {
  title: string;
  downloadButton: string;
  tableHeaders: string[];
  statusBadge: string;
  footerText: string;
  tableAriaLabel: string;
  viewCertificateLabel: string;
  showingRecordsText: string;
  certificateIssuedBadge: string;
}

export interface TransparencyReportsConfig {
  title: string;
  description: string;
  downloadButton: string;
  reportMonth: string;
}

export interface TransparencyPageConfig {
  metadata: {
    title: string;
  };
  hero: TransparencyHeroConfig;
  stats: {
    labels: TransparencyStatsConfig;
  };
  records: TransparencyRecordsConfig;
  reports: TransparencyReportsConfig;
}