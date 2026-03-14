// Layout Configuration Validator
// Validates the layout configuration structure

import { LayoutConfig } from './layout.types';

export function validateLayoutConfig(config: LayoutConfig): boolean {
  try {
    // Validate navbar
    if (!config.navbar?.logo?.src || !config.navbar?.logo?.alt) {
      console.error('Layout config: navbar.logo is incomplete');
      return false;
    }

    if (!Array.isArray(config.navbar?.navigation) || config.navbar.navigation.length === 0) {
      console.error('Layout config: navbar.navigation must be a non-empty array');
      return false;
    }

    // Validate navigation links
    for (const link of config.navbar.navigation) {
      if (!link.label || !link.icon) {
        console.error('Layout config: navigation link is incomplete', link);
        return false;
      }
      
      if (link.subLinks) {
        for (const subLink of link.subLinks) {
          if (!subLink.href || !subLink.label || !subLink.icon) {
            console.error('Layout config: navigation sublink is incomplete', subLink);
            return false;
          }
        }
      }
    }

    // Validate footer
    if (!config.footer?.brand?.title || !config.footer?.brand?.description) {
      console.error('Layout config: footer.brand is incomplete');
      return false;
    }

    if (!config.footer?.contact?.phone?.number || !config.footer?.contact?.email?.address) {
      console.error('Layout config: footer.contact is incomplete');
      return false;
    }

    if (!config.footer?.links || Object.keys(config.footer.links).length === 0) {
      console.error('Layout config: footer.links must be a non-empty object');
      return false;
    }

    // Validate footer links
    for (const [category, links] of Object.entries(config.footer.links)) {
      if (!Array.isArray(links) || links.length === 0) {
        console.error(`Layout config: footer.links.${category} must be a non-empty array`);
        return false;
      }
      
      for (const link of links) {
        if (!link.label || !link.href) {
          console.error(`Layout config: footer link in ${category} is incomplete`, link);
          return false;
        }
      }
    }

    // Validate social floating
    if (!config.socialFloating?.gallery?.href || !config.socialFloating?.gallery?.label) {
      console.error('Layout config: socialFloating.gallery is incomplete');
      return false;
    }

    if (!Array.isArray(config.socialFloating?.socialLinks) || config.socialFloating.socialLinks.length === 0) {
      console.error('Layout config: socialFloating.socialLinks must be a non-empty array');
      return false;
    }

    // Validate social links
    for (const social of config.socialFloating.socialLinks) {
      if (!social.name || !social.icon || !social.url || !social.color) {
        console.error('Layout config: social link is incomplete', social);
        return false;
      }
    }

    console.log('✅ Layout configuration validation passed');
    return true;

  } catch (error) {
    console.error('Layout config validation error:', error);
    return false;
  }
}

// Validate configuration on import
import { layoutConfig } from './layout.config';
validateLayoutConfig(layoutConfig);

export default validateLayoutConfig;