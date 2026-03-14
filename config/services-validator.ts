// Services Page Configuration Validator
// Helps validate the services page configuration for common issues

import { servicesConfig } from './services.config';
import { iconMap } from './icons.config';

interface ServicesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateServicesConfig(): ServicesValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!servicesConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!servicesConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!servicesConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }

  // Validate main services
  if (!servicesConfig.mainServices?.length) {
    errors.push('Main services array is empty or missing');
  }

  // Validate each service
  servicesConfig.mainServices?.forEach((service, index) => {
    if (!service.title) {
      errors.push(`Service ${index + 1} is missing title`);
    }
    if (!service.desc) {
      errors.push(`Service ${index + 1} is missing description`);
    }
    if (!service.icon) {
      errors.push(`Service ${index + 1} is missing icon`);
    }
    if (!service.badge) {
      errors.push(`Service ${index + 1} is missing badge`);
    }
    if (!service.includes?.length) {
      errors.push(`Service ${index + 1} has no includes array`);
    }

    // Validate icon exists
    if (service.icon && !iconMap[service.icon]) {
      errors.push(`Icon "${service.icon}" not found in icons.config.ts (used by ${service.title})`);
    }

    // Validate badge variant
    if (service.badgeVariant && !['primary', 'secondary'].includes(service.badgeVariant)) {
      errors.push(`Service ${index + 1} has invalid badge variant: ${service.badgeVariant}`);
    }
  });
  // Validate eligibility section
  if (!servicesConfig.eligibility?.title) {
    errors.push('Eligibility title is missing');
  }
  if (!servicesConfig.eligibility?.description) {
    errors.push('Eligibility description is missing');
  }
  if (!servicesConfig.eligibility?.items?.length) {
    errors.push('Eligibility items array is empty or missing');
  }

  // Validate each eligibility item
  servicesConfig.eligibility?.items?.forEach((item, index) => {
    if (!item.title) {
      errors.push(`Eligibility item ${index + 1} is missing title`);
    }
    if (!item.desc) {
      errors.push(`Eligibility item ${index + 1} is missing description`);
    }
    if (!item.icon) {
      errors.push(`Eligibility item ${index + 1} is missing icon`);
    }
    if (!item.image) {
      errors.push(`Eligibility item ${index + 1} is missing image`);
    }

    // Validate icon exists
    if (item.icon && !iconMap[item.icon]) {
      errors.push(`Icon "${item.icon}" not found in icons.config.ts (used by ${item.title})`);
    }

    // Validate image path
    if (item.image && !item.image.startsWith('/')) {
      warnings.push(`Image path "${item.image}" in ${item.title} should start with "/" for absolute path`);
    }
  });

  // Validate main image
  if (!servicesConfig.eligibility?.mainImage) {
    errors.push('Eligibility main image is missing');
  }
  if (servicesConfig.eligibility?.mainImage && !servicesConfig.eligibility.mainImage.startsWith('/')) {
    warnings.push(`Main image path should start with "/" for absolute path`);
  }

  // Validate required sections
  const requiredSections: (keyof typeof servicesConfig)[] = [
    'hero', 'mainServices', 'eligibility'
  ];

  requiredSections.forEach(section => {
    if (!servicesConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Check for reasonable number of services
  if (servicesConfig.mainServices && servicesConfig.mainServices.length < 3) {
    warnings.push(`Only ${servicesConfig.mainServices.length} main services - consider adding more`);
  }
  if (servicesConfig.mainServices && servicesConfig.mainServices.length > 10) {
    warnings.push(`${servicesConfig.mainServices.length} main services might be too many for effective display`);
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
export function logServicesValidationResults(): ServicesValidationResult {
  const results = validateServicesConfig();
  
  console.log('🔍 Services Page Config Validation Results:');
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
    console.log('\n🎉 Services page configuration is perfect!');
  }
  
  return results;
}

export default validateServicesConfig;