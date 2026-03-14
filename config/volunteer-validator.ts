import { volunteerConfig } from './volunteer.config';

interface VolunteerValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateVolunteerConfig(): VolunteerValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!volunteerConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!volunteerConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!volunteerConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof volunteerConfig)[] = [
    'hero', 'success', 'whyVolunteer', 'volunteerTypes', 'formHeader', 'sections', 
    'registrationTypes', 'labels', 'placeholders', 'selectOptions', 'validationMessages'
  ];

  requiredSections.forEach(section => {
    if (!volunteerConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate success section
  if (!volunteerConfig.success?.title) {
    errors.push('Success title is missing');
  }
  if (!volunteerConfig.success?.description) {
    errors.push('Success description is missing');
  }

  // Validate whyVolunteer section
  if (!volunteerConfig.whyVolunteer?.length) {
    errors.push('Why volunteer section is empty or missing');
  } else {
    volunteerConfig.whyVolunteer.forEach((item, index) => {
      if (!item.title) {
        errors.push(`Why volunteer item ${index + 1} is missing title`);
      }
      if (!item.desc) {
        errors.push(`Why volunteer item ${index + 1} is missing description`);
      }
      if (!item.icon) {
        warnings.push(`Why volunteer item ${index + 1} is missing icon`);
      }
    });
  }

  // Validate volunteer types
  if (!volunteerConfig.volunteerTypes?.length) {
    errors.push('Volunteer types array is empty or missing');
  } else {
    volunteerConfig.volunteerTypes.forEach((type, index) => {
      if (!type.value) {
        errors.push(`Volunteer type ${index + 1} is missing value`);
      }
      if (!type.label) {
        errors.push(`Volunteer type ${index + 1} is missing label`);
      }
      if (!type.desc) {
        errors.push(`Volunteer type ${index + 1} is missing description`);
      }
      if (!type.icon) {
        warnings.push(`Volunteer type ${index + 1} is missing icon`);
      }
      if (!type.commitment) {
        warnings.push(`Volunteer type ${index + 1} is missing commitment info`);
      }
    });
  }

  // Validate form header
  if (!volunteerConfig.formHeader?.title) {
    errors.push('Form header title is missing');
  }
  if (!volunteerConfig.formHeader?.subtitle) {
    warnings.push('Form header subtitle is missing');
  }

  // Validate sections array
  if (!volunteerConfig.sections?.length) {
    errors.push('Form sections array is empty or missing');
  } else {
    volunteerConfig.sections.forEach((section, index) => {
      if (!section.title) {
        errors.push(`Section ${index + 1} is missing title`);
      }
      if (typeof section.number !== 'number') {
        errors.push(`Section ${index + 1} is missing or has invalid number`);
      }
    });
  }

  // Validate registration types
  if (!volunteerConfig.registrationTypes?.individual?.title) {
    errors.push('Individual registration type title is missing');
  }
  if (!volunteerConfig.registrationTypes?.group?.title) {
    errors.push('Group registration type title is missing');
  }

  // Validate form labels
  const requiredLabels = [
    'selectVolunteerTypes', 'fullName', 'emailAddress', 'phoneNumber', 'dateOfBirth',
    'gender', 'completeAddress', 'city', 'state', 'pinCode', 'currentOccupation',
    'availability', 'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation',
    'whyVolunteer', 'agreeToTerms', 'termsAndConditions', 'termsLink', 'andText', 
    'privacyPolicy', 'privacyLink', 'agreeToBackgroundCheck', 'submitButton', 'asRepresentative'
  ];
  
  requiredLabels.forEach(label => {
    if (!volunteerConfig.labels?.[label as keyof typeof volunteerConfig.labels]) {
      errors.push(`Required label "${label}" is missing`);
    }
  });

  // Validate placeholders
  const requiredPlaceholders = [
    'fullName', 'email', 'phone', 'completeAddress', 'city', 'pinCode',
    'occupation', 'emergencyName', 'emergencyPhone', 'emergencyRelation', 'whyVolunteerPlaceholder'
  ];
  
  requiredPlaceholders.forEach(placeholder => {
    if (!volunteerConfig.placeholders?.[placeholder as keyof typeof volunteerConfig.placeholders]) {
      warnings.push(`Placeholder "${placeholder}" is missing`);
    }
  });

  // Validate select options
  if (!volunteerConfig.selectOptions?.groupTypes?.length) {
    errors.push('Group types options are missing');
  }
  if (!volunteerConfig.selectOptions?.genders?.length) {
    errors.push('Gender options are missing');
  }
  if (!volunteerConfig.selectOptions?.experienceLevels?.length) {
    errors.push('Experience level options are missing');
  }
  if (!volunteerConfig.selectOptions?.availabilityOptions?.length) {
    errors.push('Availability options are missing');
  }
  if (!volunteerConfig.selectOptions?.states?.length) {
    errors.push('States list is missing');
  }

  // Validate select option structure
  const validateSelectOptions = (options: any[], optionType: string) => {
    options?.forEach((option, index) => {
      if (!option.value && option.value !== '') {
        errors.push(`${optionType} option ${index + 1} is missing value`);
      }
      if (!option.label) {
        errors.push(`${optionType} option ${index + 1} is missing label`);
      }
    });
  };

  validateSelectOptions(volunteerConfig.selectOptions?.groupTypes || [], 'Group type');
  validateSelectOptions(volunteerConfig.selectOptions?.genders || [], 'Gender');
  validateSelectOptions(volunteerConfig.selectOptions?.experienceLevels || [], 'Experience level');
  validateSelectOptions(volunteerConfig.selectOptions?.availabilityOptions || [], 'Availability');

  // Validate validation messages
  if (!volunteerConfig.validationMessages?.fillRequiredFields) {
    errors.push('Validation message for required fields is missing');
  }
  if (!volunteerConfig.validationMessages?.selectVolunteerType) {
    errors.push('Validation message for volunteer type selection is missing');
  }
  if (!volunteerConfig.validationMessages?.submitFailed) {
    errors.push('Validation message for submit failure is missing');
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
export function logVolunteerValidationResults(): VolunteerValidationResult {
  const results = validateVolunteerConfig();
  
  console.log('🔍 Volunteer Page Config Validation Results:');
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
    console.log('\n🎉 Volunteer page configuration is perfect!');
  }
  
  return results;
}

export default validateVolunteerConfig;