/**
 * Authentication services
 */

import { apiClient } from '@/services/api/client';
import type { User } from '@/utils/types';
import type {
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  TwoFactorData,
  AuthResponse,
} from '../types';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  /**
   * Refresh auth token
   */
  refresh: async (): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh');
  },

  /**
   * Request password reset
   */
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    return apiClient.post<void>('/auth/reset-password', data);
  },

  /**
   * Verify 2FA code
   */
  verify2FA: async (data: TwoFactorData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/verify-2fa', data);
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },
};
