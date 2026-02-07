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
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

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

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || data.status === 'error') {
      throw new ApiError(
        data.error?.code || 'UNKNOWN_ERROR',
        data.error?.message || 'An error occurred',
        data.error?.details
      );
    }

    return data.data as T;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: JSON.stringify(body),
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: JSON.stringify(body),
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: JSON.stringify(body),
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      ...config,
    });

    return this.handleResponse<T>(response);
  }

  async upload<T>(endpoint: string, file: File, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(endpoint, config?.params);
    const token = config?.skipAuth ? null : await this.ensureValidToken();

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: formData,
      ...config,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
