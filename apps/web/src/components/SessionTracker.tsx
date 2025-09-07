'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function SessionTracker() {
  useEffect(() => {
    // Initialize session tracking
    if (typeof window !== 'undefined') {
      // Generate or get existing session ID
      let sessionId = sessionStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem('session_id', sessionId);
        sessionStorage.setItem('session_start', new Date().toISOString());
      }

      // Track page views
      const currentPath = window.location.pathname;
      const pageViews = JSON.parse(sessionStorage.getItem('page_views') || '[]');
      const currentPageView = {
        path: currentPath,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      };
      
      pageViews.push(currentPageView);
      sessionStorage.setItem('page_views', JSON.stringify(pageViews.slice(-10))); // Keep last 10 page views

      // Track session duration
      const sessionStart = new Date(sessionStorage.getItem('session_start') || new Date().toISOString());
      const sessionDuration = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
      sessionStorage.setItem('session_duration', sessionDuration.toString());

      // Clean up old sessions (optional)
      const sessionAge = Date.now() - sessionStart.getTime();
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
      if (sessionAge > maxSessionAge) {
        sessionStorage.clear();
        // Reinitialize
        const newSessionId = uuidv4();
        sessionStorage.setItem('session_id', newSessionId);
        sessionStorage.setItem('session_start', new Date().toISOString());
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}