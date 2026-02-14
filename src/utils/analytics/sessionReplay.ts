/**
 * Session Replay Manager
 * Manages session recording providers (Hotjar/FullStory)
 */

import { HotjarProvider } from './providers/hotjar';
import { FullStoryProvider } from './providers/fullstory';
import type { UserProperties, SessionReplayEvent, AnalyticsConfig } from './types';

export class SessionReplayManager {
  private hotjar?: HotjarProvider;
  private fullstory?: FullStoryProvider;
  private config: AnalyticsConfig['sessionReplay'];
  private isInitialized = false;
  private currentUserId?: string;

  constructor(config?: AnalyticsConfig['sessionReplay']) {
    this.config = config;
  }

  /**
   * Initialize session replay provider
   */
  initialize(): void {
    if (this.isInitialized || !this.config?.enabled) {
      return;
    }

    try {
      // Initialize Hotjar
      if (this.config.provider === 'hotjar' && this.config.hotjar) {
        this.hotjar = new HotjarProvider(
          this.config.hotjar.siteId,
          this.config.hotjar.version,
          false
        );
        this.hotjar.initialize();
      }

      // Initialize FullStory
      if (this.config.provider === 'fullstory' && this.config.fullstory) {
        this.fullstory = new FullStoryProvider(this.config.fullstory.orgId, false);
        this.fullstory.initialize();
      }

      this.isInitialized = true;
      console.log('[SessionReplay] Initialized with provider:', this.config.provider);
    } catch (error) {
      console.error('[SessionReplay] Initialization failed:', error);
    }
  }

  /**
   * Identify user for session replay
   */
  identify(userId: string, properties?: UserProperties): void {
    if (!this.isInitialized) {
      return;
    }

    this.currentUserId = userId;

    this.hotjar?.identify(userId, properties);
    this.fullstory?.identify(userId, properties);
  }

  /**
   * Track custom event in session replay
   */
  trackEvent(event: SessionReplayEvent): void {
    if (!this.isInitialized) {
      return;
    }

    this.hotjar?.trackEvent(event);
    this.fullstory?.trackEvent(event);
  }

  /**
   * Track error in session replay
   */
  trackError(error: Error, metadata?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      return;
    }

    const event: SessionReplayEvent = {
      type: 'error',
      message: error.message,
      metadata: {
        ...metadata,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString(),
      },
    };

    this.trackEvent(event);

    // FullStory specific error logging
    if (this.fullstory?.isLoaded()) {
      this.fullstory.log('error', error.message, event.metadata);
    }

    // Hotjar specific error tagging
    if (this.hotjar?.isLoaded()) {
      this.hotjar.tagRecording(['error', error.name]);
    }
  }

  /**
   * Track user interaction
   */
  trackInteraction(action: string, metadata?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      return;
    }

    const event: SessionReplayEvent = {
      type: 'interaction',
      message: action,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };

    this.trackEvent(event);
  }

  /**
   * Track navigation event
   */
  trackNavigation(path: string, metadata?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      return;
    }

    const event: SessionReplayEvent = {
      type: 'navigation',
      message: `Navigation to ${path}`,
      metadata: {
        ...metadata,
        path,
        timestamp: new Date().toISOString(),
      },
    };

    this.trackEvent(event);

    // Hotjar specific state change
    if (this.hotjar?.isLoaded()) {
      this.hotjar.stateChange(path);
    }
  }

  /**
   * Tag current recording with custom tags
   */
  tagRecording(tags: string[]): void {
    if (!this.isInitialized) {
      return;
    }

    this.hotjar?.tagRecording(tags);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) {
      return;
    }

    this.fullstory?.setUserVars(properties);
  }

  /**
   * Get current session URL (FullStory only)
   */
  getSessionURL(): string | null {
    if (!this.isInitialized || !this.fullstory?.isLoaded()) {
      return null;
    }

    return this.fullstory.getCurrentSessionURL(true);
  }

  /**
   * Start recording session
   */
  startRecording(): void {
    if (!this.isInitialized) {
      return;
    }

    this.hotjar?.startRecording();
    this.fullstory?.restart();
  }

  /**
   * Stop recording session
   */
  stopRecording(): void {
    if (!this.isInitialized) {
      return;
    }

    this.hotjar?.stopRecording();
    this.fullstory?.shutdown();
  }

  /**
   * Anonymize user (for privacy)
   */
  anonymize(): void {
    if (!this.isInitialized) {
      return;
    }

    this.currentUserId = undefined;
    this.fullstory?.anonymize();
  }

  /**
   * Check if session replay is active
   */
  isActive(): boolean {
    return this.isInitialized && (this.hotjar?.isLoaded() || this.fullstory?.isLoaded() || false);
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | undefined {
    return this.currentUserId;
  }

  /**
   * Get active provider
   */
  getProvider(): 'hotjar' | 'fullstory' | null {
    if (!this.isInitialized || !this.config) {
      return null;
    }

    return this.config.provider;
  }
}

// Export singleton instance
export const sessionReplay = new SessionReplayManager();
