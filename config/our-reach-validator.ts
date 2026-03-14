import { ourReachConfig } from './our-reach.config';

interface OurReachValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateOurReachConfig(): OurReachValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!ourReachConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!ourReachConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!ourReachConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }

  // Validate regions
  if (!ourReachConfig.regions?.length) {
    errors.push('Regions array is empty or missing');
  }

  // Validate each region
  ourReachConfig.regions?.forEach((region, index) => {
    if (!region.name) {
      errors.push(`Region ${index + 1} is missing name`);
    }
    if (!region.cities?.length) {
      errors.push(`Region ${index + 1} has no cities`);
    }
    if (!region.density) {
      errors.push(`Region ${index + 1} is missing density description`);
    }
    if (!region.stats) {
      errors.push(`Region ${index + 1} is missing stats`);
    }
    
    // Check for reasonable number of cities
    if (region.cities && region.cities.length < 2) {
      warnings.push(`Region ${index + 1} (${region.name}) has only ${region.cities.length} city - consider adding more`);
    }
  });

  // Validate expansion card
  if (!ourReachConfig.expansionCard?.title) {
    errors.push('Expansion card title is missing');
  }
  if (!ourReachConfig.expansionCard?.description) {
    errors.push('Expansion card description is missing');
  }
  if (!ourReachConfig.expansionCard?.buttonText) {
    errors.push('Expansion card button text is missing');
  }

  // Validate network stats
  if (!ourReachConfig.networkStats?.title) {
    errors.push('Network stats title is missing');
  }
  if (!ourReachConfig.networkStats?.stats?.length) {
    errors.push('Network stats array is empty or missing');
  }

  // Validate network stats items
  ourReachConfig.networkStats?.stats?.forEach((stat, index) => {
    if (!stat.number) {
      errors.push(`Network stat ${index + 1} is missing number`);
    }
    if (!stat.label) {
      errors.push(`Network stat ${index + 1} is missing label`);
    }
  });

  // Validate form configuration
  if (!ourReachConfig.form?.title) {
    errors.push('Form title is missing');
  }
  if (!ourReachConfig.form?.description) {
    errors.push('Form description is missing');
  }
  if (!ourReachConfig.form?.successTitle) {
    errors.push('Form success title is missing');
  }
  if (!ourReachConfig.form?.successRequestId) {
    errors.push('Form success request ID text is missing');
  }
  if (!ourReachConfig.form?.states?.length) {
    errors.push('Form states array is empty or missing');
  }

  // Validate states list
  if (ourReachConfig.form?.states && ourReachConfig.form.states.length < 25) {
    warnings.push(`Only ${ourReachConfig.form.states.length} states configured - India has 28 states + 8 UTs`);
  }

  // Validate modal configuration
  if (!ourReachConfig.modal?.regionModalDescription) {
    errors.push('Modal region description is missing');
  }
  if (!ourReachConfig.modal?.expansionButtonText) {
    errors.push('Modal expansion button text is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof ourReachConfig)[] = [
    'hero', 'regions', 'expansionCard', 'networkStats', 'form', 'modal'
  ];

  requiredSections.forEach(section => {
    if (!ourReachConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Check for duplicate region names
  const regionNames = ourReachConfig.regions?.map(r => r.name) || [];
  const duplicateRegions = regionNames.filter((name, index) => regionNames.indexOf(name) !== index);
  if (duplicateRegions.length > 0) {
    errors.push(`Duplicate region names found: ${duplicateRegions.join(', ')}`);
  }

  // Check for duplicate cities across regions
  const allCities = ourReachConfig.regions?.flatMap(r => r.cities) || [];
  const duplicateCities = allCities.filter((city, index) => allCities.indexOf(city) !== index);
  if (duplicateCities.length > 0) {
    warnings.push(`Cities appear in multiple regions: ${duplicateCities.join(', ')}`);
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
export function logOurReachValidationResults(): OurReachValidationResult {
  const results = validateOurReachConfig();
  
  console.log('🔍 Our Reach Page Config Validation Results:');
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
    console.log('\n🎉 Our Reach page configuration is perfect!');
  }
  
  return results;
}

export default validateOurReachConfig;