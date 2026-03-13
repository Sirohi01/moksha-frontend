// Performance Optimization Utilities

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class PerformanceService {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePerformanceTracking();
    }
  }

  private initializePerformanceTracking() {
    // Track Core Web Vitals
    this.trackLCP(); // Largest Contentful Paint
    this.trackFID(); // First Input Delay
    this.trackCLS(); // Cumulative Layout Shift
    this.trackFCP(); // First Contentful Paint
    this.trackLoadTimes();
  }

  // Track Largest Contentful Paint
  private trackLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP tracking not supported');
    }
  }

  // Track First Input Delay
  private trackFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID tracking not supported');
    }
  }

  // Track Cumulative Layout Shift
  private trackCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cumulativeLayoutShift = clsValue;
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS tracking not supported');
    }
  }

  // Track First Contentful Paint
  private trackFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP tracking not supported');
    }
  }

  // Track page load times
  private trackLoadTimes() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        // Send metrics to analytics
        this.reportMetrics();
      }, 0);
    });
  }

  // Get current performance metrics
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Report metrics to backend/analytics
  private async reportMetrics() {
    try {
      const metricsToReport = {
        ...this.metrics,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Send to backend
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metricsToReport)
      });
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }

  // Image optimization utilities
  static optimizeImage(src: string, width?: number, quality: number = 80): string {
    // If using Cloudinary or similar service
    if (src.includes('cloudinary.com')) {
      let optimized = src;
      
      // Add quality parameter
      optimized = optimized.replace('/upload/', `/upload/q_${quality}/`);
      
      // Add width parameter if specified
      if (width) {
        optimized = optimized.replace('/upload/', `/upload/w_${width}/`);
      }
      
      // Add format optimization
      optimized = optimized.replace('/upload/', '/upload/f_auto/');
      
      return optimized;
    }
    
    return src;
  }

  // Lazy loading utility
  static setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // Preload critical resources
  static preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      { href: '/api/content/hero', as: 'fetch' }
    ];

    criticalResources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Bundle size analyzer
  static analyzeBundleSize() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const jsResources = resources.filter(resource => 
        resource.name.includes('.js') && resource.transferSize
      );
      
      const cssResources = resources.filter(resource => 
        resource.name.includes('.css') && resource.transferSize
      );
      
      const totalJSSize = jsResources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
      const totalCSSSize = cssResources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
      
      console.log('Bundle Analysis:', {
        totalJSSize: `${(totalJSSize / 1024).toFixed(2)} KB`,
        totalCSSSize: `${(totalCSSSize / 1024).toFixed(2)} KB`,
        jsFiles: jsResources.length,
        cssFiles: cssResources.length
      });
    }
  }

  // Memory usage monitoring
  static monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      setInterval(() => {
        const memoryInfo = {
          usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
        };
        
        // Log if memory usage is high
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          console.warn('High memory usage detected:', memoryInfo);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  const performanceService = new PerformanceService();
  
  // Setup additional optimizations
  PerformanceService.setupLazyLoading();
  PerformanceService.preloadCriticalResources();
  PerformanceService.monitorMemoryUsage();
  
  // Analyze bundle size in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      PerformanceService.analyzeBundleSize();
    }, 2000);
  }
  
  return performanceService;
};

export default PerformanceService;