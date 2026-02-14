/**
 * UX Friction Detection
 * Detects and tracks user experience friction points
 */

import { sessionReplay } from './sessionReplay';
import { analytics } from './index';

export interface FrictionEvent {
  type: 'form_abandonment' | 'rage_click' | 'dead_click';
  severity: 'low' | 'medium' | 'high';
  element?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export interface FormAbandonmentConfig {
  enabled?: boolean;
  minInteractionTime?: number; // Minimum time spent on form before considering abandonment
  trackPartialFills?: boolean;
  excludeForms?: string[]; // Form IDs to exclude from tracking
}

export interface RageClickConfig {
  enabled?: boolean;
  threshold?: number; // Number of clicks to trigger rage click
  timeWindow?: number; // Time window in ms
  excludeElements?: string[]; // Element selectors to exclude
}

export interface DeadClickConfig {
  enabled?: boolean;
  excludeElements?: string[]; // Element selectors to exclude
}

export interface FrictionDetectionConfig {
  formAbandonment?: FormAbandonmentConfig;
  rageClick?: RageClickConfig;
  deadClick?: DeadClickConfig;
  onFrictionDetected?: (event: FrictionEvent) => void;
}

const DEFAULT_CONFIG: Required<FrictionDetectionConfig> = {
  formAbandonment: {
    enabled: true,
    minInteractionTime: 5000, // 5 seconds
    trackPartialFills: true,
    excludeForms: [],
  },
  rageClick: {
    enabled: true,
    threshold: 3,
    timeWindow: 1000,
    excludeElements: [],
  },
  deadClick: {
    enabled: true,
    excludeElements: [],
  },
  onFrictionDetected: undefined,
};

/**
 * Form tracking state
 */
interface FormState {
  formElement: HTMLFormElement;
  startTime: number;
  lastInteractionTime: number;
  fieldsInteracted: Set<string>;
  fieldValues: Map<string, string>;
  isSubmitted: boolean;
  isAbandoned: boolean;
}

/**
 * Click tracking for rage detection
 */
interface ClickRecord {
  element: Element;
  timestamp: number;
  x: number;
  y: number;
}

export class FrictionDetector {
  private config: Required<FrictionDetectionConfig>;
  private isInitialized = false;
  private abortController?: AbortController;
  
  // Form abandonment tracking
  private activeForms = new Map<HTMLFormElement, FormState>();
  private abandonmentCheckInterval?: NodeJS.Timeout;
  
  // Rage click tracking
  private clickHistory: ClickRecord[] = [];
  
  // Friction events log
  private frictionEvents: FrictionEvent[] = [];

  constructor(config: FrictionDetectionConfig = {}) {
    this.config = {
      formAbandonment: { ...DEFAULT_CONFIG.formAbandonment, ...config.formAbandonment },
      rageClick: { ...DEFAULT_CONFIG.rageClick, ...config.rageClick },
      deadClick: { ...DEFAULT_CONFIG.deadClick, ...config.deadClick },
      onFrictionDetected: config.onFrictionDetected,
    };
  }

  /**
   * Initialize friction detection
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // Initialize form abandonment tracking
    if (this.config.formAbandonment.enabled) {
      this.initializeFormTracking(signal);
    }

    // Initialize rage click detection
    if (this.config.rageClick.enabled) {
      this.initializeRageClickDetection(signal);
    }

    // Initialize dead click detection
    if (this.config.deadClick.enabled) {
      this.initializeDeadClickDetection(signal);
    }

    this.isInitialized = true;
    console.log('[FrictionDetector] Initialized');
  }

  /**
   * Initialize form abandonment tracking
   */
  private initializeFormTracking(signal: AbortSignal): void {
    // Track form interactions
    document.addEventListener('focus', (event) => {
      const target = event.target as HTMLElement;
      if (this.isFormField(target)) {
        this.handleFormFieldInteraction(target);
      }
    }, { signal, capture: true });

    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (this.isFormField(target)) {
        this.handleFormFieldInput(target);
      }
    }, { signal, capture: true });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.handleFormSubmit(form);
    }, { signal, capture: true });

    // Track page unload for abandonment
    window.addEventListener('beforeunload', () => {
      this.checkAllFormsForAbandonment();
    }, { signal });

    // Periodic check for form abandonment
    this.abandonmentCheckInterval = setInterval(() => {
      this.checkAllFormsForAbandonment();
    }, 10000); // Check every 10 seconds
  }

  /**
   * Initialize rage click detection
   */
  private initializeRageClickDetection(signal: AbortSignal): void {
    document.addEventListener('click', (event) => {
      this.handleClickForRageDetection(event);
    }, { signal, capture: true });
  }

  /**
   * Initialize dead click detection
   */
  private initializeDeadClickDetection(signal: AbortSignal): void {
    document.addEventListener('click', (event) => {
      this.handleClickForDeadDetection(event);
    }, { signal, capture: true });
  }

  /**
   * Handle form field interaction
   */
  private handleFormFieldInteraction(field: HTMLElement): void {
    const form = field.closest('form');
    if (!form || this.isFormExcluded(form)) {
      return;
    }

    let formState = this.activeForms.get(form);
    
    if (!formState) {
      // Initialize form tracking
      formState = {
        formElement: form,
        startTime: Date.now(),
        lastInteractionTime: Date.now(),
        fieldsInteracted: new Set(),
        fieldValues: new Map(),
        isSubmitted: false,
        isAbandoned: false,
      };
      this.activeForms.set(form, formState);
    }

    // Update interaction time
    formState.lastInteractionTime = Date.now();
    
    // Track field interaction
    const fieldName = this.getFieldIdentifier(field);
    formState.fieldsInteracted.add(fieldName);
  }

  /**
   * Handle form field input
   */
  private handleFormFieldInput(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    const form = field.closest('form');
    if (!form) {
      return;
    }

    const formState = this.activeForms.get(form);
    if (!formState) {
      return;
    }

    // Track field value (for partial fill detection)
    const fieldName = this.getFieldIdentifier(field);
    formState.fieldValues.set(fieldName, field.value);
    formState.lastInteractionTime = Date.now();
  }

  /**
   * Handle form submission
   */
  private handleFormSubmit(form: HTMLFormElement): void {
    const formState = this.activeForms.get(form);
    if (formState) {
      formState.isSubmitted = true;
      
      // Track successful form completion
      const duration = Date.now() - formState.startTime;
      analytics.trackCustomEvent({
        category: 'form',
        action: 'completed',
        label: this.getFormIdentifier(form),
        value: duration,
        metadata: {
          fields_interacted: formState.fieldsInteracted.size,
          duration_seconds: Math.round(duration / 1000),
        },
      });
      
      // Remove from tracking
      this.activeForms.delete(form);
    }
  }

  /**
   * Check all forms for abandonment
   */
  private checkAllFormsForAbandonment(): void {
    const now = Date.now();
    const abandonmentThreshold = 30000; // 30 seconds of inactivity

    this.activeForms.forEach((formState, form) => {
      if (formState.isSubmitted || formState.isAbandoned) {
        return;
      }

      const timeSinceLastInteraction = now - formState.lastInteractionTime;
      const totalTimeOnForm = now - formState.startTime;

      // Check if form should be considered abandoned
      if (
        timeSinceLastInteraction > abandonmentThreshold &&
        totalTimeOnForm > this.config.formAbandonment.minInteractionTime &&
        formState.fieldsInteracted.size > 0
      ) {
        this.trackFormAbandonment(form, formState);
      }
    });
  }

  /**
   * Track form abandonment
   */
  private trackFormAbandonment(form: HTMLFormElement, formState: FormState): void {
    formState.isAbandoned = true;

    const formId = this.getFormIdentifier(form);
    const totalFields = this.getFormFieldCount(form);
    const filledFields = this.getFilledFieldCount(formState);
    const completionRate = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
    const duration = Date.now() - formState.startTime;

    // Determine severity based on completion rate
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (completionRate > 75) {
      severity = 'high'; // User was almost done
    } else if (completionRate > 25) {
      severity = 'medium';
    }

    const frictionEvent: FrictionEvent = {
      type: 'form_abandonment',
      severity,
      element: formId,
      metadata: {
        form_id: formId,
        total_fields: totalFields,
        fields_interacted: formState.fieldsInteracted.size,
        filled_fields: filledFields,
        completion_rate: Math.round(completionRate),
        duration_seconds: Math.round(duration / 1000),
        last_field: Array.from(formState.fieldsInteracted).pop(),
      },
      timestamp: Date.now(),
    };

    this.recordFrictionEvent(frictionEvent);

    // Track in analytics
    analytics.trackCustomEvent({
      category: 'ux_friction',
      action: 'form_abandonment',
      label: formId,
      value: Math.round(completionRate),
      metadata: frictionEvent.metadata,
    });

    // Tag session replay
    sessionReplay.tagRecording(['form-abandonment', 'ux-friction', `severity-${severity}`]);
    sessionReplay.trackInteraction('form_abandonment', frictionEvent.metadata);

    console.warn('[FrictionDetector] Form abandonment detected:', frictionEvent);
  }

  /**
   * Handle click for rage detection
   */
  private handleClickForRageDetection(event: MouseEvent): void {
    const target = event.target as Element;
    if (!target || this.isElementExcluded(target, this.config.rageClick.excludeElements)) {
      return;
    }

    const now = Date.now();
    const clickRecord: ClickRecord = {
      element: target,
      timestamp: now,
      x: event.clientX,
      y: event.clientY,
    };

    // Add to history
    this.clickHistory.push(clickRecord);

    // Remove old clicks outside time window
    this.clickHistory = this.clickHistory.filter(
      (click) => now - click.timestamp < this.config.rageClick.timeWindow
    );

    // Check for rage clicks on same element
    const clicksOnElement = this.clickHistory.filter(
      (click) => this.isSameElement(click.element, target)
    );

    if (clicksOnElement.length >= this.config.rageClick.threshold) {
      this.trackRageClick(target, clicksOnElement);
      // Clear history to avoid duplicate reports
      this.clickHistory = [];
    }
  }

  /**
   * Track rage click
   */
  private trackRageClick(element: Element, clicks: ClickRecord[]): void {
    const elementInfo = this.getElementInfo(element);
    
    const frictionEvent: FrictionEvent = {
      type: 'rage_click',
      severity: 'high',
      element: elementInfo.identifier,
      metadata: {
        ...elementInfo,
        click_count: clicks.length,
        time_window_ms: this.config.rageClick.timeWindow,
        coordinates: clicks.map(c => ({ x: c.x, y: c.y })),
      },
      timestamp: Date.now(),
    };

    this.recordFrictionEvent(frictionEvent);

    // Track in analytics
    analytics.trackCustomEvent({
      category: 'ux_friction',
      action: 'rage_click',
      label: elementInfo.identifier,
      value: clicks.length,
      metadata: frictionEvent.metadata,
    });

    // Tag session replay
    sessionReplay.tagRecording(['rage-click', 'ux-friction', 'severity-high']);
    sessionReplay.trackInteraction('rage_click', frictionEvent.metadata);

    console.warn('[FrictionDetector] Rage click detected:', frictionEvent);
  }

  /**
   * Handle click for dead click detection
   */
  private handleClickForDeadDetection(event: MouseEvent): void {
    const target = event.target as Element;
    if (!target || this.isElementExcluded(target, this.config.deadClick.excludeElements)) {
      return;
    }

    // Check if element appears clickable but has no handler
    if (this.isDeadClick(target)) {
      this.trackDeadClick(target);
    }
  }

  /**
   * Check if click is a dead click
   */
  private isDeadClick(element: Element): boolean {
    // Check if element looks clickable
    const looksClickable = 
      element.classList.contains('clickable') ||
      element.classList.contains('button') ||
      element.classList.contains('btn') ||
      element.classList.contains('link') ||
      window.getComputedStyle(element).cursor === 'pointer';

    if (!looksClickable) {
      return false;
    }

    // Check if element has actual click functionality
    const hasClickHandler =
      element.getAttribute('onclick') !== null ||
      element.hasAttribute('data-click') ||
      element.closest('a, button, [role="button"], [role="link"]') !== null ||
      element.tagName === 'A' ||
      element.tagName === 'BUTTON';

    return !hasClickHandler;
  }

  /**
   * Track dead click
   */
  private trackDeadClick(element: Element): void {
    const elementInfo = this.getElementInfo(element);
    
    const frictionEvent: FrictionEvent = {
      type: 'dead_click',
      severity: 'medium',
      element: elementInfo.identifier,
      metadata: {
        ...elementInfo,
        warning: 'Element appears clickable but has no handler',
      },
      timestamp: Date.now(),
    };

    this.recordFrictionEvent(frictionEvent);

    // Track in analytics
    analytics.trackCustomEvent({
      category: 'ux_friction',
      action: 'dead_click',
      label: elementInfo.identifier,
      metadata: frictionEvent.metadata,
    });

    // Tag session replay
    sessionReplay.tagRecording(['dead-click', 'ux-friction', 'severity-medium']);
    sessionReplay.trackInteraction('dead_click', frictionEvent.metadata);

    console.warn('[FrictionDetector] Dead click detected:', frictionEvent);
  }

  /**
   * Record friction event
   */
  private recordFrictionEvent(event: FrictionEvent): void {
    this.frictionEvents.push(event);
    
    // Call custom handler if provided
    if (this.config.onFrictionDetected) {
      this.config.onFrictionDetected(event);
    }
  }

  /**
   * Get friction events
   */
  getFrictionEvents(type?: FrictionEvent['type']): FrictionEvent[] {
    if (type) {
      return this.frictionEvents.filter(e => e.type === type);
    }
    return [...this.frictionEvents];
  }

  /**
   * Get friction summary
   */
  getFrictionSummary(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  } {
    const summary = {
      total: this.frictionEvents.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
    };

    this.frictionEvents.forEach(event => {
      summary.byType[event.type] = (summary.byType[event.type] || 0) + 1;
      summary.bySeverity[event.severity] = (summary.bySeverity[event.severity] || 0) + 1;
    });

    return summary;
  }

  /**
   * Helper: Check if form field
   */
  private isFormField(element: Element): boolean {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement
    );
  }

  /**
   * Helper: Check if form is excluded
   */
  private isFormExcluded(form: HTMLFormElement): boolean {
    const formId = form.id || form.getAttribute('name') || '';
    return this.config.formAbandonment.excludeForms.includes(formId);
  }

  /**
   * Helper: Check if element is excluded
   */
  private isElementExcluded(element: Element, excludeList: string[]): boolean {
    return excludeList.some(selector => element.matches(selector));
  }

  /**
   * Helper: Get form identifier
   */
  private getFormIdentifier(form: HTMLFormElement): string {
    return form.id || form.getAttribute('name') || form.getAttribute('data-form') || 'unknown-form';
  }

  /**
   * Helper: Get field identifier
   */
  private getFieldIdentifier(field: Element): string {
    const input = field as HTMLInputElement;
    return input.name || input.id || input.getAttribute('data-field') || 'unknown-field';
  }

  /**
   * Helper: Get form field count
   */
  private getFormFieldCount(form: HTMLFormElement): number {
    return form.querySelectorAll('input, textarea, select').length;
  }

  /**
   * Helper: Get filled field count
   */
  private getFilledFieldCount(formState: FormState): number {
    let count = 0;
    formState.fieldValues.forEach(value => {
      if (value && value.trim().length > 0) {
        count++;
      }
    });
    return count;
  }

  /**
   * Helper: Check if same element
   */
  private isSameElement(el1: Element, el2: Element): boolean {
    return el1 === el2;
  }

  /**
   * Helper: Get element info
   */
  private getElementInfo(element: Element): {
    identifier: string;
    tagName: string;
    id?: string;
    className?: string;
    text?: string;
  } {
    const text = element.textContent?.trim() || '';
    return {
      identifier: element.id || element.className || element.tagName.toLowerCase(),
      tagName: element.tagName.toLowerCase(),
      id: element.id || undefined,
      className: element.className || undefined,
      text: text.length > 50 ? text.substring(0, 50) + '...' : text,
    };
  }

  /**
   * Clear friction events
   */
  clearEvents(): void {
    this.frictionEvents = [];
  }

  /**
   * Destroy detector and cleanup
   */
  destroy(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    
    if (this.abandonmentCheckInterval) {
      clearInterval(this.abandonmentCheckInterval);
    }

    this.activeForms.clear();
    this.clickHistory = [];
    this.frictionEvents = [];
    this.isInitialized = false;
    
    console.log('[FrictionDetector] Destroyed');
  }
}

// Export singleton instance
export const frictionDetector = new FrictionDetector();
