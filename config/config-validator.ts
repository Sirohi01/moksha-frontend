// Configuration Validator
// Helps validate the homepage configuration for common issues

import { homepageConfig } from './homepage.config';
import { iconMap } from './icons.config';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateConfig(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!homepageConfig.hero?.slides?.length) {
    errors.push('Hero slides array is empty or missing');
  }

  // Validate icons exist
  const checkIcon = (iconName: string, section: string) => {
    if (iconName && !iconMap[iconName]) {
      errors.push(`Icon "${iconName}" not found in icons.config.ts (used in ${section})`);
    }
  };

  // Check programme icons
  homepageConfig.ourSeva?.programmes?.forEach((prog, index) => {
    checkIcon(prog.icon, `programmes[${index}]`);
  });

  // Check mission pillars icons
  homepageConfig.missionPillars?.pillars?.forEach((pillar, index) => {
    checkIcon(pillar.icon, `missionPillars.pillars[${index}]`);
  });

  // Check timeline icons
  homepageConfig.sacredJourney?.timeline?.forEach((item, index) => {
    checkIcon(item.icon, `sacredJourney.timeline[${index}]`);
  });

  // Validate required sections
  const requiredSections: (keyof typeof homepageConfig)[] = [
    'hero', 'actionBanner', 'about', 'ourSeva', 'whereWeServe',
    'missionPillars', 'storiesInMotion', 'joinMission', 'urgentCampaigns',
    'sacredJourney', 'transparency', 'mediaRecognition', 'testimonials',
    'governmentPartners', 'faq'
  ];

  requiredSections.forEach(section => {
    if (!homepageConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate image paths (basic check)
  const checkImagePath = (path: string, location: string) => {
    if (path && !path.startsWith('/')) {
      warnings.push(`Image path "${path}" in ${location} should start with "/" for absolute path`);
    }
  };

  // Check hero images
  homepageConfig.hero?.slides?.forEach((slide, index) => {
    checkImagePath(slide, `hero.slides[${index}]`);
  });

  // Check programme images
  homepageConfig.ourSeva?.programmes?.forEach((prog, index) => {
    checkImagePath(prog.image, `programmes[${index}].image`);
  });

  // Check campaign images
  homepageConfig.urgentCampaigns?.campaigns?.forEach((campaign, index) => {
    checkImagePath(campaign.image, `campaigns[${index}].image`);
  });

  // Validate URLs/hrefs
  const checkHref = (href: string, location: string) => {
    if (href && !href.startsWith('/') && !href.startsWith('http')) {
      warnings.push(`Link "${href}" in ${location} should be absolute path or full URL`);
    }
  };

  // Check button hrefs
  homepageConfig.actionBanner?.buttons?.forEach((button, index) => {
    checkHref(button.href, `actionBanner.buttons[${index}].href`);
  });

  homepageConfig.about?.buttons?.forEach((button, index) => {
    checkHref(button.href, `about.buttons[${index}].href`);
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
export function logValidationResults(): ValidationResult {
  const results = validateConfig();
  
  console.log('🔍 Homepage Config Validation Results:');
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
    console.log('\n🎉 Configuration is perfect!');
  }
  
  return results;
}

export default validateConfig;