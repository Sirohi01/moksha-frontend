// Donate Page Configuration Validator
// Validates the donate page configuration structure

import { DonatePageConfig } from './donate.types';

export function validateDonateConfig(config: DonatePageConfig): boolean {
  try {
    // Validate metadata
    if (!config.metadata?.title) {
      console.error('Donate config: metadata.title is required');
      return false;
    }

    // Validate hero section
    if (!config.hero?.badge?.icon || !config.hero?.badge?.text) {
      console.error('Donate config: hero.badge is incomplete');
      return false;
    }

    if (!config.hero?.title?.line1 || !config.hero?.title?.line2 || !config.hero?.title?.line3) {
      console.error('Donate config: hero.title lines are incomplete');
      return false;
    }

    if (!config.hero?.subtitle) {
      console.error('Donate config: hero.subtitle is required');
      return false;
    }

    if (!Array.isArray(config.hero?.impactStats) || config.hero.impactStats.length === 0) {
      console.error('Donate config: hero.impactStats must be a non-empty array');
      return false;
    }

    // Validate donation tiers
    if (!Array.isArray(config.donationTiers) || config.donationTiers.length === 0) {
      console.error('Donate config: donationTiers must be a non-empty array');
      return false;
    }

    for (const tier of config.donationTiers) {
      if (!tier.amount || !tier.label || !tier.desc || !tier.impact) {
        console.error('Donate config: donation tier is incomplete', tier);
        return false;
      }
    }

    // Validate form sections
    if (!config.form?.sections?.personalInfo?.fields) {
      console.error('Donate config: form.sections.personalInfo.fields is required');
      return false;
    }

    if (!config.form?.sections?.address?.fields) {
      console.error('Donate config: form.sections.address.fields is required');
      return false;
    }

    if (!config.form?.sections?.preferences?.frequency?.types) {
      console.error('Donate config: form.sections.preferences.frequency.types is required');
      return false;
    }

    if (!config.form?.sections?.payment?.methods) {
      console.error('Donate config: form.sections.payment.methods is required');
      return false;
    }

    // Validate states array
    if (!Array.isArray(config.states) || config.states.length === 0) {
      console.error('Donate config: states must be a non-empty array');
      return false;
    }

    // Validate validation messages
    if (!config.validation?.minAmount || !config.validation?.requiredFields) {
      console.error('Donate config: validation messages are incomplete');
      return false;
    }

    // Validate success page
    if (!config.success?.title || !config.success?.message) {
      console.error('Donate config: success page configuration is incomplete');
      return false;
    }

    console.log('✅ Donate configuration validation passed');
    return true;

  } catch (error) {
    console.error('Donate config validation error:', error);
    return false;
  }
}

// Validate configuration on import
import { donateConfig } from './donate.config';
validateDonateConfig(donateConfig);

export default validateDonateConfig;