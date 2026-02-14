/**
 * User Behavior Analytics
 * Track user interactions and behavior patterns
 */

import { analytics } from './index';

/**
 * Behavior categories
 */
export const BEHAVIOR_CATEGORIES = {
  NAVIGATION: 'navigation',
  INTERACTION: 'interaction',
  ENGAGEMENT: 'engagement',
  PERFORMANCE: 'performance',
  ERROR: 'error',
} as const;

/**
 * Track user behavior event
 */
export function trackBehavior(
  action: string,
  category: string,
  label?: string,
  duration?: number,
  metadata?: Record<string, unknown>
): void {
  analytics.trackUserBehavior({
    action,
    category,
    label,
    duration,
    metadata,
  });
}

/**
 * Navigation behavior tracking
 */
export const navigationBehavior = {
  pageView: (path: string, referrer?: string) => {
    trackBehavior('page_view', BEHAVIOR_CATEGORIES.NAVIGATION, path, undefined, {
      referrer,
    });
  },

  linkClick: (linkText: string, destination: string) => {
    trackBehavior('link_click', BEHAVIOR_CATEGORIES.NAVIGATION, linkText, undefined, {
      destination,
    });
  },

  backButton: (fromPath: string, toPath: string) => {
    trackBehavior('back_button', BEHAVIOR_CATEGORIES.NAVIGATION, undefined, undefined, {
      from_path: fromPath,
      to_path: toPath,
    });
  },

  menuNavigation: (section: string) => {
    trackBehavior('menu_navigation', BEHAVIOR_CATEGORIES.NAVIGATION, section);
  },
};

/**
 * Interaction behavior tracking
 */
export const interactionBehavior = {
  buttonClick: (buttonName: string, context?: string) => {
    trackBehavior('button_click', BEHAVIOR_CATEGORIES.INTERACTION, buttonName, undefined, {
      context,
    });
  },

  formSubmit: (formName: string, success: boolean, duration?: number) => {
    trackBehavior('form_submit', BEHAVIOR_CATEGORIES.INTERACTION, formName, duration, {
      success,
    });
  },

  formFieldFocus: (fieldName: string, formName: string) => {
    trackBehavior('form_field_focus', BEHAVIOR_CATEGORIES.INTERACTION, fieldName, undefined, {
      form_name: formName,
    });
  },

  modalOpen: (modalName: string) => {
    trackBehavior('modal_open', BEHAVIOR_CATEGORIES.INTERACTION, modalName);
  },

  modalClose: (modalName: string, duration: number) => {
    trackBehavior('modal_close', BEHAVIOR_CATEGORIES.INTERACTION, modalName, duration);
  },

  dropdownOpen: (dropdownName: string) => {
    trackBehavior('dropdown_open', BEHAVIOR_CATEGORIES.INTERACTION, dropdownName);
  },

  tabSwitch: (fromTab: string, toTab: string) => {
    trackBehavior('tab_switch', BEHAVIOR_CATEGORIES.INTERACTION, undefined, undefined, {
      from_tab: fromTab,
      to_tab: toTab,
    });
  },

  scroll: (depth: number, maxDepth: number) => {
    trackBehavior('scroll', BEHAVIOR_CATEGORIES.INTERACTION, undefined, undefined, {
      depth,
      max_depth: maxDepth,
      percentage: (depth / maxDepth) * 100,
    });
  },

  imageView: (imageUrl: string, context?: string) => {
    trackBehavior('image_view', BEHAVIOR_CATEGORIES.INTERACTION, undefined, undefined, {
      image_url: imageUrl,
      context,
    });
  },

  videoPlay: (videoId: string, duration?: number) => {
    trackBehavior('video_play', BEHAVIOR_CATEGORIES.INTERACTION, videoId, duration);
  },
};

/**
 * Engagement behavior tracking
 */
export const engagementBehavior = {
  sessionStart: (userId?: string) => {
    trackBehavior('session_start', BEHAVIOR_CATEGORIES.ENGAGEMENT, undefined, undefined, {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  },

  sessionEnd: (duration: number, pageViews: number) => {
    trackBehavior('session_end', BEHAVIOR_CATEGORIES.ENGAGEMENT, undefined, duration, {
      page_views: pageViews,
    });
  },

  timeOnPage: (path: string, duration: number) => {
    trackBehavior('time_on_page', BEHAVIOR_CATEGORIES.ENGAGEMENT, path, duration);
  },

  inactivity: (duration: number) => {
    trackBehavior('inactivity', BEHAVIOR_CATEGORIES.ENGAGEMENT, undefined, duration);
  },

  returnVisit: (daysSinceLastVisit: number) => {
    trackBehavior('return_visit', BEHAVIOR_CATEGORIES.ENGAGEMENT, undefined, undefined, {
      days_since_last_visit: daysSinceLastVisit,
    });
  },

  shareContent: (contentType: string, platform: string) => {
    trackBehavior('share_content', BEHAVIOR_CATEGORIES.ENGAGEMENT, contentType, undefined, {
      platform,
    });
  },

  copyToClipboard: (contentType: string) => {
    trackBehavior('copy_to_clipboard', BEHAVIOR_CATEGORIES.ENGAGEMENT, contentType);
  },

  printPage: (pageName: string) => {
    trackBehavior('print_page', BEHAVIOR_CATEGORIES.ENGAGEMENT, pageName);
  },
};

/**
 * Performance behavior tracking
 */
export const performanceBehavior = {
  pageLoadTime: (path: string, loadTime: number) => {
    trackBehavior('page_load_time', BEHAVIOR_CATEGORIES.PERFORMANCE, path, loadTime);
  },

  apiResponseTime: (endpoint: string, responseTime: number, success: boolean) => {
    trackBehavior('api_response_time', BEHAVIOR_CATEGORIES.PERFORMANCE, endpoint, responseTime, {
      success,
    });
  },

  imageLoadTime: (imageUrl: string, loadTime: number) => {
    trackBehavior('image_load_time', BEHAVIOR_CATEGORIES.PERFORMANCE, undefined, loadTime, {
      image_url: imageUrl,
    });
  },

  modelLoadTime: (modelId: string, loadTime: number) => {
    trackBehavior('model_load_time', BEHAVIOR_CATEGORIES.PERFORMANCE, modelId, loadTime);
  },

  slowInteraction: (interactionType: string, duration: number) => {
    trackBehavior('slow_interaction', BEHAVIOR_CATEGORIES.PERFORMANCE, interactionType, duration);
  },
};

/**
 * Error behavior tracking
 */
export const errorBehavior = {
  jsError: (errorMessage: string, stack?: string) => {
    trackBehavior('js_error', BEHAVIOR_CATEGORIES.ERROR, errorMessage, undefined, {
      stack,
      url: window.location.href,
    });
  },

  apiError: (endpoint: string, statusCode: number, errorMessage: string) => {
    trackBehavior('api_error', BEHAVIOR_CATEGORIES.ERROR, endpoint, undefined, {
      status_code: statusCode,
      error_message: errorMessage,
    });
  },

  formValidationError: (formName: string, fieldName: string, errorType: string) => {
    trackBehavior('form_validation_error', BEHAVIOR_CATEGORIES.ERROR, formName, undefined, {
      field_name: fieldName,
      error_type: errorType,
    });
  },

  resourceLoadError: (resourceUrl: string, resourceType: string) => {
    trackBehavior('resource_load_error', BEHAVIOR_CATEGORIES.ERROR, resourceType, undefined, {
      resource_url: resourceUrl,
    });
  },

  notFoundError: (path: string) => {
    trackBehavior('not_found_error', BEHAVIOR_CATEGORIES.ERROR, path);
  },
};

/**
 * Session tracking helper
 */
export class SessionTracker {
  private sessionStartTime: number;
  private pageViews: number;
  private lastActivityTime: number;
  private inactivityThreshold: number;
  private inactivityTimer?: NodeJS.Timeout;

  constructor(inactivityThreshold = 300000) {
    // 5 minutes
    this.sessionStartTime = Date.now();
    this.pageViews = 0;
    this.lastActivityTime = Date.now();
    this.inactivityThreshold = inactivityThreshold;
    this.startInactivityTracking();
  }

  trackPageView(): void {
    this.pageViews++;
    this.updateActivity();
  }

  updateActivity(): void {
    this.lastActivityTime = Date.now();
    this.resetInactivityTimer();
  }

  private startInactivityTracking(): void {
    this.resetInactivityTimer();

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, () => this.updateActivity());
    });
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      const inactivityDuration = Date.now() - this.lastActivityTime;
      engagementBehavior.inactivity(inactivityDuration);
    }, this.inactivityThreshold);
  }

  endSession(): void {
    const sessionDuration = Date.now() - this.sessionStartTime;
    engagementBehavior.sessionEnd(sessionDuration, this.pageViews);

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }
}

/**
 * Scroll depth tracking helper
 */
export class ScrollDepthTracker {
  private maxScrollDepth = 0;
  private thresholds = [25, 50, 75, 100];
  private triggeredThresholds = new Set<number>();

  constructor() {
    this.startTracking();
  }

  private startTracking(): void {
    window.addEventListener('scroll', () => this.trackScroll());
  }

  private trackScroll(): void {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    if (scrollPercentage > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercentage;
    }

    // Track threshold milestones
    this.thresholds.forEach((threshold) => {
      if (scrollPercentage >= threshold && !this.triggeredThresholds.has(threshold)) {
        this.triggeredThresholds.add(threshold);
        interactionBehavior.scroll(scrollPercentage, 100);
      }
    });
  }

  getMaxScrollDepth(): number {
    return this.maxScrollDepth;
  }
}
