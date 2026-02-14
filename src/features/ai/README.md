# AI Assistant Feature Module

This module provides AI-powered conversational assistance for customers ordering food.

## Components

### ChatWidget

The main floating chat interface component that manages the conversation with the AI assistant.

**Features:**
- Floating widget with minimize/maximize functionality
- Mobile-responsive with backdrop overlay
- Session management
- Real-time message updates
- Integration with UI store for open/close state

**Usage:**
```tsx
import { ChatWidget } from '@/features/ai';

function MenuPage() {
  const { restaurantId } = useParams();
  
  return (
    <div>
      {/* Your menu content */}
      <ChatWidget restaurantId={restaurantId} />
    </div>
  );
}
```

### MessageList

Displays the conversation history between the user and AI assistant.

**Features:**
- Auto-scroll to latest message
- Message animations with Framer Motion
- User/Assistant message differentiation
- Dish suggestions with add-to-cart functionality
- Timestamp display
- Avatar icons for user/bot

**Props:**
- `messages: AIMessage[]` - Array of conversation messages
- `onAddToCart?: (dishId: string) => void` - Callback for adding suggested dishes to cart

### MessageInput

Text input component for sending messages to the AI assistant.

**Features:**
- Auto-resizing textarea
- Send on Enter, new line on Shift+Enter
- Loading state support
- Quick action buttons for common queries
- Character limit handling

**Props:**
- `onSendMessage: (message: string) => void` - Callback when user sends a message
- `isLoading?: boolean` - Loading state indicator
- `placeholder?: string` - Input placeholder text

## Types

### AIMessage
```typescript
interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: DishSuggestion[];
}
```

### DishSuggestion
```typescript
interface DishSuggestion {
  dishId: string;
  name: string;
  reason: string;
  price: number;
  image?: string;
}
```

### AIChatRequest
```typescript
interface AIChatRequest {
  message: string;
  sessionId?: string;
  restaurantId: string;
  context?: {
    cartItems?: string[];
    currentDish?: string;
  };
}
```

### AIChatResponse
```typescript
interface AIChatResponse {
  message: string;
  sessionId: string;
  suggestions?: DishSuggestion[];
  timestamp: Date;
}
```

## State Management

The chat widget uses the global UI store for open/close state:

```typescript
import { useUIStore } from '@/store/uiStore';

const { chatWidgetOpen, toggleChatWidget, setChatWidgetOpen } = useUIStore();
```

## Integration with Backend

To integrate with the AI API:

1. Create a service in `src/features/ai/services/aiService.ts`
2. Use React Query for API calls
3. Update the `handleSendMessage` function in ChatWidget to call the API

Example:
```typescript
import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

const { mutate: sendMessage, isLoading } = useMutation({
  mutationFn: (data: AIChatRequest) => aiService.chat(data),
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
});
```

## Styling

The components use:
- Tailwind CSS for styling
- shadcn/ui components (Button, Card, Textarea)
- Framer Motion for animations
- Lucide icons

## Accessibility

- Keyboard navigation support (Enter to send, Shift+Enter for new line)
- ARIA labels for screen readers
- Focus management
- Color contrast compliance

## Future Enhancements

- [ ] Voice input support
- [ ] Message history persistence
- [ ] Typing indicators
- [ ] Message reactions
- [ ] File/image sharing
- [ ] Multi-language support
- [ ] Conversation export
- [ ] AI response streaming
