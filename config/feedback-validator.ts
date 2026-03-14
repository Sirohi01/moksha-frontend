import { feedbackConfig } from './feedback.config';

interface FeedbackValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateFeedbackConfig(): FeedbackValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!feedbackConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!feedbackConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!feedbackConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!feedbackConfig.hero?.icon) {
    errors.push('Hero icon is missing');
  }

  // Validate form header
  if (!feedbackConfig.formHeader?.title) {
    errors.push('Form header title is missing');
  }
  if (!feedbackConfig.formHeader?.subtitle) {
    warnings.push('Form header subtitle is missing');
  }

  // Validate validation messages
  if (!feedbackConfig.validationMessages?.fillRequiredFields) {
    warnings.push('Validation message for required fields is missing');
  }
  if (!feedbackConfig.validationMessages?.selectRating) {
    warnings.push('Validation message for rating selection is missing');
  }
  if (!feedbackConfig.validationMessages?.submitFailed) {
    warnings.push('Validation message for submit failure is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof feedbackConfig)[] = [
    'hero', 'success', 'alert', 'formHeader', 'sections', 'labels', 'placeholders', 'selectOptions', 'validationMessages', 'contact'
  ];

  requiredSections.forEach(section => {
    if (!feedbackConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate success section
  if (!feedbackConfig.success?.title) {
    errors.push('Success title is missing');
  }
  if (!feedbackConfig.success?.description) {
    errors.push('Success description is missing');
  }
  if (!feedbackConfig.success?.referencePrefix) {
    warnings.push('Success reference prefix is missing');
  }

  // Validate alert section
  if (!feedbackConfig.alert?.title) {
    errors.push('Alert title is missing');
  }
  if (!feedbackConfig.alert?.message) {
    errors.push('Alert message is missing');
  }

  // Validate sections array
  if (!feedbackConfig.sections?.length) {
    errors.push('Form sections array is empty or missing');
  } else {
    feedbackConfig.sections.forEach((section, index) => {
      if (!section.title) {
        errors.push(`Section ${index + 1} is missing title`);
      }
      if (!section.icon) {
        warnings.push(`Section ${index + 1} is missing icon`);
      }
      if (typeof section.number !== 'number') {
        errors.push(`Section ${index + 1} is missing or has invalid number`);
      }
    });
  }

  // Validate form labels
  const requiredLabels = [
    'yourName', 'emailAddress', 'typeOfFeedback', 'subject', 'detailedMessage', 
    'wouldRecommend', 'submitButton'
  ];
  
  requiredLabels.forEach(label => {
    if (!feedbackConfig.labels?.[label as keyof typeof feedbackConfig.labels]) {
      errors.push(`Required label "${label}" is missing`);
    }
  });

  // Validate placeholders
  const requiredPlaceholders = ['fullName', 'email', 'subject', 'detailedMessage'];
  
  requiredPlaceholders.forEach(placeholder => {
    if (!feedbackConfig.placeholders?.[placeholder as keyof typeof feedbackConfig.placeholders]) {
      warnings.push(`Placeholder "${placeholder}" is missing`);
    }
  });

  // Validate select options
  if (!feedbackConfig.selectOptions?.feedbackType?.length) {
    errors.push('Feedback type options are missing');
  }
  if (!feedbackConfig.selectOptions?.serviceUsed?.length) {
    errors.push('Service used options are missing');
  }
  if (!feedbackConfig.selectOptions?.recommendation?.length) {
    errors.push('Recommendation options are missing');
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

  validateSelectOptions(feedbackConfig.selectOptions?.feedbackType || [], 'Feedback type');
  validateSelectOptions(feedbackConfig.selectOptions?.serviceUsed || [], 'Service used');
  validateSelectOptions(feedbackConfig.selectOptions?.recommendation || [], 'Recommendation');

  // Validate rating labels
  const requiredRatingLabels = ['excellent', 'veryGood', 'good', 'fair', 'poor'];
  
  requiredRatingLabels.forEach(label => {
    if (!feedbackConfig.ratingLabels?.[label as keyof typeof feedbackConfig.ratingLabels]) {
      warnings.push(`Rating label "${label}" is missing`);
    }
  });

  // Validate contact information
  if (!feedbackConfig.contact?.title) {
    warnings.push('Contact title is missing');
  }
  if (!feedbackConfig.contact?.phone?.number) {
    errors.push('Contact phone number is missing');
  }
  if (!feedbackConfig.contact?.phone?.display) {
    warnings.push('Contact phone display text is missing');
  }
  if (!feedbackConfig.contact?.email?.address) {
    errors.push('Contact email address is missing');
  }
  if (!feedbackConfig.contact?.email?.display) {
    warnings.push('Contact email display text is missing');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (feedbackConfig.contact?.email?.address && !emailRegex.test(feedbackConfig.contact.email.address)) {
    warnings.push('Contact email address format appears invalid');
  }

  // Validate phone format
  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (feedbackConfig.contact?.phone?.number && !phoneRegex.test(feedbackConfig.contact.phone.number)) {
    warnings.push('Contact phone number format appears invalid');
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
export function logFeedbackValidationResults(): FeedbackValidationResult {
  const results = validateFeedbackConfig();
  
  console.log('🔍 Feedback Page Config Validation Results:');
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
    console.log('\n🎉 Feedback page configuration is perfect!');
  }
  
  return results;
}

export default validateFeedbackConfig;