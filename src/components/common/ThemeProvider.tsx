import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 *
 * Wraps the application and manages theme initialization and updates.
 * Automatically applies the theme class to the document root.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme();

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return <>{children}</>;
}
