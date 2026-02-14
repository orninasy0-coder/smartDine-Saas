import { InstallPWA, PWAStatus } from '@/components/common';
import { usePWA } from '@/hooks/usePWA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Wifi, WifiOff, Download, Check } from 'lucide-react';

/**
 * PWA Example Component
 * Demonstrates PWA features and usage
 */
export const PWAExample = () => {
  const { isInstalled, isInstallable, isSupported, displayMode, isOnline } = usePWA();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">PWA Features Demo</h1>
        <p className="text-muted-foreground">
          Progressive Web App capabilities for SmartDine
        </p>
      </div>

      {/* Install Banner Example */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Install Banner</h2>
        <p className="text-sm text-muted-foreground">
          Shows a banner at the top when the app can be installed
        </p>
        <InstallPWA showBanner={true} />
      </Card>

      {/* Install Button Example */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Install Button</h2>
        <p className="text-sm text-muted-foreground">
          Inline button for navigation or settings
        </p>
        <div className="flex gap-2">
          <InstallPWA showBanner={false} variant="default" size="default" />
          <InstallPWA showBanner={false} variant="outline" size="sm" />
          <InstallPWA showBanner={false} variant="ghost" size="lg" />
        </div>
      </Card>

      {/* Status Indicators */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Status Indicators</h2>
        <p className="text-sm text-muted-foreground">
          Shows app installation and online status
        </p>
        <PWAStatus showDisplayMode={true} showOnlineStatus={true} />
      </Card>

      {/* PWA Information */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">PWA Status Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            {isInstalled ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Download className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <p className="font-medium">Installation Status</p>
              <p className="text-sm text-muted-foreground">
                {isInstalled ? 'App is installed' : 'Running in browser'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            {isInstallable ? (
              <Download className="h-5 w-5 text-blue-600" />
            ) : (
              <Check className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">Installable</p>
              <p className="text-sm text-muted-foreground">
                {isInstallable ? 'Can be installed' : 'Not available'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            {displayMode === 'standalone' || displayMode === 'fullscreen' ? (
              <Smartphone className="h-5 w-5 text-blue-600" />
            ) : (
              <Monitor className="h-5 w-5 text-gray-600" />
            )}
            <div>
              <p className="font-medium">Display Mode</p>
              <p className="text-sm text-muted-foreground capitalize">
                {displayMode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">Connection Status</p>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
            {isSupported ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Check className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">PWA Support</p>
              <p className="text-sm text-muted-foreground">
                {isSupported ? 'Supported' : 'Not supported'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">How to Use</h2>
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-medium mb-1">1. Install the App</h3>
            <p className="text-muted-foreground">
              Click the "Install App" button or banner to add SmartDine to your home screen
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">2. Offline Access</h3>
            <p className="text-muted-foreground">
              Once installed, the app will work offline with cached content
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">3. App-like Experience</h3>
            <p className="text-muted-foreground">
              Enjoy a native app experience without browser UI when installed
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">4. Fast Loading</h3>
            <p className="text-muted-foreground">
              Cached assets ensure quick loading times on repeat visits
            </p>
          </div>
        </div>
      </Card>

      {/* Browser Support */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Browser Support</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="font-medium">Chrome</p>
            <p className="text-xs text-muted-foreground">Full Support</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="font-medium">Edge</p>
            <p className="text-xs text-muted-foreground">Full Support</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="font-medium">Safari</p>
            <p className="text-xs text-muted-foreground">iOS 11.3+</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <p className="font-medium">Firefox</p>
            <p className="text-xs text-muted-foreground">Desktop Only</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
