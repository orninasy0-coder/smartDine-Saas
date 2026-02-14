/**
 * User Journey Mapping
 * Track and analyze user paths through the application
 */

import { analytics } from './index';

/**
 * Journey step interface
 */
export interface JourneyStep {
  path: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Journey path interface
 */
export interface JourneyPath {
  sessionId: string;
  userId?: string;
  steps: JourneyStep[];
  startTime: number;
  endTime?: number;
  totalDuration?: number;
  completed: boolean;
  exitPoint?: string;
}

/**
 * Path pattern interface
 */
export interface PathPattern {
  pattern: string[];
  count: number;
  avgDuration: number;
  completionRate: number;
  dropOffPoints: Map<string, number>;
}

/**
 * Journey analytics interface
 */
export interface JourneyAnalytics {
  totalJourneys: number;
  completedJourneys: number;
  averageDuration: number;
  commonPaths: PathPattern[];
  dropOffPoints: Map<string, number>;
  entryPoints: Map<string, number>;
  exitPoints: Map<string, number>;
}

/**
 * User Journey Tracker
 */
export class UserJourneyTracker {
  private currentJourney: JourneyPath | null = null;
  private journeyHistory: JourneyPath[] = [];
  private sessionId: string;
  private userId?: string;
  private maxHistorySize = 100;
  private storageKey = 'user_journey_data';

  constructor(sessionId?: string, userId?: string) {
    this.sessionId = sessionId || this.generateSessionId();
    this.userId = userId;
    this.loadFromStorage();
    this.startNewJourney();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start a new journey
   */
  startNewJourney(): void {
    if (this.currentJourney && !this.currentJourney.completed) {
      this.endJourney();
    }

    this.currentJourney = {
      sessionId: this.sessionId,
      userId: this.userId,
      steps: [],
      startTime: Date.now(),
      completed: false,
    };
  }

  /**
   * Track a journey step
   */
  trackStep(path: string, metadata?: Record<string, unknown>): void {
    if (!this.currentJourney) {
      this.startNewJourney();
    }

    const step: JourneyStep = {
      path,
      timestamp: Date.now(),
      metadata,
    };

    // Calculate duration from previous step
    if (this.currentJourney!.steps.length > 0) {
      const previousStep = this.currentJourney!.steps[this.currentJourney!.steps.length - 1];
      step.duration = step.timestamp - previousStep.timestamp;
    }

    this.currentJourney!.steps.push(step);

    // Track with analytics (if available)
    try {
      if (analytics && typeof analytics.trackCustomEvent === 'function') {
        analytics.trackCustomEvent({
          category: 'user_journey',
          action: 'step',
          label: path,
          metadata: {
            session_id: this.sessionId,
            user_id: this.userId,
            step_number: this.currentJourney!.steps.length,
            ...metadata,
          },
        });
      }
    } catch (error) {
      // Silently fail if analytics is not available
    }

    this.saveToStorage();
  }

  /**
   * End current journey
   */
  endJourney(completed = false, exitPoint?: string): void {
    if (!this.currentJourney) return;

    this.currentJourney.completed = completed;
    this.currentJourney.endTime = Date.now();
    this.currentJourney.totalDuration = this.currentJourney.endTime - this.currentJourney.startTime;
    this.currentJourney.exitPoint = exitPoint;

    // Add to history
    this.journeyHistory.push(this.currentJourney);

    // Limit history size
    if (this.journeyHistory.length > this.maxHistorySize) {
      this.journeyHistory.shift();
    }

    // Track journey completion
    try {
      if (analytics && typeof analytics.trackCustomEvent === 'function') {
        analytics.trackCustomEvent({
          category: 'user_journey',
          action: completed ? 'completed' : 'abandoned',
          label: this.getJourneyPath(),
          value: this.currentJourney.totalDuration,
          metadata: {
            session_id: this.sessionId,
            user_id: this.userId,
            steps_count: this.currentJourney.steps.length,
            exit_point: exitPoint,
          },
        });
      }
    } catch (error) {
      // Silently fail if analytics is not available
    }

    this.saveToStorage();
    this.currentJourney = null;
  }

  /**
   * Get current journey path as string
   */
  getJourneyPath(): string {
    if (!this.currentJourney) return '';
    return this.currentJourney.steps.map((step) => step.path).join(' → ');
  }

  /**
   * Get current journey
   */
  getCurrentJourney(): JourneyPath | null {
    return this.currentJourney;
  }

  /**
   * Get journey history
   */
  getJourneyHistory(): JourneyPath[] {
    return this.journeyHistory;
  }

  /**
   * Analyze journey patterns
   */
  analyzeJourneys(): JourneyAnalytics {
    const totalJourneys = this.journeyHistory.length;
    const completedJourneys = this.journeyHistory.filter((j) => j.completed).length;
    const totalDuration = this.journeyHistory.reduce((sum, j) => sum + (j.totalDuration || 0), 0);
    const averageDuration = totalJourneys > 0 ? totalDuration / totalJourneys : 0;

    // Analyze paths
    const pathMap = new Map<string, PathPattern>();
    const dropOffPoints = new Map<string, number>();
    const entryPoints = new Map<string, number>();
    const exitPoints = new Map<string, number>();

    this.journeyHistory.forEach((journey) => {
      const pathKey = journey.steps.map((s) => s.path).join('→');

      // Track entry point
      if (journey.steps.length > 0) {
        const entry = journey.steps[0].path;
        entryPoints.set(entry, (entryPoints.get(entry) || 0) + 1);
      }

      // Track exit point
      if (journey.exitPoint) {
        exitPoints.set(journey.exitPoint, (exitPoints.get(journey.exitPoint) || 0) + 1);
      }

      // Track drop-off points (incomplete journeys)
      if (!journey.completed && journey.steps.length > 0) {
        const lastStep = journey.steps[journey.steps.length - 1].path;
        dropOffPoints.set(lastStep, (dropOffPoints.get(lastStep) || 0) + 1);
      }

      // Track path patterns
      if (!pathMap.has(pathKey)) {
        pathMap.set(pathKey, {
          pattern: journey.steps.map((s) => s.path),
          count: 0,
          avgDuration: 0,
          completionRate: 0,
          dropOffPoints: new Map(),
        });
      }

      const pattern = pathMap.get(pathKey)!;
      pattern.count++;
      pattern.avgDuration =
        (pattern.avgDuration * (pattern.count - 1) + (journey.totalDuration || 0)) /
        pattern.count;
      pattern.completionRate =
        (pattern.completionRate * (pattern.count - 1) + (journey.completed ? 1 : 0)) /
        pattern.count;
    });

    // Sort common paths by count
    const commonPaths = Array.from(pathMap.values()).sort((a, b) => b.count - a.count);

    return {
      totalJourneys,
      completedJourneys,
      averageDuration,
      commonPaths,
      dropOffPoints,
      entryPoints,
      exitPoints,
    };
  }

  /**
   * Save to local storage
   */
  private saveToStorage(): void {
    try {
      const data = {
        sessionId: this.sessionId,
        userId: this.userId,
        currentJourney: this.currentJourney,
        journeyHistory: this.journeyHistory,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save journey data:', error);
    }
  }

  /**
   * Load from local storage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.journeyHistory = parsed.journeyHistory || [];
        // Don't restore current journey - start fresh
      }
    } catch (error) {
      console.error('Failed to load journey data:', error);
    }
  }

  /**
   * Clear journey data
   */
  clearData(): void {
    this.currentJourney = null;
    this.journeyHistory = [];
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
    if (this.currentJourney) {
      this.currentJourney.userId = userId;
    }
  }
}

/**
 * Path analyzer for common journey patterns
 */
export class PathAnalyzer {
  /**
   * Find common paths between two points
   */
  static findCommonPaths(
    journeys: JourneyPath[],
    startPath: string,
    endPath: string
  ): PathPattern[] {
    const pathMap = new Map<string, PathPattern>();

    journeys.forEach((journey) => {
      const startIndex = journey.steps.findIndex((s) => s.path === startPath);
      const endIndex = journey.steps.findIndex((s) => s.path === endPath);

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const subPath = journey.steps.slice(startIndex, endIndex + 1);
        const pathKey = subPath.map((s) => s.path).join('→');

        if (!pathMap.has(pathKey)) {
          pathMap.set(pathKey, {
            pattern: subPath.map((s) => s.path),
            count: 0,
            avgDuration: 0,
            completionRate: 1,
            dropOffPoints: new Map(),
          });
        }

        const pattern = pathMap.get(pathKey)!;
        pattern.count++;

        const duration = subPath.reduce((sum, step) => sum + (step.duration || 0), 0);
        pattern.avgDuration = (pattern.avgDuration * (pattern.count - 1) + duration) / pattern.count;
      }
    });

    return Array.from(pathMap.values()).sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate path efficiency (shortest vs actual)
   */
  static calculatePathEfficiency(journey: JourneyPath, optimalSteps: number): number {
    const actualSteps = journey.steps.length;
    return optimalSteps / actualSteps;
  }

  /**
   * Identify bottlenecks in user journeys
   */
  static identifyBottlenecks(journeys: JourneyPath[]): Map<string, number> {
    const stepDurations = new Map<string, number[]>();

    journeys.forEach((journey) => {
      journey.steps.forEach((step) => {
        if (step.duration) {
          if (!stepDurations.has(step.path)) {
            stepDurations.set(step.path, []);
          }
          stepDurations.get(step.path)!.push(step.duration);
        }
      });
    });

    // Calculate average duration for each step
    const avgDurations = new Map<string, number>();
    stepDurations.forEach((durations, path) => {
      const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      avgDurations.set(path, avg);
    });

    // Sort by duration (descending)
    return new Map(Array.from(avgDurations.entries()).sort((a, b) => b[1] - a[1]));
  }

  /**
   * Find alternative paths
   */
  static findAlternativePaths(
    journeys: JourneyPath[],
    targetPath: string
  ): { path: string[]; frequency: number }[] {
    const alternatives = new Map<string, number>();

    journeys.forEach((journey) => {
      const hasTarget = journey.steps.some((s) => s.path === targetPath);
      if (hasTarget) {
        const pathKey = journey.steps.map((s) => s.path).join('→');
        alternatives.set(pathKey, (alternatives.get(pathKey) || 0) + 1);
      }
    });

    return Array.from(alternatives.entries())
      .map(([path, frequency]) => ({
        path: path.split('→'),
        frequency,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
}

/**
 * Journey segmentation
 */
export class JourneySegmentation {
  /**
   * Segment journeys by completion status
   */
  static byCompletionStatus(journeys: JourneyPath[]): {
    completed: JourneyPath[];
    abandoned: JourneyPath[];
  } {
    return {
      completed: journeys.filter((j) => j.completed),
      abandoned: journeys.filter((j) => !j.completed),
    };
  }

  /**
   * Segment journeys by duration
   */
  static byDuration(
    journeys: JourneyPath[],
    thresholds: { fast: number; slow: number }
  ): {
    fast: JourneyPath[];
    medium: JourneyPath[];
    slow: JourneyPath[];
  } {
    return {
      fast: journeys.filter((j) => (j.totalDuration || 0) < thresholds.fast),
      medium: journeys.filter(
        (j) =>
          (j.totalDuration || 0) >= thresholds.fast && (j.totalDuration || 0) < thresholds.slow
      ),
      slow: journeys.filter((j) => (j.totalDuration || 0) >= thresholds.slow),
    };
  }

  /**
   * Segment journeys by path length
   */
  static byPathLength(
    journeys: JourneyPath[],
    thresholds: { short: number; long: number }
  ): {
    short: JourneyPath[];
    medium: JourneyPath[];
    long: JourneyPath[];
  } {
    return {
      short: journeys.filter((j) => j.steps.length < thresholds.short),
      medium: journeys.filter(
        (j) => j.steps.length >= thresholds.short && j.steps.length < thresholds.long
      ),
      long: journeys.filter((j) => j.steps.length >= thresholds.long),
    };
  }

  /**
   * Segment journeys by entry point
   */
  static byEntryPoint(journeys: JourneyPath[]): Map<string, JourneyPath[]> {
    const segments = new Map<string, JourneyPath[]>();

    journeys.forEach((journey) => {
      if (journey.steps.length > 0) {
        const entry = journey.steps[0].path;
        if (!segments.has(entry)) {
          segments.set(entry, []);
        }
        segments.get(entry)!.push(journey);
      }
    });

    return segments;
  }
}

// Create singleton instance
export const userJourneyTracker = new UserJourneyTracker();

// Export utilities
export { PathAnalyzer, JourneySegmentation };
