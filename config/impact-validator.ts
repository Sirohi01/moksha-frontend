import { impactConfig } from './impact.config';
import { iconMap } from './icons.config';

interface ImpactValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateImpactConfig(): ImpactValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!impactConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!impactConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!impactConfig.hero?.image) {
    errors.push('Hero image is missing');
  }

  // Validate icons exist
  const checkIcon = (iconName: string, section: string) => {
    if (iconName && !iconMap[iconName]) {
      errors.push(`Icon "${iconName}" not found in icons.config.ts (used in ${section})`);
    }
  };

  // Check impact stats icons
  impactConfig.impactStats?.stats?.forEach((stat, index) => {
    checkIcon(stat.icon, `impactStats.stats[${index}]`);
  });

  // Validate required sections
  const requiredSections: (keyof typeof impactConfig)[] = [
    'hero', 'impactStats', 'growthTimeline', 'testimonials', 'callToAction'
  ];

  requiredSections.forEach(section => {
    if (!impactConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate image paths
  const checkImagePath = (path: string, location: string) => {
    if (path && !path.startsWith('/')) {
      warnings.push(`Image path "${path}" in ${location} should start with "/" for absolute path`);
    }
  };

  // Check hero images
  checkImagePath(impactConfig.hero?.image, 'hero.image');
  checkImagePath(impactConfig.growthTimeline?.image, 'growthTimeline.image');
  checkImagePath(impactConfig.callToAction?.image, 'callToAction.image');

  // Validate impact stats
  if (!impactConfig.impactStats?.stats?.length) {
    errors.push('Impact stats array is empty or missing');
  } else {
    impactConfig.impactStats.stats.forEach((stat, index) => {
      if (!stat.number) {
        errors.push(`Impact stat ${index + 1} is missing a number`);
      }
      if (!stat.label) {
        errors.push(`Impact stat ${index + 1} is missing a label`);
      }
      if (!stat.description) {
        warnings.push(`Impact stat ${index + 1} is missing a description`);
      }
    });
  }

  // Validate growth timeline data
  if (!impactConfig.growthTimeline?.yearlyData?.length) {
    errors.push('Growth timeline yearly data is empty or missing');
  }
  if (!impactConfig.growthTimeline?.highlightedYears?.length) {
    warnings.push('Growth timeline highlighted years is empty');
  }

  // Validate testimonials
  if (!impactConfig.testimonials?.testimonials?.length) {
    warnings.push('Testimonials array is empty');
  } else {
    impactConfig.testimonials.testimonials.forEach((testimonial, index) => {
      if (!testimonial.quote) {
        errors.push(`Testimonial ${index + 1} is missing a quote`);
      }
      if (!testimonial.author) {
        errors.push(`Testimonial ${index + 1} is missing an author`);
      }
    });
  }

  // Validate call to action
  if (!impactConfig.callToAction?.title) {
    errors.push('Call to action title is missing');
  }
  if (!impactConfig.callToAction?.actions?.joinMission?.href) {
    warnings.push('Call to action join mission href is missing');
  }
  if (!impactConfig.callToAction?.actions?.supportWork?.href) {
    warnings.push('Call to action support work href is missing');
  }

  // Validate hero actions
  if (!impactConfig.hero?.actions?.joinMission?.href) {
    warnings.push('Hero join mission href is missing');
  }
  if (!impactConfig.hero?.actions?.supportWork?.href) {
    warnings.push('Hero support work href is missing');
  }

  // Validate key stats
  if (!impactConfig.hero?.keyStats?.livesHonored?.number) {
    errors.push('Hero key stats lives honored number is missing');
  }
  if (!impactConfig.hero?.keyStats?.cities?.number) {
    errors.push('Hero key stats cities number is missing');
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
export function logImpactValidationResults(): ImpactValidationResult {
  const results = validateImpactConfig();
  
  console.log('🔍 Impact Page Config Validation Results:');
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
    console.log('\n🎉 Impact page configuration is perfect!');
  }
  
  return results;
}

export default validateImpactConfig;