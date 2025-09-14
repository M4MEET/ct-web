'use client';

import { useEffect } from 'react';

interface TrackingEvent {
  event: string;
  properties: {
    [key: string]: any;
  };
}

class MarketingTracker {
  private static instance: MarketingTracker;
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  static getInstance(): MarketingTracker {
    if (!MarketingTracker.instance) {
      MarketingTracker.instance = new MarketingTracker();
    }
    return MarketingTracker.instance;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track page view on initialization
    this.trackPageView();

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.track('page_focus');
      } else {
        this.track('page_blur');
      }
    });

    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        this.track('scroll_depth', { depth: scrollPercent });
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });

    // Track clicks on CTA elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('[data-track-cta]') || target.closest('[data-track-cta]')) {
        const ctaElement = target.matches('[data-track-cta]') ? target : target.closest('[data-track-cta]');
        const ctaName = ctaElement?.getAttribute('data-track-cta') || 'unknown';
        const ctaText = ctaElement?.textContent?.trim() || 'unknown';
        
        this.track('click_cta', {
          ctaName,
          ctaText,
          href: (ctaElement as HTMLAnchorElement)?.href,
        });
      }
    });
  }

  private getUrlParameters(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(key => {
      const value = params.get(key);
      if (value) utmParams[key] = value;
    });

    return utmParams;
  }

  private getDeviceInfo(): Record<string, string> {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad/i.test(userAgent) || (isMobile && window.screen.width >= 768);
    
    return {
      device: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    };
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  async track(event: string, properties: Record<string, any> = {}): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const trackingData: TrackingEvent = {
        event,
        properties: {
          ...properties,
          ...this.getUrlParameters(),
          ...this.getDeviceInfo(),
          page: window.location.pathname,
          title: document.title,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        }
      };

      // Add user and session info
      if (this.userId) trackingData.properties.userId = this.userId;
      trackingData.properties.sessionId = this.sessionId;

      // Send tracking event
      await fetch('/api/marketing/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData),
      });

      // Also send to Google Analytics if enabled
      if (typeof gtag !== 'undefined') {
        gtag('event', event, {
          custom_parameter_1: properties.custom_parameter_1,
          custom_parameter_2: properties.custom_parameter_2,
        });
      }

      // Send to Facebook Pixel if enabled
      if (typeof fbq !== 'undefined') {
        fbq('track', 'CustomEvent', { event_name: event, ...properties });
      }

      console.log('Tracked event:', event, properties);
    } catch (error) {
      console.error('Failed to track event:', event, error);
    }
  }

  trackPageView(): void {
    this.track('page_view');
  }

  trackConversion(conversionType: string, value?: number, currency: string = 'USD'): void {
    this.track('conversion', {
      conversionType,
      value,
      currency,
    });
  }

  trackFormSubmit(formName: string, formData?: Record<string, any>): void {
    this.track('form_submit', {
      formName,
      formData,
    });
  }

  trackDownload(fileName: string, fileType: string): void {
    this.track('download', {
      fileName,
      fileType,
    });
  }

  trackVideoPlay(videoTitle: string, videoId?: string): void {
    this.track('video_play', {
      videoTitle,
      videoId,
    });
  }

  trackSearch(query: string, results?: number): void {
    this.track('search', {
      query,
      results,
    });
  }
}

export default function MarketingTrackerComponent() {
  useEffect(() => {
    // Initialize tracker on mount
    MarketingTracker.getInstance();
  }, []);

  return null; // This component doesn't render anything
}

// Export tracker instance for use in other components
export const tracker = typeof window !== 'undefined' ? MarketingTracker.getInstance() : null;

// Global tracking functions for easy use
export const trackEvent = (event: string, properties: Record<string, any> = {}) => {
  if (tracker) {
    tracker.track(event, properties);
  }
};

export const trackConversion = (conversionType: string, value?: number) => {
  if (tracker) {
    tracker.trackConversion(conversionType, value);
  }
};

export const trackFormSubmit = (formName: string, formData?: Record<string, any>) => {
  if (tracker) {
    tracker.trackFormSubmit(formName, formData);
  }
};

export const setUserId = (userId: string) => {
  if (tracker) {
    tracker.setUserId(userId);
  }
};