# PWA Implementation Guide

This document describes the Progressive Web App (PWA) implementation for the SmartDine SaaS Platform.

## Overview

The SmartDine platform is now a fully functional Progressive Web App, providing:

- **Installability**: Users can install the app on their devices
- **Offline Support**: Basic offline functionality with service worker caching
- **App-like Experience**: Standalone display mode without browser UI
- **Fast Loading**: Cached assets for improved performance
- **Cross-platform**: Works on desktop, mobile, and tablet devices

## Features Implemented

### 1. Web App Manifest (`public/manifest.json`)

The manifest defines how the app appears when installed:

- **App Identity**: Name, short name, description
- **Visual Appearance**: Icons, theme color, background color
- **Display Mode**: Standalone (full-screen app experience)
- **Icons**: Multiple sizes (72x72 to 512x512) for various devices
- **Shortcuts**: Quick access to Menu and Dashboard
- **Screenshots**: For enhanced install prompt (to be added)

### 2. Enhanced Service Worker (`public/sw.js`)

Provides comprehensive offline functionality and intelligent caching:

#### Caching Strategies

- **Multiple Cache Layers**:
  - `smartdine-v1`: Precached essential assets
  - `smartdine-runtime-v1`: Runtime cached pages (max 50 items)
  - `smartdine-images-v1`: Image cache with 7-day expiration (max 60 items)
  - `smartdine-api-v1`: API responses with 5-minute expiration (max 30 items)

- **Smart Caching by Resource Type**:
  - **Navigation (HTML)**: Network first with cache fallback
  - **Images**: Cache first with expiration and network update
  - **Static Assets (CSS, JS, Fonts)**: Cache first for fast loading
  - **API Requests**: Network first with short-lived cache fallback

#### Advanced Features

- **Cache Expiration**: Automatic expiration based on resource type
- **Cache Size Limits**: Prevents unlimited cache growth
- **Timestamp Tracking**: Tracks when resources were cached
- **Offline Fallbacks**: Custom offline page and placeholder images
- **Background Sync**: Sync data when connection is restored (if supported)
- **Periodic Sync**: Update cache periodically in background (if supported)
- **Cache Management**: Clear cache and get statistics via messages

#### Offline Experience

- **Graceful Degradation**: App works offline with cached content
- **Offline Page**: Beautiful offline page when no cache available
- **Stale-While-Revalidate**: Serve cached content while fetching updates
- **API Fallback**: Return cached API data when offline
- **Image Placeholders**: SVG placeholders for unavailable images

### 3. PWA Utilities (`src/utils/pwa.ts`)

Core PWA functionality with enhanced offline support:

- `registerServiceWorker()`: Register and manage service worker
- `setupInstallPrompt()`: Listen for install prompt events
- `showInstallPrompt()`: Trigger install prompt
- `isAppInstalled()`: Check if app is installed
- `getPWADisplayMode()`: Get current display mode
- `isPWASupported()`: Check browser support
- `clearAllCaches()`: Clear all cached data
- `getCacheStats()`: Get cache statistics (size per cache type)
- `clearCacheViaServiceWorker()`: Clear cache via service worker message
- `registerBackgroundSync()`: Register background sync for offline actions
- `registerPeriodicSync()`: Register periodic background sync
- `isBackgroundSyncSupported()`: Check background sync support
- `isPeriodicSyncSupported()`: Check periodic sync support

### 4. React Hook (`src/hooks/usePWA.ts`)

React integration for PWA features with offline capabilities:

```typescript
const {
  isInstalled,           // Is app installed?
  isInstallable,         // Can app be installed?
  isSupported,           // Does browser support PWA?
  displayMode,           // Current display mode
  isOnline,              // Online/offline status
  cacheStats,            // Cache statistics object
  backgroundSyncSupported, // Is background sync supported?
  promptInstall,         // Function to show install prompt
  clearCache,            // Function to clear all caches
  refreshCacheStats,     // Function to refresh cache stats
  syncInBackground,      // Function to register background sync
} = usePWA();
```

Cache stats structure:
```typescript
{
  precache: number,  // Precached assets count
  runtime: number,   // Runtime cached pages count
  images: number,    // Cached images count
  api: number,       // Cached API responses count
  total: number      // Total cached items
}
```

### 5. UI Components

#### InstallPWA Component (`src/components/common/InstallPWA.tsx`)

Install button with two variants:

- **Banner Mode**: Top banner with install prompt
- **Button Mode**: Inline button for navigation/settings

Features:
- Auto-hides when app is installed
- Shows installation progress
- Success/error feedback
- Dismissible banner

Usage:
```tsx
// Banner variant
<InstallPWA showBanner={true} />

// Button variant
<InstallPWA showBanner={false} variant="outline" size="sm" />
```

#### PWAStatus Component (`src/components/common/PWAStatus.tsx`)

Status indicators for:
- Display mode (App vs Browser)
- Online/offline status

Usage:
```tsx
<PWAStatus showDisplayMode={true} showOnlineStatus={true} />
```

#### OfflineExample Component (`src/examples/OfflineExample.tsx`)

Comprehensive demo of offline features:
- Connection status indicator
- Cache statistics display
- Background sync testing
- Cache management (clear, refresh)
- Caching strategies explanation
- Testing instructions

Usage:
```tsx
import { OfflineExample } from '@/examples/OfflineExample';

<OfflineExample />
```

## Integration Guide

### 1. Add to Main App

In your main App component or layout:

```tsx
import { InstallPWA, PWAStatus } from '@/components/common';

function App() {
  return (
    <>
      {/* Install banner at top */}
      <InstallPWA showBanner={true} />
      
      {/* Your app content */}
      <YourAppContent />
      
      {/* Status indicator in footer/header */}
      <PWAStatus />
    </>
  );
}
```

### 2. Add to Navigation/Settings

```tsx
import { InstallPWA } from '@/components/common';

function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <InstallPWA showBanner={false} variant="ghost" size="sm" />
    </nav>
  );
}
```

### 3. Service Worker Registration

The service worker is automatically registered via the `usePWA` hook. No manual registration needed.

## Browser Support

### Fully Supported
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ✅ Opera

### Partial Support
- ⚠️ Firefox (Desktop only, no mobile install)
- ⚠️ Safari (Desktop - limited features)

### Not Supported
- ❌ Internet Explorer

## Testing PWA Features

### 1. Local Testing

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

Then open Chrome DevTools:
1. Go to **Application** tab
2. Check **Manifest** section
3. Check **Service Workers** section
4. Use **Lighthouse** to audit PWA score

### 2. Install Prompt Testing

Chrome DevTools → Application → Manifest → "Add to home screen"

### 3. Offline Testing

1. Install the app
2. Open DevTools → Network tab
3. Set throttling to "Offline"
4. Navigate the app (cached pages should work)

### 4. Update Testing

1. Make changes to the app
2. Build and deploy
3. Open installed app
4. Should see update prompt

## Deployment Checklist

### Required Assets

- [ ] Generate PWA icons (see `public/icons/README.md`)
  - 16x16, 32x32, 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- [ ] Capture screenshots (see `public/screenshots/README.md`)
  - Mobile: 540x720 (menu-view.png)
  - Desktop: 1280x720 (dashboard.png)
- [ ] Update manifest.json with actual app details
- [ ] Test on multiple devices and browsers

### Configuration

- [ ] Set correct `start_url` in manifest.json
- [ ] Set appropriate `theme_color` matching brand
- [ ] Configure service worker cache names
- [ ] Set cache expiration policies
- [ ] Configure which routes to cache

### HTTPS Requirement

⚠️ **CRITICAL**: PWA features require HTTPS in production!

- Service workers only work on HTTPS (or localhost)
- Install prompt only shows on HTTPS
- Use valid SSL certificate

### Performance

- [ ] Optimize service worker cache size
- [ ] Set appropriate cache TTL
- [ ] Implement cache versioning strategy
- [ ] Monitor cache storage usage

## Customization

### Modify Cache Strategy

Edit `public/sw.js`:

```javascript
// Change cache names
const CACHE_NAME = 'smartdine-v2';

// Add more precached assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png', // Add your assets
];

// Modify caching strategy
// Network first, cache first, etc.
```

### Customize Install Prompt

Edit `src/components/common/InstallPWA.tsx`:

- Change banner design
- Modify button text
- Add custom animations
- Change positioning

### Modify Manifest

Edit `public/manifest.json`:

- Update app name and description
- Change theme colors
- Add/remove shortcuts
- Modify display mode

## Troubleshooting

### Install Prompt Not Showing

1. Check HTTPS is enabled
2. Verify manifest.json is valid
3. Check service worker is registered
4. Ensure icons are correct sizes
5. Clear browser cache and try again

### Service Worker Not Updating

1. Increment cache version in sw.js
2. Clear application cache in DevTools
3. Unregister old service worker
4. Hard refresh (Ctrl+Shift+R)

### Offline Mode Not Working

1. Check service worker is active
2. Verify caching strategy
3. Check network tab for cached responses
4. Ensure routes are being cached

### Icons Not Displaying

1. Verify icon files exist in public/icons/
2. Check manifest.json paths are correct
3. Ensure icon sizes match manifest
4. Clear cache and reinstall

## Best Practices

### 1. Cache Management

- Keep cache size reasonable (< 50MB)
- Implement cache expiration
- Version your caches
- Clean up old caches

### 2. Update Strategy

- Prompt users for updates
- Don't force reload
- Show update progress
- Handle update failures gracefully

### 3. Offline Experience

- Show clear offline indicators
- Cache critical pages
- Provide offline fallbacks
- Queue actions for when online

### 4. Performance

- Lazy load non-critical assets
- Optimize images before caching
- Use compression
- Monitor cache hit rates

## Future Enhancements

### Planned Features

- [ ] Background sync for offline actions
- [ ] Push notifications
- [ ] Periodic background sync
- [ ] Advanced caching strategies
- [ ] Offline form submission queue
- [ ] Share target API
- [ ] File handling API

### Advanced PWA Features

- [ ] Web Share API integration
- [ ] Badging API for notifications
- [ ] Contact Picker API
- [ ] Payment Request API
- [ ] Credential Management API

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox) - Advanced service worker library

## Support

For issues or questions about PWA implementation:
1. Check browser console for errors
2. Use Chrome DevTools Application tab
3. Run Lighthouse audit
4. Check service worker status

---

**Last Updated**: Implementation completed with basic PWA features
**Version**: 1.0.0
**Status**: ✅ Ready for testing and deployment
