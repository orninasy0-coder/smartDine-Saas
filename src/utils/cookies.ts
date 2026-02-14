/**
 * Cookie Management Utilities
 * Provides functions for setting, getting, and deleting cookies with consent awareness
 */

import type { CookieCategory } from '@/store/cookieConsentStore';

export interface CookieOptions {
  expires?: number | Date; // Days or Date object
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with optional parameters
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  const {
    expires,
    path = '/',
    domain,
    secure = true,
    sameSite = 'lax',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    const expiresDate =
      typeof expires === 'number'
        ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000)
        : expires;
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieStrings = document.cookie.split(';');

  for (let cookie of cookieStrings) {
    cookie = cookie.trim();
    const [name, value] = cookie.split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};

/**
 * Clear all cookies (except necessary ones)
 */
export const clearAllCookies = (except: string[] = []): void => {
  const cookies = getAllCookies();

  for (const name in cookies) {
    if (!except.includes(name)) {
      deleteCookie(name);
    }
  }
};

/**
 * Cookie categories mapping
 * Maps cookie names to their categories for consent management
 */
export const COOKIE_CATEGORIES: Record<string, CookieCategory> = {
  // Necessary cookies
  'cookie-consent-storage': 'necessary',
  'auth-token': 'necessary',
  'session-id': 'necessary',
  'csrf-token': 'necessary',

  // Analytics cookies
  '_ga': 'analytics',
  '_gid': 'analytics',
  '_gat': 'analytics',
  'posthog': 'analytics',
  'ph_': 'analytics',

  // Marketing cookies
  '_fbp': 'marketing',
  '_gcl_au': 'marketing',
  'ads_': 'marketing',

  // Preference cookies
  'theme': 'preferences',
  'language': 'preferences',
  'ui-preferences': 'preferences',
};

/**
 * Get the category of a cookie
 */
export const getCookieCategory = (cookieName: string): CookieCategory => {
  // Check exact match
  if (COOKIE_CATEGORIES[cookieName]) {
    return COOKIE_CATEGORIES[cookieName];
  }

  // Check prefix match
  for (const [pattern, category] of Object.entries(COOKIE_CATEGORIES)) {
    if (pattern.endsWith('_') && cookieName.startsWith(pattern)) {
      return category;
    }
  }

  // Default to necessary if unknown
  return 'necessary';
};

/**
 * Clear cookies by category
 */
export const clearCookiesByCategory = (category: CookieCategory): void => {
  const cookies = getAllCookies();

  for (const name in cookies) {
    if (getCookieCategory(name) === category) {
      deleteCookie(name);
    }
  }
};

/**
 * Clear non-consented cookies based on consent preferences
 */
export const clearNonConsentedCookies = (
  consent: Record<CookieCategory, boolean>
): void => {
  const cookies = getAllCookies();

  for (const name in cookies) {
    const category = getCookieCategory(name);
    if (!consent[category]) {
      deleteCookie(name);
    }
  }
};

export default {
  setCookie,
  getCookie,
  deleteCookie,
  hasCookie,
  getAllCookies,
  clearAllCookies,
  getCookieCategory,
  clearCookiesByCategory,
  clearNonConsentedCookies,
};
