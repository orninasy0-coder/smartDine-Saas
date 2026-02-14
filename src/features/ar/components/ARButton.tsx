/**
 * ARButton Component - Button to trigger AR view for dishes with 3D models
 *
 * This component displays a button that opens the AR viewer when clicked.
 * It only renders if the dish has a 3D model URL available.
 */

import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ARButtonProps {
  /**
   * URL of the 3D model (GLB/glTF format)
   */
  modelUrl?: string;

  /**
   * Callback when AR button is clicked
   */
  onARClick?: () => void;

  /**
   * Button size variant
   * @default "default"
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Button style variant
   * @default "outline"
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether to show the button text
   * @default true
   */
  showText?: boolean;

  /**
   * Custom button text
   * @default "View in AR"
   */
  text?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
}

export const ARButton = ({
  modelUrl,
  onARClick,
  size = 'default',
  variant = 'outline',
  className,
  showText = true,
  text = 'View in AR',
  disabled = false,
}: ARButtonProps) => {
  // Don't render if no model URL is provided
  if (!modelUrl) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onARClick?.();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn('gap-2', className)}
      aria-label={text}
    >
      <Box className="h-4 w-4" />
      {showText && <span>{text}</span>}
    </Button>
  );
};
