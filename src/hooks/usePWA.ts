import { useState, useEffect, useCallback } from 'react';
import {
  registerServiceWorker,
  setupInstallPrompt,
  showInstallPrompt,
  isAppInstalled,
  isInstallPromptAvailable,
  getPWADisplayMode,
  isPWASupported,
  getCacheStats,
  clearCacheViaServiceWorker,
  registerBackgroundSync,
  isBackgroundSyncSupported,
} from '@/utils/pwa';

interface CacheStats {
  precache: number;
  runtime: number;
  images: number;
  api: number;
  total: number;
}

interface UsePWAReturn {
  isInstalled: boolean;
  isInstallable: boolean;
  isSupported: boolean;
  displayMode: 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen';
  isOnline: boolean;
  cacheStats: CacheStats | null;
  backgroundSyncSupported: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  clearCache: () => Promise<boolean>;
  refreshCacheStats: () => Promise<void>;
  syncInBackground: (tag: string) => Promise<boolean>;
}

/**
 * Hook for PWA functionality
 */
export const usePWA = (): UsePWAReturn => {
  const [isInstalled, setIsInstalled] = useState(isAppInstalled());
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [displayMode, setDisplayMode] = useState(getPWADisplayMode());
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [backgroundSyncSupported] = useState(isBackgroundSyncSupported());

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Setup install prompt listener
  useEffect(() => {
    setupInstallPrompt(() => {
      setIsInstallable(true);
    });

    // Check if already installable
    setIsInstallable(isInstallPromptAvailable());
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor display mode changes
  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(display-mode: fullscreen)'),
      window.matchMedia('(display-mode: standalone)'),
      window.matchMedia('(display-mode: minimal-ui)'),
    ];

    const handleDisplayModeChange = () => {
      setDisplayMode(getPWADisplayMode());
      setIsInstalled(isAppInstalled());
    };

    mediaQueries.forEach((mq) => {
      mq.addEventListener('change', handleDisplayModeChange);
    });

    return () => {
      mediaQueries.forEach((mq) => {
        mq.removeEventListener('change', handleDisplayModeChange);
      });
    };
  }, []);

  // Load cache stats on mount
  useEffect(() => {
    const loadCacheStats = async () => {
      const stats = await getCacheStats();
      setCacheStats(stats);
    };

    loadCacheStats();
  }, []);

  // Listen for service worker messages
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          console.log('Background sync completed:', event.data.tag);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Prompt install function
  const promptInstall = useCallback(async () => {
    const result = await showInstallPrompt();
    
    if (result === 'accepted') {
      setIsInstallable(false);
      // Wait a bit for the app to be installed
      setTimeout(() => {
        setIsInstalled(isAppInstalled());
      }, 1000);
    }
    
    return result;
  }, []);

  // Clear cache function
  const clearCache = useCallback(async () => {
    const success = await clearCacheViaServiceWorker();
    if (success) {
      setCacheStats({ precache: 0, runtime: 0, images: 0, api: 0, total: 0 });
    }
    return success;
  }, []);

  // Refresh cache stats
  const refreshCacheStats = useCallback(async () => {
    const stats = await getCacheStats();
    setCacheStats(stats);
  }, []);

  // Background sync function
  const syncInBackground = useCallback(async (tag: string) => {
    return await registerBackgroundSync(tag);
  }, []);

  return {
    isInstalled,
    isInstallable,
    isSupported: isPWASupported(),
    displayMode,
    isOnline,
    cacheStats,
    backgroundSyncSupported,
    promptInstall,
    clearCache,
    refreshCacheStats,
    syncInBackground,
  };
};
