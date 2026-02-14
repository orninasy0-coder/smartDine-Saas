# AI Chat Widget Integration Guide

## Quick Start

### 1. Import Components

```tsx
import { ChatWidget, ChatButton } from '@/features/ai';
```

### 2. Add to Your Page

```tsx
function MenuPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  
  return (
    <div className="min-h-screen">
      {/* Your page content */}
      <div className="container mx-auto p-4">
        <h1>Restaurant Menu</h1>
        {/* Menu items... */}
      </div>

      {/* Add Chat Widget */}
      <ChatButton />
      {restaurantId && <ChatWidget restaurantId={restaurantId} />}
    </div>
  );
}
```

### 3. That's It!

The chat widget is now integrated and will:
- Show a floating button in the bottom-left corner
- Open/close when the button is clicked
- Display a welcome message
- Handle user messages (placeholder responses for now)

## Advanced Integration

### Programmatic Control

Control the chat widget programmatically using the UI store:

```tsx
import { useUIStore } from '@/store/uiStore';

function MyComponent() {
  const { setChatWidgetOpen } = useUIStore();
  
  const handleHelpClick = () => {
    setChatWidgetOpen(true);
  };
  
  return (
    <button onClick={handleHelpClick}>
      Need Help?
    </button>
  );
}
```

### Cart Integration

Add dishes to cart from AI suggestions:

```tsx
import { ChatWidget } from '@/features/ai';
import { useCart } from '@/features/cart';

function MenuPageWithCart() {
  const { restaurantId } = useParams();
  const { addItem } = useCart();
  
  // This will be passed to MessageList via ChatWidget
  // when we implement the full integration
  const handleAddToCart = (dishId: string) => {
    addItem(dishId, 1);
  };
  
  return (
    <div>
      {/* Content */}
      <ChatButton />
      {restaurantId && <ChatWidget restaurantId={restaurantId} />}
    </div>
  );
}
```

### Feature Gating (Subscription-Based)

Show chat widget only for Pro/Enterprise plans:

```tsx
function MenuPageWithFeatureGating() {
  const { restaurantId } = useParams();
  const { restaurant } = useRestaurant(restaurantId);
  
  const hasAIFeature = ['PRO', 'ENTERPRISE'].includes(
    restaurant?.subscriptionPlan || ''
  );
  
  return (
    <div>
      {/* Content */}
      
      {hasAIFeature && (
        <>
          <ChatButton />
          {restaurantId && <ChatWidget restaurantId={restaurantId} />}
        </>
      )}
    </div>
  );
}
```

## Styling Customization

### Position

The chat button is positioned at `bottom-4 left-4` by default. To change:

```tsx
// Edit ChatButton.tsx
<motion.div className="fixed bottom-4 right-4 z-40">
  {/* Change left-4 to right-4 for right side */}
</motion.div>
```

### Colors

The chat widget uses theme colors from Tailwind. Customize in your theme:

```css
/* In your tailwind.config.js or CSS */
.bg-primary {
  /* Chat header background */
}

.text-primary-foreground {
  /* Chat header text */
}
```

### Size

Adjust widget size in ChatWidget.tsx:

```tsx
// Current: w-full max-w-md h-[600px] md:w-96
// Change to your preferred size
className="... w-full max-w-lg h-[700px] md:w-[500px]"
```

## API Integration

### Step 1: Create AI Service

```typescript
// src/features/ai/services/aiService.ts
import type { AIChatRequest, AIChatResponse } from '../types';

export const aiService = {
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    const response = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('AI chat request failed');
    }
    
    return response.json();
  },
};
```

### Step 2: Create React Query Hook

```typescript
// src/features/ai/hooks/useAIChat.ts
import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/aiService';
import type { AIChatRequest } from '../types';

export function useAIChat() {
  return useMutation({
    mutationFn: (data: AIChatRequest) => aiService.chat(data),
    onError: (error) => {
      console.error('AI chat error:', error);
    },
  });
}
```

### Step 3: Update ChatWidget

```typescript
// In ChatWidget.tsx
import { useAIChat } from '../hooks/useAIChat';

export const ChatWidget: React.FC<ChatWidgetProps> = ({ restaurantId }) => {
  const { mutate: sendMessage, isPending } = useAIChat();
  
  const handleSendMessage = (content: string) => {
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Call AI API
    sendMessage(
      {
        message: content,
        sessionId,
        restaurantId,
      },
      {
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
      }
    );
  };
  
  // Pass isPending to MessageInput
  return (
    // ... JSX with <MessageInput isLoading={isPending} />
  );
};
```

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { ChatWidget } from './ChatWidget';

test('renders chat widget', () => {
  render(<ChatWidget restaurantId="test" />);
  expect(screen.getByText('المساعد الذكي')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from './ChatWidget';

test('sends message and receives response', async () => {
  const user = userEvent.setup();
  render(<ChatWidget restaurantId="test" />);
  
  const input = screen.getByPlaceholderText('اكتب رسالتك هنا...');
  await user.type(input, 'Hello');
  await user.keyboard('{Enter}');
  
  await waitFor(() => {
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Chat Widget Not Showing

1. Check if `chatWidgetOpen` is true in UI store
2. Verify `restaurantId` is provided
3. Check z-index conflicts with other elements

### Messages Not Scrolling

1. Ensure `scrollIntoView` is supported in your environment
2. Check if MessageList container has proper overflow settings

### Styling Issues

1. Verify Tailwind CSS is properly configured
2. Check if shadcn/ui components are installed
3. Ensure Framer Motion is installed

### TypeScript Errors

1. Run `npm install` to ensure all dependencies are installed
2. Restart TypeScript server in your IDE
3. Check tsconfig.json for proper path aliases

## Performance Tips

1. **Lazy Load**: Only render ChatWidget when needed
2. **Memoization**: Use React.memo for MessageList items
3. **Virtualization**: For long message lists, consider react-window
4. **Debounce**: Debounce API calls if implementing typing indicators

## Accessibility Checklist

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support (ARIA labels)
- ✅ Focus management
- ✅ Color contrast (WCAG AA)
- ✅ Touch targets (minimum 44x44px)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## Support

For issues or questions:
1. Check the README.md in `src/features/ai/`
2. Review example usage in `ChatWidget.example.tsx`
3. Check implementation summary in `IMPLEMENTATION_SUMMARY.md`
