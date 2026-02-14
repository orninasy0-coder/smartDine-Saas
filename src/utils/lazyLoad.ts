/**
 * Lazy Loading Utilities
 * 
 * Provides utilities for dynamic imports and code splitting
 * to improve initial bundle size and loading performance.
 */

import { lazy, ComponentType } from 'react';

/**
 * Retry configuration for failed dynamic imports
 */
interface RetryConfig {
  maxRetries?: number;
  delay?: number;
}

/**
 * Enhanced lazy loading with retry logic for failed chunk loads
 * Useful for handling network issues during dynamic imports
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: RetryConfig = {}
): React.LazyExoticComponent<T> {
  const { maxRetries = 3, delay = 1000 } = config;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }

            console.warn(
              `Failed to load chunk, retrying... (${retriesLeft} attempts left)`,
              error
            );

            setTimeout(() => {
              attemptImport(retriesLeft - 1);
            }, delay);
          });
      };

      attemptImport(maxRetries);
    });
  });
}

/**
 * Preload a lazy component
 * Useful for prefetching components before they're needed
 */
export function preloadComponent<T extends ComponentType<any>>(
  lazyComponent: React.LazyExoticComponent<T>
): void {
  // Access the internal _payload to trigger the import
  const component = lazyComponent as any;
  if (component._payload && component._payload._status === -1) {
    component._payload._result();
  }
}

/**
 * Create a lazy component with named export
 * Useful when importing non-default exports
 */
export function lazyNamed<T extends ComponentType<any>>(
  importFn: () => Promise<any>,
  exportName: string
): React.LazyExoticComponent<T> {
  return lazy(() =>
    importFn().then((module) => ({ default: module[exportName] }))
  );
}
