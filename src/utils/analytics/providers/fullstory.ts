/**
 * FullStory Session Replay Provider
 * Integration with FullStory for session recording and analytics
 */

import type { UserProperties, SessionReplayEvent } from '../types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FS?: any;
    _fs_host?: string;
    _fs_script?: string;
    _fs_org?: string;
    _fs_namespace?: string;
  }
}

export class FullStoryProvider {
  private orgId: string;
  private debug: boolean;
  private isInitialized = false;

  constructor(orgId: string, debug = false) {
    this.orgId = orgId;
    this.debug = debug;
  }

  /**
   * Initialize FullStory
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      // Set FullStory configuration
      window._fs_host = 'fullstory.com';
      window._fs_script = 'edge.fullstory.com/s/fs.js';
      window._fs_org = this.orgId;
      window._fs_namespace = 'FS';

      // Load FullStory script
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://${window._fs_script}`;
      document.head.appendChild(script);

      this.isInitialized = true;

      if (this.debug) {
        console.log('[FullStory] Initialized with org ID:', this.orgId);
      }
    } catch (error) {
      console.error('[FullStory] Initialization failed:', error);
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, properties?: UserProperties): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      // FullStory identify API
      window.FS.identify(userId, properties);

      if (this.debug) {
        console.log('[FullStory] User identified:', userId, properties);
      }
    } catch (error) {
      console.error('[FullStory] Identify failed:', error);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: SessionReplayEvent): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      // FullStory event API
      window.FS.event(event.message, event.metadata || {});

      if (this.debug) {
        console.log('[FullStory] Event tracked:', event);
      }
    } catch (error) {
      console.error('[FullStory] Track event failed:', error);
    }
  }

  /**
   * Set user properties
   */
  setUserVars(properties: UserProperties): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      window.FS.setUserVars(properties);

      if (this.debug) {
        console.log('[FullStory] User vars set:', properties);
      }
    } catch (error) {
      console.error('[FullStory] Set user vars failed:', error);
    }
  }

  /**
   * Log custom message
   */
  log(level: 'log' | 'info' | 'warn' | 'error', message: string, metadata?: Record<string, unknown>): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      window.FS.log(level, message, metadata);

      if (this.debug) {
        console.log(`[FullStory] Log [${level}]:`, message, metadata);
      }
    } catch (error) {
      console.error('[FullStory] Log failed:', error);
    }
  }

  /**
   * Anonymize user (stop identifying)
   */
  anonymize(): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      window.FS.anonymize();

      if (this.debug) {
        console.log('[FullStory] User anonymized');
      }
    } catch (error) {
      console.error('[FullStory] Anonymize failed:', error);
    }
  }

  /**
   * Restart session recording
   */
  restart(): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      window.FS.restart();

      if (this.debug) {
        console.log('[FullStory] Session restarted');
      }
    } catch (error) {
      console.error('[FullStory] Restart failed:', error);
    }
  }

  /**
   * Shutdown session recording
   */
  shutdown(): void {
    if (!this.isInitialized || !window.FS) {
      return;
    }

    try {
      window.FS.shutdown();

      if (this.debug) {
        console.log('[FullStory] Session shutdown');
      }
    } catch (error) {
      console.error('[FullStory] Shutdown failed:', error);
    }
  }

  /**
   * Get current session URL
   */
  getCurrentSessionURL(now?: boolean): string | null {
    if (!this.isInitialized || !window.FS) {
      return null;
    }

    try {
      return window.FS.getCurrentSessionURL(now);
    } catch (error) {
      console.error('[FullStory] Get session URL failed:', error);
      return null;
    }
  }

  /**
   * Check if FullStory is loaded
   */
  isLoaded(): boolean {
    return this.isInitialized && typeof window.FS !== 'undefined';
  }
}
