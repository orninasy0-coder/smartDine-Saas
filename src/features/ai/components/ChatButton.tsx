/**
 * ChatButton Component
 * Floating button to open the AI chat widget
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';

export const ChatButton: React.FC = () => {
  const { chatWidgetOpen, toggleChatWidget } = useUIStore();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      className="fixed bottom-4 left-4 z-40"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-2xl hover:shadow-xl transition-shadow"
        onClick={toggleChatWidget}
      >
        <motion.div
          animate={{ rotate: chatWidgetOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {chatWidgetOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </motion.div>
      </Button>

      {/* Notification Badge (optional - for unread messages) */}
      {!chatWidgetOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
        >
          <span className="text-xs text-destructive-foreground font-bold">1</span>
        </motion.div>
      )}
    </motion.div>
  );
};
