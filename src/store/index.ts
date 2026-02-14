/**
 * Global State Store
 *
 * Central export for all Zustand stores
 */

export { useAuthStore } from './authStore';
export { useUIStore } from './uiStore';
export { useCartStore } from './cartStore';
export { useCookieConsentStore } from './cookieConsentStore';
export type { CookieCategory, CookieConsent } from './cookieConsentStore';
export { useTermsStore, getTermsVersion, getAllTermsVersions, TERMS_VERSION_HISTORY } from './termsStore';
export type { TermsVersion, TermsAcceptance } from './termsStore';
