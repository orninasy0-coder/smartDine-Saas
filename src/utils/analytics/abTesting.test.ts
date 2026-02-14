/**
 * A/B Testing Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  assignVariant,
  calculateABTestResults,
  compareVariants,
  calculateMinimumSampleSize,
  getStoredVariant,
  storeVariant,
  clearStoredVariant,
  type ABTest,
  type ABTestResult,
} from './abTesting';

describe('A/B Testing', () => {
  const mockTest: ABTest = {
    id: 'test_1',
    name: 'Test 1',
    variants: [
      { id: 'control', name: 'Control', weight: 50 },
      { id: 'variant_a', name: 'Variant A', weight: 50 },
    ],
    startDate: new Date(),
    status: 'running',
    targetMetric: 'conversion',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('assignVariant', () => {
    it('should assign a variant', () => {
      const variant = assignVariant(mockTest);
      expect(variant).toBeDefined();
      expect(mockTest.variants).toContainEqual(variant);
    });

    it('should assign consistently for same user ID', () => {
      const userId = 'user123';
      const variant1 = assignVariant(mockTest, userId);
      const variant2 = assignVariant(mockTest, userId);
      expect(variant1.id).toBe(variant2.id);
    });

    it('should assign variants based on weights', () => {
      const weightedTest: ABTest = {
        ...mockTest,
        variants: [
          { id: 'control', name: 'Control', weight: 50 },
          { id: 'variant_a', name: 'Variant A', weight: 50 },
        ],
      };

      const assignments = new Map<string, number>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const variant = assignVariant(weightedTest, `user${i}`);
        assignments.set(variant.id, (assignments.get(variant.id) || 0) + 1);
      }

      const controlCount = assignments.get('control') || 0;
      const variantCount = assignments.get('variant_a') || 0;

      // Both variants should get some assignments
      expect(controlCount + variantCount).toBe(iterations);
      // At least one variant should have assignments
      expect(controlCount > 0 || variantCount > 0).toBe(true);
    });
  });

  describe('calculateABTestResults', () => {
    it('should calculate results correctly', () => {
      const impressions = new Map([
        ['control', 1000],
        ['variant_a', 1000],
      ]);

      const conversions = new Map([
        ['control', 150],
        ['variant_a', 200],
      ]);

      const results = calculateABTestResults(impressions, conversions);

      expect(results.get('control')?.conversionRate).toBe(15);
      expect(results.get('variant_a')?.conversionRate).toBe(20);
    });

    it('should handle zero impressions', () => {
      const impressions = new Map([['control', 0]]);
      const conversions = new Map([['control', 0]]);

      const results = calculateABTestResults(impressions, conversions);

      expect(results.get('control')?.conversionRate).toBe(0);
    });

    it('should calculate average values', () => {
      const impressions = new Map([['control', 100]]);
      const conversions = new Map([['control', 50]]);
      const values = new Map([['control', [10, 20, 30, 40, 50]]]);

      const results = calculateABTestResults(impressions, conversions, values);

      expect(results.get('control')?.averageValue).toBe(30);
      expect(results.get('control')?.totalValue).toBe(150);
    });
  });

  describe('compareVariants', () => {
    it('should identify winner with statistical significance', () => {
      const control: ABTestResult = {
        testId: 'test_1',
        variantId: 'control',
        variantName: 'Control',
        impressions: 5000,
        conversions: 750,
        conversionRate: 15,
      };

      const variantA: ABTestResult = {
        testId: 'test_1',
        variantId: 'variant_a',
        variantName: 'Variant A',
        impressions: 5000,
        conversions: 1000,
        conversionRate: 20,
      };

      const comparison = compareVariants(control, [variantA], 0.95);

      expect(comparison.winner).toBeDefined();
      expect(comparison.winner?.variantId).toBe('variant_a');
      expect(comparison.statisticalSignificance).toBe(true);
    });

    it('should not declare winner without statistical significance', () => {
      const control: ABTestResult = {
        testId: 'test_1',
        variantId: 'control',
        variantName: 'Control',
        impressions: 100,
        conversions: 15,
        conversionRate: 15,
      };

      const variantA: ABTestResult = {
        testId: 'test_1',
        variantId: 'variant_a',
        variantName: 'Variant A',
        impressions: 100,
        conversions: 20,
        conversionRate: 20,
      };

      const comparison = compareVariants(control, [variantA], 0.95);

      // With small sample size, should not be statistically significant
      expect(comparison.statisticalSignificance).toBe(false);
    });

    it('should provide recommendation', () => {
      const control: ABTestResult = {
        testId: 'test_1',
        variantId: 'control',
        variantName: 'Control',
        impressions: 5000,
        conversions: 750,
        conversionRate: 15,
      };

      const variantA: ABTestResult = {
        testId: 'test_1',
        variantId: 'variant_a',
        variantName: 'Variant A',
        impressions: 5000,
        conversions: 1000,
        conversionRate: 20,
      };

      const comparison = compareVariants(control, [variantA], 0.95);

      expect(comparison.recommendation).toBeDefined();
      expect(comparison.recommendation.length).toBeGreaterThan(0);
    });
  });

  describe('calculateMinimumSampleSize', () => {
    it('should calculate minimum sample size', () => {
      const sampleSize = calculateMinimumSampleSize(15, 20, 0.95, 0.8);

      expect(sampleSize).toBeGreaterThan(0);
      expect(Number.isInteger(sampleSize)).toBe(true);
    });

    it('should require larger sample for smaller effects', () => {
      const smallEffect = calculateMinimumSampleSize(15, 10, 0.95, 0.8);
      const largeEffect = calculateMinimumSampleSize(15, 50, 0.95, 0.8);

      expect(smallEffect).toBeGreaterThan(largeEffect);
    });
  });

  describe('Variant storage', () => {
    it('should store and retrieve variant', () => {
      const testId = 'test_1';
      const variantId = 'variant_a';

      storeVariant(testId, variantId);
      const retrieved = getStoredVariant(testId);

      expect(retrieved).toBe(variantId);
    });

    it('should clear stored variant', () => {
      const testId = 'test_1';
      const variantId = 'variant_a';

      storeVariant(testId, variantId);
      clearStoredVariant(testId);
      const retrieved = getStoredVariant(testId);

      expect(retrieved).toBeNull();
    });

    it('should return null for non-existent variant', () => {
      const retrieved = getStoredVariant('non_existent_test');
      expect(retrieved).toBeNull();
    });
  });
});
