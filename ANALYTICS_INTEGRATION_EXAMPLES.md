# Analytics Integration Examples

Practical examples of how to integrate analytics tracking into your SmartDine pages.

## 🎯 Landing Page Integration

```tsx
// src/pages/Landing.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { signupFunnel } from '@/utils/analytics/funnels';
import { interactionBehavior } from '@/utils/analytics/behavior';

export function Landing() {
  const { trackEvent } = useAnalytics();

  // Track page view (automatic with useAnalytics)
  useAnalytics();

  // Track funnel stage
  useEffect(() => {
    signupFunnel.landingView();
  }, []);

  // Track CTA clicks
  const handleGetStartedClick = () => {
    trackEvent({
      category: 'cta',
      action: 'click',
      label: 'get_started_hero',
    });
    
    interactionBehavior.buttonClick('get_started', 'hero_section');
    signupFunnel.signupStart();
    
    navigate('/register');
  };

  const handleViewPricingClick = () => {
    trackEvent({
      category: 'cta',
      action: 'click',
      label: 'view_pricing',
    });
    
    signupFunnel.pricingView();
    navigate('/pricing');
  };

  return (
    <div>
      <button onClick={handleGetStartedClick}>Get Started</button>
      <button onClick={handleViewPricingClick}>View Pricing</button>
    </div>
  );
}
```

## 🍕 Menu Browse Page Integration

```tsx
// src/pages/MenuBrowse.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { orderFunnel } from '@/utils/analytics/funnels';
import { searchFeature } from '@/utils/analytics/features';
import { interactionBehavior } from '@/utils/analytics/behavior';

export function MenuBrowse() {
  const { trackEvent } = useAnalytics();
  const { restaurantId } = useParams();

  // Track menu view
  useEffect(() => {
    if (restaurantId) {
      orderFunnel.menuView(restaurantId);
    }
  }, [restaurantId]);

  // Track search
  const handleSearch = (query: string, results: Dish[]) => {
    searchFeature.used(query, results.length);
    
    trackEvent({
      category: 'search',
      action: 'query',
      label: query,
      value: results.length,
    });
  };

  // Track dish view
  const handleDishClick = (dish: Dish) => {
    orderFunnel.dishView(dish.id, dish.name);
    
    interactionBehavior.buttonClick('view_dish', 'menu_grid');
    
    navigate(`/dish/${dish.id}`);
  };

  // Track filter usage
  const handleFilterChange = (filterType: string, value: string) => {
    trackEvent({
      category: 'filter',
      action: 'apply',
      label: filterType,
      metadata: { value },
    });
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <FilterBar onChange={handleFilterChange} />
      <DishGrid onDishClick={handleDishClick} />
    </div>
  );
}
```

## 🛒 Cart Page Integration

```tsx
// src/pages/Cart.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { orderFunnel } from '@/utils/analytics/funnels';
import { interactionBehavior } from '@/utils/analytics/behavior';

export function Cart() {
  const { trackEvent } = useAnalytics();
  const cart = useCartStore((state) => state.cart);

  // Track cart view
  useEffect(() => {
    const itemCount = cart.items.length;
    const totalValue = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    orderFunnel.cartView(itemCount, totalValue);
  }, [cart]);

  // Track item removal
  const handleRemoveItem = (dishId: string) => {
    trackEvent({
      category: 'cart',
      action: 'remove_item',
      label: dishId,
    });
    
    interactionBehavior.buttonClick('remove_item', 'cart');
  };

  // Track quantity change
  const handleQuantityChange = (dishId: string, newQuantity: number) => {
    trackEvent({
      category: 'cart',
      action: 'update_quantity',
      label: dishId,
      value: newQuantity,
    });
  };

  // Track checkout
  const handleCheckout = () => {
    const totalValue = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    orderFunnel.orderConfirm(cart.id, totalValue);
    
    trackEvent({
      category: 'cart',
      action: 'checkout',
      value: totalValue,
    });
    
    navigate('/checkout');
  };

  return (
    <div>
      <CartItems 
        items={cart.items}
        onRemove={handleRemoveItem}
        onQuantityChange={handleQuantityChange}
      />
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
```

## ✅ Order Confirmation Integration

```tsx
// src/pages/OrderConfirmation.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { orderFunnel } from '@/utils/analytics/funnels';

export function OrderConfirmation() {
  const { trackConversion } = useAnalytics();
  const { orderId } = useParams();
  const { data: order } = useQuery(['order', orderId], () => fetchOrder(orderId));

  // Track order completion
  useEffect(() => {
    if (order) {
      // Track in funnel
      orderFunnel.orderComplete(order.id, order.total, order.items.length);
      
      // Track as conversion
      trackConversion({
        eventName: 'purchase',
        value: order.total,
        currency: 'USD',
        transactionId: order.id,
        items: order.items.map(item => ({
          id: item.dishId,
          name: item.dishName,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    }
  }, [order]);

  return <div>Order Confirmed!</div>;
}
```

## 🤖 AI Assistant Integration

```tsx
// src/features/ai/components/ChatWidget.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { aiAssistantFeature, aiFunnel } from '@/utils/analytics/features';
import { trackFirstTimeFeatureUse } from '@/utils/analytics/features';

export function ChatWidget() {
  const { trackEvent } = useAnalytics();
  const [messageCount, setMessageCount] = useState(0);

  // Track widget view
  useEffect(() => {
    aiAssistantFeature.viewed();
    aiFunnel.widgetView();
    trackFirstTimeFeatureUse('ai_assistant');
  }, []);

  // Track chat start
  const handleChatStart = () => {
    aiFunnel.chatStart();
    aiAssistantFeature.used(1);
  };

  // Track message send
  const handleSendMessage = (message: string) => {
    setMessageCount(prev => prev + 1);
    
    trackEvent({
      category: 'ai_assistant',
      action: 'send_message',
      value: messageCount + 1,
    });
  };

  // Track recommendation
  const handleRecommendation = (dishes: Dish[]) => {
    aiFunnel.recommendationView(dishes.map(d => d.id));
    
    trackEvent({
      category: 'ai_assistant',
      action: 'recommendation_received',
      value: dishes.length,
    });
  };

  // Track recommendation acceptance
  const handleAcceptRecommendation = (dish: Dish) => {
    aiFunnel.recommendationAccept(dish.id);
    aiAssistantFeature.completed(true, false);
  };

  // Track add to cart from AI
  const handleAddToCart = (dish: Dish) => {
    aiFunnel.addToCart(dish.id, true);
    aiAssistantFeature.completed(true, true);
  };

  return <ChatInterface />;
}
```

## 🥽 AR Viewer Integration

```tsx
// src/features/ar/components/ARViewer.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { arViewerFeature, arFunnel } from '@/utils/analytics/features';
import { performanceBehavior } from '@/utils/analytics/behavior';

export function ARViewer({ dishId }: { dishId: string }) {
  const { trackEvent } = useAnalytics();
  const [interactionCount, setInteractionCount] = useState(0);
  const [startTime] = useState(Date.now());

  // Track AR button view
  useEffect(() => {
    arFunnel.buttonView(dishId);
  }, [dishId]);

  // Track AR open
  const handleAROpen = () => {
    arViewerFeature.viewed(dishId);
    arFunnel.arOpen(dishId);
    trackFirstTimeFeatureUse('ar_viewer');
  };

  // Track model load
  const handleModelLoad = () => {
    const loadTime = Date.now() - startTime;
    
    arFunnel.modelLoad(dishId, loadTime);
    performanceBehavior.modelLoadTime(dishId, loadTime);
    
    trackEvent({
      category: 'ar_viewer',
      action: 'model_loaded',
      value: loadTime,
    });
  };

  // Track interactions
  const handleInteraction = (type: string) => {
    setInteractionCount(prev => prev + 1);
    arFunnel.interaction(dishId, type);
  };

  // Track AR close
  const handleARClose = () => {
    const duration = Date.now() - startTime;
    arViewerFeature.used(dishId, interactionCount, duration);
  };

  // Track add to cart from AR
  const handleAddToCart = () => {
    arFunnel.addToCart(dishId);
    arViewerFeature.completed(dishId, true);
  };

  return <ARCanvas />;
}
```

## 👤 User Authentication Integration

```tsx
// src/pages/Register.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { signupFunnel } from '@/utils/analytics/funnels';
import { interactionBehavior } from '@/utils/analytics/behavior';

export function Register() {
  const { setUserProperties, trackEvent } = useAnalytics();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  // Track signup start
  useEffect(() => {
    signupFunnel.signupStart(selectedPlan);
  }, [selectedPlan]);

  // Track form interactions
  const handleFieldFocus = (fieldName: string) => {
    interactionBehavior.formFieldFocus(fieldName, 'signup_form');
  };

  // Track signup completion
  const handleSignupSuccess = (user: User) => {
    // Set user properties
    setUserProperties({
      userId: user.id,
      userRole: user.role,
      subscriptionPlan: user.plan,
    });

    // Track funnel completion
    signupFunnel.signupComplete(user.id, user.plan);

    // Track as conversion
    trackEvent({
      category: 'auth',
      action: 'signup_complete',
      label: user.plan,
    });

    navigate('/onboarding');
  };

  return <SignupForm />;
}
```

## 📊 Dashboard Integration

```tsx
// src/pages/RestaurantDashboard.tsx
import { useAnalytics } from '@/hooks/useAnalytics';
import { analyticsDashboardFeature } from '@/utils/analytics/features';
import { engagementBehavior } from '@/utils/analytics/behavior';

export function RestaurantDashboard() {
  const { setUserProperties } = useAnalytics();
  const user = useAuthStore((state) => state.user);
  const [period, setPeriod] = useState('week');

  // Set user properties
  useEffect(() => {
    if (user) {
      setUserProperties({
        userId: user.id,
        userRole: 'restaurant_owner',
        restaurantId: user.restaurantId,
        subscriptionPlan: user.plan,
      });
    }
  }, [user]);

  // Track dashboard view
  useEffect(() => {
    if (user?.restaurantId) {
      analyticsDashboardFeature.viewed(user.restaurantId);
    }
  }, [user]);

  // Track period change
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    
    if (user?.restaurantId) {
      analyticsDashboardFeature.used(user.restaurantId, newPeriod);
    }
  };

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      engagementBehavior.timeOnPage('/dashboard', duration);
    };
  }, []);

  return <Dashboard />;
}
```

## 🔍 Error Tracking Integration

```tsx
// src/components/common/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { errorBehavior } from '@/utils/analytics/behavior';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    errorBehavior.jsError(error.message, errorInfo.componentStack);
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 🌐 API Error Tracking

```tsx
// src/services/api/client.ts
import { errorBehavior } from '@/utils/analytics/behavior';

export async function apiRequest(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      // Track API error
      errorBehavior.apiError(
        endpoint,
        response.status,
        response.statusText
      );
    }
    
    return response;
  } catch (error) {
    // Track network error
    errorBehavior.apiError(
      endpoint,
      0,
      error instanceof Error ? error.message : 'Network error'
    );
    
    throw error;
  }
}
```

## 📱 Session Tracking

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { SessionTracker } from '@/utils/analytics/behavior';
import { useAnalytics } from '@/hooks/useAnalytics';

let sessionTracker: SessionTracker;

export function App() {
  const { reset } = useAnalytics();
  const user = useAuthStore((state) => state.user);

  // Initialize session tracking
  useEffect(() => {
    sessionTracker = new SessionTracker();
    
    return () => {
      sessionTracker.endSession();
    };
  }, []);

  // Track page views in session
  const location = useLocation();
  useEffect(() => {
    sessionTracker.trackPageView();
  }, [location.pathname]);

  // Reset analytics on logout
  const handleLogout = () => {
    reset();
    sessionTracker.endSession();
    // ... logout logic
  };

  return <YourApp />;
}
```

---

## 🎯 Best Practices

1. **Track Early**: Initialize analytics as early as possible in your app
2. **Be Consistent**: Use the same naming conventions across your app
3. **Add Context**: Include relevant metadata with events
4. **Track Errors**: Always track errors for debugging
5. **Respect Privacy**: Don't track sensitive information
6. **Test Thoroughly**: Verify analytics in development before deploying
7. **Monitor Performance**: Ensure analytics doesn't slow down your app

## 📚 Additional Resources

- Full Documentation: `src/utils/analytics/README.md`
- Quick Start Guide: `ANALYTICS_QUICK_START.md`
- Implementation Summary: `ANALYTICS_IMPLEMENTATION_SUMMARY.md`
