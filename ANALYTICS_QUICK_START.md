# Analytics Tracking - Quick Start Guide

This guide will help you get started with analytics tracking in the SmartDine SaaS platform.

## 🚀 Quick Setup (5 minutes)

### Step 1: Choose Your Analytics Provider

You can use either **Google Analytics 4** or **PostHog** (or both):

#### Option A: Google Analytics 4 (Recommended for most)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

#### Option B: PostHog (Recommended for product analytics)

1. Go to [PostHog](https://app.posthog.com/)
2. Create a new project
3. Copy your API key (format: `phc_xxxxxxxxxxxxx`)

### Step 2: Configure Environment Variables

Add to your `.env.development` or `.env.production`:

```env
# Enable analytics
VITE_FEATURE_ANALYTICS=true

# Google Analytics (Option A)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# PostHog (Option B)
VITE_POSTHOG_API_KEY=phc_xxxxxxxxxxxxx
VITE_POSTHOG_API_HOST=https://app.posthog.com

# Debug mode (development only)
VITE_DEBUG_MODE=true
```

### Step 3: Initialize Analytics in Your App

Analytics is automatically initialized when you use the `useAnalytics` hook:

```tsx
// src/App.tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function App() {
  useAnalytics(); // This initializes analytics and tracks page views
  
  return (
    <Router>
      <Routes>
        {/* Your routes */}
      </Routes>
    </Router>
  );
}
```

### Step 4: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser console (F12)

3. Navigate through your app - you should see analytics logs like:
   ```
   [Analytics] Google Analytics initialized: G-XXXXXXXXXX
   [Analytics] Page view tracked: { path: '/', title: 'Home' }
   ```

4. Check your analytics dashboard:
   - **Google Analytics**: Wait 24-48 hours for data to appear
   - **PostHog**: Data appears in real-time

## 📊 Common Use Cases

### 1. Track Button Clicks

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function MyButton() {
  const { trackEvent } = useAnalytics();
  
  const handleClick = () => {
    trackEvent({
      category: 'button',
      action: 'click',
      label: 'signup_button',
    });
  };
  
  return <button onClick={handleClick}>Sign Up</button>;
}
```

### 2. Track Order Completion

```tsx
import { orderFunnel } from '@/utils/analytics/funnels';

function OrderSuccess({ orderId, total, itemCount }) {
  useEffect(() => {
    orderFunnel.orderComplete(orderId, total, itemCount);
  }, []);
  
  return <div>Order Complete!</div>;
}
```

### 3. Track Feature Usage

```tsx
import { aiAssistantFeature } from '@/utils/analytics/features';

function AIAssistant() {
  useEffect(() => {
    aiAssistantFeature.viewed();
  }, []);
  
  const handleSendMessage = () => {
    aiAssistantFeature.used(messageCount);
  };
  
  return <ChatWidget onSend={handleSendMessage} />;
}
```

### 4. Track User Properties

```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function Dashboard() {
  const { setUserProperties } = useAnalytics();
  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    if (user) {
      setUserProperties({
        userId: user.id,
        userRole: user.role,
        subscriptionPlan: user.plan,
      });
    }
  }, [user]);
  
  return <div>Dashboard</div>;
}
```

## 🎯 Key Funnels to Track

### Order Placement Funnel

```tsx
import { orderFunnel } from '@/utils/analytics/funnels';

// 1. User scans QR code
orderFunnel.qrScan('table-123');

// 2. User views menu
orderFunnel.menuView('restaurant-456');

// 3. User views dish details
orderFunnel.dishView('dish-789', 'Margherita Pizza');

// 4. User adds to cart
orderFunnel.addToCart('dish-789', 1, 12.99);

// 5. User views cart
orderFunnel.cartView(3, 45.99);

// 6. User confirms order
orderFunnel.orderConfirm('order-123', 45.99);

// 7. Order complete
orderFunnel.orderComplete('order-123', 45.99, 3);
```

### Restaurant Signup Funnel

```tsx
import { signupFunnel } from '@/utils/analytics/funnels';

// 1. User views landing page
signupFunnel.landingView();

// 2. User views pricing
signupFunnel.pricingView();

// 3. User starts signup
signupFunnel.signupStart('pro');

// 4. Signup complete
signupFunnel.signupComplete('user-123', 'pro');

// 5. Onboarding starts
signupFunnel.onboardingStart('user-123');

// 6. Onboarding complete
signupFunnel.onboardingComplete('user-123', 'restaurant-456');
```

## 🔍 Debugging

### Enable Debug Mode

```env
VITE_DEBUG_MODE=true
```

This will log all analytics events to the console:

```
[Analytics] Manager initialized with provider: google-analytics
[Analytics] Page view tracked: { path: '/menu', title: 'Menu' }
[Analytics] Event tracked: { category: 'button', action: 'click' }
```

### Common Issues

**Analytics not tracking:**
- Check that `VITE_FEATURE_ANALYTICS=true`
- Verify your measurement ID or API key is correct
- Disable ad blockers during testing

**Events not appearing in dashboard:**
- Google Analytics: Wait 24-48 hours for data processing
- PostHog: Data should appear immediately
- Check browser console for errors

## 📈 What to Track

### Essential Events

1. **Page Views** (automatic)
2. **User Signups** (conversion)
3. **Order Completions** (conversion)
4. **Feature Usage** (adoption)
5. **Errors** (debugging)

### Nice to Have

1. Button clicks
2. Form submissions
3. Search queries
4. Filter usage
5. Time on page
6. Scroll depth

### Avoid Tracking

1. Personal information (PII)
2. Passwords or sensitive data
3. Payment details
4. Private messages

## 🎓 Next Steps

1. **Read the full documentation**: `src/utils/analytics/README.md`
2. **Explore examples**: Check existing pages for implementation patterns
3. **Set up dashboards**: Create custom dashboards in your analytics platform
4. **Monitor metrics**: Track key performance indicators (KPIs)
5. **Iterate**: Use insights to improve your product

## 📚 Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/9304153)
- [PostHog Documentation](https://posthog.com/docs)
- [Analytics Best Practices](https://developers.google.com/analytics/devguides/collection/ga4/best-practices)

## 🆘 Need Help?

- Check the full README: `src/utils/analytics/README.md`
- Review type definitions: `src/utils/analytics/types.ts`
- Look at examples in existing pages
- Enable debug mode to see what's being tracked

---

**Happy Tracking! 📊**
