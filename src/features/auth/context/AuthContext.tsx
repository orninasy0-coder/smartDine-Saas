/**
 * Auth Context - Provides authentication state globally
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { tokenService } from '@/services/token';
import { authService } from '../services';
import type { User } from '@/utils/types';
import type { AuthResponse } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a valid token
      if (tokenService.hasValidToken()) {
        try {
          // Fetch current user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired, try to refresh
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('Failed to fetch user data:', errorMessage);
          
          if (tokenService.hasValidRefreshToken()) {
            try {
              const response = await authService.refresh();
              tokenService.setTokens(response.token, response.refreshToken);
              setUser(response.user);
              setIsAuthenticated(true);
            } catch (refreshError) {
              const errorMessage = refreshError instanceof Error ? refreshError.message : 'Unknown error';
              console.error('Token refresh failed:', errorMessage);
              tokenService.clearTokens();
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            tokenService.clearTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, refreshToken: string, userData: User) => {
    tokenService.setTokens(token, refreshToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Logout error:', errorMessage);
    } finally {
      tokenService.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const response: AuthResponse = await authService.refresh();
      tokenService.setTokens(response.token, response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Token refresh failed:', errorMessage);
      await logout();
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
