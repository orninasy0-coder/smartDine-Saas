import { useState } from 'react';
import { Download, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallPWAProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showBanner?: boolean;
}

/**
 * Install PWA Button Component
 * Shows install prompt for PWA
 */
export const InstallPWA = ({
  variant = 'default',
  size = 'default',
  className = '',
  showBanner = true,
}: InstallPWAProps) => {
  const { isInstalled, isInstallable, isSupported, promptInstall } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBannerState, setShowBannerState] = useState(showBanner);
  const [installResult, setInstallResult] = useState<'accepted' | 'dismissed' | null>(null);

  // Don't show if already installed or not installable
  if (isInstalled || !isInstallable || !isSupported) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    const result = await promptInstall();
    setIsInstalling(false);
    
    if (result === 'accepted') {
      setInstallResult('accepted');
      setTimeout(() => {
        setShowBannerState(false);
      }, 2000);
    } else if (result === 'dismissed') {
      setInstallResult('dismissed');
      setTimeout(() => {
        setInstallResult(null);
      }, 2000);
    }
  };

  const handleDismiss = () => {
    setShowBannerState(false);
  };

  // Banner variant
  if (showBannerState && !installResult) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Download className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Install SmartDine App</p>
                  <p className="text-xs text-blue-100">
                    Get quick access and work offline
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  size="sm"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  {isInstalling ? 'Installing...' : 'Install'}
                </Button>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-blue-600 rounded transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Success/Dismissed feedback
  if (installResult) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            installResult === 'accepted'
              ? 'bg-green-600 text-white'
              : 'bg-gray-600 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {installResult === 'accepted' ? (
              <>
                <Check className="h-5 w-5" />
                <span>App installed successfully!</span>
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                <span>Installation cancelled</span>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Button variant
  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      variant={variant}
      size={size}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {isInstalling ? 'Installing...' : 'Install App'}
    </Button>
  );
};
