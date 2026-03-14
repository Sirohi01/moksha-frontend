import { contactConfig } from './contact.config';

interface ContactValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateContactConfig(): ContactValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!contactConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!contactConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!contactConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof contactConfig)[] = [
    'hero', 'contactInfo', 'regionalCoordinators', 'form', 'sections'
  ];

  requiredSections.forEach(section => {
    if (!contactConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate contact info
  if (!contactConfig.contactInfo?.length) {
    errors.push('Contact info array is empty or missing');
  } else {
    contactConfig.contactInfo.forEach((info, index) => {
      if (!info.title) {
        errors.push(`Contact info ${index + 1} is missing title`);
      }
      if (!info.info) {
        errors.push(`Contact info ${index + 1} is missing info`);
      }
      if (!info.icon) {
        warnings.push(`Contact info ${index + 1} is missing icon`);
      }
      if (!info.href) {
        warnings.push(`Contact info ${index + 1} is missing href`);
      }
    });
  }

  // Validate regional coordinators
  if (!contactConfig.regionalCoordinators?.title) {
    errors.push('Regional coordinators title is missing');
  }
  if (!contactConfig.regionalCoordinators?.coordinators?.length) {
    warnings.push('Regional coordinators array is empty');
  } else {
    contactConfig.regionalCoordinators.coordinators.forEach((coordinator, index) => {
      if (!coordinator.city) {
        errors.push(`Regional coordinator ${index + 1} is missing city`);
      }
      if (!coordinator.name) {
        errors.push(`Regional coordinator ${index + 1} is missing name`);
      }
      if (!coordinator.phone) {
        errors.push(`Regional coordinator ${index + 1} is missing phone`);
      }
    });
  }

  // Validate form configuration
  if (!contactConfig.form?.title) {
    errors.push('Form title is missing');
  }
  if (!contactConfig.form?.labels?.yourName) {
    errors.push('Form name label is missing');
  }
  if (!contactConfig.form?.labels?.email) {
    errors.push('Form email label is missing');
  }
  if (!contactConfig.form?.labels?.message) {
    errors.push('Form message label is missing');
  }
  if (!contactConfig.form?.submitButton) {
    errors.push('Form submit button text is missing');
  }
  if (!contactConfig.form?.subjectOptions?.length) {
    errors.push('Form subject options are missing');
  }
  if (!contactConfig.form?.success?.title) {
    errors.push('Form success title is missing');
  }
  if (!contactConfig.form?.success?.description) {
    errors.push('Form success description is missing');
  }

  // Validate validation messages
  if (!contactConfig.form?.validation?.fillRequiredFields) {
    errors.push('Form validation message for required fields is missing');
  }
  if (!contactConfig.form?.validation?.networkError) {
    errors.push('Form validation message for network error is missing');
  }

  // Validate sections
  if (!contactConfig.sections?.reachUsDirectly) {
    errors.push('Reach us directly section title is missing');
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
export function logContactValidationResults(): ContactValidationResult {
  const results = validateContactConfig();
  
  console.log('🔍 Contact Page Config Validation Results:');
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
    console.log('\n🎉 Contact page configuration is perfect!');
  }
  
  return results;
}

export default validateContactConfig;