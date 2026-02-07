/**
 * Storage utilities for localStorage and sessionStorage
 */

import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { safeJsonParse } from '@/utils/helpers';

class StorageService {
  /**
   * Gets item from localStorage
   */
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return safeJsonParse<T>(item, fallback);
    } catch {
      return fallback;
    }
  }

  /**
   * Sets item in localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Removes item from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clears all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Gets auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Sets auth token
   */
  setAuthToken(token: string): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Removes auth token
   */
  removeAuthToken(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Gets user preferences
   */
  getUserPreferences<T>(fallback: T): T {
    return this.get(LOCAL_STORAGE_KEYS.USER_PREFERENCES, fallback);
  }

  /**
   * Sets user preferences
   */
  setUserPreferences<T>(preferences: T): void {
    this.set(LOCAL_STORAGE_KEYS.USER_PREFERENCES, preferences);
  }
}

export const storage = new StorageService();
