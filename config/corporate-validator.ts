import { corporateConfig } from './corporate.config';

interface CorporateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateCorporateConfig(): CorporateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!corporateConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!corporateConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!corporateConfig.hero?.subtitle) {
    errors.push('Hero subtitle is missing');
  }
  if (!corporateConfig.hero?.partnersText) {
    errors.push('Hero partners text is missing');
  }
  if (!corporateConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof corporateConfig)[] = [
    'hero', 'models', 'trust', 'buttons'
  ];

  requiredSections.forEach(section => {
    if (!corporateConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate models section
  if (!corporateConfig.models?.length) {
    errors.push('Models array is empty or missing');
  } else {
    corporateConfig.models.forEach((model, index) => {
      if (!model.title) {
        errors.push(`Model ${index + 1} is missing title`);
      }
      if (!model.desc) {
        errors.push(`Model ${index + 1} is missing description`);
      }
      if (!model.icon) {
        warnings.push(`Model ${index + 1} is missing icon`);
      }
    });
  }

  // Validate trust section
  if (!corporateConfig.trust?.title) {
    errors.push('Trust section title is missing');
  }
  if (!corporateConfig.trust?.subtitle) {
    errors.push('Trust section subtitle is missing');
  }
  if (!corporateConfig.trust?.forCSRText) {
    errors.push('Trust section CSR text is missing');
  }
  if (!corporateConfig.trust?.description) {
    errors.push('Trust section description is missing');
  }
  if (!corporateConfig.trust?.icon) {
    warnings.push('Trust section icon is missing');
  }
  if (!corporateConfig.trust?.imageUrl) {
    warnings.push('Trust section image URL is missing');
  }
  if (!corporateConfig.trust?.imageAlt) {
    warnings.push('Trust section image alt text is missing');
  }

  // Validate certifications
  if (!corporateConfig.trust?.certifications?.taxExemption?.value) {
    errors.push('Tax exemption value is missing');
  }
  if (!corporateConfig.trust?.certifications?.taxExemption?.label) {
    errors.push('Tax exemption label is missing');
  }
  if (!corporateConfig.trust?.certifications?.permanentReg?.value) {
    errors.push('Permanent registration value is missing');
  }
  if (!corporateConfig.trust?.certifications?.permanentReg?.label) {
    errors.push('Permanent registration label is missing');
  }

  // Validate buttons
  if (!corporateConfig.buttons?.getPartnershipDeck) {
    errors.push('Partnership deck button text is missing');
  }
  if (!corporateConfig.buttons?.contactLink) {
    errors.push('Contact link is missing');
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
export function logCorporateValidationResults(): CorporateValidationResult {
  const results = validateCorporateConfig();
  
  console.log('🔍 Corporate Page Config Validation Results:');
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
    console.log('\n🎉 Corporate page configuration is perfect!');
  }
  
  return results;
}

export default validateCorporateConfig;