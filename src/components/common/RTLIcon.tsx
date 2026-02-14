import { LucideIcon } from 'lucide-react';
import { getIconRTLClass } from '@/utils/rtl';
import { cn } from '@/lib/utils';

interface RTLIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  /**
   * Whether to mirror the icon in RTL mode
   * Default: auto-detect based on icon name
   */
  mirror?: boolean;
}

/**
 * RTL-aware Icon Component
 * 
 * Automatically mirrors directional icons (arrows, chevrons) in RTL mode.
 * Use this component instead of directly rendering Lucide icons for better RTL support.
 * 
 * @example
 * ```tsx
 * import { ChevronRight } from 'lucide-react';
 * import { RTLIcon } from '@/components/common';
 * 
 * <RTLIcon icon={ChevronRight} className="w-5 h-5" />
 * ```
 */
export function RTLIcon({ icon: Icon, className, size, mirror }: RTLIconProps) {
  const iconName = Icon.displayName || Icon.name || '';
  const shouldMirror = mirror !== undefined ? mirror : getIconRTLClass(iconName) !== '';
  
  return (
    <Icon
      size={size}
      className={cn(
        shouldMirror && 'rtl-mirror',
        className
      )}
    />
  );
}
