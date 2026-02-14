/**
 * ARSupportIndicator Component
 * 
 * Displays device AR/3D support status with detailed information
 * Shows capabilities and provides helpful messages for unsupported devices
 */

import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useARSupport } from '../hooks/useARSupport';
import { Card } from '@/components/ui/card';

export interface ARSupportIndicatorProps {
  /**
   * Show detailed capabilities information
   * @default false
   */
  showDetails?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

export function ARSupportIndicator({
  showDetails = false,
  className,
}: ARSupportIndicatorProps) {
  const { isSupported, isChecking, deviceSupport, message } = useARSupport();

  if (isChecking) {
    return (
      <Card className={className}>
        <div className="p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
          <div>
            <p className="text-sm font-medium">Checking device capabilities...</p>
          </div>
        </div>
      </Card>
    );
  }

  const Icon = isSupported ? CheckCircle : AlertCircle;
  const iconColor = isSupported ? 'text-green-500' : 'text-amber-500';
  const bgColor = isSupported ? 'bg-green-50 dark:bg-green-950/20' : 'bg-amber-50 dark:bg-amber-950/20';

  return (
    <Card className={className}>
      <div className={`p-4 ${bgColor}`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {isSupported ? '3D Rendering Supported' : '3D Rendering Not Available'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{message}</p>

            {showDetails && deviceSupport && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Info className="w-3 h-3" />
                  <span className="font-medium">Device Details:</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">WebGL:</span>{' '}
                    <span className={deviceSupport.webgl ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {deviceSupport.webgl ? 'Supported' : 'Not Supported'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">WebGL2:</span>{' '}
                    <span className={deviceSupport.webgl2 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                      {deviceSupport.webgl2 ? 'Supported' : 'Not Supported'}
                    </span>
                  </div>
                </div>

                {deviceSupport.capabilities && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-muted-foreground">Max Texture Size:</span>{' '}
                        {deviceSupport.capabilities.maxTextureSize}px
                      </div>
                      <div>
                        <span className="text-muted-foreground">Renderer:</span>{' '}
                        {deviceSupport.capabilities.renderer}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vendor:</span>{' '}
                        {deviceSupport.capabilities.vendor}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isSupported && (
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Don't worry! You can still view high-quality images of our dishes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
