# Conversation Context Management

## Overview

The AI Assistant maintains conversation context throughout the ordering session, allowing for natural, context-aware interactions. This feature enables the AI to remember previous messages and provide relevant responses based on the conversation history.

## Features

### 1. Conversation History Tracking

The AI service includes the last 10 messages from the conversation when making API requests to OpenAI. This allows the AI to:

- Remember what the user asked previously
- Provide consistent recommendations
- Answer follow-up questions accurately
- Maintain conversation flow

**Example:**
```
User: "أريد برجر"
AI: "لدينا برجر لحم وبرجر دجاج. أيهما تفضل؟"
User: "ماذا طلبت قبل قليل؟"
AI: "طلبت برجر. هل تريد برجر اللحم أم الدجاج؟"
```

### 2. Conversation Persistence

Conversations are automatically saved to localStorage and restored when the user returns to the page. This ensures:

- Conversation history survives page reloads
- Users can continue where they left off
- Each restaurant has its own conversation history
- History is stored locally for privacy

**Storage Key Format:** `ai-chat-{restaurantId}`

### 3. Context Information

The AI service can include additional context in requests:

- **Cart Items**: Current items in the user's cart
- **Current Dish**: The dish the user is currently viewing

This context is appended to the user's message to help the AI provide more relevant responses.

**Example:**
```typescript
await aiService.chat({
  message: 'هل هذا الطبق حار؟',
  restaurantId: 'restaurant-123',
  context: {
    currentDish: 'دجاج حار',
    cartItems: ['برجر لحم', 'بطاطس مقلية'],
  },
});
```

### 4. Session Management

Each conversation has a unique session ID that:

- Tracks the conversation across multiple messages
- Can be used for analytics and debugging
- Is automatically generated if not provided
- Persists throughout the conversation

## Implementation Details

### AI Service

The `aiService.chat()` method accepts conversation history:

```typescript
interface AIChatRequest {
  message: string;
  sessionId?: string;
  restaurantId: string;
  conversationHistory?: AIMessage[];
  context?: {
    cartItems?: string[];
    currentDish?: string;
  };
}
```

**History Limit:** Only the last 10 messages are included to avoid exceeding token limits.

### ChatWidget Component

The ChatWidget component:

1. Loads conversation history from localStorage on mount
2. Saves messages to localStorage whenever they change
3. Passes conversation history to the AI service with each request
4. Handles corrupted localStorage data gracefully

### Storage Format

Messages are stored as JSON arrays:

```json
[
  {
    "id": "welcome",
    "role": "assistant",
    "content": "مرحباً! أنا مساعدك الذكي.",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "user-1",
    "role": "user",
    "content": "أريد برجر",
    "timestamp": "2024-01-15T10:31:00.000Z"
  }
]
```

## Usage

### Basic Usage

The conversation context is handled automatically by the ChatWidget component. No additional configuration is needed.

### Clearing Conversation History

To clear the conversation history programmatically:

```typescript
const storageKey = `ai-chat-${restaurantId}`;
localStorage.removeItem(storageKey);
```

### Accessing Conversation History

To access the current conversation history:

```typescript
const storageKey = `ai-chat-${restaurantId}`;
const savedMessages = localStorage.getItem(storageKey);
if (savedMessages) {
  const messages = JSON.parse(savedMessages);
  // Use messages
}
```

## Testing

Comprehensive tests are available in:

- `src/features/ai/services/conversationContext.test.ts` - Tests for AI service context handling
- `src/features/ai/components/ChatWidget.context.test.tsx` - Tests for ChatWidget persistence

Run tests:
```bash
npm test -- src/features/ai/services/conversationContext.test.ts
npm test -- src/features/ai/components/ChatWidget.context.test.tsx
```

## Privacy Considerations

- Conversation history is stored locally in the browser
- No conversation data is sent to the server (except during AI API calls)
- Users can clear their history by clearing browser data
- Each restaurant has isolated conversation storage

## Performance

- History is limited to 10 messages to control token usage
- localStorage operations are minimal and non-blocking
- Conversation data is small (typically < 10KB)

## Future Enhancements

Potential improvements for future versions:

1. **Server-side persistence**: Store conversations on the server for cross-device access
2. **Conversation export**: Allow users to download their conversation history
3. **Smart context pruning**: Intelligently select relevant messages instead of just the last 10
4. **Context summarization**: Summarize long conversations to reduce token usage
5. **Multi-session support**: Support multiple concurrent conversations per restaurant

## Requirements Validation

This implementation satisfies:

- **Requirement 5.6**: "THE AI_Assistant SHALL maintain conversation context throughout the ordering session"
- **Property 26**: AI responses are context-aware and reference previous messages
- **Property 27**: Conversation history is preserved across interactions

## Related Files

- `src/features/ai/services/aiService.ts` - AI service with context handling
- `src/features/ai/components/ChatWidget.tsx` - Chat widget with persistence
- `src/features/ai/types/index.ts` - Type definitions
- `src/features/ai/hooks/useAIChat.ts` - React Query hook for AI chat
