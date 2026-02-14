/**
 * User Journey Tests
 * Test user journey tracking and analysis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  UserJourneyTracker,
  PathAnalyzer,
  JourneySegmentation,
  type JourneyPath,
} from './userJourney';

describe('UserJourneyTracker', () => {
  let tracker: UserJourneyTracker;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    tracker = new UserJourneyTracker('test-session', 'test-user');
  });

  it('should start a new journey', () => {
    const journey = tracker.getCurrentJourney();
    expect(journey).not.toBeNull();
    expect(journey?.sessionId).toBe('test-session');
    expect(journey?.userId).toBe('test-user');
    expect(journey?.steps).toHaveLength(0);
  });

  it('should track journey steps', () => {
    tracker.trackStep('/home');
    tracker.trackStep('/products');
    tracker.trackStep('/cart');

    const journey = tracker.getCurrentJourney();
    expect(journey?.steps).toHaveLength(3);
    expect(journey?.steps[0].path).toBe('/home');
    expect(journey?.steps[1].path).toBe('/products');
    expect(journey?.steps[2].path).toBe('/cart');
  });

  it('should calculate step durations', async () => {
    tracker.trackStep('/home');
    // Wait a bit to ensure timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 10));
    tracker.trackStep('/products');

    const journey = tracker.getCurrentJourney();
    expect(journey?.steps[1].duration).toBeGreaterThan(0);
  });

  it('should end journey and add to history', () => {
    tracker.trackStep('/home');
    tracker.trackStep('/products');
    tracker.endJourney(true, '/checkout');

    const history = tracker.getJourneyHistory();
    expect(history).toHaveLength(1);
    expect(history[0].completed).toBe(true);
    expect(history[0].exitPoint).toBe('/checkout');
  });

  it('should generate journey path string', () => {
    tracker.trackStep('/home');
    tracker.trackStep('/products');
    tracker.trackStep('/cart');

    const pathString = tracker.getJourneyPath();
    expect(pathString).toBe('/home → /products → /cart');
  });

  it('should analyze journey patterns', () => {
    // Clear history and create fresh tracker
    localStorage.clear();
    const freshTracker = new UserJourneyTracker('pattern-test', 'test-user');
    
    // Create multiple journeys
    for (let i = 0; i < 5; i++) {
      if (i > 0) freshTracker.startNewJourney();
      freshTracker.trackStep('/home');
      freshTracker.trackStep('/products');
      freshTracker.trackStep('/cart');
      freshTracker.endJourney(i < 3); // 3 completed, 2 abandoned
    }

    const analytics = freshTracker.analyzeJourneys();
    expect(analytics.totalJourneys).toBe(5);
    expect(analytics.completedJourneys).toBe(3);
    expect(analytics.commonPaths).toHaveLength(1);
    expect(analytics.commonPaths[0].count).toBe(5);
  });

  it('should track entry and exit points', () => {
    // Clear history first
    tracker.clearData();
    tracker = new UserJourneyTracker('test-session-3', 'test-user');
    
    tracker.trackStep('/landing');
    tracker.trackStep('/features');
    tracker.endJourney(false, '/pricing');

    tracker.startNewJourney();
    tracker.trackStep('/home');
    tracker.trackStep('/products');
    tracker.endJourney(true, '/checkout');

    const analytics = tracker.analyzeJourneys();
    expect(analytics.entryPoints.get('/landing')).toBe(1);
    expect(analytics.entryPoints.get('/home')).toBe(1);
    expect(analytics.exitPoints.get('/pricing')).toBe(1);
    expect(analytics.exitPoints.get('/checkout')).toBe(1);
  });

  it('should track drop-off points for incomplete journeys', () => {
    // Clear history first
    tracker.clearData();
    tracker = new UserJourneyTracker('test-session-4', 'test-user');
    
    tracker.trackStep('/home');
    tracker.trackStep('/products');
    tracker.trackStep('/cart');
    tracker.endJourney(false);

    const analytics = tracker.analyzeJourneys();
    expect(analytics.dropOffPoints.get('/cart')).toBe(1);
  });

  it('should set user ID', () => {
    tracker.setUserId('new-user-id');
    const journey = tracker.getCurrentJourney();
    expect(journey?.userId).toBe('new-user-id');
  });

  it('should clear all data', () => {
    tracker.trackStep('/home');
    tracker.endJourney(true);

    tracker.clearData();

    expect(tracker.getCurrentJourney()).toBeNull();
    expect(tracker.getJourneyHistory()).toHaveLength(0);
  });
});

describe('PathAnalyzer', () => {
  const createMockJourney = (paths: string[], completed = true): JourneyPath => ({
    sessionId: 'test-session',
    steps: paths.map((path, index) => ({
      path,
      timestamp: Date.now() + index * 1000,
      duration: index > 0 ? 1000 : undefined,
    })),
    startTime: Date.now(),
    endTime: Date.now() + paths.length * 1000,
    totalDuration: paths.length * 1000,
    completed,
  });

  it('should find common paths between two points', () => {
    const journeys = [
      createMockJourney(['/home', '/products', '/details', '/cart']),
      createMockJourney(['/home', '/products', '/details', '/cart']),
      createMockJourney(['/home', '/search', '/details', '/cart']),
    ];

    const commonPaths = PathAnalyzer.findCommonPaths(journeys, '/home', '/cart');
    expect(commonPaths).toHaveLength(2);
    expect(commonPaths[0].count).toBe(2);
  });

  it('should calculate path efficiency', () => {
    const journey = createMockJourney(['/home', '/products', '/extra', '/cart']);
    const efficiency = PathAnalyzer.calculatePathEfficiency(journey, 3);
    expect(efficiency).toBe(0.75); // 3 optimal / 4 actual
  });

  it('should identify bottlenecks', () => {
    const journeys = [
      createMockJourney(['/home', '/slow-page', '/cart']),
      createMockJourney(['/home', '/slow-page', '/cart']),
    ];

    // Manually set longer duration for slow page
    journeys.forEach((j) => {
      j.steps[1].duration = 5000;
    });

    const bottlenecks = PathAnalyzer.identifyBottlenecks(journeys);
    const slowPageDuration = bottlenecks.get('/slow-page');
    expect(slowPageDuration).toBe(5000);
  });

  it('should find alternative paths', () => {
    const journeys = [
      createMockJourney(['/home', '/products', '/cart']),
      createMockJourney(['/home', '/search', '/cart']),
      createMockJourney(['/home', '/products', '/cart']),
    ];

    const alternatives = PathAnalyzer.findAlternativePaths(journeys, '/cart');
    expect(alternatives).toHaveLength(2);
    expect(alternatives[0].frequency).toBe(2);
  });
});

describe('JourneySegmentation', () => {
  const createMockJourney = (
    completed: boolean,
    duration: number,
    stepCount: number
  ): JourneyPath => ({
    sessionId: 'test-session',
    steps: Array.from({ length: stepCount }, (_, i) => ({
      path: `/step-${i}`,
      timestamp: Date.now() + i * 1000,
      duration: i > 0 ? 1000 : undefined,
    })),
    startTime: Date.now(),
    endTime: Date.now() + duration,
    totalDuration: duration,
    completed,
  });

  it('should segment by completion status', () => {
    const journeys = [
      createMockJourney(true, 5000, 3),
      createMockJourney(false, 3000, 2),
      createMockJourney(true, 4000, 3),
    ];

    const segments = JourneySegmentation.byCompletionStatus(journeys);
    expect(segments.completed).toHaveLength(2);
    expect(segments.abandoned).toHaveLength(1);
  });

  it('should segment by duration', () => {
    const journeys = [
      createMockJourney(true, 2000, 2),
      createMockJourney(true, 5000, 3),
      createMockJourney(true, 10000, 5),
    ];

    const segments = JourneySegmentation.byDuration(journeys, { fast: 3000, slow: 8000 });
    expect(segments.fast).toHaveLength(1);
    expect(segments.medium).toHaveLength(1);
    expect(segments.slow).toHaveLength(1);
  });

  it('should segment by path length', () => {
    const journeys = [
      createMockJourney(true, 2000, 2),
      createMockJourney(true, 5000, 4),
      createMockJourney(true, 10000, 8),
    ];

    const segments = JourneySegmentation.byPathLength(journeys, { short: 3, long: 6 });
    expect(segments.short).toHaveLength(1);
    expect(segments.medium).toHaveLength(1);
    expect(segments.long).toHaveLength(1);
  });

  it('should segment by entry point', () => {
    const journey1 = createMockJourney(true, 5000, 3);
    journey1.steps[0].path = '/home';

    const journey2 = createMockJourney(true, 5000, 3);
    journey2.steps[0].path = '/landing';

    const journey3 = createMockJourney(true, 5000, 3);
    journey3.steps[0].path = '/home';

    const journeys = [journey1, journey2, journey3];

    const segments = JourneySegmentation.byEntryPoint(journeys);
    expect(segments.get('/home')).toHaveLength(2);
    expect(segments.get('/landing')).toHaveLength(1);
  });
});
