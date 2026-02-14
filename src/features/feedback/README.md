# Feedback Feature

This module provides components for collecting customer feedback and ratings.

## Components

### AverageRating

A display component that shows the average rating with stars and review count. Perfect for displaying aggregate ratings on dish cards, restaurant pages, or anywhere you need to show rating statistics.

**Features:**
- Displays formatted average rating (e.g., "4.5/5")
- Shows star visualization (readonly)
- Displays review count with proper pluralization
- Multiple size options (sm, md, lg)
- Horizontal or vertical layout
- Optional label and count display
- Customizable styling

**Usage:**

```tsx
import { AverageRating } from '@/features/feedback';

// Basic usage
<AverageRating
  averageRating={4.5}
  reviewCount={127}
/>

// Compact display (no label)
<AverageRating
  averageRating={4.2}
  reviewCount={45}
  size="sm"
  showLabel={false}
/>

// Vertical layout
<AverageRating
  averageRating={4.8}
  reviewCount={203}
  layout="vertical"
/>

// Minimal (stars only)
<AverageRating
  averageRating={3.5}
  reviewCount={12}
  showLabel={false}
  showCount={false}
  size="sm"
/>
```

**Props:**
- `averageRating` (number): Average rating value (0-5)
- `reviewCount` (number): Total number of reviews
- `size` ('sm' | 'md' | 'lg', optional): Star size (default: 'md')
- `showCount` (boolean, optional): Show review count (default: true)
- `showLabel` (boolean, optional): Show rating number (default: true)
- `className` (string, optional): Additional CSS classes
- `layout` ('horizontal' | 'vertical', optional): Layout direction (default: 'horizontal')

### StarRating

An interactive star rating component that allows users to rate their experience on a 1-5 scale.

**Features:**
- Interactive star selection with hover effects
- Keyboard navigation support (Enter/Space keys)
- Readonly mode for displaying existing ratings
- Customizable size (sm, md, lg)
- Optional rating label display
- Accessible with proper ARIA labels

**Usage:**

```tsx
import { StarRating } from '@/features/feedback';

// Interactive rating
<StarRating
  rating={rating}
  onRatingChange={setRating}
  size="lg"
  showLabel
/>

// Readonly display
<StarRating
  rating={4}
  readonly
  size="md"
/>
```

**Props:**
- `rating` (number): Current rating value (0-5)
- `onRatingChange` (function, optional): Callback when rating changes
- `maxRating` (number, optional): Maximum rating value (default: 5)
- `size` ('sm' | 'md' | 'lg', optional): Star size (default: 'md')
- `readonly` (boolean, optional): Disable interaction (default: false)
- `showLabel` (boolean, optional): Show rating label (default: false)
- `className` (string, optional): Additional CSS classes

### FeedbackForm

A complete feedback form component that combines star rating and text review input.

**Features:**
- Star rating selection (required)
- Text review input (optional, max 1000 characters)
- Form validation with error messages
- Character count display
- Loading state support
- Optional card wrapper
- Order/dish information display

**Usage:**

```tsx
import { FeedbackForm } from '@/features/feedback';

function OrderFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      await submitFeedback(data);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FeedbackForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      orderId="12345678-abcd"
      dishName="Margherita Pizza"
    />
  );
}
```

**Props:**
- `onSubmit` (function): Callback when form is submitted with `FeedbackFormData`
- `isSubmitting` (boolean, optional): Loading state (default: false)
- `orderId` (string, optional): Order ID to display
- `dishName` (string, optional): Dish name to display
- `className` (string, optional): Additional CSS classes
- `showCard` (boolean, optional): Wrap in card component (default: true)

**FeedbackFormData Type:**
```typescript
interface FeedbackFormData {
  rating: number;        // 1-5
  comment: string;       // Trimmed text, max 1000 chars
}
```

### FeedbackPrompt

A prompt component that appears after order delivery to encourage users to leave feedback. Supports multiple display variants (dialog, card, inline).

**Features:**
- Multiple display variants (dialog, card, inline)
- Auto-show capability for dialog variant
- Success message after submission
- Dismissible with optional callback
- Restaurant and order information display
- Integrates with FeedbackForm component

**Usage:**

```tsx
import { FeedbackPrompt } from '@/features/feedback';

// Dialog variant (appears as modal)
function OrderDeliveredPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      await submitFeedback(data);
      toast.success('Thank you for your feedback!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    // Track dismissal or save preference
    console.log('User dismissed feedback prompt');
  };

  return (
    <FeedbackPrompt
      orderId="order-123"
      orderNumber="ORD-001"
      restaurantName="Test Restaurant"
      onSubmit={handleSubmit}
      onDismiss={handleDismiss}
      isSubmitting={isSubmitting}
      variant="dialog"
      autoShow
    />
  );
}

// Card variant (embedded in page)
function OrderCompletePage() {
  return (
    <div className="space-y-4">
      <h1>Order Completed</h1>
      <FeedbackPrompt
        orderId="order-123"
        orderNumber="ORD-001"
        onSubmit={handleSubmit}
        variant="card"
      />
    </div>
  );
}

// Inline variant (no wrapper)
function OrderSummary() {
  return (
    <div className="p-4">
      <FeedbackPrompt
        orderId="order-123"
        orderNumber="ORD-001"
        onSubmit={handleSubmit}
        variant="inline"
      />
    </div>
  );
}
```

**Props:**
- `orderId` (string): Order ID for feedback submission
- `orderNumber` (string): Display-friendly order number
- `restaurantName` (string, optional): Restaurant name to display
- `onSubmit` (function): Callback when feedback is submitted with `FeedbackFormData`
- `onDismiss` (function, optional): Callback when prompt is dismissed
- `isSubmitting` (boolean, optional): Loading state (default: false)
- `variant` ('dialog' | 'card' | 'inline', optional): Display variant (default: 'dialog')
- `autoShow` (boolean, optional): Auto-show dialog on mount (default: false)
- `className` (string, optional): Additional CSS classes

**Variants:**
- **dialog**: Modal overlay that can be auto-shown after delivery
- **card**: Card component embedded in page content
- **inline**: Minimal wrapper for custom layouts

## Validation Rules

### Rating
- **Required**: User must select a rating (1-5 stars)
- **Range**: 1-5 (enforced by component)

### Comment
- **Optional**: User can submit without a comment
- **Max Length**: 1000 characters
- **Trimming**: Whitespace is automatically trimmed on submission

## Accessibility

Both components follow WCAG 2.1 Level AA guidelines:

- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Space keys
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Clear focus indicators
- **Error Messages**: Announced with `role="alert"`
- **Color Contrast**: Meets 4.5:1 contrast ratio

## Integration Example

### Post-Delivery Feedback Flow

```tsx
import { FeedbackPrompt, FeedbackFormData } from '@/features/feedback';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function OrderTrackingPage({ order }: { order: Order }) {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  // Show feedback prompt when order is delivered
  useEffect(() => {
    if (order.status === 'DELIVERED') {
      // Wait a moment before showing prompt
      const timer = setTimeout(() => {
        setShowFeedbackPrompt(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [order.status]);

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          rating: data.rating,
          comment: data.comment,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to submit feedback');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      setShowFeedbackPrompt(false);
    },
    onError: () => {
      toast.error('Failed to submit feedback. Please try again.');
    },
  });

  const handleDismiss = () => {
    setShowFeedbackPrompt(false);
    // Optionally save dismissal preference
    localStorage.setItem(`feedback-dismissed-${order.id}`, 'true');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Order tracking content */}
      <OrderTracker order={order} />
      
      {/* Feedback prompt appears after delivery */}
      {showFeedbackPrompt && (
        <FeedbackPrompt
          orderId={order.id}
          orderNumber={order.orderNumber}
          restaurantName={order.restaurant?.name}
          onSubmit={(data) => submitFeedbackMutation.mutate(data)}
          onDismiss={handleDismiss}
          isSubmitting={submitFeedbackMutation.isPending}
          variant="dialog"
          autoShow
        />
      )}
    </div>
  );
}
```

### Customer Feedback Flow

```tsx
import { FeedbackForm, FeedbackFormData } from '@/features/feedback';
import { useMutation } from '@tanstack/react-query';

function CustomerFeedbackPage({ orderId }: { orderId: string }) {
  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating: data.rating,
          comment: data.comment,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to submit feedback');
      return response.json();
    },
    onSuccess: () => {
      // Show success message
      toast.success('Thank you for your feedback!');
    },
    onError: () => {
      // Show error message
      toast.error('Failed to submit feedback. Please try again.');
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <FeedbackForm
        onSubmit={(data) => submitFeedbackMutation.mutate(data)}
        isSubmitting={submitFeedbackMutation.isPending}
        orderId={orderId}
      />
    </div>
  );
}
```

### Display Existing Ratings

```tsx
import { StarRating, AverageRating } from '@/features/feedback';

// Using AverageRating component (recommended)
function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{dish.name}</h3>
      <p>{dish.description}</p>
      <div className="mt-2">
        <AverageRating
          averageRating={dish.averageRating}
          reviewCount={dish.reviewCount}
          size="sm"
        />
      </div>
    </div>
  );
}

// Using StarRating directly (for custom layouts)
function DishCardCustom({ dish }: { dish: Dish }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{dish.name}</h3>
      <p>{dish.description}</p>
      <div className="flex items-center gap-2 mt-2">
        <StarRating rating={dish.averageRating} readonly size="sm" />
        <span className="text-sm text-muted-foreground">
          ({dish.reviewCount} reviews)
        </span>
      </div>
    </div>
  );
}

// Restaurant header with vertical layout
function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="flex items-center gap-6">
      <img src={restaurant.logo} alt={restaurant.name} className="w-20 h-20" />
      <div>
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <AverageRating
          averageRating={restaurant.averageRating}
          reviewCount={restaurant.totalReviews}
          size="md"
          layout="horizontal"
        />
      </div>
    </div>
  );
}
```

## Testing

All components have comprehensive test coverage:

- **AverageRating.test.tsx**: Tests for rendering, display options, size/layout variants, and edge cases
- **StarRating.test.tsx**: Tests for rendering, interaction, accessibility, and edge cases
- **FeedbackForm.test.tsx**: Tests for form validation, submission, loading states, and accessibility
- **FeedbackPrompt.test.tsx**: Tests for all variants (dialog, card, inline), submission flow, and dismissal

Run tests:
```bash
npm run test src/features/feedback
```

## Styling

Components use Tailwind CSS and shadcn/ui for consistent styling:
- Dark mode support
- Responsive design
- Smooth transitions and animations
- Consistent with design system

## Future Enhancements

Potential improvements for future iterations:
- Image upload for feedback
- Emoji reactions
- Feedback categories/tags
- Anonymous feedback option
- Feedback editing capability
