/**
 * Heatmap Analytics
 * Track click positions and scroll depth for heatmap visualization
 */

import { analytics } from './index';

export interface ClickHeatmapData {
  x: number;
  y: number;
  timestamp: number;
  elementInfo: {
    tagName: string;
    id?: string;
    className?: string;
    text?: string;
  };
  viewport: {
    width: number;
    height: number;
  };
  page: {
    url: string;
    path: string;
  };
}

export interface ScrollHeatmapData {
  depth: number;
  percentage: number;
  timestamp: number;
  viewport: {
    width: number;
    height: number;
  };
  page: {
    url: string;
    path: string;
  };
}

export interface AttentionHeatmapData {
  elementId: string;
  duration: number;
  timestamp: number;
  elementInfo: {
    tagName: string;
    id?: string;
    className?: string;
  };
  viewport: {
    width: number;
    height: number;
  };
  page: {
    url: string;
    path: string;
  };
}

/**
 * Click Heatmap Tracker
 * Tracks all click positions for heatmap visualization
 */
export class ClickHeatmapTracker {
  private isTracking = false;
  private clickData: ClickHeatmapData[] = [];
  private maxDataPoints = 1000;
  private abortController?: AbortController;

  /**
   * Start tracking clicks for heatmap
   */
  start(): void {
    if (this.isTracking) {
      return;
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    document.addEventListener('click', this.handleClick.bind(this), { signal, capture: true });

    this.isTracking = true;
    console.log('[ClickHeatmapTracker] Started');
  }

  /**
   * Handle click event
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (!target) return;

    const clickData: ClickHeatmapData = {
      x: event.clientX,
      y: event.clientY + window.pageYOffset,
      timestamp: Date.now(),
      elementInfo: {
        tagName: target.tagName.toLowerCase(),
        id: target.id || undefined,
        className: target.className || undefined,
        text: this.getElementText(target),
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      page: {
        url: window.location.href,
        path: window.location.pathname,
      },
    };

    this.clickData.push(clickData);

    // Limit data points to prevent memory issues
    if (this.clickData.length > this.maxDataPoints) {
      this.clickData.shift();
    }

    // Track in analytics
    analytics.trackEvent({
      category: 'Heatmap',
      action: 'click',
      label: window.location.pathname,
      metadata: {
        x: clickData.x,
        y: clickData.y,
        element: clickData.elementInfo.tagName,
        elementId: clickData.elementInfo.id,
      },
    });
  }

  /**
   * Get element text (truncated)
   */
  private getElementText(element: Element): string {
    const text = element.textContent?.trim() || '';
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  }

  /**
   * Get all click data
   */
  getClickData(): ClickHeatmapData[] {
    return [...this.clickData];
  }

  /**
   * Get click data for specific page
   */
  getClickDataForPage(path: string): ClickHeatmapData[] {
    return this.clickData.filter((data) => data.page.path === path);
  }

  /**
   * Clear click data
   */
  clear(): void {
    this.clickData = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isTracking = false;
    console.log('[ClickHeatmapTracker] Stopped');
  }

  /**
   * Export click data for visualization
   */
  exportData(): string {
    return JSON.stringify(this.clickData, null, 2);
  }
}

/**
 * Scroll Depth Heatmap Tracker
 * Tracks scroll depth over time for heatmap visualization
 */
export class ScrollDepthTracker {
  private isTracking = false;
  private scrollData: ScrollHeatmapData[] = [];
  private maxDataPoints = 500;
  private lastScrollTime = 0;
  private throttleDelay = 100; // ms
  private abortController?: AbortController;

  /**
   * Start tracking scroll depth
   */
  start(): void {
    if (this.isTracking) {
      return;
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    window.addEventListener('scroll', this.handleScroll.bind(this), { signal, passive: true });

    this.isTracking = true;
    console.log('[ScrollDepthTracker] Started');
  }

  /**
   * Handle scroll event (throttled)
   */
  private handleScroll(): void {
    const now = Date.now();
    if (now - this.lastScrollTime < this.throttleDelay) {
      return;
    }
    this.lastScrollTime = now;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

    const scrollData: ScrollHeatmapData = {
      depth: scrollTop,
      percentage: scrollPercentage,
      timestamp: now,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      page: {
        url: window.location.href,
        path: window.location.pathname,
      },
    };

    this.scrollData.push(scrollData);

    // Limit data points
    if (this.scrollData.length > this.maxDataPoints) {
      this.scrollData.shift();
    }

    // Track in analytics (only at milestones)
    if (scrollPercentage % 25 === 0) {
      analytics.trackEvent({
        category: 'Heatmap',
        action: 'scroll_depth',
        label: window.location.pathname,
        value: scrollPercentage,
        metadata: {
          depth: scrollTop,
        },
      });
    }
  }

  /**
   * Get all scroll data
   */
  getScrollData(): ScrollHeatmapData[] {
    return [...this.scrollData];
  }

  /**
   * Get scroll data for specific page
   */
  getScrollDataForPage(path: string): ScrollHeatmapData[] {
    return this.scrollData.filter((data) => data.page.path === path);
  }

  /**
   * Get max scroll depth reached
   */
  getMaxScrollDepth(): number {
    if (this.scrollData.length === 0) return 0;
    return Math.max(...this.scrollData.map((data) => data.percentage));
  }

  /**
   * Clear scroll data
   */
  clear(): void {
    this.scrollData = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isTracking = false;
    console.log('[ScrollDepthTracker] Stopped');
  }

  /**
   * Export scroll data for visualization
   */
  exportData(): string {
    return JSON.stringify(this.scrollData, null, 2);
  }
}

/**
 * Attention Heatmap Tracker
 * Tracks time spent viewing specific elements
 */
export class AttentionHeatmapTracker {
  private isTracking = false;
  private attentionData: AttentionHeatmapData[] = [];
  private currentElement: Element | null = null;
  private elementStartTime = 0;
  private minDuration = 1000; // Minimum 1 second to count
  private maxDataPoints = 500;
  private abortController?: AbortController;

  /**
   * Start tracking attention
   */
  start(): void {
    if (this.isTracking) {
      return;
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // Track mouse movement to detect element attention
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { signal, passive: true });
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { signal });

    this.isTracking = true;
    console.log('[AttentionHeatmapTracker] Started');
  }

  /**
   * Handle mouse move
   */
  private handleMouseMove(event: MouseEvent): void {
    const target = event.target as Element;
    if (!target) return;

    // If we're on a new element, record the previous one
    if (this.currentElement && this.currentElement !== target) {
      this.recordAttention();
    }

    // Start tracking new element
    this.currentElement = target;
    this.elementStartTime = Date.now();
  }

  /**
   * Handle mouse leave
   */
  private handleMouseLeave(): void {
    if (this.currentElement) {
      this.recordAttention();
      this.currentElement = null;
    }
  }

  /**
   * Record attention duration for current element
   */
  private recordAttention(): void {
    if (!this.currentElement) return;

    const duration = Date.now() - this.elementStartTime;

    // Only record if duration meets minimum threshold
    if (duration < this.minDuration) return;

    const elementId = this.getElementIdentifier(this.currentElement);

    const attentionData: AttentionHeatmapData = {
      elementId,
      duration,
      timestamp: Date.now(),
      elementInfo: {
        tagName: this.currentElement.tagName.toLowerCase(),
        id: this.currentElement.id || undefined,
        className: this.currentElement.className || undefined,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      page: {
        url: window.location.href,
        path: window.location.pathname,
      },
    };

    this.attentionData.push(attentionData);

    // Limit data points
    if (this.attentionData.length > this.maxDataPoints) {
      this.attentionData.shift();
    }

    // Track in analytics
    analytics.trackEvent({
      category: 'Heatmap',
      action: 'attention',
      label: window.location.pathname,
      value: duration,
      metadata: {
        element: attentionData.elementInfo.tagName,
        elementId: attentionData.elementInfo.id,
      },
    });
  }

  /**
   * Get unique identifier for element
   */
  private getElementIdentifier(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    return `${tagName}${className}`;
  }

  /**
   * Get all attention data
   */
  getAttentionData(): AttentionHeatmapData[] {
    return [...this.attentionData];
  }

  /**
   * Get attention data for specific page
   */
  getAttentionDataForPage(path: string): AttentionHeatmapData[] {
    return this.attentionData.filter((data) => data.page.path === path);
  }

  /**
   * Get aggregated attention by element
   */
  getAggregatedAttention(): Map<string, number> {
    const aggregated = new Map<string, number>();

    this.attentionData.forEach((data) => {
      const current = aggregated.get(data.elementId) || 0;
      aggregated.set(data.elementId, current + data.duration);
    });

    return aggregated;
  }

  /**
   * Clear attention data
   */
  clear(): void {
    this.attentionData = [];
  }

  /**
   * Stop tracking
   */
  stop(): void {
    if (this.currentElement) {
      this.recordAttention();
    }

    if (this.abortController) {
      this.abortController.abort();
    }

    this.isTracking = false;
    console.log('[AttentionHeatmapTracker] Stopped');
  }

  /**
   * Export attention data for visualization
   */
  exportData(): string {
    return JSON.stringify(this.attentionData, null, 2);
  }
}

// Export singleton instances
export const clickHeatmapTracker = new ClickHeatmapTracker();
export const scrollDepthTracker = new ScrollDepthTracker();
export const attentionHeatmapTracker = new AttentionHeatmapTracker();

/**
 * Initialize all heatmap trackers
 */
export function initializeHeatmaps(): void {
  clickHeatmapTracker.start();
  scrollDepthTracker.start();
  attentionHeatmapTracker.start();
  console.log('[Heatmaps] All trackers initialized');
}

/**
 * Stop all heatmap trackers
 */
export function stopHeatmaps(): void {
  clickHeatmapTracker.stop();
  scrollDepthTracker.stop();
  attentionHeatmapTracker.stop();
  console.log('[Heatmaps] All trackers stopped');
}

/**
 * Clear all heatmap data
 */
export function clearHeatmapData(): void {
  clickHeatmapTracker.clear();
  scrollDepthTracker.clear();
  attentionHeatmapTracker.clear();
  console.log('[Heatmaps] All data cleared');
}

/**
 * Export all heatmap data
 */
export function exportAllHeatmapData(): {
  clicks: ClickHeatmapData[];
  scrolls: ScrollHeatmapData[];
  attention: AttentionHeatmapData[];
} {
  return {
    clicks: clickHeatmapTracker.getClickData(),
    scrolls: scrollDepthTracker.getScrollData(),
    attention: attentionHeatmapTracker.getAttentionData(),
  };
}
