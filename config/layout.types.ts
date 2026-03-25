// Layout Components Type Definitions
// TypeScript interfaces for navbar, footer, and social floating components

export interface NavLink {
  href?: string;
  label: string;
  icon: string;
  subLinks?: SubLink[];
}

export interface SubLink {
  href: string;
  label: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

export interface FooterLinkGroup {
  [category: string]: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface ContactInfo {
  phone: {
    number: string;
    display: string;
  };
  email: {
    address: string;
    display: string;
  };
}

export interface LayoutConfig {
  // Navbar Configuration
  navbar: {
    logo: {
      src: string;
      alt: string;
      title: string;
      subtitle: string;
    };
    navigation: NavLink[];
    actions: {
      search: {
        label: string;
        shortcut: string;
      };
      donate: {
        label: string;
        mobileLabel: string;
      };
    };
    mobile: {
      openLabel: string;
      closeLabel: string;
      moreLabel: string;
    };
  };

  // Footer Configuration
  footer: {
    brand: {
      logo: {
        src: string;
        alt: string;
      };
      title: string;
      subtitle: string;
      description: string;
    };
    emergency: {
      status: string;
      reportLink: {
        text: string;
        href: string;
      };
    };
    contact: ContactInfo;
    links: FooterLinkGroup;
    bottom: {
      missionStatus: string;
      copyright: string;
      legalLinks: FooterLink[];
      socialPlatforms: string[];
    };
  };

  // Social Floating Configuration
  socialFloating: {
    gallery: {
      label: string;
      href: string;
      tooltip: string;
    };
    socialLinks: SocialLink[];
    whatsapp?: string;
  };
}

export default LayoutConfig;