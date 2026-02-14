/**
 * User Interaction Tracking
 * Automatic tracking of user interactions for session replay
 */

import { sessionReplay } from './sessionReplay';

export interface InteractionTrackingConfig {
  trackClicks?: boolean;
  trackFormSubmissions?: boolean;
  trackFormFields?: boolean;
  trackScrollDepth?: boolean;
  trackRageClicks?: boolean;
  trackDeadClicks?: boolean;
  scrollDepthThresholds?: number[];
  rageClickThreshold?: number;
  rageClickTimeWindow?: number;
}

const DEFAULT_CONFIG: Required<InteractionTrackingConfig> = {
  trackClicks: true,
  trackFormSubmissions: true,
  trackFormFields: true,
  trackScrollDepth: true,
  trackRageClicks: true,
  trackDeadClicks: true,
  scrollDepthThresholds: [25, 50, 75, 100],
  rageClickThreshold: 3,
  rageClickTimeWindow: 1000,
};

export class InteractionTracker {
  private config: Required<InteractionTrackingConfig>;
  private isInitialized = false;
  private scrollDepthReached = new Set<number>();
  private clickHistory: Array<{ element: Element; timestamp: number }> = [];
  private abortController?: AbortController;

  constructor(config: InteractionTrackingConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize interaction tracking
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // Track clicks
    if (this.config.trackClicks) {
      document.addEventListener('click', this.handleClick.bind(this), { signal, capture: true });
    }

    // Track form submissions
    if (this.config.trackFormSubmissions) {
      document.addEventListener('submit', this.handleFormSubmit.bind(this), { signal, capture: true });
    }

    // Track form field interactions
    if (this.config.trackFormFields) {
      document.addEventListener('focus', this.handleFormFieldFocus.bind(this), { signal, capture: true });
      document.addEventListener('blur', this.handleFormFieldBlur.bind(this), { signal, capture: true });
    }

    // Track scroll depth
    if (this.config.trackScrollDepth) {
      window.addEventListener('scroll', this.handleScroll.bind(this), { signal, passive: true });
    }

    this.isInitialized = true;
    console.log('[InteractionTracker] Initialized');
  }

  /**
   * Handle click events
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (!target) return;

    const elementInfo = this.getElementInfo(target);

    // Track the click
    sessionReplay.trackInteraction('click', {
      ...elementInfo,
      x: event.clientX,
      y: event.clientY,
      button: event.button,
    });

    // Check for rage clicks
    if (this.config.trackRageClicks) {
      this.detectRageClick(target);
    }

    // Check for dead clicks
    if (this.config.trackDeadClicks) {
      this.detectDeadClick(target);
    }
  }

  /**
   * Handle form submission
   */
  private handleFormSubmit(event: Event): void {
    const form = event.target as HTMLFormElement;
    if (!form) return;

    const formInfo = this.getElementInfo(form);

    sessionReplay.trackInteraction('form_submit', {
      ...formInfo,
      action: form.action,
      method: form.method,
    });
  }

  /**
   * Handle form field focus
   */
  private handleFormFieldFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (!this.isFormField(target)) return;

    const fieldInfo = this.getElementInfo(target);

    sessionReplay.trackInteraction('form_field_focus', fieldInfo);
  }

  /**
   * Handle form field blur
   */
  private handleFormFieldBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (!this.isFormField(target)) return;

    const fieldInfo = this.getElementInfo(target);

    sessionReplay.trackInteraction('form_field_blur', {
      ...fieldInfo,
      hasValue: !!target.value,
      valueLength: target.value?.length || 0,
    });
  }

  /**
   * Handle scroll events
   */
  private handleScroll(): void {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

    // Track scroll depth thresholds
    this.config.scrollDepthThresholds.forEach((threshold) => {
      if (scrollPercentage >= threshold && !this.scrollDepthReached.has(threshold)) {
        this.scrollDepthReached.add(threshold);
        sessionReplay.trackInteraction('scroll_depth', {
          threshold,
          percentage: scrollPercentage,
        });
      }
    });
  }

  /**
   * Detect rage clicks (multiple rapid clicks on same element)
   */
  private detectRageClick(element: Element): void {
    const now = Date.now();

    // Add current click to history
    this.clickHistory.push({ element, timestamp: now });

    // Remove old clicks outside time window
    this.clickHistory = this.clickHistory.filter(
      (click) => now - click.timestamp < this.config.rageClickTimeWindow
    );

    // Count clicks on same element
    const clicksOnElement = this.clickHistory.filter((click) => click.element === element).length;

    if (clicksOnElement >= this.config.rageClickThreshold) {
      const elementInfo = this.getElementInfo(element);
      sessionReplay.trackInteraction('rage_click', {
        ...elementInfo,
        clickCount: clicksOnElement,
      });

      // Tag recording for easier filtering
      sessionReplay.tagRecording(['rage-click', 'ux-friction']);

      // Clear history to avoid duplicate reports
      this.clickHistory = [];
    }
  }

  /**
   * Detect dead clicks (clicks that don't result in any action)
   */
  private detectDeadClick(element: Element): void {
    // Check if element is interactive but has no event listeners
    const isInteractive =
      element.tagName === 'DIV' ||
      element.tagName === 'SPAN' ||
      element.classList.contains('clickable') ||
      element.classList.contains('button');

    if (!isInteractive) return;

    // Check if element has click handlers
    const hasClickHandler =
      element.getAttribute('onclick') !== null ||
      element.hasAttribute('data-click') ||
      element.closest('a, button, [role="button"]') !== null;

    if (!hasClickHandler) {
      const elementInfo = this.getElementInfo(element);
      sessionReplay.trackInteraction('dead_click', {
        ...elementInfo,
        warning: 'Element appears clickable but has no handler',
      });

      // Tag recording for easier filtering
      sessionReplay.tagRecording(['dead-click', 'ux-friction']);
    }
  }

  /**
   * Get element information for tracking
   */
  private getElementInfo(element: Element): Record<string, unknown> {
    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id || undefined,
      className: element.className || undefined,
      text: this.getElementText(element),
      xpath: this.getXPath(element),
      attributes: this.getRelevantAttributes(element),
    };
  }

  /**
   * Get element text content (truncated)
   */
  private getElementText(element: Element): string {
    const text = element.textContent?.trim() || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text;
  }

  /**
   * Get XPath for element
   */
  private getXPath(element: Element): string {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }

    const parts: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling = current.previousSibling;

      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }

      const tagName = current.nodeName.toLowerCase();
      const pathIndex = index > 0 ? `[${index + 1}]` : '';
      parts.unshift(tagName + pathIndex);

      current = current.parentElement;
    }

    return parts.length ? '/' + parts.join('/') : '';
  }

  /**
   * Get relevant attributes for tracking
   */
  private getRelevantAttributes(element: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    const relevantAttrs = ['type', 'name', 'placeholder', 'aria-label', 'data-testid', 'role'];

    relevantAttrs.forEach((attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        attrs[attr] = value;
      }
    });

    return attrs;
  }

  /**
   * Check if element is a form field
   */
  private isFormField(element: Element): boolean {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    );
  }

  /**
   * Reset scroll depth tracking
   */
  resetScrollDepth(): void {
    this.scrollDepthReached.clear();
  }

  /**
   * Destroy tracker and cleanup
   */
  destroy(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isInitialized = false;
    this.scrollDepthReached.clear();
    this.clickHistory = [];
    console.log('[InteractionTracker] Destroyed');
  }
}

// Export singleton instance
export const interactionTracker = new InteractionTracker();
