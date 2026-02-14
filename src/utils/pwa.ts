/**
 * PWA Utilities
 * Handles service worker registration and install prompt
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Register service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New service worker available');
              // Notify user about update
              if (window.confirm('New version available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  console.warn('Service Workers are not supported in this browser');
  return null;
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const success = await registration.unregister();
        console.log('Service Worker unregistered:', success);
        return success;
      }
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
  return false;
};

/**
 * Setup install prompt listener
 */
export const setupInstallPrompt = (
  onPromptAvailable?: (prompt: BeforeInstallPromptEvent) => void
): void => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    console.log('Install prompt available');
    
    // Notify callback
    if (onPromptAvailable) {
      onPromptAvailable(deferredPrompt);
    }
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
  });
};

/**
 * Show install prompt
 */
export const showInstallPrompt = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
  if (!deferredPrompt) {
    console.warn('Install prompt not available');
    return 'unavailable';
  }

  try {
    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User ${outcome} the install prompt`);
    
    // Clear the deferred prompt
    deferredPrompt = null;
    
    return outcome;
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return 'unavailable';
  }
};

/**
 * Check if app is installed
 */
export const isAppInstalled = (): boolean => {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check for iOS standalone mode
  if ((navigator as any).standalone === true) {
    return true;
  }

  return false;
};

/**
 * Check if install prompt is available
 */
export const isInstallPromptAvailable = (): boolean => {
  return deferredPrompt !== null;
};

/**
 * Get PWA display mode
 */
export const getPWADisplayMode = (): 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen' => {
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  return 'browser';
};

/**
 * Check if device supports PWA
 */
export const isPWASupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Clear all caches
 */
export const clearAllCaches = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('All caches cleared');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{
  precache: number;
  runtime: number;
  images: number;
  api: number;
  total: number;
} | null> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_CACHE_SIZE' },
          [messageChannel.port2]
        );
      }
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000);
    });
  }
  
  return null;
};

/**
 * Clear cache via service worker message
 */
export const clearCacheViaServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success || false);
      };
      
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      }
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  }
  
  return false;
};

/**
 * Register background sync (if supported)
 */
export const registerBackgroundSync = async (tag: string): Promise<boolean> => {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
      console.log('Background sync registered:', tag);
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  }
  
  console.warn('Background sync not supported');
  return false;
};

/**
 * Register periodic background sync (if supported)
 */
export const registerPeriodicSync = async (
  tag: string,
  minInterval: number = 24 * 60 * 60 * 1000 // 24 hours default
): Promise<boolean> => {
  if ('serviceWorker' in navigator && 'periodicSync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).periodicSync.register(tag, {
        minInterval,
      });
      console.log('Periodic sync registered:', tag);
      return true;
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
      return false;
    }
  }
  
  console.warn('Periodic sync not supported');
  return false;
};

/**
 * Check if background sync is supported
 */
export const isBackgroundSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype;
};

/**
 * Check if periodic sync is supported
 */
export const isPeriodicSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'periodicSync' in ServiceWorkerRegistration.prototype;
};
