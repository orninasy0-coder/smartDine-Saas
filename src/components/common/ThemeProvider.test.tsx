import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';

// Mock the useTheme hook
let mockResolvedTheme = 'light';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
  }),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clean up document classes before each test
    document.documentElement.classList.remove('light', 'dark');
    mockResolvedTheme = 'light';
  });

  it('should render children correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
  });

  it('should apply light theme class to document root', () => {
    mockResolvedTheme = 'light';
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should apply dark theme class to document root', () => {
    mockResolvedTheme = 'dark';
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should remove previous theme class when theme changes', () => {
    mockResolvedTheme = 'light';
    const { rerender } = render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Change theme
    mockResolvedTheme = 'dark';
    rerender(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should render multiple children', () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child1">First</div>
        <div data-testid="child2">Second</div>
        <div data-testid="child3">Third</div>
      </ThemeProvider>
    );

    expect(container.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child3"]')).toBeInTheDocument();
  });

  it('should not add extra wrapper elements', () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child">Content</div>
      </ThemeProvider>
    );

    // ThemeProvider should render children directly without wrapper
    const child = container.querySelector('[data-testid="child"]');
    expect(child?.parentElement).toBe(container);
  });
});
