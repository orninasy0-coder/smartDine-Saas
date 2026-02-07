/**
 * Token service for JWT handling
 * Provides utilities for token storage, retrieval, validation, and expiration checking
 */

import { storage } from '../storage';

interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
  [key: string]: unknown;
}

class TokenService {
  /**
   * Decodes a JWT token without verification
   * Note: This only decodes the payload, it does NOT verify the signature
   */
  private decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as JWTPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Checks if a token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    // Add 10 second buffer to account for clock skew
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime + 10;
  }

  /**
   * Gets the expiration time of a token in milliseconds
   */
  getTokenExpiration(token: string): number | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return null;
    }

    return payload.exp * 1000;
  }

  /**
   * Gets the time remaining until token expiration in milliseconds
   */
  getTimeUntilExpiration(token: string): number | null {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return null;
    }

    const remaining = expiration - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Extracts user information from token
   */
  getUserFromToken(token: string): { id: string; email: string; role: string } | null {
    const payload = this.decodeToken(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  /**
   * Stores auth and refresh tokens
   */
  setTokens(authToken: string, refreshToken: string): void {
    storage.setAuthToken(authToken);
    storage.setRefreshToken(refreshToken);
  }

  /**
   * Gets the current auth token
   */
  getAuthToken(): string | null {
    return storage.getAuthToken();
  }

  /**
   * Gets the current refresh token
   */
  getRefreshToken(): string | null {
    return storage.getRefreshToken();
  }

  /**
   * Checks if user has valid auth token
   */
  hasValidToken(): boolean {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  /**
   * Checks if refresh token is available and valid
   */
  hasValidRefreshToken(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    return !this.isTokenExpired(refreshToken);
  }

  /**
   * Removes all tokens from storage
   */
  clearTokens(): void {
    storage.clearAuthTokens();
  }

  /**
   * Checks if token needs refresh (expires in less than 5 minutes)
   */
  shouldRefreshToken(): boolean {
    const token = this.getAuthToken();
    if (!token) {
      return false;
    }

    const timeRemaining = this.getTimeUntilExpiration(token);
    if (timeRemaining === null) {
      return false;
    }

    // Refresh if less than 5 minutes remaining
    const FIVE_MINUTES = 5 * 60 * 1000;
    return timeRemaining < FIVE_MINUTES;
  }
}

export const tokenService = new TokenService();
