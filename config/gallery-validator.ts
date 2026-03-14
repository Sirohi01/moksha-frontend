import { galleryConfig } from './gallery.config';

interface GalleryValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateGalleryConfig(): GalleryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!galleryConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }
  if (!galleryConfig.hero?.title?.line1) {
    errors.push('Hero title line 1 is missing');
  }
  if (!galleryConfig.hero?.title?.line2) {
    errors.push('Hero title line 2 is missing');
  }
  if (!galleryConfig.hero?.title?.line3) {
    errors.push('Hero title line 3 is missing');
  }
  if (!galleryConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof galleryConfig)[] = [
    'hero', 'gallery'
  ];

  requiredSections.forEach(section => {
    if (!galleryConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate hero stats
  const statsKeys = ['momentsCaptured', 'categories', 'citiesDocumented', 'storiesTold'];
  statsKeys.forEach(key => {
    const stat = galleryConfig.hero?.stats?.[key as keyof typeof galleryConfig.hero.stats];
    if (!stat?.number) {
      errors.push(`Hero stat "${key}" number is missing`);
    }
    if (!stat?.label) {
      errors.push(`Hero stat "${key}" label is missing`);
    }
  });

  // Validate background images
  if (!galleryConfig.hero?.backgroundImages?.length) {
    warnings.push('Hero background images array is empty');
  }

  // Validate gallery categories
  if (!galleryConfig.gallery?.categories?.length) {
    errors.push('Gallery categories array is empty or missing');
  }

  // Validate gallery images
  if (!galleryConfig.gallery?.images?.length) {
    errors.push('Gallery images array is empty or missing');
  } else {
    galleryConfig.gallery.images.forEach((image, index) => {
      if (!image.src) {
        errors.push(`Gallery image ${index + 1} is missing src`);
      }
      if (!image.title) {
        errors.push(`Gallery image ${index + 1} is missing title`);
      }
      if (!image.category) {
        warnings.push(`Gallery image ${index + 1} is missing category`);
      }
      if (!image.location) {
        warnings.push(`Gallery image ${index + 1} is missing location`);
      }
      if (!image.date) {
        warnings.push(`Gallery image ${index + 1} is missing date`);
      }
      if (!image.height || image.height <= 0) {
        warnings.push(`Gallery image ${index + 1} has invalid height`);
      }
    });
  }

  // Validate load more text
  if (!galleryConfig.gallery?.loadMoreText) {
    warnings.push('Gallery load more text is missing');
  }

  // Validate image paths
  const checkImagePath = (path: string, location: string) => {
    if (path && !path.startsWith('/') && !path.startsWith('http')) {
      warnings.push(`Image path "${path}" in ${location} should start with "/" for absolute path or be a valid URL`);
    }
  };

  galleryConfig.hero?.backgroundImages?.forEach((image, index) => {
    checkImagePath(image, `hero.backgroundImages[${index}]`);
  });

  galleryConfig.gallery?.images?.forEach((image, index) => {
    checkImagePath(image.src, `gallery.images[${index}].src`);
  });

  // Validate categories consistency
  const imageCategories = new Set(galleryConfig.gallery?.images?.map(img => img.category) || []);
  const definedCategories = new Set(galleryConfig.gallery?.categories?.filter(cat => cat !== 'All') || []);
  
  imageCategories.forEach(category => {
    if (!definedCategories.has(category)) {
      warnings.push(`Image category "${category}" is not defined in categories list`);
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
export function logGalleryValidationResults(): GalleryValidationResult {
  const results = validateGalleryConfig();
  
  console.log('🔍 Gallery Page Config Validation Results:');
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
    console.log('\n🎉 Gallery page configuration is perfect!');
  }
  
  return results;
}

export default validateGalleryConfig;