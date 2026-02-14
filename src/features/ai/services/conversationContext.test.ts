/**
 * Conversation Context Management Tests
 * Tests for AI conversation context handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { aiService } from './aiService';
import type { AIMessage } from '../types';

// Mock fetch
global.fetch = vi.fn();

describe('Conversation Context Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set mock API key
    vi.stubEnv('VITE_OPENAI_API_KEY', 'sk-test-key');
  });

  describe('Context Preservation', () => {
    it('should include conversation history in API request', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'نعم، أتذكر أنك طلبت برجر.',
            },
          },
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 20,
          total_tokens: 120,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const conversationHistory: AIMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'أريد برجر',
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'لدينا برجر لحم وبرجر دجاج',
          timestamp: new Date(),
        },
      ];

      await aiService.chat({
        message: 'ماذا طلبت قبل قليل؟',
        restaurantId: 'test-restaurant',
        conversationHistory,
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      // Should include system message + history + current message
      expect(requestBody.messages.length).toBeGreaterThan(2);
      expect(requestBody.messages[1].content).toBe('أريد برجر');
      expect(requestBody.messages[2].content).toBe('لدينا برجر لحم وبرجر دجاج');
    });

    it('should limit conversation history to last 10 messages', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'رد' } }],
        usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Create 15 messages
      const conversationHistory: AIMessage[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        timestamp: new Date(),
      }));

      await aiService.chat({
        message: 'رسالة جديدة',
        restaurantId: 'test-restaurant',
        conversationHistory,
      });

      const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      // Should include: system + last 10 history + current = 12 messages
      expect(requestBody.messages.length).toBe(12);
    });

    it('should work without conversation history', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'مرحباً' } }],
        usage: { prompt_tokens: 50, completion_tokens: 10, total_tokens: 60 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await aiService.chat({
        message: 'مرحباً',
        restaurantId: 'test-restaurant',
      });

      const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);

      // Should include only system + current message
      expect(requestBody.messages.length).toBe(2);
    });
  });

  describe('Context Information', () => {
    it('should append cart context to user message', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'نعم، لديك برجر في السلة' } }],
        usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await aiService.chat({
        message: 'ماذا في سلتي؟',
        restaurantId: 'test-restaurant',
        context: {
          cartItems: ['برجر لحم', 'بطاطس مقلية'],
        },
      });

      const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      const lastMessage = requestBody.messages[requestBody.messages.length - 1];

      expect(lastMessage.content).toContain('ماذا في سلتي؟');
      expect(lastMessage.content).toContain('العناصر في السلة');
      expect(lastMessage.content).toContain('برجر لحم');
      expect(lastMessage.content).toContain('بطاطس مقلية');
    });

    it('should append current dish context to user message', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'نعم، هذا الطبق حار' } }],
        usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await aiService.chat({
        message: 'هل هذا الطبق حار؟',
        restaurantId: 'test-restaurant',
        context: {
          currentDish: 'دجاج حار',
        },
      });

      const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      const lastMessage = requestBody.messages[requestBody.messages.length - 1];

      expect(lastMessage.content).toContain('هل هذا الطبق حار؟');
      expect(lastMessage.content).toContain('الطبق الحالي');
      expect(lastMessage.content).toContain('دجاج حار');
    });

    it('should handle both cart and dish context', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'رد' } }],
        usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await aiService.chat({
        message: 'سؤال',
        restaurantId: 'test-restaurant',
        context: {
          cartItems: ['برجر'],
          currentDish: 'بيتزا',
        },
      });

      const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      const lastMessage = requestBody.messages[requestBody.messages.length - 1];

      expect(lastMessage.content).toContain('العناصر في السلة');
      expect(lastMessage.content).toContain('الطبق الحالي');
    });
  });

  describe('Session Management', () => {
    it('should generate session ID if not provided', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'رد' } }],
        usage: { prompt_tokens: 50, completion_tokens: 10, total_tokens: 60 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await aiService.chat({
        message: 'مرحباً',
        restaurantId: 'test-restaurant',
      });

      expect(response.sessionId).toBeDefined();
      expect(response.sessionId).toMatch(/^session-\d+$/);
    });

    it('should preserve provided session ID', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'رد' } }],
        usage: { prompt_tokens: 50, completion_tokens: 10, total_tokens: 60 },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const sessionId = 'custom-session-123';
      const response = await aiService.chat({
        message: 'مرحباً',
        restaurantId: 'test-restaurant',
        sessionId,
      });

      expect(response.sessionId).toBe(sessionId);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Server error' } }),
      });

      await expect(
        aiService.chat({
          message: 'مرحباً',
          restaurantId: 'test-restaurant',
        })
      ).rejects.toThrow('OpenAI API error');
    });

    it('should handle network errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        aiService.chat({
          message: 'مرحباً',
          restaurantId: 'test-restaurant',
        })
      ).rejects.toThrow('Network error');
    });
  });
});
