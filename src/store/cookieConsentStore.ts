import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cookie Consent Categories
 */
export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

/**
 * Cookie Consent Preferences
 */
export interface CookieConsent {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

/**
 * Cookie Consent State
 */
interface CookieConsentState {
  hasConsented: boolean;
  consent: CookieConsent;
  consentDate: string | null;
  bannerDismissed: boolean;
}

/**
 * Cookie Consent Actions
 */
interface CookieConsentActions {
  setConsent: (consent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  dismissBanner: () => void;
  resetConsent: () => void;
}

type CookieConsentStore = CookieConsentState & CookieConsentActions;

/**
 * Default consent state (only necessary cookies)
 */
const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

/**
 * Cookie Consent Store
 *
 * Manages user cookie consent preferences with localStorage persistence
 */
export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set) => ({
      // State
      hasConsented: false,
      consent: defaultConsent,
      consentDate: null,
      bannerDismissed: false,

      // Actions
      setConsent: (newConsent) =>
        set((state) => ({
          hasConsented: true,
          consent: {
            ...state.consent,
            ...newConsent,
            necessary: true, // Always true
          },
          consentDate: new Date().toISOString(),
          bannerDismissed: true,
        })),

      acceptAll: () =>
        set({
          hasConsented: true,
          consent: {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
          },
          consentDate: new Date().toISOString(),
          bannerDismissed: true,
        }),

      rejectAll: () =>
        set({
          hasConsented: true,
          consent: defaultConsent,
          consentDate: new Date().toISOString(),
          bannerDismissed: true,
        }),

      dismissBanner: () =>
        set({
          bannerDismissed: true,
        }),

      resetConsent: () =>
        set({
          hasConsented: false,
          consent: defaultConsent,
          consentDate: null,
          bannerDismissed: false,
        }),
    }),
    {
      name: 'cookie-consent-storage',
    }
  )
);
