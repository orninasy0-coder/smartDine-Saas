import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiError } from './client';

describe('ApiClient Retry Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Retry on network errors', () => {
    it('should retry on network failure and succeed on second attempt', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });

      global.fetch = mockFetch;

      const result = await apiClient.get('/test', { retries: 2 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ id: 1 });
    });

    it('should fail after max retries on persistent network error', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      global.fetch = mockFetch;

      await expect(apiClient.get('/test', { retries: 2 })).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('Retry on server errors (5xx)', () => {
    it('should retry on 500 server error', async () => {
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({
            status: 'error',
            error: { code: 'SERVER_ERROR', message: 'Internal server error' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });

      global.fetch = mockFetch;

      const result = await apiClient.get('/test', { retries: 2 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('No retry on client errors (4xx)', () => {
    it('should not retry on 404 not found', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          status: 'error',
          error: { code: 'NOT_FOUND', message: 'Resource not found' },
        }),
      });

      global.fetch = mockFetch;

      await expect(apiClient.get('/test', { retries: 2 })).rejects.toThrow(ApiError);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });

    it('should not retry on 400 bad request', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          status: 'error',
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        }),
      });

      global.fetch = mockFetch;

      await expect(apiClient.post('/test', {}, { retries: 2 })).rejects.toThrow(ApiError);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });
  });

  describe('Retry on timeout', () => {
    it('should retry on request timeout', async () => {
      let callCount = 0;
      const mockFetch = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call times out
          return new Promise((_, reject) => {
            setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 10);
          });
        }
        // Second call succeeds
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });
      });

      global.fetch = mockFetch;

      const result = await apiClient.get('/test', { retries: 2, timeout: 5 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('Retry callback', () => {
    it('should call onRetry callback on each retry attempt', async () => {
      const onRetry = vi.fn();
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });

      global.fetch = mockFetch;

      await apiClient.get('/test', { retries: 3, onRetry });

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
      expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
    });
  });

  describe('Exponential backoff', () => {
    it('should wait with exponential backoff between retries', async () => {
      vi.useFakeTimers();

      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });

      global.fetch = mockFetch;

      const promise = apiClient.get('/test', { retries: 2, retryDelay: 1000 });

      // First attempt fails immediately
      await vi.advanceTimersByTimeAsync(0);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Wait for first retry delay (1000ms + jitter)
      await vi.advanceTimersByTimeAsync(2000);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Wait for second retry delay (2000ms + jitter)
      await vi.advanceTimersByTimeAsync(3000);
      expect(mockFetch).toHaveBeenCalledTimes(3);

      const result = await promise;
      expect(result).toEqual({ id: 1 });

      vi.useRealTimers();
    });
  });

  describe('Custom retry configuration', () => {
    it('should respect custom retry count', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      global.fetch = mockFetch;

      await expect(apiClient.get('/test', { retries: 5, retryDelay: 10 })).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(6); // Initial + 5 retries
    }, 10000); // Increase timeout for this test

    it('should respect custom timeout', async () => {
      const mockFetch = vi.fn().mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ status: 'success', data: { id: 1 } })
          }), 1000);
        })
      );
      global.fetch = mockFetch;

      await expect(apiClient.get('/test', { timeout: 100, retries: 0 })).rejects.toThrow();
    });
  });

  describe('All HTTP methods support retry', () => {
    it('should retry POST requests', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });

      global.fetch = mockFetch;

      const result = await apiClient.post('/test', { data: 'test' }, { retries: 1 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ id: 1 });
    });

    it('should retry PUT requests', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { id: 1 } }),
        });

      global.fetch = mockFetch;

      const result = await apiClient.put('/test', { data: 'test' }, { retries: 1 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ id: 1 });
    });

    it('should retry DELETE requests', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'success', data: { success: true } }),
        });

      global.fetch = mockFetch;

      const result = await apiClient.delete('/test', { retries: 1 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });
  });
});
