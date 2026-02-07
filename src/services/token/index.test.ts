/**
 * Token service tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenService } from './index';
import { storage } from '../storage';

// Mock storage
vi.mock('../storage', () => ({
  storage: {
    setAuthToken: vi.fn(),
    getAuthToken: vi.fn(),
    setRefreshToken: vi.fn(),
    getRefreshToken: vi.fn(),
    clearAuthTokens: vi.fn(),
  },
}));

describe('TokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Token Decoding', () => {
    it('should decode a valid JWT token', () => {
      // Create a mock JWT token (header.payload.signature)
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
        iat: Math.floor(Date.now() / 1000),
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const mockToken = `header.${encodedPayload}.signature`;

      const user = tokenService.getUserFromToken(mockToken);

      expect(user).toEqual({
        id: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
      });
    });

    it('should return null for invalid token format', () => {
      const invalidToken = 'invalid.token';
      const user = tokenService.getUserFromToken(invalidToken);
      expect(user).toBeNull();
    });
  });

  describe('Token Expiration', () => {
    it('should detect expired token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) - 3600, // expired 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200,
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const expiredToken = `header.${encodedPayload}.signature`;

      expect(tokenService.isTokenExpired(expiredToken)).toBe(true);
    });

    it('should detect valid token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
        iat: Math.floor(Date.now() / 1000),
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const validToken = `header.${encodedPayload}.signature`;

      expect(tokenService.isTokenExpired(validToken)).toBe(false);
    });

    it('should get time until expiration', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: futureTime,
        iat: Math.floor(Date.now() / 1000),
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      const timeRemaining = tokenService.getTimeUntilExpiration(token);
      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(3600 * 1000); // Less than or equal to 1 hour in ms
    });
  });

  describe('Token Storage', () => {
    it('should store auth and refresh tokens', () => {
      const authToken = 'auth.token.here';
      const refreshToken = 'refresh.token.here';

      tokenService.setTokens(authToken, refreshToken);

      expect(storage.setAuthToken).toHaveBeenCalledWith(authToken);
      expect(storage.setRefreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it('should retrieve auth token', () => {
      const mockToken = 'mock.auth.token';
      vi.mocked(storage.getAuthToken).mockReturnValue(mockToken);

      const token = tokenService.getAuthToken();

      expect(token).toBe(mockToken);
      expect(storage.getAuthToken).toHaveBeenCalled();
    });

    it('should retrieve refresh token', () => {
      const mockRefreshToken = 'mock.refresh.token';
      vi.mocked(storage.getRefreshToken).mockReturnValue(mockRefreshToken);

      const token = tokenService.getRefreshToken();

      expect(token).toBe(mockRefreshToken);
      expect(storage.getRefreshToken).toHaveBeenCalled();
    });

    it('should clear all tokens', () => {
      tokenService.clearTokens();

      expect(storage.clearAuthTokens).toHaveBeenCalled();
    });
  });

  describe('Token Validation', () => {
    it('should return true for valid token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const validToken = `header.${encodedPayload}.signature`;

      vi.mocked(storage.getAuthToken).mockReturnValue(validToken);

      expect(tokenService.hasValidToken()).toBe(true);
    });

    it('should return false when no token exists', () => {
      vi.mocked(storage.getAuthToken).mockReturnValue(null);

      expect(tokenService.hasValidToken()).toBe(false);
    });

    it('should return false for expired token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) - 3600,
        iat: Math.floor(Date.now() / 1000) - 7200,
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const expiredToken = `header.${encodedPayload}.signature`;

      vi.mocked(storage.getAuthToken).mockReturnValue(expiredToken);

      expect(tokenService.hasValidToken()).toBe(false);
    });
  });

  describe('Token Refresh Logic', () => {
    it('should indicate token needs refresh when expiring soon', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) + 120, // expires in 2 minutes
        iat: Math.floor(Date.now() / 1000),
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const soonToExpireToken = `header.${encodedPayload}.signature`;

      vi.mocked(storage.getAuthToken).mockReturnValue(soonToExpireToken);

      expect(tokenService.shouldRefreshToken()).toBe(true);
    });

    it('should not indicate refresh needed for fresh token', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'CUSTOMER',
        exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
        iat: Math.floor(Date.now() / 1000),
      };

      const encodedPayload = btoa(JSON.stringify(payload));
      const freshToken = `header.${encodedPayload}.signature`;

      vi.mocked(storage.getAuthToken).mockReturnValue(freshToken);

      expect(tokenService.shouldRefreshToken()).toBe(false);
    });
  });
});
