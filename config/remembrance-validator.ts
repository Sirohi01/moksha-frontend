import { remembranceConfig } from './remembrance.config';

interface RemembranceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateRemembranceConfig(): RemembranceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!remembranceConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!remembranceConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!remembranceConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof remembranceConfig)[] = [
    'hero', 'memorialGrid', 'memorialMessage'
  ];

  requiredSections.forEach(section => {
    if (!remembranceConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate memorial grid
  if (!remembranceConfig.memorialGrid?.memorials?.length) {
    errors.push('Memorials array is empty or missing');
  } else {
    remembranceConfig.memorialGrid.memorials.forEach((memorial, index) => {
      if (!memorial.name) {
        errors.push(`Memorial ${index + 1} is missing a name`);
      }
      if (!memorial.tribute) {
        errors.push(`Memorial ${index + 1} is missing a tribute`);
      }
      if (!memorial.date) {
        warnings.push(`Memorial ${index + 1} is missing a date`);
      }
      if (!memorial.city) {
        warnings.push(`Memorial ${index + 1} is missing a city`);
      }
    });
  }

  // Validate search configuration
  if (!remembranceConfig.memorialGrid?.search?.placeholder) {
    errors.push('Search placeholder text is missing');
  }
  if (!remembranceConfig.memorialGrid?.search?.buttonText) {
    errors.push('Search button text is missing');
  }

  // Validate actions
  if (!remembranceConfig.memorialGrid?.actions?.offerFlower) {
    warnings.push('Offer flower action text is missing');
  }
  if (!remembranceConfig.memorialGrid?.actions?.viewCase) {
    warnings.push('View case action text is missing');
  }

  // Validate stats
  if (!remembranceConfig.memorialGrid?.stats?.number) {
    errors.push('Stats number is missing');
  }
  if (!remembranceConfig.memorialGrid?.stats?.description) {
    errors.push('Stats description is missing');
  }
  if (!remembranceConfig.memorialGrid?.stats?.sponsorButton) {
    errors.push('Sponsor button text is missing');
  }

  // Validate memorial message section
  if (!remembranceConfig.memorialMessage?.title) {
    errors.push('Memorial message title is missing');
  }
  if (!remembranceConfig.memorialMessage?.description) {
    errors.push('Memorial message description is missing');
  }

  // Validate memorial message actions
  if (!remembranceConfig.memorialMessage?.actions?.leaveTribute?.text) {
    errors.push('Leave tribute action text is missing');
  }
  if (!remembranceConfig.memorialMessage?.actions?.leaveTribute?.href) {
    warnings.push('Leave tribute action href is missing');
  }
  if (!remembranceConfig.memorialMessage?.actions?.missionStory?.text) {
    errors.push('Mission story action text is missing');
  }
  if (!remembranceConfig.memorialMessage?.actions?.missionStory?.href) {
    warnings.push('Mission story action href is missing');
  }

  // Validate links
  const validateLink = (href: string, location: string) => {
    if (href && !href.startsWith('/') && !href.startsWith('http')) {
      warnings.push(`Link "${href}" in ${location} should be a valid path or URL`);
    }
  };

  validateLink(remembranceConfig.memorialGrid?.stats?.sponsorLink, 'stats.sponsorLink');
  validateLink(remembranceConfig.memorialMessage?.actions?.leaveTribute?.href, 'memorialMessage.actions.leaveTribute.href');
  validateLink(remembranceConfig.memorialMessage?.actions?.missionStory?.href, 'memorialMessage.actions.missionStory.href');

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
export function logRemembranceValidationResults(): RemembranceValidationResult {
  const results = validateRemembranceConfig();
  
  console.log('🔍 Remembrance Page Config Validation Results:');
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
    console.log('\n🎉 Remembrance page configuration is perfect!');
  }
  
  return results;
}

export default validateRemembranceConfig;