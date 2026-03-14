import { tributeConfig } from './tribute.config';

interface TributeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateTributeConfig(): TributeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!tributeConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!tributeConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!tributeConfig.hero?.subtitle) {
    errors.push('Hero subtitle is missing');
  }
  if (!tributeConfig.hero?.titleSuffix) {
    errors.push('Hero title suffix is missing');
  }
  if (!tributeConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof tributeConfig)[] = [
    'hero', 'options', 'quote', 'buttons'
  ];

  requiredSections.forEach(section => {
    if (!tributeConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate options section
  if (!tributeConfig.options?.length) {
    errors.push('Options array is empty or missing');
  } else {
    tributeConfig.options.forEach((option, index) => {
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

  // Validate quote section
  if (!tributeConfig.quote?.title) {
    errors.push('Quote section title is missing');
  }
  if (!tributeConfig.quote?.subtitle) {
    errors.push('Quote section subtitle is missing');
  }
  if (!tributeConfig.quote?.quote) {
    errors.push('Quote text is missing');
  }
  if (!tributeConfig.quote?.icon) {
    warnings.push('Quote section icon is missing');
  }
  if (!tributeConfig.quote?.imageUrl) {
    warnings.push('Quote section image URL is missing');
  }
  if (!tributeConfig.quote?.imageAlt) {
    warnings.push('Quote section image alt text is missing');
  }
  if (!tributeConfig.quote?.buttonText) {
    errors.push('Quote section button text is missing');
  }
  if (!tributeConfig.quote?.buttonLink) {
    errors.push('Quote section button link is missing');
  }

  // Validate buttons
  if (!tributeConfig.buttons?.sponsorTribute) {
    errors.push('Sponsor tribute button text is missing');
  }
  if (!tributeConfig.buttons?.donateLink) {
    errors.push('Donate link is missing');
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
export function logTributeValidationResults(): TributeValidationResult {
  const results = validateTributeConfig();
  
  console.log('🔍 Tribute Page Config Validation Results:');
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
    console.log('\n🎉 Tribute page configuration is perfect!');
  }
  
  return results;
}

export default validateTributeConfig;