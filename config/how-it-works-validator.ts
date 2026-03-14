// How It Works Page Configuration Validator
// Helps validate the how it works page configuration for common issues

import { howItWorksConfig } from './how-it-works.config';
import { iconMap } from './icons.config';

interface HowItWorksValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateHowItWorksConfig(): HowItWorksValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!howItWorksConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!howItWorksConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate steps
  if (!howItWorksConfig.steps?.length) {
    errors.push('Steps array is empty or missing');
  }

  // Validate icons exist
  const checkIcon = (iconName: string, section: string) => {
    if (iconName && !iconMap[iconName]) {
      errors.push(`Icon "${iconName}" not found in icons.config.ts (used in ${section})`);
    }
  };

  // Check step icons
  howItWorksConfig.steps?.forEach((step, index) => {
    checkIcon(step.icon, `steps[${index}]`);
    
    // Validate step content
    if (!step.title) {
      errors.push(`Step ${index + 1} is missing title`);
    }
    if (!step.description) {
      errors.push(`Step ${index + 1} is missing description`);
    }
    if (!step.actions?.length) {
      warnings.push(`Step ${index + 1} has no actions defined`);
    }
  });

  // Validate call to action
  if (!howItWorksConfig.callToAction?.title) {
    errors.push('Call to action title is missing');
  }
  if (!howItWorksConfig.callToAction?.buttons?.reportOnline?.href) {
    errors.push('Report online button href is missing');
  }
  if (!howItWorksConfig.callToAction?.buttons?.callButton?.phoneNumber) {
    errors.push('Call button phone number is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof howItWorksConfig)[] = [
    'hero', 'steps', 'callToAction'
  ];

  requiredSections.forEach(section => {
    if (!howItWorksConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate phone number format
  const phoneNumber = howItWorksConfig.callToAction?.buttons?.callButton?.phoneNumber;
  if (phoneNumber && !phoneNumber.startsWith('+')) {
    warnings.push('Phone number should start with country code (+91 for India)');
  }

  // Validate href format
  const reportHref = howItWorksConfig.callToAction?.buttons?.reportOnline?.href;
  if (reportHref && !reportHref.startsWith('/') && !reportHref.startsWith('http')) {
    warnings.push('Report online href should be absolute path or full URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      sectionsChecked: requiredSections.length
    }
  };
}

// Helper function to log validation results
export function logHowItWorksValidationResults(): HowItWorksValidationResult {
  const results = validateHowItWorksConfig();
  
  console.log('🔍 How It Works Page Config Validation Results:');
  console.log(`✅ Valid: ${results.isValid ? 'Yes' : 'No'}`);
  console.log(`❌ Errors: ${results.summary.totalErrors}`);
  console.log(`⚠️  Warnings: ${results.summary.totalWarnings}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (results.isValid && results.warnings.length === 0) {
    console.log('\n🎉 How It Works page configuration is perfect!');
  }
  
  return results;
}

export default validateHowItWorksConfig;