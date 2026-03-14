import { storiesConfig } from './stories.config';

interface StoriesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateStoriesConfig(): StoriesValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!storiesConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!storiesConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!storiesConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof storiesConfig)[] = [
    'hero', 'storiesGrid', 'newsletter'
  ];

  requiredSections.forEach(section => {
    if (!storiesConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate stories grid
  if (!storiesConfig.storiesGrid?.stories?.length) {
    errors.push('Stories array is empty or missing');
  } else {
    storiesConfig.storiesGrid.stories.forEach((story, index) => {
      if (!story.title) {
        errors.push(`Story ${index + 1} is missing a title`);
      }
      if (!story.description) {
        errors.push(`Story ${index + 1} is missing a description`);
      }
      if (!story.image) {
        errors.push(`Story ${index + 1} is missing an image`);
      }
      if (!story.duration) {
        warnings.push(`Story ${index + 1} is missing duration`);
      }
      if (!story.type) {
        warnings.push(`Story ${index + 1} is missing type`);
      }
    });
  }

  // Validate buttons
  if (!storiesConfig.storiesGrid?.buttons?.watchNow) {
    errors.push('Watch now button text is missing');
  }
  if (!storiesConfig.storiesGrid?.buttons?.favorite) {
    warnings.push('Favorite button text is missing');
  }

  // Validate newsletter section
  if (!storiesConfig.newsletter?.title) {
    errors.push('Newsletter title is missing');
  }
  if (!storiesConfig.newsletter?.description) {
    errors.push('Newsletter description is missing');
  }
  if (!storiesConfig.newsletter?.placeholder) {
    warnings.push('Newsletter placeholder text is missing');
  }
  if (!storiesConfig.newsletter?.buttonText) {
    errors.push('Newsletter button text is missing');
  }

  // Validate image URLs
  storiesConfig.storiesGrid?.stories?.forEach((story, index) => {
    if (story.image && !story.image.startsWith('http') && !story.image.startsWith('/')) {
      warnings.push(`Story ${index + 1} image should be a valid URL or absolute path`);
    }
  });

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
export function logStoriesValidationResults(): StoriesValidationResult {
  const results = validateStoriesConfig();
  
  console.log('🔍 Stories Page Config Validation Results:');
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
    console.log('\n🎉 Stories page configuration is perfect!');
  }
  
  return results;
}

export default validateStoriesConfig;