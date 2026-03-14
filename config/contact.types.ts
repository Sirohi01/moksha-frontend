// Contact Page Type Definitions
// TypeScript interfaces for all contact page configuration

export interface ContactInfo {
  icon: string;
  title: string;
  info: string;
  sub: string;
  href: string;
}

export interface RegionalCoordinator {
  city: string;
  name: string;
  phone: string;
}

export interface SubjectOption {
  value: string;
  label: string;
}

export interface ContactPageConfig {
  // Page Metadata
  metadata: {
    title: string;
  };

  // Hero Section
  hero: {
    badge: string;
    title: string;
    description: string;
  };

  // Contact Information
  contactInfo: ContactInfo[];

  // Regional Coordinators
  regionalCoordinators: {
    title: string;
    coordinators: RegionalCoordinator[];
  };

  // Contact Form
  form: {
    title: string;
    labels: {
      yourName: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
    };
    placeholders: {
      fullName: string;
      email: string;
      phone: string;
      selectSubject: string;
      message: string;
    };
    subjectOptions: SubjectOption[];
    submitButton: string;
    validation: {
      fillRequiredFields: string;
      networkError: string;
      submitError: string;
    };
    success: {
      title: string;
      description: string;
      sendAnotherButton: string;
    };
  };

  // Section Titles
  sections: {
    reachUsDirectly: string;
  };
}

export default ContactPageConfig;