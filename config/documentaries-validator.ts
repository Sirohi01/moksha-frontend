import { documentariesConfig } from './documentaries.config';

interface DocumentariesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateDocumentariesConfig(): DocumentariesValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!documentariesConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!documentariesConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!documentariesConfig.hero?.subtitle) {
    errors.push('Hero subtitle is missing');
  }
  if (!documentariesConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof documentariesConfig)[] = [
    'hero', 'films', 'festivalSelections'
  ];

  requiredSections.forEach(section => {
    if (!documentariesConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate films
  if (!documentariesConfig.films?.items?.length) {
    errors.push('Films items array is empty or missing');
  } else {
    documentariesConfig.films.items.forEach((film, index) => {
      if (!film.title) {
        errors.push(`Film ${index + 1} is missing title`);
      }
      if (!film.duration) {
        errors.push(`Film ${index + 1} is missing duration`);
      }
      if (!film.type) {
        errors.push(`Film ${index + 1} is missing type`);
      }
      if (!film.year) {
        errors.push(`Film ${index + 1} is missing year`);
      }
      if (!film.desc) {
        errors.push(`Film ${index + 1} is missing description`);
      }
      if (!film.image) {
        errors.push(`Film ${index + 1} is missing image`);
      }
    });
  }

  if (!documentariesConfig.films?.watchButton) {
    errors.push('Films watch button text is missing');
  }
  if (!documentariesConfig.films?.newBadge) {
    errors.push('Films new badge text is missing');
  }

  // Validate festival selections
  if (!documentariesConfig.festivalSelections?.title) {
    errors.push('Festival selections title is missing');
  }
  if (!documentariesConfig.festivalSelections?.subtitle) {
    errors.push('Festival selections subtitle is missing');
  }
  if (!documentariesConfig.festivalSelections?.description) {
    errors.push('Festival selections description is missing');
  }
  if (!documentariesConfig.festivalSelections?.festivals?.length) {
    errors.push('Festival selections festivals array is empty or missing');
  } else {
    documentariesConfig.festivalSelections.festivals.forEach((festival, index) => {
      if (!festival.name) {
        errors.push(`Festival ${index + 1} is missing name`);
      }
      if (!festival.subtitle) {
        errors.push(`Festival ${index + 1} is missing subtitle`);
      }
      if (!festival.year) {
        errors.push(`Festival ${index + 1} is missing year`);
      }
    });
  }

  if (!documentariesConfig.festivalSelections?.recognitionText) {
    errors.push('Festival selections recognition text is missing');
  }
  if (!documentariesConfig.festivalSelections?.stats?.awards && documentariesConfig.festivalSelections?.stats?.awards !== 0) {
    errors.push('Festival selections awards count is missing');
  }
  if (!documentariesConfig.festivalSelections?.stats?.selections && documentariesConfig.festivalSelections?.stats?.selections !== 0) {
    errors.push('Festival selections selections count is missing');
  }
  if (!documentariesConfig.festivalSelections?.statsLabels?.awards) {
    errors.push('Festival selections awards label is missing');
  }
  if (!documentariesConfig.festivalSelections?.statsLabels?.selections) {
    errors.push('Festival selections selections label is missing');
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
export function logDocumentariesValidationResults(): DocumentariesValidationResult {
  const results = validateDocumentariesConfig();
  
  console.log('🔍 Documentaries Page Config Validation Results:');
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
    console.log('\n🎉 Documentaries page configuration is perfect!');
  }
  
  return results;
}

export default validateDocumentariesConfig;