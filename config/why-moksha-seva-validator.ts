// Why Moksha Seva Page Configuration Validator
// Helps validate the why moksha seva page configuration for common issues

import { whyMokshaSevaConfig } from './why-moksha-seva.config';
import { iconMap } from './icons.config';

interface WhyMokshaSevaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateWhyMokshaSevaConfig(): WhyMokshaSevaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!whyMokshaSevaConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!whyMokshaSevaConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!whyMokshaSevaConfig.hero?.stats?.length) {
    errors.push('Hero stats array is empty or missing');
  }

  // Validate reasons
  if (!whyMokshaSevaConfig.reasons?.length) {
    errors.push('Reasons array is empty or missing');
  }

  // Validate icons exist
  const checkIcon = (iconName: string, section: string) => {
    if (iconName && !iconMap[iconName]) {
      errors.push(`Icon "${iconName}" not found in icons.config.ts (used in ${section})`);
    }
  };

  // Check reason icons
  whyMokshaSevaConfig.reasons?.forEach((reason, index) => {
    checkIcon(reason.icon, `reasons[${index}]`);
    
    // Validate reason content
    if (!reason.title) {
      errors.push(`Reason ${index + 1} is missing title`);
    }
    if (!reason.description) {
      errors.push(`Reason ${index + 1} is missing description`);
    }
    if (!reason.color) {
      warnings.push(`Reason ${index + 1} is missing color class`);
    }
  });

  // Validate impact section
  if (!whyMokshaSevaConfig.impact?.title) {
    errors.push('Impact section title is missing');
  }
  if (!whyMokshaSevaConfig.impact?.stats?.length) {
    errors.push('Impact stats array is empty or missing');
  }

  // Validate call to action
  if (!whyMokshaSevaConfig.callToAction?.title) {
    errors.push('Call to action title is missing');
  }
  if (!whyMokshaSevaConfig.callToAction?.buttons?.volunteer?.href) {
    errors.push('Volunteer button href is missing');
  }
  if (!whyMokshaSevaConfig.callToAction?.buttons?.donate?.href) {
    errors.push('Donate button href is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof whyMokshaSevaConfig)[] = [
    'hero', 'reasons', 'impact', 'callToAction'
  ];

  requiredSections.forEach(section => {
    if (!whyMokshaSevaConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate image paths
  const checkImagePath = (path: string, location: string) => {
    if (path && !path.startsWith('/')) {
      warnings.push(`Image path "${path}" in ${location} should start with "/" for absolute path`);
    }
  };

  // Check hero image
  checkImagePath(whyMokshaSevaConfig.hero?.image, 'hero.image');

  // Validate href format
  const checkHref = (href: string, location: string) => {
    if (href && !href.startsWith('/') && !href.startsWith('http')) {
      warnings.push(`Link "${href}" in ${location} should be absolute path or full URL`);
    }
  };

  // Check button hrefs
  checkHref(whyMokshaSevaConfig.callToAction?.buttons?.volunteer?.href, 'callToAction.buttons.volunteer.href');
  checkHref(whyMokshaSevaConfig.callToAction?.buttons?.donate?.href, 'callToAction.buttons.donate.href');

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
export function logWhyMokshaSevaValidationResults(): WhyMokshaSevaValidationResult {
  const results = validateWhyMokshaSevaConfig();
  
  console.log('🔍 Why Moksha Seva Page Config Validation Results:');
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
    console.log('\n🎉 Why Moksha Seva page configuration is perfect!');
  }
  
  return results;
}

export default validateWhyMokshaSevaConfig;