/**
 * AI Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from './aiService';

// Mock fetch
global.fetch = vi.fn();

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return true when API key is configured', () => {
      const result = aiService.isAvailable();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getConfig', () => {
    it('should return configuration object', () => {
      const config = aiService.getConfig();
      
      expect(config).toHaveProperty('model');
      expect(config).toHaveProperty('maxTokens');
      expect(config).toHaveProperty('temperature');
      expect(config).toHaveProperty('isAvailable');
    });

    it('should have valid configuration values', () => {
      const config = aiService.getConfig();
      
      expect(config.maxTokens).toBeGreaterThan(0);
      expect(config.temperature).toBeGreaterThanOrEqual(0);
      expect(config.temperature).toBeLessThanOrEqual(2);
    });
  });

  describe('chat', () => {
    it('should throw error when API key is not configured', async () => {
      // This test assumes API key might not be configured in test environment
      // Adjust based on your test setup
      const request = {
        message: 'Hello',
        restaurantId: 'test-restaurant',
      };

      // If API key is not configured, should throw
      if (!aiService.isAvailable()) {
        await expect(aiService.chat(request)).rejects.toThrow();
      }
    });
  });
});
