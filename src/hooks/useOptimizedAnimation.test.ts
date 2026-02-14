import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useOptimizedAnimation,
  useAnimationPerformance,
  useInViewAnimation,
  useScrollAnimation,
} from './useOptimizedAnimation';

describe('useOptimizedAnimation', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it('should return animation variants and transition', () => {
    const { result } = renderHook(() => useOptimizedAnimation('fadeIn'));

    expect(result.current.variants).toBeDefined();
    expect(result.current.transition).toBeDefined();
    expect(result.current.shouldReduceMotion).toBe(false);
  });

  it('should return reduced motion variants when preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useOptimizedAnimation('slideUp'));

    expect(result.current.shouldReduceMotion).toBe(true);
    expect(result.current.variants.initial).toEqual({ opacity: 0 });
  });

  it('should listen for motion preference changes', () => {
    const mockAddEventListener = vi.fn();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
      })),
    });

    renderHook(() => useOptimizedAnimation('fadeIn'));

    expect(mockAddEventListener).toHaveBeenCalled();
  });
});

describe('useAnimationPerformance', () => {
  it('should initialize with 60 FPS', () => {
    const { result } = renderHook(() => useAnimationPerformance());

    expect(result.current.fps).toBe(60);
    expect(result.current.isGood).toBe(true);
  });
});

describe('useInViewAnimation', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    })) as any;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it('should return ref and animation props', () => {
    const { result } = renderHook(() => useInViewAnimation('fadeIn'));

    expect(result.current.ref).toBeDefined();
    expect(result.current.variants).toBeDefined();
    expect(result.current.transition).toBeDefined();
    expect(result.current.animate).toBe('initial');
  });

  it('should return ref callback', () => {
    const { result } = renderHook(() => useInViewAnimation('fadeIn'));

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.ref).toBe('function');
  });
});

describe('useScrollAnimation', () => {
  it('should initialize with zero scroll values', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.scrollY).toBe(0);
    expect(result.current.scrollProgress).toBe(0);
  });
});
