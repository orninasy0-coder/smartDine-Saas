/**
 * useAIChat Hook
 * React Query hook for AI chat functionality
 */

import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/aiService';
import type { AIChatRequest, AIChatResponse } from '../types';

interface UseAIChatOptions {
  onSuccess?: (data: AIChatResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for sending messages to AI assistant
 */
export function useAIChat(options?: UseAIChatOptions) {
  return useMutation({
    mutationFn: (request: AIChatRequest) => aiService.chat(request),
    onSuccess: options?.onSuccess,
    onError: (error: Error) => {
      console.error('AI Chat Error:', error);
      options?.onError?.(error);
    },
  });
}

/**
 * Hook for getting dish recommendations
 */
export function useAIRecommendations() {
  return useMutation({
    mutationFn: ({
      restaurantId,
      preferences,
    }: {
      restaurantId: string;
      preferences: {
        dietary?: string[];
        spiceLevel?: string;
        budget?: number;
      };
    }) => aiService.getRecommendations(restaurantId, preferences),
  });
}

/**
 * Hook to check if AI is available
 */
export function useAIAvailability() {
  return {
    isAvailable: aiService.isAvailable(),
    config: aiService.getConfig(),
  };
}
