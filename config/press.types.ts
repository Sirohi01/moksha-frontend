// Press Page Type Definitions
// TypeScript interfaces for all press page configuration

export interface PressItem {
  source: string;
  date: string;
  title: string;
  type: string;
}

export interface Asset {
  name: string;
  format: string;
  size: string;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface PressPageConfig {
  // Page Metadata
  metadata: {
    title: string;
  };

  // Hero Section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };

  // Press Coverage
  pressCoverage: {
    items: PressItem[];
    readButton: string;
  };

  // Asset Library
  assetLibrary: {
    title: string;
    assets: Asset[];
  };

  // Media Contact
  mediaContact: {
    title: string;
    subtitle: string;
    description: string;
    contacts: ContactInfo[];
  };
}

export default PressPageConfig;