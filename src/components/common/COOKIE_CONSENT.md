# Cookie Consent Management System

## Overview

The Cookie Consent Management system provides GDPR-compliant cookie consent functionality with customizable preferences and persistent storage.

## Features

- ✅ GDPR-compliant cookie consent banner
- ✅ Granular cookie category control (Necessary, Analytics, Marketing, Preferences)
- ✅ Persistent storage using Zustand with localStorage
- ✅ Multi-language support (English/Arabic)
- ✅ Animated banner with Framer Motion
- ✅ Cookie policy page with detailed information
- ✅ Settings component for managing preferences
- ✅ Utility functions for cookie management
- ✅ React hooks for consent checking

## Components

### 1. CookieConsentBanner

The main banner component that appears at the bottom of the screen.

```tsx
import { CookieConsentBanner } from '@/components/common';

// Add to your App.tsx or root layout
<CookieConsentBanner />
```

**Features:**
- Simple view with Accept All / Reject All / Customize buttons
- Detailed settings view with individual category toggles
- Animated entrance/exit
- Responsive design
- RTL support

### 2. CookieSettings

A settings component for managing cookie preferences from a settings page.

```tsx
import { CookieSettings } from '@/components/common';

// Use in settings page
<CookieSettings />
```

**Features:**
- Display all cookie categories
- Toggle individual categories
- Show last consent date
- Save/Reset functionality

### 3. CookiePolicy Page

A comprehensive cookie policy page explaining cookie usage.

```tsx
// Route is automatically added at /cookie-policy
<Route path="/cookie-policy" element={<CookiePolicy />} />
```

## Store

### useCookieConsentStore

Zustand store for managing cookie consent state.

```tsx
import { useCookieConsentStore } from '@/store';

const {
  hasConsented,
  consent,
  consentDate,
  bannerDismissed,
  setConsent,
  acceptAll,
  rejectAll,
  dismissBanner,
  resetConsent,
} = useCookieConsentStore();
```

**State:**
- `hasConsented`: boolean - Whether user has made a consent choice
- `consent`: CookieConsent - Object with consent for each category
- `consentDate`: string | null - ISO date of last consent
- `bannerDismissed`: boolean - Whether banner was dismissed

**Actions:**
- `setConsent(consent)`: Set consent for specific categories
- `acceptAll()`: Accept all cookie categories
- `rejectAll()`: Reject all optional cookies (only necessary)
- `dismissBanner()`: Dismiss banner without saving preferences
- `resetConsent()`: Reset all consent preferences

## Hooks

### useCookieConsent

Main hook for working with cookie consent.

```tsx
import { useCookieConsent } from '@/hooks';

const {
  hasConsented,
  consent,
  canUseAnalytics,
  canUseMarketing,
  canUsePreferences,
  acceptAll,
  rejectAll,
} = useCookieConsent();

// Check if analytics is allowed
if (canUseAnalytics()) {
  // Initialize analytics
}
```

### useConditionalEffect

Hook to conditionally execute code based on cookie consent.

```tsx
import { useConditionalEffect } from '@/hooks';

// Only run effect if analytics cookies are allowed
useConditionalEffect(
  () => {
    // Initialize Google Analytics
    console.log('Analytics initialized');
  },
  'analytics',
  []
);
```

## Utilities

### Cookie Management Functions

```tsx
import {
  setCookie,
  getCookie,
  deleteCookie,
  hasCookie,
  getAllCookies,
  clearAllCookies,
  getCookieCategory,
  clearCookiesByCategory,
  clearNonConsentedCookies,
} from '@/utils/cookies';

// Set a cookie
setCookie('my-cookie', 'value', {
  expires: 30, // days
  secure: true,
  sameSite: 'lax',
});

// Get a cookie
const value = getCookie('my-cookie');

// Delete a cookie
deleteCookie('my-cookie');

// Clear cookies by category
clearCookiesByCategory('analytics');

// Clear non-consented cookies
clearNonConsentedCookies(consent);
```

## Cookie Categories

### 1. Necessary Cookies (Always Active)

Essential cookies required for the website to function.

**Examples:**
- Authentication tokens
- Session identifiers
- CSRF tokens
- Cookie consent preferences

**Cannot be disabled.**

### 2. Analytics Cookies (Optional)

Help understand how visitors interact with the website.

**Examples:**
- Google Analytics (_ga, _gid, _gat)
- PostHog (posthog, ph_*)
- Page view tracking
- User behavior analysis

### 3. Marketing Cookies (Optional)

Used to track visitors across websites for advertising.

**Examples:**
- Facebook Pixel (_fbp)
- Google Ads (_gcl_au)
- Retargeting cookies
- Conversion tracking

### 4. Preference Cookies (Optional)

Remember user choices for a personalized experience.

**Examples:**
- Language preference
- Theme selection
- UI preferences
- Regional settings

## Integration with Analytics

### Conditional Analytics Initialization

```tsx
import { useConditionalEffect } from '@/hooks';
import { initializeAnalytics } from '@/utils/analytics';

function App() {
  // Only initialize analytics if user consented
  useConditionalEffect(
    () => {
      initializeAnalytics();
      return () => {
        // Cleanup if needed
      };
    },
    'analytics',
    []
  );

  return <YourApp />;
}
```

### Check Before Tracking

```tsx
import { useCookieConsent } from '@/hooks';

function MyComponent() {
  const { canUseAnalytics } = useCookieConsent();

  const handleClick = () => {
    if (canUseAnalytics()) {
      // Track event
      trackEvent('button_click');
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

## Translations

Cookie consent translations are available in English and Arabic.

**Translation Keys:**
- `cookies.banner.*` - Banner text
- `cookies.settings.*` - Settings text
- `cookies.categories.*` - Category descriptions
- `cookies.alwaysActive` - Always active label

## Styling

The components use Tailwind CSS and shadcn/ui components for consistent styling.

**Customization:**
- Modify colors in `tailwind.config.js`
- Adjust animations in component files
- Update banner position/size as needed

## Best Practices

1. **Always show the banner on first visit**
   - Banner automatically appears if user hasn't consented

2. **Respect user choices**
   - Don't load analytics/marketing scripts if not consented
   - Use `useConditionalEffect` or check consent before tracking

3. **Provide easy access to settings**
   - Link to cookie policy in footer
   - Add cookie settings to user settings page

4. **Clear non-consented cookies**
   - Automatically clear cookies when user changes preferences
   - Use `clearNonConsentedCookies()` utility

5. **Update cookie policy**
   - Keep cookie policy page up to date
   - Document all cookies used
   - Explain purpose of each category

## GDPR Compliance

This implementation follows GDPR requirements:

- ✅ Clear information about cookie usage
- ✅ Granular consent options
- ✅ Easy to withdraw consent
- ✅ No pre-checked boxes (except necessary)
- ✅ Persistent storage of preferences
- ✅ Access to detailed cookie policy
- ✅ Ability to change preferences anytime

## Testing

Test the cookie consent system:

1. **First Visit**
   - Banner should appear
   - No consent stored

2. **Accept All**
   - All categories enabled
   - Banner dismissed
   - Consent stored in localStorage

3. **Reject All**
   - Only necessary cookies enabled
   - Banner dismissed
   - Consent stored

4. **Customize**
   - Settings view appears
   - Individual toggles work
   - Preferences saved correctly

5. **Persistence**
   - Refresh page
   - Banner should not appear
   - Preferences maintained

6. **Settings Page**
   - Can change preferences
   - Changes saved
   - Last update date shown

## Troubleshooting

### Banner not appearing
- Check if consent already stored in localStorage
- Clear localStorage key: `cookie-consent-storage`
- Verify component is rendered in App.tsx

### Preferences not persisting
- Check browser localStorage is enabled
- Verify Zustand persist middleware is working
- Check for console errors

### Analytics not working
- Verify consent is granted for analytics
- Check `canUseAnalytics()` returns true
- Ensure analytics initialization is conditional

## Future Enhancements

Potential improvements:

- [ ] Cookie scanner to auto-detect cookies
- [ ] Integration with cookie consent platforms
- [ ] A/B testing for consent rates
- [ ] More granular cookie categories
- [ ] Cookie consent API for backend
- [ ] Consent management dashboard
- [ ] Export consent history
- [ ] Multi-domain consent sync

## Resources

- [GDPR Cookie Consent](https://gdpr.eu/cookies/)
- [Cookie Consent Best Practices](https://www.cookiebot.com/en/gdpr-cookies/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Framer Motion](https://www.framer.com/motion/)
