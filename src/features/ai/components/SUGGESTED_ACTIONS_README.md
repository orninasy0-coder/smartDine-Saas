# SuggestedActions Component

## Overview

The `SuggestedActions` component provides quick action buttons for common AI assistant queries. It displays a set of predefined or custom action buttons that users can click to quickly send common queries to the AI assistant without typing.

## Features

- **Default Actions**: Comes with 6 predefined common actions in Arabic
- **Custom Actions**: Support for custom action sets with labels, queries, and icons
- **Loading State**: Disables all buttons when loading
- **Animated**: Smooth stagger animation using Framer Motion
- **Accessible**: Fully keyboard accessible with proper ARIA attributes
- **Responsive**: Wraps buttons on smaller screens

## Usage

### Basic Usage (Default Actions)

```tsx
import { SuggestedActions } from '@/features/ai/components';

function MyComponent() {
  const handleActionClick = (query: string) => {
    console.log('User selected:', query);
    // Send query to AI assistant
  };

  return (
    <SuggestedActions onActionClick={handleActionClick} />
  );
}
```

### Custom Actions

```tsx
import { SuggestedActions, type SuggestedAction } from '@/features/ai/components';
import { Coffee, Pizza } from 'lucide-react';

function MyComponent() {
  const customActions: SuggestedAction[] = [
    {
      id: 'coffee',
      label: 'قهوة',
      query: 'أريد قهوة ساخنة',
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      id: 'pizza',
      label: 'بيتزا',
      query: 'أريد بيتزا كبيرة',
      icon: <Pizza className="w-4 h-4" />,
    },
  ];

  return (
    <SuggestedActions
      onActionClick={handleActionClick}
      customActions={customActions}
    />
  );
}
```

### With Loading State

```tsx
<SuggestedActions
  onActionClick={handleActionClick}
  isLoading={isAILoading}
/>
```

## Props

### `SuggestedActionsProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onActionClick` | `(query: string) => void` | Yes | - | Callback function called when an action is clicked, receives the query string |
| `isLoading` | `boolean` | No | `false` | When true, all action buttons are disabled |
| `customActions` | `SuggestedAction[]` | No | Default actions | Array of custom actions to display instead of defaults |

### `SuggestedAction` Type

```typescript
interface SuggestedAction {
  id: string;           // Unique identifier for the action
  label: string;        // Display text on the button
  query: string;        // Query text to send when clicked
  icon?: React.ReactNode; // Optional icon to display
}
```

## Default Actions

The component comes with 6 default actions in Arabic:

1. **الأطباق المقترحة** (Recommendations) - "ما هي الأطباق المقترحة اليوم؟"
2. **أطباق نباتية** (Vegetarian) - "ما هي الأطباق النباتية المتوفرة؟"
3. **أطباق حارة** (Spicy) - "أريد طبقاً حاراً"
4. **الأكثر طلباً** (Popular) - "ما هي الأطباق الأكثر طلباً؟"
5. **وجبات سريعة** (Quick) - "أريد وجبة سريعة التحضير"
6. **خيارات اقتصادية** (Budget) - "ما هي الخيارات الاقتصادية المتوفرة؟"

## Integration with MessageInput

The `SuggestedActions` component is integrated into the `MessageInput` component:

```tsx
import { MessageInput } from '@/features/ai/components';

// MessageInput automatically includes SuggestedActions
<MessageInput
  onSendMessage={handleSend}
  isLoading={isLoading}
/>
```

## Styling

The component uses Tailwind CSS classes and follows the design system:

- Buttons use `outline` variant with hover effects
- Icons are sized at `w-4 h-4`
- Buttons have a height of `h-8` for consistency
- Hover state changes to primary color with border
- Smooth transitions on all interactive states

## Animation

The component uses Framer Motion for animations:

- **Container**: Fades in with stagger effect on children
- **Items**: Each button animates in with a spring animation
- **Stagger Delay**: 0.05s between each button
- **Spring Config**: Stiffness 300, Damping 24

## Accessibility

- All buttons are keyboard accessible
- Proper focus states
- Disabled state when loading
- Semantic HTML with proper button elements
- Screen reader friendly labels

## Examples

See `SuggestedActions.example.tsx` for complete working examples including:

1. Default actions usage
2. Custom actions with icons
3. Loading state demonstration
4. Integration patterns

## Testing

The component includes comprehensive tests in `SuggestedActions.test.tsx`:

- Renders default actions correctly
- Handles click events with correct queries
- Supports custom actions
- Respects loading state
- Properly disables/enables buttons

Run tests with:

```bash
npm test -- SuggestedActions.test.tsx
```

## Related Components

- **MessageInput**: Uses SuggestedActions for quick queries
- **ChatWidget**: Contains MessageInput with SuggestedActions
- **MessageList**: Displays AI responses to suggested actions

## Best Practices

1. **Keep actions concise**: Use short, clear labels (2-3 words)
2. **Relevant icons**: Use icons that clearly represent the action
3. **Contextual actions**: Customize actions based on restaurant type or menu
4. **Loading feedback**: Always pass `isLoading` state to prevent duplicate requests
5. **Query clarity**: Write queries that are clear and specific for the AI

## Future Enhancements

Potential improvements for future versions:

- Dynamic actions based on menu context
- Personalized actions based on user history
- Action analytics and usage tracking
- Multi-language support for action labels
- Action categories/groups for better organization
