/**
 * useLogin hook - handles login logic with comprehensive error handling
 */

import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { authService } from '../services';
import { ApiError } from '@/services/api/client';
import type { LoginCredentials } from '../types';

export const useLogin = () => {
  const { login: setAuthState } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      // Update auth context with login data
      setAuthState(response.token, response.refreshToken, response.user);
      
      return response;
    } catch (err) {
      let message = 'Login failed. Please try again.';

      if (err instanceof ApiError) {
        // Handle specific API error codes
        switch (err.code) {
          case 'INVALID_CREDENTIALS':
            message = 'Invalid email or password. Please check your credentials and try again.';
            break;
          case 'ACCOUNT_LOCKED':
            message = 'Your account has been locked. Please contact support.';
            break;
          case 'ACCOUNT_NOT_VERIFIED':
            message = 'Please verify your email address before logging in.';
            break;
          case 'TOO_MANY_ATTEMPTS':
            message = 'Too many login attempts. Please try again later.';
            break;
          case 'NETWORK_ERROR':
            message = 'Network error. Please check your internet connection.';
            break;
          default:
            message = err.message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};
