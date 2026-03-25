'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsAPI } from '@/lib/api';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const eventsRef = useRef<any[]>([]);


  // Initialize Session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('visitor_session_id');
      if (!sid) {
        sid = crypto.randomUUID();
        localStorage.setItem('visitor_session_id', sid);
      }
      sessionIdRef.current = sid;
    }
  }, []);

  // Track Page Views and Time Spent
  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    startTimeRef.current = Date.now();
    eventsRef.current = [];

    const sendTrackingData = (immediateEvents?: any[]) => {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTimeRef.current) / 1000);
      
      const trackingData = {
        sessionId: sessionIdRef.current,
        path: currentPath,
        startTime: new Date(startTimeRef.current),
        endTime: new Date(endTime),
        duration: duration,
        events: immediateEvents || eventsRef.current,
        referer: typeof document !== 'undefined' ? document.referrer : '',
        isNewSession: !localStorage.getItem('returning_visitor')
      };

      if (!localStorage.getItem('returning_visitor')) {
        localStorage.setItem('returning_visitor', 'true');
      }

      // Use a fixed absolute URL for reliability across ports
      const trackUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/analytics/track`;

      // Fire and forget - use sendBeacon for more reliability on exit
      if (typeof navigator !== 'undefined' && navigator.sendBeacon && !immediateEvents) {
        const blob = new Blob([JSON.stringify(trackingData)], { type: 'application/json' });
        navigator.sendBeacon(trackUrl, blob);
      } else {
        analyticsAPI.trackVisitorAction(trackingData).catch(err => console.debug('Tracking silence', err));
      }
    };

    // Send initial page view immediately
    sendTrackingData([{ type: 'page_view', timestamp: new Date(), pageUrl: currentPath }]);

    // Cleanup: Send final data on exit
    return () => {
      sendTrackingData();
    };
  }, [pathname, searchParams]);

  // Track Clicks Globally
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElement = target.closest('button, a, input[type="submit"], input[type="button"]');

      if (clickableElement) {
        const getElementIdentifier = (el: HTMLElement) => {
          // 1. Check for tel/mail links (Emergency)
          const hrefAttribute = el.getAttribute('href');
          if (hrefAttribute?.startsWith('tel:')) return 'Emergency Helpline Dial';
          if (hrefAttribute?.startsWith('mailto:')) return 'Email Contact Trigger';

          // 2. Check for explicit data, aria-label or title
          const label = el.getAttribute('aria-label') || el.getAttribute('title');
          if (label) return label.replace('Follow us on ', '') + ' Click';

          // 3. Check for specific Social Floating patterns
          if (el.classList.contains('bg-[#f4c430]')) return 'Gallery Access';

          // 4. Check for text content
          const text = el.textContent?.trim().substring(0, 50);
          if (text) return text;

          // 5. Check for input values
          if (el instanceof HTMLInputElement && el.value) return el.value;

          // 6. Check for href links
          if (hrefAttribute) {
            try {
              const url = new URL(hrefAttribute, window.location.origin);
              if (url.hostname.includes('facebook')) return 'Facebook Page External';
              if (url.hostname.includes('twitter') || url.hostname.includes('x.com')) return 'Twitter/X Page External';
              if (url.hostname.includes('instagram')) return 'Instagram Page External';
              if (url.hostname.includes('youtube')) return 'YouTube Page External';
              if (url.hostname.includes('linkedin')) return 'LinkedIn Page External';
              return `Nav: ${url.pathname}`;
            } catch (e) {
              return hrefAttribute.substring(0, 50);
            }
          }

          return el.id || el.className?.split(' ')[0] || 'Interactive Element';
        };

        const eventData = {
          type: 'click',
          targetId: clickableElement.id || undefined,
          targetText: getElementIdentifier(clickableElement as HTMLElement),
          targetClass: clickableElement.className,
          timestamp: new Date(),
          pageUrl: window.location.pathname
        };

        eventsRef.current.push(eventData);

        // SEND IMMEDIATELY for true real-time surveillance
        const currentPath = window.location.pathname + window.location.search;
        analyticsAPI.trackVisitorAction({
          sessionId: sessionIdRef.current,
          path: currentPath,
          startTime: new Date(),
          endTime: new Date(),
          duration: 0,
          events: [eventData],
          referer: document.referrer,
          isNewSession: false
        }).catch(() => {});
        
        // Clear queue after immediate send to prevent duplication in the final cleanup report
        eventsRef.current = [];
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return null; // This component doesn't render anything
}
