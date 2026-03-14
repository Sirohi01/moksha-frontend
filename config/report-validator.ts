import { reportConfig } from './report.config';
import { iconMap } from './icons.config';

interface ReportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateReportConfig(): ReportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!reportConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!reportConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!reportConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }

  // Validate success section
  if (!reportConfig.success?.title) {
    errors.push('Success title is missing');
  }
  if (!reportConfig.success?.description) {
    errors.push('Success description is missing');
  }
  if (!reportConfig.success?.phoneNumber) {
    errors.push('Success phone number is missing');
  }

  // Validate icons exist
  const checkIcon = (iconName: string, section: string) => {
    if (iconName && !iconMap[iconName]) {
      errors.push(`Icon "${iconName}" not found in icons.config.ts (used in ${section})`);
    }
  };

  // Check section icons
  reportConfig.sections?.forEach((section, index) => {
    if (section.icon) {
      checkIcon(section.icon, `sections[${index}]`);
    }
  });

  // Validate required sections
  const requiredSections: (keyof typeof reportConfig)[] = [
    'hero', 'success', 'sections', 'labels', 'placeholders', 'selectOptions', 'emergency'
  ];

  requiredSections.forEach(section => {
    if (!reportConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate form sections
  if (!reportConfig.sections?.length) {
    errors.push('Form sections array is empty or missing');
  } else {
    reportConfig.sections.forEach((section, index) => {
      if (!section.title) {
        errors.push(`Section ${index + 1} is missing a title`);
      }
      if (!section.number) {
        errors.push(`Section ${index + 1} is missing a number`);
      }
    });
  }

  // Validate select options
  const selectOptionKeys = ['reporterRelation', 'locationType', 'gender', 'bodyCondition'];
  selectOptionKeys.forEach(key => {
    const options = reportConfig.selectOptions?.[key as keyof typeof reportConfig.selectOptions];
    if (!Array.isArray(options) || options.length === 0) {
      errors.push(`Select options for "${key}" are missing or empty`);
    }
  });

  // Validate states array
  if (!reportConfig.selectOptions?.states?.length) {
    errors.push('States array is empty or missing');
  }

  // Validate labels completeness
  const requiredLabels = [
    'reporterName', 'reporterPhone', 'exactLocation', 'dateFound', 'timeFound',
    'gender', 'bodyCondition', 'submitButton', 'agreeToTerms', 'consentToShare'
  ];
  
  requiredLabels.forEach(label => {
    if (!reportConfig.labels?.[label as keyof typeof reportConfig.labels]) {
      errors.push(`Required label "${label}" is missing`);
    }
  });

  // Validate placeholders completeness
  const requiredPlaceholders = [
    'reporterName', 'reporterPhone', 'exactLocation', 'approximateAge'
  ];
  
  requiredPlaceholders.forEach(placeholder => {
    if (!reportConfig.placeholders?.[placeholder as keyof typeof reportConfig.placeholders]) {
      warnings.push(`Placeholder for "${placeholder}" is missing`);
    }
  });

  // Validate emergency contact
  if (!reportConfig.emergency?.phoneNumber) {
    errors.push('Emergency phone number is missing');
  }
  if (!reportConfig.emergency?.title) {
    errors.push('Emergency contact title is missing');
  }

  // Validate document sections
  if (!reportConfig.documentSections?.bplCard) {
    warnings.push('BPL card document section title is missing');
  }
  if (!reportConfig.documentSections?.aadhaarCard) {
    warnings.push('Aadhaar card document section title is missing');
  }

  // Validate upload texts
  if (!reportConfig.uploadTexts?.clickToUpload) {
    warnings.push('Upload text for "click to upload" is missing');
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
export function logReportValidationResults(): ReportValidationResult {
  const results = validateReportConfig();
  
  console.log('🔍 Report Page Config Validation Results:');
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
    console.log('\n🎉 Report page configuration is perfect!');
  }
  
  return results;
}

export default validateReportConfig;