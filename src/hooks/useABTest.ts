/**
 * A/B Testing Hook
 * React hook for A/B testing functionality
 */

import { useState, useEffect, useCallback } from 'react';
import {
  assignVariant,
  trackABTestImpression,
  trackABTestConversion,
  getStoredVariant,
  storeVariant,
  type ABTest,
  type ABTestVariant,
} from '@/utils/analytics/abTesting';

export interface UseABTestOptions {
  test: ABTest;
  userId?: string;
  autoTrackImpression?: boolean;
}

export function useABTest(options: UseABTestOptions) {
  const { test, userId, autoTrackImpression = true } = options;
  const [variant, setVariant] = useState<ABTestVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Assign variant on mount
  useEffect(() => {
    if (test.status !== 'running') {
      setIsLoading(false);
      return;
    }

    // Check for stored variant first
    const storedVariantId = getStoredVariant(test.id);
    let assignedVariant: ABTestVariant;

    if (storedVariantId) {
      // Use stored variant
      const found = test.variants.find((v) => v.id === storedVariantId);
      assignedVariant = found || assignVariant(test, userId);
    } else {
      // Assign new variant
      assignedVariant = assignVariant(test, userId);
      storeVariant(test.id, assignedVariant.id);
    }

    setVariant(assignedVariant);
    setIsLoading(false);

    // Auto-track impression
    if (autoTrackImpression) {
      trackABTestImpression(test.id, assignedVariant.id);
    }
  }, [test, userId, autoTrackImpression]);

  /**
   * Track conversion for the current variant
   */
  const trackConversion = useCallback(
    (value?: number, metadata?: Record<string, unknown>) => {
      if (!variant) return;
      trackABTestConversion(test.id, variant.id, value, metadata);
    },
    [test.id, variant]
  );

  /**
   * Track impression manually
   */
  const trackImpression = useCallback(
    (metadata?: Record<string, unknown>) => {
      if (!variant) return;
      trackABTestImpression(test.id, variant.id, metadata);
    },
    [test.id, variant]
  );

  /**
   * Check if current variant matches a specific variant ID
   */
  const isVariant = useCallback(
    (variantId: string): boolean => {
      return variant?.id === variantId;
    },
    [variant]
  );

  return {
    variant,
    isLoading,
    trackConversion,
    trackImpression,
    isVariant,
  };
}
