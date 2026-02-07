import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header Component', () => {
  describe('Logo and Navigation Links', () => {
    it('should render the SmartDine logo', () => {
      render(<Header variant="public" />);
      expect(screen.getByText('SmartDine')).toBeInTheDocument();
    });

    it('should render public navigation links', () => {
      render(<Header variant="public" />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
      expect(screen.getByText('Demo')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render authenticated navigation links when authenticated', () => {
      render(<Header variant="authenticated" userName="Test User" />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should render theme toggle button', () => {
      render(<Header variant="public" />);
      const themeToggle = screen.getByLabelText('Toggle theme');
      expect(themeToggle).toBeInTheDocument();
    });
  });

  describe('Language Selector', () => {
    it('should render language selector button', () => {
      render(<Header variant="public" />);
      const languageButton = screen.getByText('EN');
      expect(languageButton).toBeInTheDocument();
    });

    it('should toggle language when clicked', () => {
      render(<Header variant="public" />);
      const languageButton = screen.getByText('EN');
      fireEvent.click(languageButton);
      expect(screen.getByText('AR')).toBeInTheDocument();
    });
  });

  describe('Login/Register Buttons', () => {
    it('should render login and register buttons for public variant', () => {
      render(<Header variant="public" />);
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('should not render login/register buttons for authenticated variant', () => {
      render(<Header variant="authenticated" userName="Test User" />);
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
      expect(screen.queryByText('Register')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Responsive Menu', () => {
    it('should render mobile menu toggle button', () => {
      render(<Header variant="public" />);
      const menuButton = screen.getAllByRole('button').find((button) => {
        const svg = button.querySelector('svg');
        return svg?.classList.contains('lucide-menu');
      });
      expect(menuButton).toBeInTheDocument();
    });

    it('should show mobile menu when opened', () => {
      render(<Header variant="public" />);
      const menuButton = screen.getAllByRole('button').find((button) => {
        const svg = button.querySelector('svg');
        return svg?.classList.contains('lucide-menu');
      });

      // Click to open mobile menu
      if (menuButton) {
        fireEvent.click(menuButton);
      }

      // Check that mobile menu links are present (using getAllByText for multiple matches)
      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks.length).toBeGreaterThan(1); // Desktop + Mobile
    });
  });

  describe('Sticky Header', () => {
    it('should have sticky positioning classes', () => {
      const { container } = render(<Header variant="public" />);
      const header = container.querySelector('header');
      expect(header?.classList.contains('sticky')).toBe(true);
      expect(header?.classList.contains('top-0')).toBe(true);
    });

    it('should have backdrop blur effect', () => {
      const { container } = render(<Header variant="public" />);
      const header = container.querySelector('header');
      expect(header?.classList.contains('backdrop-blur')).toBe(true);
    });
  });

  describe('Authenticated User Features', () => {
    it('should render user profile dropdown', () => {
      render(<Header variant="authenticated" userName="Test User" />);
      const userButton = screen.getAllByRole('button').find((button) => {
        const svg = button.querySelector('svg');
        return svg?.classList.contains('lucide-user');
      });
      expect(userButton).toBeInTheDocument();
    });

    it('should render notification bell with count', () => {
      render(<Header variant="authenticated" userName="Test User" notificationCount={5} />);
      const notificationBell = screen.getAllByRole('button').find((button) => {
        const svg = button.querySelector('svg');
        return svg?.classList.contains('lucide-bell');
      });
      expect(notificationBell).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });
});
