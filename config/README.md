# Configuration System Documentation

This directory contains all configuration files for the Moksha Seva website pages. All hardcoded text, images, and content have been moved to these configuration files for easy management and updates.

## Available Page Configurations

### 1. Homepage Configuration ✅
- **Config File**: `homepage.config.ts`
- **Types**: `types.ts`
- **Validator**: `config-validator.ts`
- **Page**: `app/page.tsx`
- **Status**: Complete - All content configurable

### 2. About Us Page Configuration ✅
- **Config File**: `about.config.ts`
- **Types**: `about.types.ts`
- **Validator**: `about-validator.ts`
- **Page**: `app/about/page.tsx`
- **Status**: Complete - All content configurable

### 3. How It Works Page Configuration ✅
- **Config File**: `how-it-works.config.ts`
- **Types**: `how-it-works.types.ts`
- **Validator**: `how-it-works-validator.ts`
- **Page**: `app/how-it-works/page.tsx`
- **Status**: Complete - All content configurable

### 4. Why Moksha Seva Page Configuration ✅
- **Config File**: `why-moksha-seva.config.ts`
- **Types**: `why-moksha-seva.types.ts`
- **Validator**: `why-moksha-seva-validator.ts`
- **Page**: `app/why-moksha-seva/page.tsx`
- **Status**: Complete - All content configurable

### 5. Our Reach Page Configuration ✅
- **Config File**: `our-reach.config.ts`
- **Types**: `our-reach.types.ts`
- **Validator**: `our-reach-validator.ts`
- **Page**: `app/our-reach/page.tsx`
- **Status**: Complete - All content configurable

### 6. Board Page Configuration ✅
- **Config File**: `board.config.ts`
- **Types**: `board.types.ts`
- **Validator**: `board-validator.ts`
- **Page**: `app/board/page.tsx`
- **Status**: Complete - All content configurable

### 7. Services Page Configuration ✅
- **Config File**: `services.config.ts`
- **Types**: `services.types.ts`
- **Validator**: `services-validator.ts`
- **Page**: `app/services/page.tsx`
- **Status**: Complete - All content configurable

### 8. Report Page Configuration ✅
- **Config File**: `report.config.ts`
- **Types**: `report.types.ts`
- **Validator**: `report-validator.ts`
- **Page**: `app/report/page.tsx`
- **Status**: Complete - All content configurable

## Configuration Structure

Each page configuration follows a consistent structure:

```typescript
export const pageConfig: PageConfig = {
  // Page Metadata
  metadata: {
    title: "Page Title"
  },

  // Hero Section
  hero: {
    title: "Main Title",
    description: "Page description",
    // ... other hero properties
  },

  // Content Sections
  // ... various content sections specific to each page

  // Call to Action (if applicable)
  callToAction: {
    title: "CTA Title",
    description: "CTA Description",
    buttons: {
      // ... button configurations
    }
  }
};
```

## Icons Configuration

All icons are managed through `icons.config.ts` which maps string names to Lucide React components:

```typescript
import { Heart, Shield, Users, CheckCircle } from 'lucide-react';

export const iconMap = {
  Heart,
  Shield,
  Users,
  CheckCircle,
  // ... more icons
};

export const getIcon = (iconName: string) => {
  return iconMap[iconName] || Heart; // fallback to Heart icon
};
```

## Validation System

Each page has its own validator that checks for:
- Missing required fields
- Invalid icon references
- Malformed URLs and paths
- Content length requirements
- Duplicate entries
- Type safety

### Running Validations

```typescript
import { logHomepageValidationResults } from './config-validator';
import { logAboutValidationResults } from './about-validator';
import { logHowItWorksValidationResults } from './how-it-works-validator';
import { logWhyMokshaSevaValidationResults } from './why-moksha-seva-validator';
import { logOurReachValidationResults } from './our-reach-validator';

import { logBoardValidationResults } from './board-validator';

import { logServicesValidationResults } from './services-validator';

import { logReportValidationResults } from './report-validator';

// Run individual validations
logHomepageValidationResults();
logAboutValidationResults();
logHowItWorksValidationResults();
logWhyMokshaSevaValidationResults();
logOurReachValidationResults();
logBoardValidationResults();
logServicesValidationResults();
logReportValidationResults();
```

## Page-Specific Features

### Why Moksha Seva Page
- **6 Key Reasons**: Compassionate Care, Trusted Legacy, Community Driven, 24/7 Availability, Recognized Excellence, Complete Compliance
- **Impact Statistics**: 4 key metrics showcasing service reach
- **Dual CTA**: Volunteer and Donate buttons
- **Icon Integration**: Uses Heart, Shield, Users, Clock, Award, CheckCircle icons

### Report Page
- **Comprehensive Form**: 12-section emergency report form for unclaimed bodies
- **Complete Workflow**: Hero, form sections, success page, emergency contact
- **Form Validation**: All required fields, select options, file uploads
- **Document Management**: BPL Card, Aadhaar, NOC, PAN card uploads
- **Icon Integration**: Uses User, MapPin, Clock, FileText, Camera, Upload icons
- **State Management**: All 36 Indian states and UTs in dropdown
- **Emergency Contact**: Configurable 24/7 helpline information

### Services Page
- **6 Main Services**: Cremation, Documentation, Family Support, Body Identification, Training, Government Liaison
- **Eligibility Section**: 5 categories of who can access services with images
- **Service Details**: Each service includes badge, description, and feature list
- **Icon Integration**: Uses Flame, FileText, Users, Camera, BookOpen, Shield, UserCheck, Heart, MapPin icons
- **Image Gallery**: Multiple service images with proper alt text

### Board Page
- **5 Leadership Members**: Managing Trustee, Medical Officer, Sacred Rites Advisor, Operations, Legal Lead
- **Advisory Statistics**: 4 key metrics (Active Advisors, City Heads, Transparency, Field Support)
- **Join Advisory Council**: Call-to-action card for board applications
- **Icon Integration**: Uses Users, ShieldCheck, BarChart3 icons
- **Email Integration**: Direct mailto links for each board member

### Our Reach Page
- **Regional Coverage**: 5 regions (North, South, West, East, Central India)
- **Interactive Elements**: Region modals and expansion request form
- **Form System**: Complete expansion request with validation
- **State Management**: All 33 Indian states and UTs
- **Dynamic Content**: Region-specific descriptions and statistics

## Best Practices

### 1. Content Management
- Keep all text content in config files
- Use descriptive property names
- Group related content into sections
- Maintain consistent naming conventions

### 2. Images
- Use absolute paths starting with `/`
- Store images in the `public` directory
- Provide meaningful alt text for accessibility
- Use appropriate image formats and sizes

### 3. Icons
- Add new icons to `icons.config.ts` first
- Use descriptive icon names
- Provide fallback icons for missing references
- Test icon rendering after adding new ones

### 4. Links and URLs
- Use absolute paths for internal links (`/about`)
- Use full URLs for external links (`https://example.com`)
- Validate all links before deployment
- Use meaningful link text for accessibility

### 5. Type Safety
- Define proper TypeScript interfaces for all configs
- Use strict typing for better development experience
- Export types for reuse across components
- Validate config structure at build time

## Configuration Benefits

1. **Centralized Content Management**: All content in one place per page
2. **Type Safety**: TypeScript ensures configuration integrity
3. **Validation**: Automated checks prevent common errors
4. **Maintainability**: Easy to update content without touching components
5. **Consistency**: Standardized structure across all pages
6. **Developer Experience**: Clear separation of content and presentation logic

## Completed Pages Summary

All 8 main pages now have complete configuration systems:

1. **Homepage** - Hero, services, impact, testimonials, CTA
2. **About Us** - Hero, mission/vision, story, values, team, certifications
3. **How It Works** - Hero, 6-step process, CTA
4. **Why Moksha Seva** - Hero, 6 reasons, impact stats, dual CTA
5. **Our Reach** - Hero, regions, network stats, expansion form, modals
6. **Board** - Hero, leadership team, advisory stats, join council CTA
7. **Services** - Hero, 6 main services, eligibility criteria, service images
8. **Report** - Hero, 12-section emergency form, success page, emergency contact

Each page is fully configurable with zero hardcoded values, complete type safety, and comprehensive validation systems.