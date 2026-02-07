import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';

type Theme = 'light' | 'dark' | 'system';

/**
 * Custom hook for theme management
 *
 * Provides theme state and setter, handles system preference detection,
 * applies theme to document root, and persists to localStorage
 */
export function useTheme() {
  const { theme, setTheme: setStoreTheme } = useUIStore();

  // Get the resolved theme (handles 'system' preference)
  const getResolvedTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const resolvedTheme = getResolvedTheme();

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setStoreTheme(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add the resolved theme class
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme | null;
    if (
      savedTheme &&
      (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')
    ) {
      setStoreTheme(savedTheme);
    }
  }, [setStoreTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}
