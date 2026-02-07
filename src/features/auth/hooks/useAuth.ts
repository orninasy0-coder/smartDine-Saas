/**
 * useAuth hook - manages authentication state
 */

import { useState, useEffect } from 'react';
import { storage } from '@/services/storage';
import type { User } from '@/utils/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = storage.getAuthToken();
    if (token) {
      // TODO: Validate token and fetch user data
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    storage.setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    storage.removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
