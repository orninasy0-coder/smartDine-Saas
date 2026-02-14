/**
 * A/B Testing Utilities
 * Track and analyze A/B test results
 */

import { analytics } from './index';

export interface ABTestVariant {
  id: string;
  name: string;
  description?: string;
  weight?: number; // Percentage of traffic (0-100)
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'running' | 'paused' | 'completed';
  targetMetric: string;
  minimumSampleSize?: number;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  variantName: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  averageValue?: number;
  totalValue?: number;
  confidence?: number;
  isWinner?: boolean;
}

export interface ABTestComparison {
  testId: string;
  testName: string;
  controlVariant: ABTestResult;
  variants: ABTestResult[];
  winner?: ABTestResult;
  statisticalSignificance: boolean;
  confidenceLevel: number;
  recommendation: string;
}

/**
 * Assign user to A/B test variant
 */
export function assignVariant(test: ABTest, userId?: string): ABTestVariant {
  // Use userId for consistent assignment, or random for anonymous users
  const seed = userId ? hashString(userId) : Math.random();
  
  // Calculate cumulative weights
  const totalWeight = test.variants.reduce((sum, v) => sum + (v.weight || 100 / test.variants.length), 0);
  const normalizedSeed = seed * totalWeight;
  
  let cumulativeWeight = 0;
  for (const variant of test.variants) {
    cumulativeWeight += variant.weight || 100 / test.variants.length;
    if (normalizedSeed <= cumulativeWeight) {
      return variant;
    }
  }
  
  // Fallback to first variant
  return test.variants[0];
}

/**
 * Track A/B test impression
 */
export function trackABTestImpression(
  testId: string,
  variantId: string,
  metadata?: Record<string, unknown>
): void {
  analytics.trackEvent({
    category: 'ab_test',
    action: 'impression',
    label: `${testId}_${variantId}`,
    metadata: {
      test_id: testId,
      variant_id: variantId,
      ...metadata,
    },
  });
}

/**
 * Track A/B test conversion
 */
export function trackABTestConversion(
  testId: string,
  variantId: string,
  value?: number,
  metadata?: Record<string, unknown>
): void {
  analytics.trackEvent({
    category: 'ab_test',
    action: 'conversion',
    label: `${testId}_${variantId}`,
    value,
    metadata: {
      test_id: testId,
      variant_id: variantId,
      conversion_value: value,
      ...metadata,
    },
  });
}

/**
 * Calculate A/B test results
 */
export function calculateABTestResults(
  impressions: Map<string, number>,
  conversions: Map<string, number>,
  values?: Map<string, number[]>
): Map<string, ABTestResult> {
  const results = new Map<string, ABTestResult>();
  
  impressions.forEach((impressionCount, variantId) => {
    const conversionCount = conversions.get(variantId) || 0;
    const conversionRate = impressionCount > 0 ? (conversionCount / impressionCount) * 100 : 0;
    
    const variantValues = values?.get(variantId) || [];
    const totalValue = variantValues.reduce((sum, v) => sum + v, 0);
    const averageValue = variantValues.length > 0 ? totalValue / variantValues.length : 0;
    
    results.set(variantId, {
      testId: '',
      variantId,
      variantName: variantId,
      impressions: impressionCount,
      conversions: conversionCount,
      conversionRate,
      averageValue,
      totalValue,
    });
  });
  
  return results;
}

/**
 * Compare A/B test variants and determine winner
 */
export function compareVariants(
  controlResult: ABTestResult,
  variantResults: ABTestResult[],
  confidenceLevel: number = 0.95
): ABTestComparison {
  // Calculate statistical significance using Z-test for proportions
  const results = [controlResult, ...variantResults];
  let winner: ABTestResult | undefined;
  let maxConversionRate = controlResult.conversionRate;
  let statisticalSignificance = false;
  
  variantResults.forEach((variant) => {
    const zScore = calculateZScore(
      controlResult.conversions,
      controlResult.impressions,
      variant.conversions,
      variant.impressions
    );
    
    const pValue = calculatePValue(zScore);
    const confidence = 1 - pValue;
    
    variant.confidence = confidence;
    
    // Check if this variant is significantly better than control
    if (confidence >= confidenceLevel && variant.conversionRate > maxConversionRate) {
      maxConversionRate = variant.conversionRate;
      winner = variant;
      statisticalSignificance = true;
      variant.isWinner = true;
    }
  });
  
  // If no variant beats control significantly, control might be the winner
  if (!winner && controlResult.conversionRate >= maxConversionRate) {
    controlResult.isWinner = true;
    winner = controlResult;
  }
  
  const recommendation = generateRecommendation(
    controlResult,
    variantResults,
    winner,
    statisticalSignificance,
    confidenceLevel
  );
  
  return {
    testId: controlResult.testId,
    testName: '',
    controlVariant: controlResult,
    variants: variantResults,
    winner,
    statisticalSignificance,
    confidenceLevel,
    recommendation,
  };
}

/**
 * Calculate Z-score for two proportions
 */
function calculateZScore(
  conversions1: number,
  impressions1: number,
  conversions2: number,
  impressions2: number
): number {
  const p1 = impressions1 > 0 ? conversions1 / impressions1 : 0;
  const p2 = impressions2 > 0 ? conversions2 / impressions2 : 0;
  
  const pooledP = (conversions1 + conversions2) / (impressions1 + impressions2);
  const standardError = Math.sqrt(
    pooledP * (1 - pooledP) * (1 / impressions1 + 1 / impressions2)
  );
  
  if (standardError === 0) return 0;
  
  return (p2 - p1) / standardError;
}

/**
 * Calculate p-value from Z-score (two-tailed test)
 */
function calculatePValue(zScore: number): number {
  // Approximation of cumulative distribution function
  const z = Math.abs(zScore);
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return 2 * p; // Two-tailed test
}

/**
 * Generate recommendation based on test results
 */
function generateRecommendation(
  control: ABTestResult,
  variants: ABTestResult[],
  winner: ABTestResult | undefined,
  significant: boolean,
  confidenceLevel: number
): string {
  if (!winner) {
    return 'No clear winner detected. Consider running the test longer to gather more data.';
  }
  
  if (!significant) {
    return `Winner identified but not statistically significant at ${(confidenceLevel * 100).toFixed(0)}% confidence level. Continue testing or increase sample size.`;
  }
  
  const improvement =
    control.conversionRate > 0
      ? ((winner.conversionRate - control.conversionRate) / control.conversionRate) * 100
      : 0;
  
  if (winner.variantId === control.variantId) {
    return `Control variant is performing best. No changes recommended. Consider testing more radical variations.`;
  }
  
  return `Variant "${winner.variantName}" is the clear winner with ${improvement.toFixed(1)}% improvement over control. Recommend rolling out to 100% of users.`;
}

/**
 * Calculate minimum sample size for A/B test
 */
export function calculateMinimumSampleSize(
  baselineConversionRate: number,
  minimumDetectableEffect: number,
  confidenceLevel: number = 0.95,
  power: number = 0.8
): number {
  // Simplified calculation using normal approximation
  const zAlpha = 1.96; // For 95% confidence (two-tailed)
  const zBeta = 0.84; // For 80% power
  
  const p1 = baselineConversionRate / 100;
  const p2 = p1 * (1 + minimumDetectableEffect / 100);
  
  const numerator =
    Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);
  
  return Math.ceil(numerator / denominator);
}

/**
 * Hash string to number (for consistent variant assignment)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

/**
 * Get A/B test variant from storage
 */
export function getStoredVariant(testId: string): string | null {
  try {
    return localStorage.getItem(`ab_test_${testId}`);
  } catch {
    return null;
  }
}

/**
 * Store A/B test variant assignment
 */
export function storeVariant(testId: string, variantId: string): void {
  try {
    localStorage.setItem(`ab_test_${testId}`, variantId);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear stored variant (for testing purposes)
 */
export function clearStoredVariant(testId: string): void {
  try {
    localStorage.removeItem(`ab_test_${testId}`);
  } catch {
    // Ignore storage errors
  }
}
