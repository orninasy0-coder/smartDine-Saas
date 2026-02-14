/**
 * AI Assistant Types
 */

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: DishSuggestion[];
}

export interface DishSuggestion {
  dishId: string;
  name: string;
  reason: string;
  price: number;
  image?: string;
}

export interface ChatSession {
  sessionId: string;
  restaurantId: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIChatRequest {
  message: string;
  sessionId?: string;
  restaurantId: string;
  conversationHistory?: AIMessage[];
  context?: {
    cartItems?: string[];
    currentDish?: string;
  };
}

export interface AIChatResponse {
  message: string;
  sessionId: string;
  suggestions?: DishSuggestion[];
  timestamp: Date;
}
