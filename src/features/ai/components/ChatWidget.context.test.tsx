/**
 * ChatWidget Conversation Context Tests
 * Tests for conversation persistence and context management in ChatWidget
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatWidget } from './ChatWidget';
import type { AIMessage } from '../types';

// Mock the UI store
vi.mock('@/store/uiStore', () => ({
  useUIStore: () => ({
    chatWidgetOpen: true,
    setChatWidgetOpen: vi.fn(),
  }),
}));

// Mock the AI chat hook
const mockSendAIMessage = vi.fn();
vi.mock('../hooks/useAIChat', () => ({
  useAIChat: (options?: { onSuccess?: (data: unknown) => void }) => ({
    mutate: (request: unknown) => {
      mockSendAIMessage(request);
      // Simulate successful response
      if (options?.onSuccess) {
        options.onSuccess({
          message: 'رد من المساعد',
          sessionId: 'test-session',
          timestamp: new Date(),
        });
      }
    },
    isPending: false,
  }),
}));

describe('ChatWidget Conversation Context', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderChatWidget = (restaurantId = 'test-restaurant') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ChatWidget restaurantId={restaurantId} />
      </QueryClientProvider>
    );
  };

  describe('Conversation Persistence', () => {
    it('should save conversation to localStorage', async () => {
      const user = userEvent.setup();
      renderChatWidget();

      // Wait for welcome message
      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });

      // Send a message
      const input = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input, 'مرحباً{Enter}');

      // Check localStorage
      await waitFor(() => {
        const saved = localStorage.getItem('ai-chat-test-restaurant');
        expect(saved).toBeTruthy();
        const messages = JSON.parse(saved!);
        expect(messages.length).toBeGreaterThan(1);
        expect(messages.some((m: AIMessage) => m.content === 'مرحباً')).toBe(true);
      });
    });

    it('should load conversation from localStorage on mount', async () => {
      // Pre-populate localStorage
      const savedMessages: AIMessage[] = [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'مرحباً! أنا مساعدك الذكي.',
          timestamp: new Date(),
        },
        {
          id: 'user-1',
          role: 'user',
          content: 'أريد برجر',
          timestamp: new Date(),
        },
        {
          id: 'assistant-1',
          role: 'assistant',
          content: 'لدينا برجر لحم وبرجر دجاج',
          timestamp: new Date(),
        },
      ];

      localStorage.setItem('ai-chat-test-restaurant', JSON.stringify(savedMessages));

      renderChatWidget();

      // Check that messages are displayed
      await waitFor(() => {
        expect(screen.getByText('أريد برجر')).toBeInTheDocument();
        expect(screen.getByText('لدينا برجر لحم وبرجر دجاج')).toBeInTheDocument();
      });
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      // Set invalid JSON
      localStorage.setItem('ai-chat-test-restaurant', 'invalid json');

      renderChatWidget();

      // Should show welcome message instead of crashing
      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });
    });

    it('should use separate storage for different restaurants', async () => {
      const user = userEvent.setup();

      // First restaurant
      const { unmount } = renderChatWidget('restaurant-1');
      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });

      const input1 = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input1, 'رسالة للمطعم 1{Enter}');

      await waitFor(() => {
        const saved1 = localStorage.getItem('ai-chat-restaurant-1');
        expect(saved1).toBeTruthy();
      });

      unmount();

      // Second restaurant
      renderChatWidget('restaurant-2');
      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });

      const input2 = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input2, 'رسالة للمطعم 2{Enter}');

      await waitFor(() => {
        const saved2 = localStorage.getItem('ai-chat-restaurant-2');
        expect(saved2).toBeTruthy();

        // Both should exist independently
        const saved1 = localStorage.getItem('ai-chat-restaurant-1');
        expect(saved1).toBeTruthy();

        const messages1 = JSON.parse(saved1!);
        const messages2 = JSON.parse(saved2!);

        expect(messages1.some((m: AIMessage) => m.content === 'رسالة للمطعم 1')).toBe(true);
        expect(messages2.some((m: AIMessage) => m.content === 'رسالة للمطعم 2')).toBe(true);
      });
    });
  });

  describe('Context Passing', () => {
    it('should pass conversation history to AI service', async () => {
      const user = userEvent.setup();

      // Pre-populate with history
      const savedMessages: AIMessage[] = [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'مرحباً',
          timestamp: new Date(),
        },
        {
          id: 'user-1',
          role: 'user',
          content: 'أريد برجر',
          timestamp: new Date(),
        },
      ];

      localStorage.setItem('ai-chat-test-restaurant', JSON.stringify(savedMessages));

      renderChatWidget();

      await waitFor(() => {
        expect(screen.getByText('أريد برجر')).toBeInTheDocument();
      });

      // Send new message
      const input = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input, 'ماذا طلبت؟{Enter}');

      // Verify AI service was called with conversation history
      await waitFor(() => {
        expect(mockSendAIMessage).toHaveBeenCalled();
        const callArgs = mockSendAIMessage.mock.calls[0][0];
        expect(callArgs.conversationHistory).toBeDefined();
        expect(callArgs.conversationHistory.length).toBeGreaterThan(0);
        expect(callArgs.conversationHistory.some((m: AIMessage) => m.content === 'أريد برجر')).toBe(
          true
        );
      });
    });

    it('should include session ID in requests', async () => {
      const user = userEvent.setup();
      renderChatWidget();

      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input, 'مرحباً{Enter}');

      await waitFor(() => {
        expect(mockSendAIMessage).toHaveBeenCalled();
        const callArgs = mockSendAIMessage.mock.calls[0][0];
        expect(callArgs.sessionId).toBeDefined();
        expect(callArgs.sessionId).toMatch(/^session-\d+$/);
      });
    });
  });

  describe('Message Display', () => {
    it('should display user and assistant messages correctly', async () => {
      const user = userEvent.setup();
      renderChatWidget();

      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input, 'سؤال اختبار{Enter}');

      await waitFor(() => {
        expect(screen.getByText('سؤال اختبار')).toBeInTheDocument();
        expect(screen.getByText('رد من المساعد')).toBeInTheDocument();
      });
    });

    it('should show message count when minimized', async () => {
      const user = userEvent.setup();
      renderChatWidget();

      await waitFor(() => {
        expect(screen.getByText(/مرحباً/)).toBeInTheDocument();
      });

      // Send a message
      const input = screen.getByPlaceholderText(/اكتب رسالتك/);
      await user.type(input, 'رسالة{Enter}');

      await waitFor(() => {
        expect(screen.getByText('رسالة')).toBeInTheDocument();
      });

      // Minimize - find button by its SVG icon class
      const buttons = screen.getAllByRole('button');
      const minimizeButton = buttons.find((btn) =>
        btn.querySelector('.lucide-minimize-2')
      );
      expect(minimizeButton).toBeDefined();
      await user.click(minimizeButton!);

      // Should show message count
      await waitFor(() => {
        expect(screen.getByText(/رسالة/)).toBeInTheDocument();
      });
    });
  });
});
