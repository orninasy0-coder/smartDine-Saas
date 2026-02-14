/**
 * useARSupport Hook
 * 
 * React hook for detecting AR/3D rendering support on the current device.
 * Provides device capabilities, support status, and user-friendly messages.
 */

import { useEffect, useState } from 'react';
import { detectDeviceSupport, type DeviceSupport } from '../utils/deviceDetection';

export interface UseARSupportResult {
  /**
   * Whether the device supports AR/3D rendering
   */
  isSupported: boolean;
  /**
   * Whether the device check is still in progress
   */
  isChecking: boolean;
  /**
   * Detailed device support information
   */
  deviceSupport: DeviceSupport | null;
  /**
   * User-friendly message about device support
   */
  message: string;
  /**
   * Recheck device capabilities
   */
  recheck: () => void;
}

/**
 * Hook to detect AR/3D rendering support on the current device
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isSupported, isChecking, message } = useARSupport();
 *   
 *   if (isChecking) {
 *     return <div>Checking device capabilities...</div>;
 *   }
 *   
 *   if (!isSupported) {
 *     return <div>{message}</div>;
 *   }
 *   
 *   return <ARViewer />;
 * }
 * ```
 */
export function useARSupport(): UseARSupportResult {
  const [isChecking, setIsChecking] = useState(true);
  const [deviceSupport, setDeviceSupport] = useState<DeviceSupport | null>(null);

  const checkSupport = () => {
    setIsChecking(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const support = detectDeviceSupport();
      setDeviceSupport(support);
      setIsChecking(false);
    }, 0);
  };

  useEffect(() => {
    checkSupport();
  }, []);

  const isSupported = deviceSupport?.canRender3D ?? false;
  
  const message = deviceSupport
    ? deviceSupport.canRender3D
      ? '3D rendering is supported on your device'
      : deviceSupport.reason || 'Your device does not support 3D rendering'
    : 'Checking device capabilities...';

  return {
    isSupported,
    isChecking,
    deviceSupport,
    message,
    recheck: checkSupport,
  };
}
