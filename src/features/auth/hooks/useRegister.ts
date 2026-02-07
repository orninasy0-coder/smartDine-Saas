/**
 * useRegister hook - handles registration logic
 */

import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { authService } from '../services';
import type { RegisterData } from '../types';

export const useRegister = () => {
  const { login: setAuthState } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      
      // Update auth context with registration data
      setAuthState(response.token, response.refreshToken, response.user);
      
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
