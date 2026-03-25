// Configuration Service
// Handles fetching page configurations from backend API

interface ConfigResponse {
  success: boolean;
  data: {
    pageName: string;
    config: any;
    lastModified: string;
    version: number;
  };
  message?: string;
}

interface ConfigCache {
  [key: string]: {
    config: any;
    timestamp: number;
    version: number;
  };
}

class ConfigService {
  private cache: ConfigCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  /**
   * Get page configuration from backend API
   */
  async getPageConfig(pageName: string): Promise<any> {
    try {
      // Check cache first
      const cached = this.cache[pageName];
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log(`📦 Using cached config for: ${pageName}`);
        return cached.config;
      }

      console.log(`🌐 Fetching config for: ${pageName}`);
      
      const response = await fetch(`${this.API_BASE_URL}/api/page-config/${pageName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control
        cache: 'no-cache'
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`⚠️ Configuration not found for page: ${pageName}`);
          return this.getFallbackConfig(pageName);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ConfigResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch configuration');
      }

      // Cache the configuration
      this.cache[pageName] = {
        config: data.data.config,
        timestamp: Date.now(),
        version: data.data.version
      };

      console.log(`✅ Successfully loaded config for: ${pageName} (v${data.data.version})`);
      return data.data.config;

    } catch (error) {
      console.error(`❌ Error fetching config for ${pageName}:`, error);
      
      // Return cached version if available
      const cached = this.cache[pageName];
      if (cached) {
        console.log(`📦 Using stale cached config for: ${pageName}`);
        return cached.config;
      }

      // Return fallback configuration
      return this.getFallbackConfig(pageName);
    }
  }

  /**
   * Get fallback configuration when backend is unavailable
   */
  private getFallbackConfig(pageName: string): any {
    console.log(`🔄 Using fallback config for: ${pageName}`);
    
    // Import local config files as fallback
    switch (pageName) {
      case 'homepage':
        return this.getHomepageFallback();
      case 'about':
        return this.getAboutFallback();
      case 'donate':
        return this.getDonateFallback();
      case 'compliance':
        return this.getComplianceFallback();
      default:
        return this.getDefaultFallback(pageName);
    }
  }

  private getHomepageFallback() {
    return {
      hero: {
        slides: ["/gallery/image1.png"],
        autoSlideInterval: 5000
      },
      actionBanner: {
        title: "Free Sacred Rites for Unclaimed Souls • Dignity for the Forgotten",
        buttons: [
          { text: "Report a Case", href: "/report", variant: "primary" },
          { text: "Donate Now", href: "/donate", variant: "secondary" }
        ]
      },
      about: {
        badge: "About Moksha Seva",
        title: "Restoring Dignity to the",
        titleHighlight: "Final Journey",
        description: "Moksha Seva is dedicated to ensuring that no soul departs this world without the sacred rites and dignity they deserve.",
        stats: [
          { number: "5000+", label: "Souls Served" },
          { number: "38+", label: "Cities" },
          { number: "24/7", label: "Service" }
        ]
      }
    };
  }

  private getAboutFallback() {
    return {
      hero: {
        title: "About Moksha Seva",
        subtitle: "Restoring dignity to the final journey",
        description: "We are guardians of humanity's final chapter."
      }
    };
  }

  private getDonateFallback() {
    return {
      hero: {
        title: "Support Our Mission",
        subtitle: "Your donation makes a difference",
        description: "Help us provide dignified services to those in need."
      }
    };
  }

  private getComplianceFallback() {
    return {
      hero: {
        badge: "TRUST & ACCOUNTABILITY",
        title: "AUDIT &",
        titleHighlight: "COMPLIANCE",
        description: "Moksha Seva operates with 100% legal compliance and transparency. We are a registered trust with deep accountability to the law and our donors."
      },
      taxExemption: {
        title: "TAX",
        titleHighlight: "EXEMPTION",
        description: "All donations made to Moksha Seva Foundation are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. We provide instant digital receipts for all contributions.",
        registrations: [
          { label: "NGO DARPAN ID", value: "UP/2023/0345678" },
          { label: "CSR REGISTRATION NO", value: "CSR00012345" }
        ],
        points: [
          "Ensures all funds are audited monthly.",
          "Guarantee that mission remains non-profit.",
          "Enables government tracking and safety.",
          "Builds permanent trust with the public."
        ]
      }
    };
  }

  private getDefaultFallback(pageName: string) {
    return {
      title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page`,
      subtitle: "Content loading...",
      description: "Please wait while we load the page content."
    };
  }

  /**
   * Clear cache for a specific page or all pages
   */
  clearCache(pageName?: string) {
    if (pageName) {
      delete this.cache[pageName];
      console.log(`🗑️ Cleared cache for: ${pageName}`);
    } else {
      this.cache = {};
      console.log('🗑️ Cleared all configuration cache');
    }
  }

  /**
   * Preload configurations for multiple pages
   */
  async preloadConfigs(pageNames: string[]) {
    console.log(`🚀 Preloading configs for: ${pageNames.join(', ')}`);
    
    const promises = pageNames.map(pageName => 
      this.getPageConfig(pageName).catch(error => {
        console.warn(`Failed to preload ${pageName}:`, error.message);
        return null;
      })
    );

    await Promise.all(promises);
    console.log('✅ Configuration preloading completed');
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    const status = Object.entries(this.cache).map(([pageName, data]) => ({
      pageName,
      version: data.version,
      age: Date.now() - data.timestamp,
      fresh: Date.now() - data.timestamp < this.CACHE_DURATION
    }));

    return {
      totalCached: Object.keys(this.cache).length,
      pages: status
    };
  }
}

// Export singleton instance
export const configService = new ConfigService();
export default configService;