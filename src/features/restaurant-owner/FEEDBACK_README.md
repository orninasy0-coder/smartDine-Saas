# Feedback Management - Restaurant Owner Dashboard

## Overview

The Feedback Management feature allows restaurant owners to view, filter, and analyze customer feedback and ratings. This helps restaurants understand customer satisfaction and identify areas for improvement.

## Components

### FeedbackPage

Main page component that displays feedback overview and statistics.

**Location:** `src/features/restaurant-owner/pages/Feedback.tsx`

**Features:**
- Overview statistics (average rating, total feedback, comment rate, recent feedback)
- Rating distribution chart
- Filterable and sortable feedback list
- Responsive design for all screen sizes

**Usage:**
```tsx
import { FeedbackPage } from '@/features/restaurant-owner';

function App() {
  return <FeedbackPage />;
}
```

### FeedbackList

Component that displays a list of customer feedback with filtering and sorting options.

**Location:** `src/features/restaurant-owner/components/FeedbackList.tsx`

**Props:**
```typescript
interface FeedbackListProps {
  feedback: Feedback[];
  isLoading?: boolean;
}
```

**Features:**
- Filter by rating (1-5 stars or all)
- Sort by most recent or highest rating
- Individual feedback cards with:
  - Star rating display
  - Customer comments
  - Order information
  - Timestamp
  - Dish-specific feedback indicator
- Loading skeleton state
- Empty state when no feedback exists

**Usage:**
```tsx
import { FeedbackList } from '@/features/restaurant-owner';

function MyComponent() {
  const feedback = [
    {
      id: '1',
      restaurantId: 'rest-1',
      orderId: 'order-123',
      customerId: 'customer-1',
      rating: 5,
      comment: 'Great food!',
      createdAt: new Date().toISOString(),
    },
  ];

  return <FeedbackList feedback={feedback} />;
}
```

## Data Structure

### Feedback Interface

```typescript
interface Feedback {
  id: string;
  restaurantId: string;
  orderId: string;
  customerId: string;
  dishId?: string;        // Optional: specific dish feedback
  rating: number;         // 1-5 stars
  comment?: string;       // Optional text review
  createdAt: string;      // ISO date string
}
```

## Features

### 1. Statistics Dashboard

The feedback page displays key metrics:

- **Average Rating**: Overall rating out of 5.0 stars
- **Total Feedback**: Total number of reviews received
- **Comment Rate**: Percentage of customers who left text comments
- **Recent Feedback**: Number of reviews in the last 7 days

### 2. Rating Distribution

Visual breakdown showing the count of each star rating (1-5 stars) with progress bars.

### 3. Filtering

Filter feedback by specific star ratings:
- All Ratings
- 5 Stars
- 4 Stars
- 3 Stars
- 2 Stars
- 1 Star

### 4. Sorting

Sort feedback by:
- **Most Recent**: Newest feedback first
- **Highest Rating**: Highest rated feedback first

### 5. Feedback Cards

Each feedback card displays:
- Order number (truncated for privacy)
- Date and time of feedback
- Star rating badge (color-coded by rating)
- Visual star rating display
- Customer comment (if provided)
- Indicator for dish-specific feedback

## Color Coding

Ratings are color-coded for quick identification:
- **5-4 stars**: Default/Primary (positive)
- **3 stars**: Secondary (neutral)
- **2-1 stars**: Destructive/Red (needs attention)

## States

### Loading State
Shows skeleton placeholders while fetching feedback data.

### Empty State
Displays a friendly message when no feedback exists yet.

### No Results State
Shows when filters don't match any feedback.

## Integration

### With Backend API

To integrate with a real backend:

```typescript
// In FeedbackPage component
import { useQuery } from '@tanstack/react-query';
import { fetchFeedback } from '../services/feedbackService';

export function FeedbackPage() {
  const { data: feedback, isLoading } = useQuery({
    queryKey: ['feedback', restaurantId],
    queryFn: () => fetchFeedback(restaurantId),
  });

  // ... rest of component
}
```

### Create Feedback Service

```typescript
// src/features/restaurant-owner/services/feedbackService.ts
import { Feedback } from '@/utils/types';

export async function fetchFeedback(restaurantId: string): Promise<Feedback[]> {
  const response = await fetch(`/api/v1/feedback/restaurant/${restaurantId}`);
  if (!response.ok) throw new Error('Failed to fetch feedback');
  return response.json();
}

export async function fetchDishFeedback(dishId: string): Promise<Feedback[]> {
  const response = await fetch(`/api/v1/feedback/dish/${dishId}`);
  if (!response.ok) throw new Error('Failed to fetch dish feedback');
  return response.json();
}
```

## Routing

Add the feedback page to your router:

```tsx
// In your router configuration
import { FeedbackPage } from '@/features/restaurant-owner';

{
  path: '/dashboard/feedback',
  element: <FeedbackPage />,
}
```

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast meets WCAG AA standards
- Screen reader friendly

## Responsive Design

- Mobile-first approach
- Stacked layout on small screens
- Grid layout on larger screens
- Touch-friendly interactive elements

## Future Enhancements

Potential improvements for future iterations:

1. **Response System**: Allow restaurant owners to respond to feedback
2. **Export Functionality**: Export feedback data to CSV/PDF
3. **Advanced Analytics**: Sentiment analysis, trending topics
4. **Notifications**: Alert owners of low ratings
5. **Filtering by Date Range**: View feedback from specific time periods
6. **Dish-Specific View**: Filter feedback by specific dishes
7. **Customer Insights**: View feedback history per customer
8. **Comparison Charts**: Compare ratings over time periods

## Testing

Example test file location: `src/features/restaurant-owner/components/FeedbackList.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { FeedbackList } from './FeedbackList';

describe('FeedbackList', () => {
  it('renders empty state when no feedback', () => {
    render(<FeedbackList feedback={[]} />);
    expect(screen.getByText(/no feedback yet/i)).toBeInTheDocument();
  });

  it('renders feedback cards', () => {
    const feedback = [
      {
        id: '1',
        restaurantId: 'rest-1',
        orderId: 'order-123',
        customerId: 'customer-1',
        rating: 5,
        comment: 'Great!',
        createdAt: new Date().toISOString(),
      },
    ];
    render(<FeedbackList feedback={feedback} />);
    expect(screen.getByText('Great!')).toBeInTheDocument();
  });
});
```

## Related Components

- `DashboardStats`: Shows average rating in overview
- `TopDishesDisplay`: Can be enhanced with rating data
- `MenuEditor`: Can show dish-specific ratings

## API Endpoints

Expected backend endpoints:

```
GET /api/v1/feedback/restaurant/:restaurantId
GET /api/v1/feedback/dish/:dishId
POST /api/v1/feedback (customer submission)
```

## Notes

- Currently uses mock data for demonstration
- Feedback is read-only for restaurant owners
- Customers submit feedback after order delivery
- One feedback per order (as per requirements)
- Dish-specific feedback is optional
