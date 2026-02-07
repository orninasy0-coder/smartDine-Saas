import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 *
 * Default settings for all queries and mutations in the application
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Cache time: Unused data stays in cache for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Retry failed requests 3 times with exponential backoff
      retry: 3,

      // Retry delay increases exponentially (1s, 2s, 4s)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Refetch on reconnect to get latest data
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});
