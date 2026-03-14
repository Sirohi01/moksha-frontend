import { testimonialsConfig } from './testimonials.config';

interface TestimonialsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateTestimonialsConfig(): TestimonialsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!testimonialsConfig.hero?.highlightText) {
    errors.push('Hero highlight text is missing');
  }
  if (!testimonialsConfig.hero?.description) {
    errors.push('Hero description is missing');
  }

  // Validate required sections
  const requiredSections: (keyof typeof testimonialsConfig)[] = [
    'hero', 'stats', 'testimonialsGrid', 'videoTestimonials', 'callToAction'
  ];

  requiredSections.forEach(section => {
    if (!testimonialsConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate stats
  if (!testimonialsConfig.stats?.length) {
    errors.push('Stats array is empty or missing');
  } else {
    testimonialsConfig.stats.forEach((stat, index) => {
      if (!stat.number) {
        errors.push(`Stat ${index + 1} is missing a number`);
      }
      if (!stat.label) {
        errors.push(`Stat ${index + 1} is missing a label`);
      }
    });
  }

  // Validate testimonials grid
  if (!testimonialsConfig.testimonialsGrid?.title) {
    errors.push('Testimonials grid title is missing');
  }
  if (!testimonialsConfig.testimonialsGrid?.testimonials?.length) {
    errors.push('Testimonials array is empty or missing');
  } else {
    testimonialsConfig.testimonialsGrid.testimonials.forEach((testimonial, index) => {
      if (!testimonial.name) {
        errors.push(`Testimonial ${index + 1} is missing a name`);
      }
      if (!testimonial.quote) {
        errors.push(`Testimonial ${index + 1} is missing a quote`);
      }
      if (!testimonial.role) {
        warnings.push(`Testimonial ${index + 1} is missing a role`);
      }
      if (!testimonial.location) {
        warnings.push(`Testimonial ${index + 1} is missing a location`);
      }
      if (!testimonial.image) {
        warnings.push(`Testimonial ${index + 1} is missing an image`);
      }
      if (testimonial.rating < 1 || testimonial.rating > 5) {
        warnings.push(`Testimonial ${index + 1} has invalid rating (should be 1-5)`);
      }
    });
  }

  // Validate video testimonials
  if (!testimonialsConfig.videoTestimonials?.title) {
    errors.push('Video testimonials title is missing');
  }
  if (!testimonialsConfig.videoTestimonials?.description) {
    warnings.push('Video testimonials description is missing');
  }
  if (!testimonialsConfig.videoTestimonials?.videos?.length) {
    warnings.push('Video testimonials array is empty or missing');
  } else {
    testimonialsConfig.videoTestimonials.videos.forEach((video, index) => {
      if (!video.title) {
        warnings.push(`Video ${index + 1} is missing a title`);
      }
      if (!video.thumbnail) {
        warnings.push(`Video ${index + 1} is missing a thumbnail`);
      }
      if (!video.duration) {
        warnings.push(`Video ${index + 1} is missing duration`);
      }
    });
  }

  // Validate call to action
  if (!testimonialsConfig.callToAction?.title) {
    errors.push('Call to action title is missing');
  }
  if (!testimonialsConfig.callToAction?.description) {
    errors.push('Call to action description is missing');
  }
  if (!testimonialsConfig.callToAction?.actions?.shareStory?.text) {
    errors.push('Share story action text is missing');
  }
  if (!testimonialsConfig.callToAction?.actions?.shareStory?.href) {
    warnings.push('Share story action href is missing');
  }
  if (!testimonialsConfig.callToAction?.actions?.joinMission?.text) {
    errors.push('Join mission action text is missing');
  }
  if (!testimonialsConfig.callToAction?.actions?.joinMission?.href) {
    warnings.push('Join mission action href is missing');
  }

  // Validate image paths
  const checkImagePath = (path: string, location: string) => {
    if (path && !path.startsWith('/') && !path.startsWith('http')) {
      warnings.push(`Image path "${path}" in ${location} should start with "/" for absolute path or be a valid URL`);
    }
  };

  testimonialsConfig.testimonialsGrid?.testimonials?.forEach((testimonial, index) => {
    checkImagePath(testimonial.image, `testimonials[${index}].image`);
  });

  testimonialsConfig.videoTestimonials?.videos?.forEach((video, index) => {
    checkImagePath(video.thumbnail, `videos[${index}].thumbnail`);
  });

  // Validate links
  const validateLink = (href: string, location: string) => {
    if (href && !href.startsWith('/') && !href.startsWith('http')) {
      warnings.push(`Link "${href}" in ${location} should be a valid path or URL`);
    }
  };

  validateLink(testimonialsConfig.callToAction?.actions?.shareStory?.href, 'callToAction.actions.shareStory.href');
  validateLink(testimonialsConfig.callToAction?.actions?.joinMission?.href, 'callToAction.actions.joinMission.href');

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
export function logTestimonialsValidationResults(): TestimonialsValidationResult {
  const results = validateTestimonialsConfig();
  
  console.log('🔍 Testimonials Page Config Validation Results:');
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
    console.log('\n🎉 Testimonials page configuration is perfect!');
  }
  
  return results;
}

export default validateTestimonialsConfig;