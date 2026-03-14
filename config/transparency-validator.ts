import { transparencyConfig } from './transparency.config';

interface TransparencyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateTransparencyConfig(): TransparencyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!transparencyConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!transparencyConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!transparencyConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!transparencyConfig.hero?.icon) {
    warnings.push('Hero icon is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof transparencyConfig)[] = [
    'hero', 'stats', 'records', 'reports'
  ];

  requiredSections.forEach(section => {
    if (!transparencyConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate stats section
  if (!transparencyConfig.stats?.labels?.totalCremations) {
    errors.push('Total cremations label is missing');
  }
  if (!transparencyConfig.stats?.labels?.certificatesIssued) {
    errors.push('Certificates issued label is missing');
  }
  if (!transparencyConfig.stats?.labels?.activeCases) {
    errors.push('Active cases label is missing');
  }
  if (!transparencyConfig.stats?.labels?.citiesCovered) {
    errors.push('Cities covered label is missing');
  }

  // Validate records section
  if (!transparencyConfig.records?.title) {
    errors.push('Records section title is missing');
  }
  if (!transparencyConfig.records?.downloadButton) {
    errors.push('Records download button text is missing');
  }
  if (!transparencyConfig.records?.tableHeaders?.length) {
    errors.push('Records table headers are missing');
  }
  if (!transparencyConfig.records?.statusBadge) {
    errors.push('Records status badge text is missing');
  }
  if (!transparencyConfig.records?.footerText) {
    errors.push('Records footer text is missing');
  }
  if (!transparencyConfig.records?.tableAriaLabel) {
    errors.push('Records table aria label is missing');
  }
  if (!transparencyConfig.records?.viewCertificateLabel) {
    errors.push('Records view certificate label is missing');
  }
  if (!transparencyConfig.records?.showingRecordsText) {
    errors.push('Records showing text is missing');
  }
  if (!transparencyConfig.records?.certificateIssuedBadge) {
    errors.push('Records certificate issued badge is missing');
  }

  // Validate reports section
  if (!transparencyConfig.reports?.title) {
    errors.push('Reports section title is missing');
  }
  if (!transparencyConfig.reports?.description) {
    errors.push('Reports section description is missing');
  }
  if (!transparencyConfig.reports?.downloadButton) {
    errors.push('Reports download button text is missing');
  }
  if (!transparencyConfig.reports?.reportMonth) {
    errors.push('Reports month is missing');
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
export function logTransparencyValidationResults(): TransparencyValidationResult {
  const results = validateTransparencyConfig();
  
  console.log('🔍 Transparency Page Config Validation Results:');
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
    console.log('\n🎉 Transparency page configuration is perfect!');
  }
  
  return results;
}

export default validateTransparencyConfig;