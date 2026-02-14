/**
 * AI Service
 * Handles communication with OpenAI API
 */

import type { AIChatRequest, AIChatResponse, DishSuggestion } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4';
const AI_MAX_TOKENS = parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '500');
const AI_TEMPERATURE = parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7');

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIChatRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
  max_tokens: number;
}

interface OpenAIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Build system prompt for AI assistant
 */
function buildSystemPrompt(restaurantId: string): string {
  return `أنت مساعد ذكي لمطعم SmartDine. مهمتك مساعدة العملاء في اختيار الأطباق وتقديم المعلومات عن القائمة.

إرشادات:
1. كن ودوداً ومفيداً
2. قدم توصيات بناءً على تفضيلات العميل
3. اذكر معلومات دقيقة عن المكونات والحساسية
4. اقترح أطباقاً مناسبة بناءً على السياق
5. استخدم اللغة العربية بشكل طبيعي وواضح
6. لا تشارك معلومات شخصية للعملاء
7. إذا لم تكن متأكداً من معلومة، اعترف بذلك

معرف المطعم: ${restaurantId}`;
}

/**
 * Extract dish suggestions from AI response
 */
function extractDishSuggestions(_content: string): DishSuggestion[] {
  // TODO: Implement logic to parse dish suggestions from AI response
  // For now, return empty array
  // In production, you would parse structured data or use function calling
  return [];
}

/**
 * AI Service
 */
export const aiService = {
  /**
   * Send chat message to AI assistant with conversation context
   */
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-dev-placeholder') {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      const systemPrompt = buildSystemPrompt(request.restaurantId);

      // Build messages array with conversation history
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // Add conversation history if provided
      if (request.conversationHistory && request.conversationHistory.length > 0) {
        // Include previous messages for context (limit to last 10 messages to avoid token limits)
        const recentHistory = request.conversationHistory.slice(-10);
        recentHistory.forEach((msg) => {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          });
        });
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: request.message,
      });

      // Add context information if provided
      if (request.context) {
        let contextInfo = '\n\nمعلومات السياق:\n';
        if (request.context.cartItems && request.context.cartItems.length > 0) {
          contextInfo += `- العناصر في السلة: ${request.context.cartItems.join(', ')}\n`;
        }
        if (request.context.currentDish) {
          contextInfo += `- الطبق الحالي: ${request.context.currentDish}\n`;
        }
        // Append context to the last user message
        messages[messages.length - 1].content += contextInfo;
      }

      const openAIRequest: OpenAIChatRequest = {
        model: AI_MODEL,
        messages,
        temperature: AI_TEMPERATURE,
        max_tokens: AI_MAX_TOKENS,
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(openAIRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data: OpenAIChatResponse = await response.json();

      const assistantMessage = data.choices[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك.';
      const suggestions = extractDishSuggestions(assistantMessage);

      return {
        message: assistantMessage,
        sessionId: request.sessionId || `session-${Date.now()}`,
        suggestions,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  /**
   * Get dish recommendations based on preferences
   */
  async getRecommendations(
    restaurantId: string,
    preferences: {
      dietary?: string[];
      spiceLevel?: string;
      budget?: number;
    }
  ): Promise<DishSuggestion[]> {
    const preferencesText = [
      preferences.dietary?.length ? `قيود غذائية: ${preferences.dietary.join(', ')}` : '',
      preferences.spiceLevel ? `مستوى الحرارة: ${preferences.spiceLevel}` : '',
      preferences.budget ? `الميزانية: ${preferences.budget} ر.س` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const message = `أريد توصيات لأطباق مناسبة بناءً على التفضيلات التالية:\n${preferencesText}`;

    const response = await this.chat({
      message,
      restaurantId,
    });

    return response.suggestions || [];
  },

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return Boolean(OPENAI_API_KEY && OPENAI_API_KEY !== 'sk-dev-placeholder');
  },

  /**
   * Get AI configuration
   */
  getConfig() {
    return {
      model: AI_MODEL,
      maxTokens: AI_MAX_TOKENS,
      temperature: AI_TEMPERATURE,
      isAvailable: this.isAvailable(),
    };
  },
};
