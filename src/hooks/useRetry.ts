import { useState, useCallback } from 'react';

export interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
}

export interface UseRetryOptions {
  maxRetries?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onSuccess?: () => void;
  onMaxRetriesReached?: (error: Error) => void;
}

/**
 * Hook for managing retry state and logic in React components
 *
 * @example
 * ```tsx
 * const { retry, retryState, resetRetry } = useRetry({
 *   maxRetries: 3,
 *   onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
 * });
 *
 * const handleSubmit = async () => {
 *   await retry(async () => {
 *     await apiClient.post('/api/orders', orderData);
 *   });
 * };
 * ```
 */
export function useRetry(options: UseRetryOptions = {}) {
  const { maxRetries = 3, onRetry, onSuccess, onMaxRetriesReached } = options;

  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
  });

  const resetRetry = useCallback(() => {
    setRetryState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
    });
  }, []);

  const retry = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          setRetryState({
            isRetrying: attempt > 0,
            retryCount: attempt,
            lastError: lastError,
          });

          const result = await fn();

          // Success - reset state
          setRetryState({
            isRetrying: false,
            retryCount: 0,
            lastError: null,
          });

          if (onSuccess) {
            onSuccess();
          }

          return result;
        } catch (error) {
          lastError = error as Error;

          // If this was the last attempt, throw the error
          if (attempt === maxRetries) {
            setRetryState({
              isRetrying: false,
              retryCount: attempt,
              lastError: lastError,
            });

            if (onMaxRetriesReached) {
              onMaxRetriesReached(lastError);
            }

            throw lastError;
          }

          // Call retry callback
          if (onRetry) {
            onRetry(attempt + 1, lastError);
          }

          // Wait before retrying with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // This should never be reached
      throw lastError || new Error('Retry failed');
    },
    [maxRetries, onRetry, onSuccess, onMaxRetriesReached]
  );

  return {
    retry,
    retryState,
    resetRetry,
  };
}
