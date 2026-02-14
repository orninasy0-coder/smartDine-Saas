import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation, useLanguage } from './useTranslation';
import { useUIStore } from '../store/uiStore';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// Mock the UI store
vi.mock('../store/uiStore', () => ({
  useUIStore: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      if (params && params.name) {
        return `Welcome back, ${params.name}`;
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      off: vi.fn(),
    },
  }),
}));

describe('useTranslation', () => {
  const mockSetLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useUIStore as any).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });

    // Mock document properties
    Object.defineProperty(document.documentElement, 'dir', {
      writable: true,
      value: 'ltr',
      configurable: true,
    });
    Object.defineProperty(document.documentElement, 'lang', {
      writable: true,
      value: 'en',
      configurable: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return translation function', () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.t).toBeDefined();
    expect(typeof result.current.t).toBe('function');
  });

  it('should return current language', () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.language).toBeDefined();
    expect(['en', 'ar']).toContain(result.current.language);
  });

  it('should return i18n instance', () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.i18n).toBeDefined();
    expect(result.current.i18n.changeLanguage).toBeDefined();
  });

  it('should provide changeLanguage function', () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.changeLanguage).toBeDefined();
    expect(typeof result.current.changeLanguage).toBe('function');
  });

  it('should return isRTL flag', () => {
    const { result } = renderHook(() => useTranslation());

    expect(typeof result.current.isRTL).toBe('boolean');
  });

  it('should set isRTL to false for English', () => {
    (useUIStore as any).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });

    const { result } = renderHook(() => useTranslation());

    expect(result.current.isRTL).toBe(false);
  });

  it('should translate common keys', () => {
    const { result } = renderHook(() => useTranslation());

    const translated = result.current.t('common.loading');
    expect(translated).toBeDefined();
    expect(typeof translated).toBe('string');
  });

  it('should handle interpolation', () => {
    const { result } = renderHook(() => useTranslation());

    const translated = result.current.t('dashboard.welcome', { name: 'John' });
    expect(translated).toContain('John');
  });

  it('should call changeLanguage', async () => {
    const { result } = renderHook(() => useTranslation());

    await act(async () => {
      await result.current.changeLanguage('ar');
    });

    expect(mockSetLanguage).toHaveBeenCalledWith('ar');
  });

  it('should persist language to localStorage when changing language', async () => {
    const { result } = renderHook(() => useTranslation());

    await act(async () => {
      await result.current.changeLanguage('ar');
    });

    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE)).toBe('ar');
  });

  it('should update document direction to RTL for Arabic', async () => {
    const { result } = renderHook(() => useTranslation());

    await act(async () => {
      await result.current.changeLanguage('ar');
    });

    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
  });

  it('should update document direction to LTR for English', async () => {
    const { result } = renderHook(() => useTranslation());

    await act(async () => {
      await result.current.changeLanguage('en');
    });

    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
  });

  it('should load saved language from localStorage on mount', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, 'ar');
    
    (useUIStore as any).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });

    renderHook(() => useTranslation());

    // The effect should call setLanguage with the saved language
    expect(mockSetLanguage).toHaveBeenCalledWith('ar');
  });

  it('should not change language if localStorage value matches current language', () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, 'en');

    renderHook(() => useTranslation());

    // Should not call setLanguage if the language is already correct
    expect(mockSetLanguage).not.toHaveBeenCalled();
  });
});

describe('useLanguage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current language', () => {
    (useUIStore as any).mockReturnValue({
      language: 'en',
      setLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('en');
  });

  it('should return isRTL flag', () => {
    (useUIStore as any).mockReturnValue({
      language: 'en',
      setLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useLanguage());

    expect(result.current.isRTL).toBe(false);
  });

  it('should return isRTL as true for Arabic', () => {
    (useUIStore as any).mockReturnValue({
      language: 'ar',
      setLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useLanguage());

    expect(result.current.isRTL).toBe(true);
  });

  it('should return isRTL as false for English', () => {
    (useUIStore as any).mockReturnValue({
      language: 'en',
      setLanguage: vi.fn(),
    });

    const { result } = renderHook(() => useLanguage());

    expect(result.current.isRTL).toBe(false);
  });
});
