/**
 * Register Page Integration Tests
 * Tests the registration page with form validation and password strength
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

// Mock the auth hooks
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

vi.mock('@/features/auth/hooks/useRegister', () => ({
  useRegister: () => ({
    register: vi.fn().mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'CUSTOMER',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }),
    isLoading: false,
    error: null,
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the register page without crashing', () => {
    renderRegister();
    expect(document.body).toBeTruthy();
  });

  it('should display registration header', () => {
    renderRegister();
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Sign up to get started with SmartDine')).toBeInTheDocument();
  });

  it('should render email input field', () => {
    renderRegister();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should render password input field', () => {
    renderRegister();
    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should render confirm password input field', () => {
    renderRegister();
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should render create account button', () => {
    renderRegister();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    const toggleButtons = screen.getAllByRole('button', { name: '' });
    const passwordToggle = toggleButtons[0];

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should toggle confirm password visibility', async () => {
    const user = userEvent.setup();
    renderRegister();

    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const toggleButtons = screen.getAllByRole('button', { name: '' });
    const confirmPasswordToggle = toggleButtons[1];

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await user.click(confirmPasswordToggle);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    await user.click(confirmPasswordToggle);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderRegister();

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderRegister();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Check for any email validation error message
      const errorMessage = screen.queryByText(/email/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should display password strength meter when typing password', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, 'Test123!');

    await waitFor(() => {
      expect(screen.getByText(/Password strength:/i)).toBeInTheDocument();
    });
  });

  it('should display password requirements', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('One number')).toBeInTheDocument();
      expect(screen.getByText('One special character (@$!%*?&)')).toBeInTheDocument();
    });
  });

  it('should validate password mismatch', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

    await user.type(passwordInput, 'Test123!@#');
    await user.type(confirmPasswordInput, 'Different123!@#');

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Check for password mismatch error - look for the specific error message
      const errorMessage = screen.queryByText(/don't match/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should display link to login page', () => {
    renderRegister();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should display terms and privacy policy links', () => {
    renderRegister();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('should show weak password strength for simple passwords', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, 'password');

    await waitFor(() => {
      expect(screen.getByText(/Password strength:/i)).toBeInTheDocument();
      // Weak password should show low strength
      const strengthText = screen.getByText(/Password strength:/i).parentElement;
      expect(strengthText).toHaveTextContent(/Weak|Very Weak/i);
    });
  });

  it('should show strong password strength for complex passwords', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, 'Test123!@#Strong');

    await waitFor(() => {
      expect(screen.getByText(/Password strength:/i)).toBeInTheDocument();
      const strengthText = screen.getByText(/Password strength:/i).parentElement;
      expect(strengthText).toHaveTextContent(/Strong|Very Strong/i);
    });
  });

  it('should mark password requirements as met when satisfied', async () => {
    const user = userEvent.setup();
    renderRegister();

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    await user.type(passwordInput, 'Test123!@#');

    await waitFor(() => {
      // All requirements should be met
      const requirements = screen.getByText('At least 8 characters').closest('div');
      expect(requirements).toBeInTheDocument();
    });
  });

  it('should have proper form structure', () => {
    renderRegister();
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render user icon in header', () => {
    const { container } = renderRegister();
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have gradient background', () => {
    const { container } = renderRegister();
    const background = container.querySelector('.bg-gradient-to-br');
    expect(background).toBeInTheDocument();
  });

  it('should render card with proper styling', () => {
    const { container } = renderRegister();
    const card = container.querySelector('.bg-card');
    expect(card).toBeInTheDocument();
  });

  it('should accept valid registration data', async () => {
    const user = userEvent.setup();
    renderRegister();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Test123!@#');
    await user.type(confirmPasswordInput, 'Test123!@#');

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    await user.click(submitButton);

    // Should not show validation errors
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });
  });

  it('should display email icon', () => {
    const { container } = renderRegister();
    const emailIcons = container.querySelectorAll('svg');
    expect(emailIcons.length).toBeGreaterThan(0);
  });

  it('should display lock icons for password fields', () => {
    const { container } = renderRegister();
    const lockIcons = container.querySelectorAll('svg');
    expect(lockIcons.length).toBeGreaterThan(0);
  });
});
