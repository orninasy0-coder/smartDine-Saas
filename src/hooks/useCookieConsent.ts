/**
 * Cookie Consent Hook
 * Provides utilities for managing cookie consent and checking permissions
 */

import { useEffect } from 'react';
import { useCookieConsentStore, type CookieCategory } from '@/store/cookieConsentStore';

export const useCookieConsent = () => {
  const {
    hasConsented,
    consent,
    consentDate,
    bannerDismissed,
    setConsent,
    acceptAll,
    rejectAll,
    dismissBanner,
    resetConsent,
  } = useCookieConsentStore();

  /**
   * Check if a specific cookie category is allowed
   */
  const isCategoryAllowed = (category: CookieCategory): boolean => {
    return consent[category];
  };

  /**
   * Check if analytics cookies are allowed
   */
  const canUseAnalytics = (): boolean => {
    return consent.analytics;
  };

  /**
   * Check if marketing cookies are allowed
   */
  const canUseMarketing = (): boolean => {
    return consent.marketing;
  };

  /**
   * Check if preference cookies are allowed
   */
  const canUsePreferences = (): boolean => {
    return consent.preferences;
  };

  /**
   * Get consent status for all categories
   */
  const getConsentStatus = () => {
    return {
      hasConsented,
      consent,
      consentDate,
      bannerDismissed,
    };
  };

  /**
   * Update consent for specific categories
   */
  const updateConsent = (categories: Partial<typeof consent>) => {
    setConsent(categories);
  };

  return {
    // State
    hasConsented,
    consent,
    consentDate,
    bannerDismissed,

    // Actions
    setConsent: updateConsent,
    acceptAll,
    rejectAll,
    dismissBanner,
    resetConsent,

    // Utilities
    isCategoryAllowed,
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences,
    getConsentStatus,
  };
};

/**
 * Hook to conditionally execute code based on cookie consent
 * Useful for initializing analytics, marketing pixels, etc.
 */
export const useConditionalEffect = (
  effect: () => void | (() => void),
  category: CookieCategory,
  deps: React.DependencyList = []
) => {
  const { isCategoryAllowed } = useCookieConsent();

  useEffect(() => {
    if (isCategoryAllowed(category)) {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isCategoryAllowed(category), ...deps]);
};

export default useCookieConsent;
