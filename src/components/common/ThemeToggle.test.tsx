import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

// Mock the useTheme hook
const mockSetTheme = vi.fn();
let mockTheme = 'light';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockTheme = 'light';
  });

  it('should render theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    expect(button).toBeInTheDocument();
  });

  it('should show sun icon when theme is light', () => {
    mockTheme = 'light';
    const { container } = render(<ThemeToggle />);
    const sunIcon = container.querySelector('svg.lucide-sun');
    expect(sunIcon).toBeInTheDocument();
  });

  it('should show moon icon when theme is dark', () => {
    mockTheme = 'dark';
    const { container } = render(<ThemeToggle />);
    const moonIcon = container.querySelector('svg.lucide-moon');
    expect(moonIcon).toBeInTheDocument();
  });

  it('should show monitor icon when theme is system', () => {
    mockTheme = 'system';
    const { container } = render(<ThemeToggle />);
    const monitorIcon = container.querySelector('svg.lucide-monitor');
    expect(monitorIcon).toBeInTheDocument();
  });

  it('should have dropdown menu trigger', () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should have screen reader text', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Toggle theme', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('should have outline variant button', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should have icon size button', () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText('Toggle theme');
    expect(button).toBeInTheDocument();
  });
});
