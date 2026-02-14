/**
 * Cohort Behavior Analysis
 * Analyze user behavior patterns across different cohorts
 */

import type { JourneyPath } from './userJourney';

/**
 * Cohort definition
 */
export interface Cohort {
  id: string;
  name: string;
  description?: string;
  criteria: CohortCriteria;
  users: Set<string>;
  createdAt: number;
}

/**
 * Cohort criteria
 */
export interface CohortCriteria {
  type:
    | 'signup_date'
    | 'first_purchase'
    | 'feature_usage'
    | 'user_property'
    | 'behavior_pattern'
    | 'custom';
  dateRange?: {
    start: number;
    end: number;
  };
  property?: {
    key: string;
    value: string | number | boolean;
    operator?: 'equals' | 'contains' | 'greater_than' | 'less_than';
  };
  behavior?: {
    action: string;
    minOccurrences?: number;
    timeWindow?: number;
  };
  customFilter?: (userId: string, metadata?: Record<string, unknown>) => boolean;
}

/**
 * Cohort metrics
 */
export interface CohortMetrics {
  cohortId: string;
  totalUsers: number;
  activeUsers: number;
  retentionRate: number;
  avgSessionDuration: number;
  avgJourneysPerUser: number;
  completionRate: number;
  commonPaths: string[];
  topFeatures: Map<string, number>;
  conversionRate: number;
}

/**
 * Cohort comparison
 */
export interface CohortComparison {
  cohortA: CohortMetrics;
  cohortB: CohortMetrics;
  differences: {
    retentionRateDiff: number;
    sessionDurationDiff: number;
    completionRateDiff: number;
    conversionRateDiff: number;
  };
  insights: string[];
}

/**
 * Cohort Analyzer
 */
export class CohortAnalyzer {
  private cohorts: Map<string, Cohort> = new Map();
  private userJourneys: Map<string, JourneyPath[]> = new Map();

  /**
   * Create a new cohort
   */
  createCohort(name: string, criteria: CohortCriteria, description?: string): Cohort {
    const cohort: Cohort = {
      id: `cohort_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      criteria,
      users: new Set(),
      createdAt: Date.now(),
    };

    this.cohorts.set(cohort.id, cohort);
    return cohort;
  }

  /**
   * Add user to cohort
   */
  addUserToCohort(cohortId: string, userId: string): void {
    const cohort = this.cohorts.get(cohortId);
    if (cohort) {
      cohort.users.add(userId);
    }
  }

  /**
   * Remove user from cohort
   */
  removeUserFromCohort(cohortId: string, userId: string): void {
    const cohort = this.cohorts.get(cohortId);
    if (cohort) {
      cohort.users.delete(userId);
    }
  }

  /**
   * Check if user matches cohort criteria
   */
  matchesCriteria(
    userId: string,
    criteria: CohortCriteria,
    metadata?: Record<string, unknown>
  ): boolean {
    switch (criteria.type) {
      case 'signup_date':
        if (criteria.dateRange && metadata?.signupDate) {
          const signupDate = metadata.signupDate as number;
          return (
            signupDate >= criteria.dateRange.start && signupDate <= criteria.dateRange.end
          );
        }
        return false;

      case 'user_property':
        if (criteria.property && metadata) {
          const value = metadata[criteria.property.key];
          const targetValue = criteria.property.value;
          const operator = criteria.property.operator || 'equals';

          switch (operator) {
            case 'equals':
              return value === targetValue;
            case 'contains':
              return String(value).includes(String(targetValue));
            case 'greater_than':
              return Number(value) > Number(targetValue);
            case 'less_than':
              return Number(value) < Number(targetValue);
            default:
              return false;
          }
        }
        return false;

      case 'behavior_pattern':
        if (criteria.behavior) {
          const journeys = this.userJourneys.get(userId) || [];
          const actionCount = journeys.reduce((count, journey) => {
            return (
              count +
              journey.steps.filter((step) => step.metadata?.action === criteria.behavior!.action)
                .length
            );
          }, 0);

          return actionCount >= (criteria.behavior.minOccurrences || 1);
        }
        return false;

      case 'custom':
        if (criteria.customFilter) {
          return criteria.customFilter(userId, metadata);
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Auto-assign users to cohorts based on criteria
   */
  autoAssignUsers(userMetadata: Map<string, Record<string, unknown>>): void {
    this.cohorts.forEach((cohort) => {
      userMetadata.forEach((metadata, userId) => {
        if (this.matchesCriteria(userId, cohort.criteria, metadata)) {
          this.addUserToCohort(cohort.id, userId);
        }
      });
    });
  }

  /**
   * Track user journeys for cohort analysis
   */
  trackUserJourney(userId: string, journey: JourneyPath): void {
    if (!this.userJourneys.has(userId)) {
      this.userJourneys.set(userId, []);
    }
    this.userJourneys.get(userId)!.push(journey);
  }

  /**
   * Calculate cohort metrics
   */
  calculateCohortMetrics(cohortId: string): CohortMetrics | null {
    const cohort = this.cohorts.get(cohortId);
    if (!cohort) return null;

    const cohortJourneys: JourneyPath[] = [];
    const userSessionCounts = new Map<string, number>();
    const pathCounts = new Map<string, number>();
    const featureCounts = new Map<string, number>();

    let totalDuration = 0;
    let completedJourneys = 0;
    let conversions = 0;

    // Collect journeys for cohort users
    cohort.users.forEach((userId) => {
      const journeys = this.userJourneys.get(userId) || [];
      cohortJourneys.push(...journeys);

      userSessionCounts.set(userId, journeys.length);

      journeys.forEach((journey) => {
        totalDuration += journey.totalDuration || 0;
        if (journey.completed) completedJourneys++;

        // Track paths
        const pathKey = journey.steps.map((s) => s.path).join('→');
        pathCounts.set(pathKey, (pathCounts.get(pathKey) || 0) + 1);

        // Track features
        journey.steps.forEach((step) => {
          if (step.metadata?.feature) {
            const feature = step.metadata.feature as string;
            featureCounts.set(feature, (featureCounts.get(feature) || 0) + 1);
          }
        });

        // Track conversions
        if (journey.metadata?.converted) {
          conversions++;
        }
      });
    });

    const totalUsers = cohort.users.size;
    const activeUsers = userSessionCounts.size;
    const totalJourneys = cohortJourneys.length;

    // Calculate metrics
    const retentionRate = totalUsers > 0 ? activeUsers / totalUsers : 0;
    const avgSessionDuration = totalJourneys > 0 ? totalDuration / totalJourneys : 0;
    const avgJourneysPerUser = activeUsers > 0 ? totalJourneys / activeUsers : 0;
    const completionRate = totalJourneys > 0 ? completedJourneys / totalJourneys : 0;
    const conversionRate = totalJourneys > 0 ? conversions / totalJourneys : 0;

    // Get top paths
    const commonPaths = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path]) => path);

    return {
      cohortId,
      totalUsers,
      activeUsers,
      retentionRate,
      avgSessionDuration,
      avgJourneysPerUser,
      completionRate,
      commonPaths,
      topFeatures: featureCounts,
      conversionRate,
    };
  }

  /**
   * Compare two cohorts
   */
  compareCohorts(cohortAId: string, cohortBId: string): CohortComparison | null {
    const metricsA = this.calculateCohortMetrics(cohortAId);
    const metricsB = this.calculateCohortMetrics(cohortBId);

    if (!metricsA || !metricsB) return null;

    const differences = {
      retentionRateDiff: metricsA.retentionRate - metricsB.retentionRate,
      sessionDurationDiff: metricsA.avgSessionDuration - metricsB.avgSessionDuration,
      completionRateDiff: metricsA.completionRate - metricsB.completionRate,
      conversionRateDiff: metricsA.conversionRate - metricsB.conversionRate,
    };

    const insights: string[] = [];

    // Generate insights
    if (Math.abs(differences.retentionRateDiff) > 0.1) {
      insights.push(
        `Cohort A has ${differences.retentionRateDiff > 0 ? 'higher' : 'lower'} retention rate by ${Math.abs(differences.retentionRateDiff * 100).toFixed(1)}%`
      );
    }

    if (Math.abs(differences.completionRateDiff) > 0.1) {
      insights.push(
        `Cohort A has ${differences.completionRateDiff > 0 ? 'higher' : 'lower'} completion rate by ${Math.abs(differences.completionRateDiff * 100).toFixed(1)}%`
      );
    }

    if (Math.abs(differences.conversionRateDiff) > 0.05) {
      insights.push(
        `Cohort A has ${differences.conversionRateDiff > 0 ? 'higher' : 'lower'} conversion rate by ${Math.abs(differences.conversionRateDiff * 100).toFixed(1)}%`
      );
    }

    if (Math.abs(differences.sessionDurationDiff) > 10000) {
      insights.push(
        `Cohort A has ${differences.sessionDurationDiff > 0 ? 'longer' : 'shorter'} average session duration by ${Math.abs(differences.sessionDurationDiff / 1000).toFixed(1)}s`
      );
    }

    return {
      cohortA: metricsA,
      cohortB: metricsB,
      differences,
      insights,
    };
  }

  /**
   * Get cohort retention over time
   */
  getCohortRetention(
    cohortId: string,
    timeWindows: number[]
  ): Map<number, number> {
    const cohort = this.cohorts.get(cohortId);
    if (!cohort) return new Map();

    const retention = new Map<number, number>();
    const cohortStartTime = cohort.createdAt;

    timeWindows.forEach((window) => {
      const windowEnd = cohortStartTime + window;
      let activeUsers = 0;

      cohort.users.forEach((userId) => {
        const journeys = this.userJourneys.get(userId) || [];
        const hasActivityInWindow = journeys.some(
          (journey) =>
            journey.startTime >= cohortStartTime && journey.startTime <= windowEnd
        );

        if (hasActivityInWindow) {
          activeUsers++;
        }
      });

      const retentionRate = cohort.users.size > 0 ? activeUsers / cohort.users.size : 0;
      retention.set(window, retentionRate);
    });

    return retention;
  }

  /**
   * Get all cohorts
   */
  getCohorts(): Cohort[] {
    return Array.from(this.cohorts.values());
  }

  /**
   * Get cohort by ID
   */
  getCohort(cohortId: string): Cohort | undefined {
    return this.cohorts.get(cohortId);
  }

  /**
   * Delete cohort
   */
  deleteCohort(cohortId: string): boolean {
    return this.cohorts.delete(cohortId);
  }
}

/**
 * Predefined cohort builders
 */
export class CohortBuilders {
  /**
   * Create cohort by signup date range
   */
  static bySignupDate(
    analyzer: CohortAnalyzer,
    name: string,
    startDate: number,
    endDate: number
  ): Cohort {
    return analyzer.createCohort(
      name,
      {
        type: 'signup_date',
        dateRange: { start: startDate, end: endDate },
      },
      `Users who signed up between ${new Date(startDate).toLocaleDateString()} and ${new Date(endDate).toLocaleDateString()}`
    );
  }

  /**
   * Create cohort by user property
   */
  static byUserProperty(
    analyzer: CohortAnalyzer,
    name: string,
    propertyKey: string,
    propertyValue: string | number | boolean,
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' = 'equals'
  ): Cohort {
    return analyzer.createCohort(
      name,
      {
        type: 'user_property',
        property: { key: propertyKey, value: propertyValue, operator },
      },
      `Users where ${propertyKey} ${operator} ${propertyValue}`
    );
  }

  /**
   * Create cohort by behavior pattern
   */
  static byBehavior(
    analyzer: CohortAnalyzer,
    name: string,
    action: string,
    minOccurrences = 1
  ): Cohort {
    return analyzer.createCohort(
      name,
      {
        type: 'behavior_pattern',
        behavior: { action, minOccurrences },
      },
      `Users who performed "${action}" at least ${minOccurrences} times`
    );
  }

  /**
   * Create cohort with custom filter
   */
  static custom(
    analyzer: CohortAnalyzer,
    name: string,
    filter: (userId: string, metadata?: Record<string, unknown>) => boolean,
    description?: string
  ): Cohort {
    return analyzer.createCohort(
      name,
      {
        type: 'custom',
        customFilter: filter,
      },
      description
    );
  }
}

// Create singleton instance
export const cohortAnalyzer = new CohortAnalyzer();

// Export utilities
export { CohortBuilders };
