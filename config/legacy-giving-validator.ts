import { legacyGivingConfig } from './legacy-giving.config';

interface LegacyGivingValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateLegacyGivingConfig(): LegacyGivingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!legacyGivingConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!legacyGivingConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!legacyGivingConfig.hero?.subtitle) {
    errors.push('Hero subtitle is missing');
  }
  if (!legacyGivingConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof legacyGivingConfig)[] = [
    'hero', 'options', 'message', 'buttons'
  ];

  requiredSections.forEach(section => {
    if (!legacyGivingConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate options section
  if (!legacyGivingConfig.options?.length) {
    errors.push('Options array is empty or missing');
  } else {
    legacyGivingConfig.options.forEach((option, index) => {
      if (!option.title) {
        errors.push(`Option ${index + 1} is missing title`);
      }
      if (!option.desc) {
        errors.push(`Option ${index + 1} is missing description`);
      }
      if (!option.icon) {
        warnings.push(`Option ${index + 1} is missing icon`);
      }
    });
  }

  // Validate message section
  if (!legacyGivingConfig.message?.title) {
    errors.push('Message section title is missing');
  }
  if (!legacyGivingConfig.message?.subtitle) {
    errors.push('Message section subtitle is missing');
  }
  if (!legacyGivingConfig.message?.subtitleHighlight) {
    errors.push('Message section subtitle highlight is missing');
  }
  if (!legacyGivingConfig.message?.description) {
    errors.push('Message section description is missing');
  }
  if (!legacyGivingConfig.message?.icon) {
    warnings.push('Message section icon is missing');
  }

  // Validate message buttons
  if (!legacyGivingConfig.message?.buttons?.talkToFounder) {
    errors.push('Talk to founder button text is missing');
  }
  if (!legacyGivingConfig.message?.buttons?.talkToFounderLink) {
    errors.push('Talk to founder button link is missing');
  }
  if (!legacyGivingConfig.message?.buttons?.downloadPDF) {
    errors.push('Download PDF button text is missing');
  }
  if (!legacyGivingConfig.message?.buttons?.downloadPDFLink) {
    errors.push('Download PDF button link is missing');
  }

  // Validate common buttons
  if (!legacyGivingConfig.buttons?.requestInfoPack) {
    errors.push('Request info pack button text is missing');
  }
  if (!legacyGivingConfig.buttons?.requestInfoLink) {
    errors.push('Request info pack button link is missing');
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
export function logLegacyGivingValidationResults(): LegacyGivingValidationResult {
  const results = validateLegacyGivingConfig();
  
  console.log('🔍 Legacy Giving Page Config Validation Results:');
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
    console.log('\n🎉 Legacy Giving page configuration is perfect!');
  }
  
  return results;
}

export default validateLegacyGivingConfig;