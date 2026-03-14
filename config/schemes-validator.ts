import { schemesConfig } from './schemes.config';

interface SchemesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateSchemesConfig(): SchemesValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!schemesConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!schemesConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!schemesConfig.hero?.subtitle) {
    errors.push('Hero subtitle is missing');
  }
  if (!schemesConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof schemesConfig)[] = [
    'hero', 'tabs', 'centralSchemes', 'stateSchemes', 'otherSchemes', 
    'assistanceTypes', 'helpSources', 'sections', 'buttons', 'form', 'help'
  ];

  requiredSections.forEach(section => {
    if (!schemesConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate tabs
  if (!schemesConfig.tabs?.central) {
    errors.push('Central tab label is missing');
  }
  if (!schemesConfig.tabs?.state) {
    errors.push('State tab label is missing');
  }

  // Validate central schemes
  if (!schemesConfig.centralSchemes?.length) {
    errors.push('Central schemes array is empty or missing');
  } else {
    schemesConfig.centralSchemes.forEach((scheme, index) => {
      if (!scheme.title) {
        errors.push(`Central scheme ${index + 1} is missing title`);
      }
      if (!scheme.benefit) {
        errors.push(`Central scheme ${index + 1} is missing benefit`);
      }
      if (!scheme.eligibility) {
        errors.push(`Central scheme ${index + 1} is missing eligibility`);
      }
      if (!scheme.icon) {
        warnings.push(`Central scheme ${index + 1} is missing icon`);
      }
    });
  }

  // Validate state schemes
  if (!schemesConfig.stateSchemes?.length) {
    errors.push('State schemes array is empty or missing');
  } else {
    schemesConfig.stateSchemes.forEach((stateData, stateIndex) => {
      if (!stateData.state) {
        errors.push(`State scheme ${stateIndex + 1} is missing state name`);
      }
      if (!stateData.schemes?.length) {
        errors.push(`State scheme ${stateIndex + 1} has no schemes`);
      } else {
        stateData.schemes.forEach((scheme, schemeIndex) => {
          if (!scheme.title) {
            errors.push(`State ${stateData.state} scheme ${schemeIndex + 1} is missing title`);
          }
          if (!scheme.benefit) {
            errors.push(`State ${stateData.state} scheme ${schemeIndex + 1} is missing benefit`);
          }
          if (!scheme.eligibility) {
            errors.push(`State ${stateData.state} scheme ${schemeIndex + 1} is missing eligibility`);
          }
          if (!scheme.icon) {
            warnings.push(`State ${stateData.state} scheme ${schemeIndex + 1} is missing icon`);
          }
        });
      }
    });
  }

  // Validate other schemes
  if (!schemesConfig.otherSchemes?.length) {
    warnings.push('Other schemes array is empty');
  } else {
    schemesConfig.otherSchemes.forEach((scheme, index) => {
      if (!scheme.title) {
        errors.push(`Other scheme ${index + 1} is missing title`);
      }
      if (!scheme.benefit) {
        errors.push(`Other scheme ${index + 1} is missing benefit`);
      }
      if (!scheme.eligibility) {
        errors.push(`Other scheme ${index + 1} is missing eligibility`);
      }
    });
  }

  // Validate assistance types
  if (!schemesConfig.assistanceTypes?.length) {
    errors.push('Assistance types array is empty or missing');
  }

  // Validate help sources
  if (!schemesConfig.helpSources?.length) {
    errors.push('Help sources array is empty or missing');
  }

  // Validate form configuration
  if (!schemesConfig.form?.labels?.fullName) {
    errors.push('Form full name label is missing');
  }
  if (!schemesConfig.form?.labels?.emailAddress) {
    errors.push('Form email label is missing');
  }
  if (!schemesConfig.form?.labels?.phoneNumber) {
    errors.push('Form phone label is missing');
  }
  if (!schemesConfig.form?.success?.title) {
    errors.push('Form success title is missing');
  }
  if (!schemesConfig.form?.success?.description) {
    errors.push('Form success description is missing');
  }

  // Validate help section
  if (!schemesConfig.help?.title) {
    errors.push('Help section title is missing');
  }
  if (!schemesConfig.help?.subtitle) {
    errors.push('Help section subtitle is missing');
  }
  if (!schemesConfig.help?.description) {
    errors.push('Help section description is missing');
  }
  if (!schemesConfig.help?.phone) {
    errors.push('Help section phone is missing');
  }
  if (!schemesConfig.help?.email) {
    errors.push('Help section email is missing');
  }

  // Validate states list
  if (!schemesConfig.states?.length) {
    errors.push('States list is empty or missing');
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
export function logSchemesValidationResults(): SchemesValidationResult {
  const results = validateSchemesConfig();
  
  console.log('🔍 Schemes Page Config Validation Results:');
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
    console.log('\n🎉 Schemes page configuration is perfect!');
  }
  
  return results;
}

export default validateSchemesConfig;