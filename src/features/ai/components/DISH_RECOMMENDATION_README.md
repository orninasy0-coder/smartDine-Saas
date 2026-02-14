# DishRecommendation Component

## Overview

The `DishRecommendation` component displays AI-recommended dishes with reasons, prices, images, and action buttons. It's designed to show personalized dish suggestions from the AI assistant in an attractive, interactive format.

## Features

- ✨ Animated dish cards with smooth transitions
- 🖼️ Dish images with fallback placeholders
- 💡 AI reasoning for each recommendation
- 💰 Price display
- 🛒 Add to cart functionality
- ℹ️ View details action
- ⏳ Loading state with skeleton UI
- 📱 Responsive design

## Usage

### Basic Usage

```tsx
import { DishRecommendation } from '@/features/ai/components';
import type { DishSuggestion } from '@/features/ai/types';

const suggestions: DishSuggestion[] = [
  {
    dishId: '1',
    name: 'برجر كلاسيك',
    reason: 'طبق شهير ومحبوب من قبل العملاء',
    price: 45.0,
    image: '/images/burger.jpg',
  },
];

function MyComponent() {
  const handleAddToCart = (dishId: string) => {
    console.log('Adding to cart:', dishId);
  };

  const handleViewDetails = (dishId: string) => {
    console.log('Viewing details:', dishId);
  };

  return (
    <DishRecommendation
      suggestions={suggestions}
      onAddToCart={handleAddToCart}
      onViewDetails={handleViewDetails}
    />
  );
}
```

### With Loading State

```tsx
<DishRecommendation
  suggestions={[]}
  isLoading={true}
/>
```

### Integration with AI Chat

```tsx
import { useAIChat } from '@/features/ai/hooks';
import { DishRecommendation } from '@/features/ai/components';

function ChatWithRecommendations() {
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  
  const { mutate: sendMessage } = useAIChat({
    onSuccess: (response) => {
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    },
  });

  return (
    <div>
      {/* Chat interface */}
      <DishRecommendation
        suggestions={suggestions}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `suggestions` | `DishSuggestion[]` | Yes | - | Array of dish suggestions to display |
| `onAddToCart` | `(dishId: string) => void` | No | - | Callback when add to cart button is clicked |
| `onViewDetails` | `(dishId: string) => void` | No | - | Callback when view details button is clicked |
| `isLoading` | `boolean` | No | `false` | Shows loading skeleton when true |

## DishSuggestion Type

```typescript
interface DishSuggestion {
  dishId: string;      // Unique dish identifier
  name: string;        // Dish name
  reason: string;      // AI reasoning for recommendation
  price: number;       // Dish price
  image?: string;      // Optional dish image URL
}
```

## Styling

The component uses:
- Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui components (Card, Button)
- Lucide icons (Plus, Info, Star)

### Customization

You can customize the appearance by:
1. Modifying Tailwind classes in the component
2. Adjusting animation variants
3. Changing icon components

## States

### Empty State
When `suggestions` array is empty and not loading, the component renders nothing.

### Loading State
Shows 3 skeleton cards with pulse animation.

### Populated State
Displays dish cards with:
- Image or placeholder
- Dish name
- AI reasoning (truncated to 2 lines)
- Price
- Action buttons (if callbacks provided)

## Accessibility

- Semantic HTML structure
- Button titles for screen readers
- Proper alt text for images
- Keyboard navigation support

## Animation

Uses Framer Motion with:
- Staggered children animation
- Spring-based transitions
- Smooth opacity and y-axis movement

## Best Practices

1. **Always provide callbacks**: Include `onAddToCart` and `onViewDetails` for full functionality
2. **Handle loading states**: Show loading UI while fetching recommendations
3. **Optimize images**: Use optimized images or CDN URLs
4. **Error handling**: Handle cases where suggestions might be empty
5. **Responsive design**: Component is mobile-friendly by default

## Example Scenarios

### Restaurant Menu Page
```tsx
// Show recommendations based on user preferences
<DishRecommendation
  suggestions={aiRecommendations}
  onAddToCart={addToCart}
  onViewDetails={navigateToDishPage}
/>
```

### Chat Widget
```tsx
// Display recommendations within chat interface
{lastMessage.suggestions && (
  <DishRecommendation
    suggestions={lastMessage.suggestions}
    onAddToCart={addToCart}
  />
)}
```

### Personalized Dashboard
```tsx
// Show daily recommendations
<section>
  <h2>توصيات اليوم</h2>
  <DishRecommendation
    suggestions={dailyRecommendations}
    onAddToCart={addToCart}
    onViewDetails={viewDish}
  />
</section>
```

## Testing

The component includes comprehensive tests covering:
- Loading state rendering
- Empty state handling
- Dish display
- Price formatting
- Button interactions
- Image rendering
- Placeholder fallback

Run tests with:
```bash
npm run test -- DishRecommendation.test.tsx
```

## Related Components

- `ChatWidget` - AI chat interface
- `SuggestedActions` - Quick action buttons
- `MessageList` - Chat message display

## Future Enhancements

- [ ] Dietary restriction badges
- [ ] Spice level indicators
- [ ] Preparation time display
- [ ] Nutritional information
- [ ] Favorite/save functionality
- [ ] Share recommendations
- [ ] Comparison view
