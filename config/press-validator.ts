import { pressConfig } from './press.config';

interface PressValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validatePressConfig(): PressValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!pressConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!pressConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!pressConfig.hero?.subtitle) {
    errors.push('Hero subtitle is missing');
  }
  if (!pressConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof pressConfig)[] = [
    'hero', 'pressCoverage', 'assetLibrary', 'mediaContact'
  ];

  requiredSections.forEach(section => {
    if (!pressConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate press coverage
  if (!pressConfig.pressCoverage?.items?.length) {
    errors.push('Press coverage items array is empty or missing');
  } else {
    pressConfig.pressCoverage.items.forEach((item, index) => {
      if (!item.source) {
        errors.push(`Press item ${index + 1} is missing source`);
      }
      if (!item.title) {
        errors.push(`Press item ${index + 1} is missing title`);
      }
      if (!item.date) {
        errors.push(`Press item ${index + 1} is missing date`);
      }
      if (!item.type) {
        errors.push(`Press item ${index + 1} is missing type`);
      }
    });
  }

  if (!pressConfig.pressCoverage?.readButton) {
    errors.push('Press coverage read button text is missing');
  }

  // Validate asset library
  if (!pressConfig.assetLibrary?.title) {
    errors.push('Asset library title is missing');
  }
  if (!pressConfig.assetLibrary?.assets?.length) {
    errors.push('Asset library assets array is empty or missing');
  } else {
    pressConfig.assetLibrary.assets.forEach((asset, index) => {
      if (!asset.name) {
        errors.push(`Asset ${index + 1} is missing name`);
      }
      if (!asset.format) {
        errors.push(`Asset ${index + 1} is missing format`);
      }
      if (!asset.size) {
        errors.push(`Asset ${index + 1} is missing size`);
      }
    });
  }

  // Validate media contact
  if (!pressConfig.mediaContact?.title) {
    errors.push('Media contact title is missing');
  }
  if (!pressConfig.mediaContact?.subtitle) {
    errors.push('Media contact subtitle is missing');
  }
  if (!pressConfig.mediaContact?.description) {
    errors.push('Media contact description is missing');
  }
  if (!pressConfig.mediaContact?.contacts?.length) {
    errors.push('Media contact contacts array is empty or missing');
  } else {
    pressConfig.mediaContact.contacts.forEach((contact, index) => {
      if (!contact.label) {
        errors.push(`Media contact ${index + 1} is missing label`);
      }
      if (!contact.value) {
        errors.push(`Media contact ${index + 1} is missing value`);
      }
      if (!contact.href) {
        errors.push(`Media contact ${index + 1} is missing href`);
      }
      if (!contact.icon) {
        warnings.push(`Media contact ${index + 1} is missing icon`);
      }
    });
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
export function logPressValidationResults(): PressValidationResult {
  const results = validatePressConfig();
  
  console.log('🔍 Press Page Config Validation Results:');
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
    console.log('\n🎉 Press page configuration is perfect!');
  }
  
  return results;
}

export default validatePressConfig;