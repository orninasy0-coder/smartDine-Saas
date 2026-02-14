/**
 * Hotjar Session Replay Provider
 * Integration with Hotjar for session recording and heatmaps
 */

import type { UserProperties, SessionReplayEvent } from '../types';

declare global {
  interface Window {
    hj?: (command: string, ...args: unknown[]) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  }
}

export class HotjarProvider {
  private siteId: number;
  private version: number;
  private debug: boolean;
  private isInitialized = false;

  constructor(siteId: number, version = 6, debug = false) {
    this.siteId = siteId;
    this.version = version;
    this.debug = debug;
  }

  /**
   * Initialize Hotjar
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      // Set Hotjar settings
      window._hjSettings = {
        hjid: this.siteId,
        hjsv: this.version,
      };

      // Load Hotjar script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://static.hotjar.com/c/hotjar-${this.siteId}.js?sv=${this.version}`;
      document.head.appendChild(script);

      this.isInitialized = true;

      if (this.debug) {
        console.log('[Hotjar] Initialized with site ID:', this.siteId);
      }
    } catch (error) {
      console.error('[Hotjar] Initialization failed:', error);
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, properties?: UserProperties): void {
    if (!this.isInitialized || !window.hj) {
      return;
    }

    try {
      // Hotjar identify API
      window.hj('identify', userId, properties);

      if (this.debug) {
        console.log('[Hotjar] User identified:', userId, properties);
      }
    } catch (error) {
      console.error('[Hotjar] Identify failed:', error);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: SessionReplayEvent): void {
    if (!this.isInitialized || !window.hj) {
      return;
    }

    try {
      // Hotjar event API
      window.hj('event', event.message);

      if (this.debug) {
        console.log('[Hotjar] Event tracked:', event);
      }
    } catch (error) {
      console.error('[Hotjar] Track event failed:', error);
    }
  }

  /**
   * Tag recording with custom attribute
   */
  tagRecording(tags: string[]): void {
    if (!this.isInitialized || !window.hj) {
      return;
    }

    try {
      tags.forEach((tag) => {
        window.hj?.('tagRecording', [tag]);
      });

      if (this.debug) {
        console.log('[Hotjar] Recording tagged:', tags);
      }
    } catch (error) {
      console.error('[Hotjar] Tag recording failed:', error);
    }
  }

  /**
   * Trigger state change (for SPA navigation)
   */
  stateChange(path: string): void {
    if (!this.isInitialized || !window.hj) {
      return;
    }

    try {
      window.hj('stateChange', path);

      if (this.debug) {
        console.log('[Hotjar] State change:', path);
      }
    } catch (error) {
      console.error('[Hotjar] State change failed:', error);
    }
  }

  /**
   * Start recording (if not already recording)
   */
  startRecording(): void {
    if (!this.isInitialized || !window.hj) {
      return;
    }

    try {
      window.hj('trigger', 'start_recording');

      if (this.debug) {
        console.log('[Hotjar] Recording started');
      }
    } catch (error) {
      console.error('[Hotjar] Start recording failed:', error);
    }
  }

  /**
   * Stop recording
   */
  stopRecording(): void {
    if (!this.isInitialized || !window.hj) {
      return;
    }

    try {
      window.hj('trigger', 'stop_recording');

      if (this.debug) {
        console.log('[Hotjar] Recording stopped');
      }
    } catch (error) {
      console.error('[Hotjar] Stop recording failed:', error);
    }
  }

  /**
   * Check if Hotjar is loaded
   */
  isLoaded(): boolean {
    return this.isInitialized && typeof window.hj === 'function';
  }
}
