/**
 * Auth Context Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuthContext } from './AuthContext';
import { tokenService } from '@/services/token';
import { authService } from '../services';

// Mock dependencies
vi.mock('@/services/token', () => ({
  tokenService: {
    hasValidToken: vi.fn(),
    hasValidRefreshToken: vi.fn(),
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    getAuthToken: vi.fn(),
    getRefreshToken: vi.fn(),
  },
}));

vi.mock('../services', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize with unauthenticated state when no token exists', async () => {
    vi.mocked(tokenService.hasValidToken).mockReturnValue(false);

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should initialize with authenticated state when valid token exists', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'CUSTOMER' as const,
      twoFactorEnabled: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(tokenService.hasValidToken).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle login correctly', async () => {
    vi.mocked(tokenService.hasValidToken).mockReturnValue(false);

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'CUSTOMER' as const,
      twoFactorEnabled: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    await waitFor(() => {
      result.current.login('token', 'refresh-token', mockUser);
    });

    expect(tokenService.setTokens).toHaveBeenCalledWith('token', 'refresh-token');
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should handle logout correctly', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'CUSTOMER' as const,
      twoFactorEnabled: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    vi.mocked(tokenService.hasValidToken).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(authService.logout).mockResolvedValue();

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await waitFor(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(tokenService.clearTokens).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('should throw error when useAuthContext is used outside provider', () => {
    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow('useAuthContext must be used within an AuthProvider');
  });
});
