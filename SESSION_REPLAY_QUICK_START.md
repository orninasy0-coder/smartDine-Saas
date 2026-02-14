# Session Replay Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Choose Your Provider

**Hotjar** (Recommended for beginners)
- Easy setup
- Great heatmaps
- Free tier available
- Sign up at [hotjar.com](https://www.hotjar.com)

**FullStory** (Advanced features)
- Powerful search
- Session URLs
- Advanced analytics
- Sign up at [fullstory.com](https://www.fullstory.com)

### Step 2: Add Environment Variables

Create or update `.env.local`:

```env
# For Hotjar
VITE_HOTJAR_SITE_ID=1234567

# For FullStory
VITE_FULLSTORY_ORG_ID=o-XXXXX-na1
```

### Step 3: Initialize in Your App

```typescript
// src/main.tsx or src/App.tsx
import { initializeAnalytics, interactionTracker, errorTracker } from '@/utils/analytics';

// Initialize analytics with session replay
initializeAnalytics({
  sessionReplay: {
    enabled: true,
    provider: 'hotjar', // or 'fullstory'
    hotjar: {
      siteId: parseInt(import.meta.env.VITE_HOTJAR_SITE_ID || '0'),
      version: 6,
    },
    maskAllInputs: true, // Protect sensitive data
  },
});

// Enable interaction tracking
interactionTracker.initialize();

// Enable error tracking
errorTracker.initialize();
```

### Step 4: Wrap Your App with Error Boundary

```typescript
// src/App.tsx
import { ErrorBoundaryWithReplay } from '@/components/common/ErrorBoundaryWithReplay';

function App() {
  return (
    <ErrorBoundaryWithReplay showSessionUrl={true}>
      <YourApp />
    </ErrorBoundaryWithReplay>
  );
}
```

### Step 5: Identify Users (Optional)

```typescript
// After user logs in
import { analytics } from '@/utils/analytics';

analytics.setUserProperties({
  userId: user.id,
  email: user.email,
  name: user.name,
  plan: user.subscription.plan,
});
```

## ✅ That's It!

You're now recording sessions! Visit your provider's dashboard to view recordings.

## 🎯 Common Use Cases

### Track Important Actions

```typescript
import { sessionReplay } from '@/utils/analytics';

// When user completes checkout
sessionReplay.trackInteraction('checkout_completed', {
  orderValue: 99.99,
  itemCount: 3,
});

// Tag the session
sessionReplay.tagRecording(['conversion', 'high-value']);
```

### Track Errors Manually

```typescript
import { errorTracker } from '@/utils/analytics';

try {
  await processPayment();
} catch (error) {
  errorTracker.captureErrorWithAction(
    error as Error,
    'payment_processing',
    { amount: 99.99 }
  );
}
```

### Get Session URL (FullStory only)

```typescript
import { sessionReplay } from '@/utils/analytics';

const sessionUrl = sessionReplay.getSessionURL();
// Include in support tickets or error reports
```

## 🔍 What Gets Tracked Automatically?

✅ All clicks and interactions  
✅ Form submissions  
✅ Scroll depth  
✅ Page navigation  
✅ JavaScript errors  
✅ Network errors  
✅ Rage clicks (user frustration)  
✅ Dead clicks (UX issues)  

## 🔒 Privacy & Security

**Automatic Data Masking:**
- All password fields masked
- Credit card inputs masked
- Configurable input masking

**User Consent:**
```typescript
// Respect cookie consent
if (userConsent.analytics) {
  sessionReplay.startRecording();
} else {
  sessionReplay.stopRecording();
}
```

## 📊 View Your Recordings

**Hotjar:**
1. Go to [hotjar.com](https://www.hotjar.com)
2. Navigate to Recordings
3. Filter by tags, errors, or user properties

**FullStory:**
1. Go to [fullstory.com](https://www.fullstory.com)
2. Navigate to Sessions
3. Use powerful search to find specific sessions

## 🐛 Debugging

Check if session replay is active:

```typescript
import { sessionReplay } from '@/utils/analytics';

console.log('Active:', sessionReplay.isActive());
console.log('Provider:', sessionReplay.getProvider());
```

Enable debug mode:

```typescript
initializeAnalytics({
  debug: true,
  sessionReplay: { enabled: true, provider: 'hotjar' },
});
```

## 📚 Learn More

- [Full Implementation Guide](./SESSION_REPLAY_IMPLEMENTATION.md)
- [Analytics Documentation](./ANALYTICS_IMPLEMENTATION_SUMMARY.md)
- [Privacy Best Practices](./COOKIE_CONSENT_IMPLEMENTATION.md)

## 🆘 Need Help?

Common issues:

1. **Not recording?** Check environment variables
2. **Missing interactions?** Ensure `interactionTracker.initialize()` is called
3. **No errors captured?** Ensure `errorTracker.initialize()` is called
4. **Privacy concerns?** Enable `maskAllInputs: true`

## 🎉 Next Steps

1. ✅ Set up session replay
2. ✅ Test in development
3. ✅ Deploy to staging
4. ✅ Review first recordings
5. ✅ Enable in production
6. ✅ Set up alerts for errors
7. ✅ Use insights to improve UX
