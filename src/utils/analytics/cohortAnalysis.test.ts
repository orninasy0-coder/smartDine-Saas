/**
 * Cohort Analysis Tests
 * Test cohort behavior analysis functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CohortAnalyzer,
  CohortBuilders,
  type JourneyPath,
  type CohortCriteria,
} from './cohortAnalysis';

describe('CohortAnalyzer', () => {
  let analyzer: CohortAnalyzer;

  beforeEach(() => {
    analyzer = new CohortAnalyzer();
  });

  it('should create a new cohort', () => {
    const criteria: CohortCriteria = {
      type: 'signup_date',
      dateRange: { start: Date.now() - 7 * 24 * 60 * 60 * 1000, end: Date.now() },
    };

    const cohort = analyzer.createCohort('New Users', criteria, 'Users from last 7 days');

    expect(cohort.name).toBe('New Users');
    expect(cohort.description).toBe('Users from last 7 days');
    expect(cohort.users.size).toBe(0);
  });

  it('should add and remove users from cohort', () => {
    const criteria: CohortCriteria = { type: 'custom' };
    const cohort = analyzer.createCohort('Test Cohort', criteria);

    analyzer.addUserToCohort(cohort.id, 'user1');
    analyzer.addUserToCohort(cohort.id, 'user2');

    expect(cohort.users.size).toBe(2);
    expect(cohort.users.has('user1')).toBe(true);

    analyzer.removeUserFromCohort(cohort.id, 'user1');
    expect(cohort.users.size).toBe(1);
    expect(cohort.users.has('user1')).toBe(false);
  });

  it('should match signup date criteria', () => {
    const now = Date.now();
    const criteria: CohortCriteria = {
      type: 'signup_date',
      dateRange: { start: now - 7 * 24 * 60 * 60 * 1000, end: now },
    };

    const recentUser = analyzer.matchesCriteria('user1', criteria, {
      signupDate: now - 3 * 24 * 60 * 60 * 1000,
    });
    expect(recentUser).toBe(true);

    const oldUser = analyzer.matchesCriteria('user2', criteria, {
      signupDate: now - 30 * 24 * 60 * 60 * 1000,
    });
    expect(oldUser).toBe(false);
  });

  it('should match user property criteria with equals operator', () => {
    const criteria: CohortCriteria = {
      type: 'user_property',
      property: { key: 'plan', value: 'premium', operator: 'equals' },
    };

    const premiumUser = analyzer.matchesCriteria('user1', criteria, { plan: 'premium' });
    expect(premiumUser).toBe(true);

    const basicUser = analyzer.matchesCriteria('user2', criteria, { plan: 'basic' });
    expect(basicUser).toBe(false);
  });

  it('should match user property criteria with contains operator', () => {
    const criteria: CohortCriteria = {
      type: 'user_property',
      property: { key: 'email', value: '@example.com', operator: 'contains' },
    };

    const match = analyzer.matchesCriteria('user1', criteria, {
      email: 'user@example.com',
    });
    expect(match).toBe(true);

    const noMatch = analyzer.matchesCriteria('user2', criteria, {
      email: 'user@other.com',
    });
    expect(noMatch).toBe(false);
  });

  it('should match user property criteria with greater_than operator', () => {
    const criteria: CohortCriteria = {
      type: 'user_property',
      property: { key: 'age', value: 18, operator: 'greater_than' },
    };

    const adult = analyzer.matchesCriteria('user1', criteria, { age: 25 });
    expect(adult).toBe(true);

    const minor = analyzer.matchesCriteria('user2', criteria, { age: 16 });
    expect(minor).toBe(false);
  });

  it('should match behavior pattern criteria', () => {
    const criteria: CohortCriteria = {
      type: 'behavior_pattern',
      behavior: { action: 'purchase', minOccurrences: 3 },
    };

    // Create journeys with purchase actions
    const journey1: JourneyPath = {
      sessionId: 'session1',
      userId: 'user1',
      steps: [
        { path: '/home', timestamp: Date.now(), metadata: { action: 'purchase' } },
        { path: '/cart', timestamp: Date.now(), metadata: { action: 'purchase' } },
        { path: '/checkout', timestamp: Date.now(), metadata: { action: 'purchase' } },
      ],
      startTime: Date.now(),
      completed: true,
    };

    analyzer.trackUserJourney('user1', journey1);

    const matches = analyzer.matchesCriteria('user1', criteria);
    expect(matches).toBe(true);
  });

  it('should match custom filter criteria', () => {
    const criteria: CohortCriteria = {
      type: 'custom',
      customFilter: (userId, metadata) => {
        return metadata?.plan === 'premium' && (metadata?.age as number) > 21;
      },
    };

    const match = analyzer.matchesCriteria('user1', criteria, { plan: 'premium', age: 25 });
    expect(match).toBe(true);

    const noMatch = analyzer.matchesCriteria('user2', criteria, { plan: 'premium', age: 18 });
    expect(noMatch).toBe(false);
  });

  it('should auto-assign users to cohorts', () => {
    const criteria: CohortCriteria = {
      type: 'user_property',
      property: { key: 'plan', value: 'premium', operator: 'equals' },
    };

    const cohort = analyzer.createCohort('Premium Users', criteria);

    const userMetadata = new Map([
      ['user1', { plan: 'premium' }],
      ['user2', { plan: 'basic' }],
      ['user3', { plan: 'premium' }],
    ]);

    analyzer.autoAssignUsers(userMetadata);

    expect(cohort.users.size).toBe(2);
    expect(cohort.users.has('user1')).toBe(true);
    expect(cohort.users.has('user3')).toBe(true);
    expect(cohort.users.has('user2')).toBe(false);
  });

  it('should calculate cohort metrics', () => {
    const criteria: CohortCriteria = { type: 'custom' };
    const cohort = analyzer.createCohort('Test Cohort', criteria);

    // Add users
    analyzer.addUserToCohort(cohort.id, 'user1');
    analyzer.addUserToCohort(cohort.id, 'user2');

    // Track journeys
    const journey1: JourneyPath = {
      sessionId: 'session1',
      userId: 'user1',
      steps: [
        { path: '/home', timestamp: Date.now() },
        { path: '/products', timestamp: Date.now() + 1000, duration: 1000 },
      ],
      startTime: Date.now(),
      endTime: Date.now() + 2000,
      totalDuration: 2000,
      completed: true,
      metadata: { converted: true },
    };

    const journey2: JourneyPath = {
      sessionId: 'session2',
      userId: 'user2',
      steps: [{ path: '/home', timestamp: Date.now() }],
      startTime: Date.now(),
      endTime: Date.now() + 1000,
      totalDuration: 1000,
      completed: false,
    };

    analyzer.trackUserJourney('user1', journey1);
    analyzer.trackUserJourney('user2', journey2);

    const metrics = analyzer.calculateCohortMetrics(cohort.id);

    expect(metrics).not.toBeNull();
    expect(metrics!.totalUsers).toBe(2);
    expect(metrics!.activeUsers).toBe(2);
    expect(metrics!.retentionRate).toBe(1);
    expect(metrics!.completionRate).toBe(0.5);
    expect(metrics!.conversionRate).toBe(0.5);
  });

  it('should compare two cohorts', () => {
    const cohortA = analyzer.createCohort('Cohort A', { type: 'custom' });
    const cohortB = analyzer.createCohort('Cohort B', { type: 'custom' });

    analyzer.addUserToCohort(cohortA.id, 'user1');
    analyzer.addUserToCohort(cohortB.id, 'user2');

    // Track journeys with different completion rates
    const journeyA: JourneyPath = {
      sessionId: 'session1',
      userId: 'user1',
      steps: [{ path: '/home', timestamp: Date.now() }],
      startTime: Date.now(),
      endTime: Date.now() + 5000,
      totalDuration: 5000,
      completed: true,
    };

    const journeyB: JourneyPath = {
      sessionId: 'session2',
      userId: 'user2',
      steps: [{ path: '/home', timestamp: Date.now() }],
      startTime: Date.now(),
      endTime: Date.now() + 2000,
      totalDuration: 2000,
      completed: false,
    };

    analyzer.trackUserJourney('user1', journeyA);
    analyzer.trackUserJourney('user2', journeyB);

    const comparison = analyzer.compareCohorts(cohortA.id, cohortB.id);

    expect(comparison).not.toBeNull();
    expect(comparison!.cohortA.completionRate).toBe(1);
    expect(comparison!.cohortB.completionRate).toBe(0);
    expect(comparison!.differences.completionRateDiff).toBe(1);
    expect(comparison!.insights.length).toBeGreaterThan(0);
  });

  it('should calculate cohort retention over time', () => {
    const cohort = analyzer.createCohort('Test Cohort', { type: 'custom' });
    analyzer.addUserToCohort(cohort.id, 'user1');

    const journey: JourneyPath = {
      sessionId: 'session1',
      userId: 'user1',
      steps: [{ path: '/home', timestamp: cohort.createdAt + 1000 }],
      startTime: cohort.createdAt + 1000,
      completed: true,
    };

    analyzer.trackUserJourney('user1', journey);

    const timeWindows = [
      1 * 24 * 60 * 60 * 1000, // 1 day
      7 * 24 * 60 * 60 * 1000, // 7 days
    ];

    const retention = analyzer.getCohortRetention(cohort.id, timeWindows);

    expect(retention.size).toBe(2);
    expect(retention.get(timeWindows[0])).toBe(1);
  });

  it('should get all cohorts', () => {
    analyzer.createCohort('Cohort 1', { type: 'custom' });
    analyzer.createCohort('Cohort 2', { type: 'custom' });

    const cohorts = analyzer.getCohorts();
    expect(cohorts).toHaveLength(2);
  });

  it('should delete cohort', () => {
    const cohort = analyzer.createCohort('Test Cohort', { type: 'custom' });
    const deleted = analyzer.deleteCohort(cohort.id);

    expect(deleted).toBe(true);
    expect(analyzer.getCohort(cohort.id)).toBeUndefined();
  });
});

describe('CohortBuilders', () => {
  let analyzer: CohortAnalyzer;

  beforeEach(() => {
    analyzer = new CohortAnalyzer();
  });

  it('should create cohort by signup date', () => {
    const startDate = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const endDate = Date.now();

    const cohort = CohortBuilders.bySignupDate(analyzer, 'New Users', startDate, endDate);

    expect(cohort.name).toBe('New Users');
    expect(cohort.criteria.type).toBe('signup_date');
    expect(cohort.criteria.dateRange?.start).toBe(startDate);
    expect(cohort.criteria.dateRange?.end).toBe(endDate);
  });

  it('should create cohort by user property', () => {
    const cohort = CohortBuilders.byUserProperty(analyzer, 'Premium Users', 'plan', 'premium');

    expect(cohort.name).toBe('Premium Users');
    expect(cohort.criteria.type).toBe('user_property');
    expect(cohort.criteria.property?.key).toBe('plan');
    expect(cohort.criteria.property?.value).toBe('premium');
  });

  it('should create cohort by behavior', () => {
    const cohort = CohortBuilders.byBehavior(analyzer, 'Active Users', 'page_view', 10);

    expect(cohort.name).toBe('Active Users');
    expect(cohort.criteria.type).toBe('behavior_pattern');
    expect(cohort.criteria.behavior?.action).toBe('page_view');
    expect(cohort.criteria.behavior?.minOccurrences).toBe(10);
  });

  it('should create cohort with custom filter', () => {
    const filter = (userId: string, metadata?: Record<string, unknown>) => {
      return metadata?.active === true;
    };

    const cohort = CohortBuilders.custom(analyzer, 'Custom Cohort', filter, 'Active users only');

    expect(cohort.name).toBe('Custom Cohort');
    expect(cohort.criteria.type).toBe('custom');
    expect(cohort.description).toBe('Active users only');
  });
});
