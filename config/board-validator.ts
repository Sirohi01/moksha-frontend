// Board Page Configuration Validator
// Helps validate the board page configuration for common issues

import { boardConfig } from './board.config';
import { iconMap } from './icons.config';

interface BoardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    sectionsChecked: number;
  };
}

export function validateBoardConfig(): BoardValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate hero section
  if (!boardConfig.hero?.title) {
    errors.push('Hero title is missing');
  }
  if (!boardConfig.hero?.description) {
    errors.push('Hero description is missing');
  }
  if (!boardConfig.hero?.badge) {
    errors.push('Hero badge is missing');
  }

  // Validate leadership team
  if (!boardConfig.leadership?.length) {
    errors.push('Leadership array is empty or missing');
  }

  // Validate each leadership member
  boardConfig.leadership?.forEach((member, index) => {
    if (!member.name) {
      errors.push(`Leadership member ${index + 1} is missing name`);
    }
    if (!member.role) {
      errors.push(`Leadership member ${index + 1} is missing role`);
    }
    if (!member.desc) {
      errors.push(`Leadership member ${index + 1} is missing description`);
    }
    if (!member.icon) {
      errors.push(`Leadership member ${index + 1} is missing icon`);
    }
    if (!member.id) {
      errors.push(`Leadership member ${index + 1} is missing ID`);
    }

    // Validate icon exists
    if (member.icon && !iconMap[member.icon]) {
      errors.push(`Icon "${member.icon}" not found in icons.config.ts (used by ${member.name})`);
    }

    // Validate ID format
    if (member.id && !member.id.match(/^[a-z0-9-]+$/)) {
      warnings.push(`Member ID "${member.id}" should use lowercase letters, numbers, and hyphens only`);
    }

    // Check description length
    if (member.desc && member.desc.length < 20) {
      warnings.push(`Description for ${member.name} is quite short (${member.desc.length} chars)`);
    }
    if (member.desc && member.desc.length > 200) {
      warnings.push(`Description for ${member.name} is quite long (${member.desc.length} chars)`);
    }
  });

  // Validate join card
  if (!boardConfig.joinCard?.title) {
    errors.push('Join card title is missing');
  }
  if (!boardConfig.joinCard?.description) {
    errors.push('Join card description is missing');
  }
  if (!boardConfig.joinCard?.buttonText) {
    errors.push('Join card button text is missing');
  }
  if (!boardConfig.joinCard?.buttonHref) {
    errors.push('Join card button href is missing');
  }

  // Validate button href format
  if (boardConfig.joinCard?.buttonHref && !boardConfig.joinCard.buttonHref.startsWith('/')) {
    warnings.push(`Join card button href "${boardConfig.joinCard.buttonHref}" should start with "/" for internal links`);
  }

  // Validate stats
  if (!boardConfig.stats?.length) {
    errors.push('Stats array is empty or missing');
  }

  // Validate each stat
  boardConfig.stats?.forEach((stat, index) => {
    if (!stat.number) {
      errors.push(`Stat ${index + 1} is missing number`);
    }
    if (!stat.label) {
      errors.push(`Stat ${index + 1} is missing label`);
    }
  });

  // Validate required sections
  const requiredSections: (keyof typeof boardConfig)[] = [
    'hero', 'leadership', 'joinCard', 'stats', 'labels'
  ];

  requiredSections.forEach(section => {
    if (!boardConfig[section]) {
      errors.push(`Required section "${section}" is missing from config`);
    }
  });

  // Validate labels
  if (!boardConfig.labels?.viewProfile) {
    errors.push('View profile label is missing');
  }

  // Check for duplicate member IDs
  const memberIds = boardConfig.leadership?.map(m => m.id) || [];
  const duplicateIds = memberIds.filter((id, index) => memberIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate member IDs found: ${duplicateIds.join(', ')}`);
  }

  // Check for duplicate member names
  const memberNames = boardConfig.leadership?.map(m => m.name) || [];
  const duplicateNames = memberNames.filter((name, index) => memberNames.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    errors.push(`Duplicate member names found: ${duplicateNames.join(', ')}`);
  }

  // Validate leadership team size
  if (boardConfig.leadership && boardConfig.leadership.length < 3) {
    warnings.push(`Only ${boardConfig.leadership.length} leadership members - consider adding more for credibility`);
  }
  if (boardConfig.leadership && boardConfig.leadership.length > 10) {
    warnings.push(`${boardConfig.leadership.length} leadership members might be too many for effective display`);
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
export function logBoardValidationResults(): BoardValidationResult {
  const results = validateBoardConfig();
  
  console.log('🔍 Board Page Config Validation Results:');
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
    console.log('\n🎉 Board page configuration is perfect!');
  }
  
  return results;
}

export default validateBoardConfig;