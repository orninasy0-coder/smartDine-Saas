/**
 * ChatWidget Component
 * Floating AI assistant chat interface
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useAIChat } from '../hooks/useAIChat';
import { toast } from 'sonner';
import type { AIMessage } from '../types';

interface ChatWidgetProps {
  restaurantId: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ restaurantId }) => {
  const { chatWidgetOpen, setChatWidgetOpen } = useUIStore();
  const { addItem } = useCartStore();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  // Load conversation history from localStorage on mount
  useEffect(() => {
    const storageKey = `ai-chat-${restaurantId}`;
    const savedMessages = localStorage.getItem(storageKey);
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: AIMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load conversation history:', error);
        // Initialize with welcome message if loading fails
        initializeWelcomeMessage();
      }
    } else {
      // Initialize with welcome message if no saved history
      initializeWelcomeMessage();
    }
  }, [restaurantId]);

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `ai-chat-${restaurantId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, restaurantId]);

  // Helper function to initialize welcome message
  const initializeWelcomeMessage = () => {
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني اقتراح أطباق، الإجابة عن أسئلتك حول القائمة، أو مساعدتك في اختيار وجبتك المثالية.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  // AI Chat mutation
  const { mutate: sendAIMessage, isPending: isAILoading } = useAIChat({
    onSuccess: (response) => {
      const assistantMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(response.timestamp),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ في الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send to AI API with conversation history
    sendAIMessage({
      message: content,
      sessionId,
      restaurantId,
      conversationHistory: messages, // Pass conversation history for context
    });
  };

  const handleClose = () => {
    setChatWidgetOpen(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClearHistory = () => {
    const storageKey = `ai-chat-${restaurantId}`;
    localStorage.removeItem(storageKey);
    initializeWelcomeMessage();
  };

  const handleAddToCart = (dishId: string) => {
    // Find the dish suggestion in the messages
    let dishSuggestion = null;
    
    for (const message of messages) {
      if (message.suggestions) {
        dishSuggestion = message.suggestions.find((s) => s.dishId === dishId);
        if (dishSuggestion) break;
      }
    }

    if (!dishSuggestion) {
      toast.error('لم يتم العثور على الطبق');
      return;
    }

    // Add to cart
    addItem(
      {
        dishId: dishSuggestion.dishId,
        name: dishSuggestion.name,
        price: dishSuggestion.price,
        quantity: 1,
        image: dishSuggestion.image,
      },
      restaurantId
    );

    // Show success toast
    toast.success(`تمت إضافة ${dishSuggestion.name} إلى السلة`);
  };

  if (!chatWidgetOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {chatWidgetOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {chatWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 ${
              isMinimized
                ? 'bottom-4 right-4 w-80'
                : 'bottom-4 right-4 w-full max-w-md h-[600px] md:w-96'
            }`}
          >
            <Card className="flex flex-col h-full shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold text-sm">المساعد الذكي</h3>
                    <p className="text-xs opacity-90">متصل الآن</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={handleToggleMinimize}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={handleClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Content - Hidden when minimized */}
              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-hidden">
                    <MessageList 
                      messages={messages}
                      onAddToCart={handleAddToCart}
                    />
                  </div>

                  {/* Input */}
                  <div className="border-t">
                    <MessageInput 
                      onSendMessage={handleSendMessage}
                      isLoading={isAILoading}
                    />
                  </div>
                </>
              )}

              {/* Minimized State */}
              {isMinimized && (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {messages.length} رسالة
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
