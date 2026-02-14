# Analytics Tracking System

Comprehensive analytics tracking system for SmartDine SaaS platform with support for Google Analytics 4 and PostHog.

## Features

- ✅ **Multiple Providers**: Google Analytics 4 and PostHog support
- ✅ **Conversion Funnel Tracking**: Track user journeys through key funnels
- ✅ **Feature Adoption**: Monitor feature usage and adoption rates
- ✅ **User Behavior**: Track interactions, engagement, and performance
- ✅ **Type-Safe**: Full TypeScript support with type definitions
- ✅ **Privacy-Focused**: Respects user privacy and GDPR compliance
- ✅ **Debug Mode**: Development-friendly debugging

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

```env
# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# PostHog (optional)
VITE_POSTHOG_API_KEY=phc_xxxxxxxxxxxxx
VITE_POSTHOG_API_HOST=https://app.posthog.com

# Enable/disable analytics
VITE_FEATURE_ANALYTICS=true
```

### 2. Initialize Analytics

Analytics is automatically initialized when you use the `useAnalytics` hook:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function App() {
  const analytics = useAnalytics();
  
  // Analytics is now initialized and tracking page views
  return <YourApp />;
}
```

## Usage

### Page View Tracking

Page views are automatically tracked on route changes when using `useAnalytics`:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function MyPage() {
  useAnalytics(); // Automatically tracks page views
  
  return <div>My Page</div>;
}
```

### Custom Event Tracking

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackEvent } = useAnalytics();
  
  const handleClick = () => {
    trackEvent({
      category: 'button',
      action: 'click',
      label: 'signup_button',
      value: 1,
      metadata: {
        location: 'header',
      },
    });
  };
  
  return <button onClick={handleClick}>Sign Up</button>;
}
```

### Conversion Funnel Tracking

Track user progress through conversion funnels:

```tsx
import { orderFunnel, signupFunnel } from '@/utils/analytics/funnels';

// Order placement funnel
orderFunnel.qrScan('table-123');
orderFunnel.menuView('restaurant-456');
orderFunnel.dishView('dish-789', 'Margherita Pizza');
orderFunnel.addToCart('dish-789', 1, 12.99);
orderFunnel.cartView(3, 45.99);
orderFunnel.orderConfirm('order-123', 45.99);
orderFunnel.orderComplete('order-123', 45.99, 3);

// Signup funnel
signupFunnel.landingView();
signupFunnel.pricingView();
signupFunnel.signupStart('pro');
signupFunnel.signupComplete('user-123', 'pro');
```

### Feature Adoption Tracking

Track feature usage and adoption:

```tsx
import { 
  aiAssistantFeature, 
  arViewerFeature,
  trackFirstTimeFeatureUse 
} from '@/utils/analytics/features';

// AI Assistant
aiAssistantFeature.viewed();
aiAssistantFeature.used(5); // 5 messages sent
aiAssistantFeature.completed(true, true); // recommendation accepted, added to cart

// AR Viewer
arViewerFeature.viewed('dish-123');
arViewerFeature.used('dish-123', 10, 30000); // 10 interactions, 30 seconds
arViewerFeature.completed('dish-123', true); // added to cart

// Track first-time feature use
trackFirstTimeFeatureUse('ai_assistant', 'user-123');
```

### User Behavior Tracking

Track user interactions and behavior:

```tsx
import { 
  navigationBehavior,
  interactionBehavior,
  engagementBehavior,
  performanceBehavior,
  errorBehavior,
} from '@/utils/analytics/behavior';

// Navigation
navigationBehavior.linkClick('View Menu', '/menu');
navigationBehavior.backButton('/dish/123', '/menu');

// Interactions
interactionBehavior.buttonClick('add_to_cart', 'dish_detail');
interactionBehavior.formSubmit('contact_form', true, 2500);
interactionBehavior.modalOpen('cart_modal');

// Engagement
engagementBehavior.sessionStart('user-123');
engagementBehavior.timeOnPage('/menu', 45000);
engagementBehavior.shareContent('menu', 'facebook');

// Performance
performanceBehavior.pageLoadTime('/menu', 1200);
performanceBehavior.apiResponseTime('/api/dishes', 350, true);

// Errors
errorBehavior.apiError('/api/orders', 500, 'Internal Server Error');
errorBehavior.formValidationError('signup_form', 'email', 'invalid_format');
```

### User Properties

Set user properties for segmentation:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { setUserProperties } = useAnalytics();
  
  useEffect(() => {
    setUserProperties({
      userId: 'user-123',
      userRole: 'restaurant_owner',
      restaurantId: 'restaurant-456',
      subscriptionPlan: 'pro',
    });
  }, []);
}
```

### Conversion Tracking

Track conversions and purchases:

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function CheckoutSuccess() {
  const { trackConversion } = useAnalytics();
  
  useEffect(() => {
    trackConversion({
      eventName: 'purchase',
      value: 45.99,
      currency: 'USD',
      transactionId: 'order-123',
      items: [
        {
          id: 'dish-789',
          name: 'Margherita Pizza',
          category: 'pizza',
          quantity: 1,
          price: 12.99,
        },
      ],
    });
  }, []);
}
```

## Session Tracking

Track user sessions automatically:

```tsx
import { SessionTracker } from '@/utils/analytics/behavior';

// Initialize session tracker
const sessionTracker = new SessionTracker();

// Track page views
sessionTracker.trackPageView();

// Update activity on user interaction
sessionTracker.updateActivity();

// End session (e.g., on logout or page unload)
sessionTracker.endSession();
```

## Scroll Depth Tracking

Track how far users scroll on pages:

```tsx
import { ScrollDepthTracker } from '@/utils/analytics/behavior';

// Initialize scroll tracker
const scrollTracker = new ScrollDepthTracker();

// Get max scroll depth
const maxDepth = scrollTracker.getMaxScrollDepth();
```

## Available Funnels

### Order Placement Funnel
- QR Scan
- Menu View
- Dish View
- Add to Cart
- Cart View
- Order Confirm
- Order Complete

### Restaurant Signup Funnel
- Landing View
- Pricing View
- Signup Start
- Signup Complete
- Onboarding Start
- Onboarding Complete

### AI Assistant Funnel
- Widget View
- Chat Start
- Recommendation View
- Recommendation Accept
- Add to Cart

### AR Viewer Funnel
- AR Button View
- AR Open
- Model Load
- Interaction
- Add to Cart

## Available Features

### Core Features
- QR Menu
- AI Assistant
- AR Viewer
- Cart
- Order Tracking

### Restaurant Owner Features
- Menu Management
- Analytics Dashboard
- Staff Management
- QR Generator
- Feedback View

### Kitchen Features
- Kitchen Dashboard
- Order Status Update

### Delivery Features
- Delivery Dashboard
- Route Optimizer

### Admin Features
- Platform Analytics
- Restaurant Management
- Subscription Management

### Advanced Features
- Multi-language
- Dark Mode
- Notifications
- Search
- Filters

## Privacy & GDPR Compliance

The analytics system is designed with privacy in mind:

- **Opt-out Support**: Users can disable analytics via feature flags
- **No PII by Default**: Personal information is not tracked unless explicitly set
- **User Consent**: Implement cookie consent before initializing analytics
- **Data Minimization**: Only essential data is tracked
- **Reset on Logout**: User identity is reset when logging out

## Debug Mode

Enable debug mode in development:

```env
VITE_DEBUG_MODE=true
```

This will log all analytics events to the console for debugging.

## Best Practices

1. **Track Meaningful Events**: Only track events that provide actionable insights
2. **Use Consistent Naming**: Follow the established naming conventions
3. **Add Context**: Include relevant metadata with events
4. **Respect Privacy**: Don't track sensitive user information
5. **Test Thoroughly**: Verify analytics in development before deploying
6. **Monitor Performance**: Ensure analytics doesn't impact user experience
7. **Document Custom Events**: Keep track of custom events you add

## Troubleshooting

### Analytics Not Tracking

1. Check that `VITE_FEATURE_ANALYTICS=true` in your `.env` file
2. Verify your measurement ID or API key is correct
3. Check browser console for errors
4. Ensure ad blockers are disabled during testing

### Events Not Appearing

1. Wait a few minutes for data to process
2. Check that the provider is properly initialized
3. Verify the event format matches the expected structure
4. Enable debug mode to see console logs

## Examples

See the following files for implementation examples:

- `src/pages/Landing.tsx` - Page view tracking
- `src/pages/MenuBrowse.tsx` - Funnel tracking
- `src/features/ai/components/ChatWidget.tsx` - Feature adoption
- `src/components/common/Button.tsx` - Interaction tracking

## API Reference

See the TypeScript definitions in:
- `src/utils/analytics/types.ts` - Type definitions
- `src/utils/analytics/index.ts` - Main API
- `src/hooks/useAnalytics.ts` - React hook API
