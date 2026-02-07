/**
 * Icon Component - Centralized icon wrapper
 *
 * Provides a consistent interface for using Lucide icons throughout the application.
 * Supports size variants, custom colors, and accessibility features.
 */

import React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

/**
 * Icon wrapper component for consistent icon usage
 *
 * @example
 * ```tsx
 * import { Icon } from '@/components/common/Icon';
 * import { Home } from 'lucide-react';
 *
 * <Icon icon={Home} size="md" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  icon: LucideIcon,
  size = 'md',
  className,
  ...props
}) => {
  return <LucideIcon className={cn(sizeMap[size], className)} {...props} />;
};
