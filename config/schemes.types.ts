// Type definitions for Schemes page configuration

export interface SchemesHeroConfig {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface SchemesTabConfig {
  central: string;
  state: string;
}

export interface SchemeConfig {
  title: string;
  authority?: string;
  benefit: string;
  eligibility: string;
  purpose?: string;
  description?: string;
  status?: string;
  icon: string;
  color?: string;
}

export interface StateSchemeConfig {
  state: string;
  schemes: SchemeConfig[];
}

export interface AssistanceTypeConfig {
  type: string;
  amount: string;
}

export interface SchemesFormConfig {
  labels: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    additionalDetails: string;
    selectState: string;
  };
  placeholders: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    message: string;
  };
  validation: {
    fillRequiredFields: string;
  };
  success: {
    title: string;
    description: string;
    closeButton: string;
    submitAnotherButton: string;
  };
  formHeader: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  note: string;
  submitButton: string;
  confidentialityNote: string;
}

export interface SchemesHelpConfig {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  callLabel: string;
  emailLabel: string;
}

export interface SchemesPageConfig {
  metadata: {
    title: string;
  };
  hero: SchemesHeroConfig;
  tabs: SchemesTabConfig;
  centralSchemes: SchemeConfig[];
  stateSchemes: StateSchemeConfig[];
  otherSchemes: SchemeConfig[];
  assistanceTypes: AssistanceTypeConfig[];
  helpSources: string[];
  sections: {
    centralTitle: string;
    stateTitle: string;
    otherAssistanceTitle: string;
    assistanceAmountsTitle: string;
    helpSourcesTitle: string;
    helpSourcesDescription: string;
  };
  buttons: {
    applyForScheme: string;
    applyForAssistance: string;
  };
  tableHeaders: {
    schemeType: string;
    amount: string;
  };
  form: SchemesFormConfig;
  help: SchemesHelpConfig;
  states: string[];
}