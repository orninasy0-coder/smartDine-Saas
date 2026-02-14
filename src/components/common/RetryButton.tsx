import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
  isRetrying?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable retry button component with loading state
 *
 * @example
 * ```tsx
 * <RetryButton
 *   onRetry={handleRetry}
 *   isRetrying={isLoading}
 * />
 * ```
 */
export function RetryButton({
  onRetry,
  isRetrying = false,
  disabled = false,
  className,
  children,
}: RetryButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      onClick={onRetry}
      disabled={disabled || isRetrying}
      variant="outline"
      className={className}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
      {children || t('common.retry')}
    </Button>
  );
}
