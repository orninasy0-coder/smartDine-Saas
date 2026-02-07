/**
 * ProtectedRoute Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as authHooks from '@/features/auth/hooks';
import { USER_ROLES } from '@/utils/constants';

// Mock the useAuth hook
vi.mock('@/features/auth/hooks', () => ({
  useAuth: vi.fn(),
}));

// Mock the Loading component
vi.mock('@/components/common', () => ({
  Loading: () => <div>Loading...</div>,
}));

describe('ProtectedRoute', () => {
  const mockUseAuth = vi.mocked(authHooks.useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (
    element: React.ReactElement,
    initialRoute = '/'
  ) => {
    window.history.pushState({}, 'Test page', initialRoute);
    
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={element} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </BrowserRouter>
    );
  };

  it('shows loading spinner while authentication is being checked', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        email: 'test@example.com',
        role: USER_ROLES.CUSTOMER,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('allows access when user has required role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        email: 'admin@example.com',
        role: USER_ROLES.PLATFORM_ADMIN,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter(
      <ProtectedRoute requiredRoles={[USER_ROLES.PLATFORM_ADMIN]}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to unauthorized when user does not have required role', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        email: 'customer@example.com',
        role: USER_ROLES.CUSTOMER,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter(
      <ProtectedRoute requiredRoles={[USER_ROLES.PLATFORM_ADMIN]}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('allows access when user has one of multiple required roles', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        email: 'owner@example.com',
        role: USER_ROLES.RESTAURANT_OWNER,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    renderWithRouter(
      <ProtectedRoute
        requiredRoles={[USER_ROLES.RESTAURANT_OWNER, USER_ROLES.PLATFORM_ADMIN]}
      >
        <div>Owner Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Owner Content')).toBeInTheDocument();
  });

  it('uses custom redirect path when provided', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshAuth: vi.fn(),
      updateUser: vi.fn(),
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute redirectTo="/custom-login">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/custom-login" element={<div>Custom Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Custom Login Page')).toBeInTheDocument();
  });
});
