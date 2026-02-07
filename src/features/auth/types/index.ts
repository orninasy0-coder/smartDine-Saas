/**
 * Authentication types
 */

import type { UserRole } from '@/utils/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface TwoFactorData {
  code: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    restaurantId?: string;
    twoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
