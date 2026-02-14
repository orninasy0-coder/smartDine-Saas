/**
 * Offline Functionality Example
 * Demonstrates service worker offline capabilities
 */

import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wifi,
  WifiOff,
  Database,
  Trash2,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

export const OfflineExample = () => {
  const {
    isOnline,
    cacheStats,
    backgroundSyncSupported,
    clearCache,
    refreshCacheStats,
    syncInBackground,
  } = usePWA();

  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Refresh cache stats on mount
  useEffect(() => {
    refreshCacheStats();
  }, [refreshCacheStats]);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      const success = await clearCache();
      if (success) {
        await refreshCacheStats();
        alert('Cache cleared successfully!');
      } else {
        alert('Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Error clearing cache');
    } finally {
      setIsClearing(false);
    }
  };

  const handleRefreshStats = async () => {
    setIsRefreshing(true);
    try {
      await refreshCacheStats();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBackgroundSync = async () => {
    setSyncStatus('syncing');
    try {
      const success = await syncInBackground('sync-orders');
      setSyncStatus(success ? 'success' : 'error');
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Background sync error:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Offline Functionality Demo</h1>
        <p className="text-muted-foreground">
          Test service worker offline capabilities and caching strategies
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-green-500" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-500" />
                Offline
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isOnline
              ? 'You are connected to the internet'
              : 'You are offline - cached content is available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </Badge>
            {!isOnline && (
              <p className="text-sm text-muted-foreground">
                Try navigating the app - cached pages will still work!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cache Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Statistics
          </CardTitle>
          <CardDescription>View cached resources for offline access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cacheStats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Precache</p>
                  <p className="text-2xl font-bold">{cacheStats.precache}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Runtime</p>
                  <p className="text-2xl font-bold">{cacheStats.runtime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Images</p>
                  <p className="text-2xl font-bold">{cacheStats.images}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">API</p>
                  <p className="text-2xl font-bold">{cacheStats.api}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">{cacheStats.total}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshStats}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh Stats
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearCache}
                  disabled={isClearing}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Loading cache statistics...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Background Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Background Sync
            {backgroundSyncSupported ? (
              <Badge variant="default">Supported</Badge>
            ) : (
              <Badge variant="secondary">Not Supported</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Sync data in the background when connection is restored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {backgroundSyncSupported ? (
            <>
              <p className="text-sm text-muted-foreground">
                Background sync allows the app to sync data automatically when you go back online.
                Try going offline, making changes, and coming back online.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleBackgroundSync}
                  disabled={syncStatus === 'syncing'}
                  variant={syncStatus === 'success' ? 'default' : 'outline'}
                >
                  {syncStatus === 'idle' && (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Register Sync
                    </>
                  )}
                  {syncStatus === 'syncing' && (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  )}
                  {syncStatus === 'success' && (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Sync Registered
                    </>
                  )}
                  {syncStatus === 'error' && (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Sync Failed
                    </>
                  )}
                </Button>

                {syncStatus === 'success' && (
                  <p className="text-sm text-green-600">
                    Background sync registered successfully!
                  </p>
                )}
                {syncStatus === 'error' && (
                  <p className="text-sm text-red-600">Failed to register background sync</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <XCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Background sync is not supported in this browser</p>
              <p className="text-sm mt-2">Try Chrome or Edge for full PWA features</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Caching Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Caching Strategies</CardTitle>
          <CardDescription>How different resources are cached</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Navigation (HTML)</h4>
              <p className="text-sm text-muted-foreground">
                Network first, cache fallback - Always try to fetch fresh, use cache when offline
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">Images</h4>
              <p className="text-sm text-muted-foreground">
                Cache first with expiration (7 days) - Serve from cache, update in background
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">Static Assets (CSS, JS, Fonts)</h4>
              <p className="text-sm text-muted-foreground">
                Cache first - Serve from cache for fast loading
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold">API Requests</h4>
              <p className="text-sm text-muted-foreground">
                Network first with short cache (5 min) - Fresh data preferred, stale data when
                offline
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Offline Mode</CardTitle>
          <CardDescription>How to test offline functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open Chrome DevTools (F12)</li>
            <li>Go to the Network tab</li>
            <li>Change throttling to "Offline"</li>
            <li>Try navigating the app - cached pages should still work</li>
            <li>Check the Application tab → Cache Storage to see cached resources</li>
            <li>Go back online and see the connection status update</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineExample;
