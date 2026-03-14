import { aboutConfig } from './about.config';
import { iconMap } from './icons.config';

interface AboutValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateAboutConfig(): AboutValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!aboutConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!aboutConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!aboutConfig.hero?.stats?.length) {
    errors.push('Hero stats array is empty or missing');
  }

  // Validate icons exist
  const checkIcon = (iconName: string, section: string) => {
    if (iconName && !iconMap[iconName]) {
      errors.push(`Icon "${iconName}" not found in icons.config.ts (used in ${section})`);
    }
  };

  // Check mission/vision icons
  checkIcon(aboutConfig.missionVision?.mission?.icon, 'mission');
  checkIcon(aboutConfig.missionVision?.vision?.icon, 'vision');

  // Check values icons
  aboutConfig.values?.values?.forEach((value, index) => {
    checkIcon(value.icon, `values[${index}]`);
  });

  // Validate required sections
  const requiredSections: (keyof typeof aboutConfig)[] = [
    'hero', 'missionVision', 'story', 'values', 'team', 'certifications'
  ];

  requiredSections.forEach(section => {
    if (!aboutConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate image paths
  const checkImagePath = (path: string, location: string) => {
    if (path && !path.startsWith('/')) {
      warnings.push(`Image path "${path}" in ${location} should start with "/" for absolute path`);
    }
  };

  // Check hero image
  checkImagePath(aboutConfig.hero?.image, 'hero.image');
  checkImagePath(aboutConfig.story?.image, 'story.image');

  // Validate team members
  if (!aboutConfig.team?.members?.length) {
    warnings.push('Team members array is empty');
  }

  // Validate values
  if (!aboutConfig.values?.values?.length) {
    warnings.push('Values array is empty');
  }

  // Validate certifications
  if (!aboutConfig.certifications?.certifications?.length) {
    warnings.push('Certifications array is empty');
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
export function logAboutValidationResults(): AboutValidationResult {
  const results = validateAboutConfig();
  
  console.log('🔍 About Page Config Validation Results:');
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
    console.log('\n🎉 About page configuration is perfect!');
  }
  
  return results;
}

export default validateAboutConfig;