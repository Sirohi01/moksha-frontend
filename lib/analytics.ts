// Google Analytics Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formType: string, success: boolean = true) => {
  trackEvent(
    success ? 'form_submit_success' : 'form_submit_error',
    'form_interaction',
    formType
  );
};

// Track donations
export const trackDonation = (amount: number, method: string) => {
  trackEvent('donation', 'engagement', method, amount);

  // Enhanced ecommerce tracking for donations
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `donation_${Date.now()}`,
      value: amount,
      currency: 'INR',
      items: [{
        item_id: 'donation',
        item_name: 'Donation to Moksha Sewa',
        category: 'donation',
        quantity: 1,
        price: amount
      }]
    });
  }
};

// Track volunteer applications
export const trackVolunteerApplication = (skills: string) => {
  trackEvent('volunteer_application', 'engagement', skills);
};

// Track contact form submissions
export const trackContactSubmission = (subject: string) => {
  trackEvent('contact_form', 'engagement', subject);
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', 'engagement', `${fileType}: ${fileName}`);
};

// Track external link clicks
export const trackExternalLink = (url: string) => {
  trackEvent('external_link_click', 'engagement', url);
};

// Track search queries
export const trackSearch = (query: string, results: number) => {
  trackEvent('search', 'engagement', query, results);
};

// Custom event tracking for admin actions
export const trackAdminAction = (action: string, section: string) => {
  trackEvent(`admin_${action}`, 'admin_panel', section);
};

// Performance tracking
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

        if (loadTime > 0) {
          trackEvent('page_load_time', 'performance', window.location.pathname, Math.round(loadTime));
        }
      }, 0);
    });
  }
};

// User engagement tracking
export const trackUserEngagement = () => {
  let startTime = Date.now();
  let isActive = true;

  const trackTimeOnPage = () => {
    if (isActive) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 10) { // Only track if user spent more than 10 seconds
        trackEvent('time_on_page', 'engagement', window.location.pathname, timeSpent);
      }
    }
  };

  // Track when user becomes inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      trackTimeOnPage();
    } else {
      isActive = true;
      startTime = Date.now();
    }
  });

  // Track before page unload
  window.addEventListener('beforeunload', trackTimeOnPage);
};

// Initialize all tracking
export const initializeAnalytics = () => {
  initGA();
  trackPerformance();
  trackUserEngagement();
};