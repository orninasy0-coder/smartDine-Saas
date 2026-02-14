/**
 * API client configuration
 */

import { API_BASE_URL } from '@/utils/constants';
import { tokenService } from '../token';
import type { ApiResponse } from '@/utils/types';

export class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, unknown>;
  skipAuth?: boolean; // Skip authentication for public endpoints
  retries?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Initial retry delay in ms (default: 1000)
  timeout?: number; // Request timeout in ms (default: 30000)
  onRetry?: (attempt: number, error: Error) => void; // Callback on retry
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;
  private readonly DEFAULT_RETRIES = 3;
  private readonly DEFAULT_RETRY_DELAY = 1000;
  private readonly DEFAULT_TIMEOUT = 30000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return tokenService.getAuthToken();
  }

  /**
   * Refreshes the auth token using the refresh token
   */
  private async refreshAuthToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new ApiError('NO_REFRESH_TOKEN', 'No refresh token available');
        }

        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const data: ApiResponse<{ token: string; refreshToken: string }> = await response.json();

        if (!response.ok || data.status === 'error') {
          throw new ApiError(
            data.error?.code || 'REFRESH_FAILED',
            data.error?.message || 'Failed to refresh token'
          );
        }

        const { token, refreshToken: newRefreshToken } = data.data as {
          token: string;
          refreshToken: string;
        };

        // Store new tokens
        tokenService.setTokens(token, newRefreshToken);

        return token;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Checks if token needs refresh and refreshes if necessary
   */
  private async ensureValidToken(): Promise<string | null> {
    const token = this.getAuthToken();

    if (!token) {
      return null;
    }

    // If token is expired, try to refresh
    if (tokenService.isTokenExpired(token)) {
      try {
        return await this.refreshAuthToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        tokenService.clearTokens();
        return null;
      }
    }

    // If token expires soon, refresh in background
    if (tokenService.shouldRefreshToken()) {
      this.refreshAuthToken().catch((error) => {
        console.error('Background token refresh failed:', error);
      });
    }

    return token;
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Determines if an error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof ApiError) {
      // Don't retry client errors (4xx) except 408 (timeout) and 429 (rate limit)
      const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', 'RATE_LIMIT', 'SERVER_ERROR'];
      return retryableCodes.includes(error.code);
    }

    // Retry network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }

    return false;
  }

  /**
   * Calculates retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number, baseDelay: number): number {
    // Exponential backoff: baseDelay * 2^attempt with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add random jitter up to 1 second
    return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
  }

  /**
   * Wraps fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('TIMEOUT', `Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Executes a request with retry logic
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<Response>,
    config?: RequestConfig
  ): Promise<T> {
    const maxRetries = config?.retries ?? this.DEFAULT_RETRIES;
    const retryDelay = config?.retryDelay ?? this.DEFAULT_RETRY_DELAY;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry if it's the last attempt or error is not retryable
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          throw error;
        }

        // Call retry callback if provided
        if (config?.onRetry) {
          config.onRetry(attempt + 1, lastError);
        }

        // Wait before retrying
        const delay = this.calculateRetryDelay(attempt, retryDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.warn(
          `Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`,
          lastError
        );
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Request failed after retries');
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle cases where response might not have a body
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch (error) {
      // If response has no body or invalid JSON, create error response
      throw new ApiError(
        this.getErrorCodeFromStatus(response.status),
        `Request failed with status ${response.status}`,
        error
      );
    }

    if (!response.ok || data.status === 'error') {
      const errorCode = data.error?.code || this.getErrorCodeFromStatus(response.status);
      throw new ApiError(
        errorCode,
        data.error?.message || 'An error occurred',
        data.error?.details
      );
    }

    return data.data as T;
  }

  /**
   * Maps HTTP status codes to error codes
   */
  private getErrorCodeFromStatus(status: number): string {
    if (status === 408) return 'TIMEOUT';
    if (status === 429) return 'RATE_LIMIT';
    if (status >= 500) return 'SERVER_ERROR';
    if (status >= 400) return 'CLIENT_ERROR';
    return 'UNKNOWN_ERROR';
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();
    const timeout = config?.timeout ?? this.DEFAULT_TIMEOUT;

    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(
          url,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
              ...config?.headers,
            },
            ...config,
          },
          timeout
        ),
      config
    );
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();
    const timeout = config?.timeout ?? this.DEFAULT_TIMEOUT;

    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(
          url,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
              ...config?.headers,
            },
            body: JSON.stringify(body),
            ...config,
          },
          timeout
        ),
      config
    );
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();
    const timeout = config?.timeout ?? this.DEFAULT_TIMEOUT;

    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(
          url,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
              ...config?.headers,
            },
            body: JSON.stringify(body),
            ...config,
          },
          timeout
        ),
      config
    );
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();
    const timeout = config?.timeout ?? this.DEFAULT_TIMEOUT;

    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(
          url,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
              ...config?.headers,
            },
            body: JSON.stringify(body),
            ...config,
          },
          timeout
        ),
      config
    );
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();
    const timeout = config?.timeout ?? this.DEFAULT_TIMEOUT;

    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(
          url,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
              ...config?.headers,
            },
            ...config,
          },
          timeout
        ),
      config
    );
  }

  async upload<T>(endpoint: string, file: File, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();
    const timeout = config?.timeout ?? this.DEFAULT_TIMEOUT;

    const formData = new FormData();
    formData.append('file', file);

    return this.executeWithRetry<T>(
      () =>
        this.fetchWithTimeout(
          url,
          {
            method: 'POST',
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
              ...config?.headers,
            },
            body: formData,
            ...config,
          },
          timeout
        ),
      config
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
