import { useState } from 'react';
import { X } from 'lucide-react';
import { FeedbackForm, FeedbackFormData } from './FeedbackForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeedbackPromptProps {
  orderId: string;
  orderNumber: string;
  restaurantName?: string;
  onSubmit: (data: FeedbackFormData) => void | Promise<void>;
  onDismiss?: () => void;
  isSubmitting?: boolean;
  variant?: 'dialog' | 'card' | 'inline';
  autoShow?: boolean;
  className?: string;
}

/**
 * FeedbackPrompt Component
 * 
 * Prompts users to leave feedback after their order has been delivered.
 * Can be displayed as a dialog, card, or inline component.
 * 
 * @example
 * // Dialog variant (default)
 * <FeedbackPrompt
 *   orderId="123"
 *   orderNumber="ORD-001"
 *   onSubmit={handleSubmit}
 *   onDismiss={handleDismiss}
 *   autoShow
 * />
 * 
 * @example
 * // Card variant
 * <FeedbackPrompt
 *   orderId="123"
 *   orderNumber="ORD-001"
 *   onSubmit={handleSubmit}
 *   variant="card"
 * />
 */
export function FeedbackPrompt({
  orderId,
  orderNumber,
  restaurantName,
  onSubmit,
  onDismiss,
  isSubmitting = false,
  variant = 'dialog',
  autoShow = false,
  className,
}: FeedbackPromptProps) {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (data: FeedbackFormData) => {
    await onSubmit(data);
    setHasSubmitted(true);
    
    // Auto-close dialog after successful submission
    if (variant === 'dialog') {
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  // Success message after submission
  if (hasSubmitted && variant !== 'dialog') {
    return (
      <Card className={cn('border-green-200 dark:border-green-800', className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Thank you for your feedback!</h3>
            <p className="text-sm text-muted-foreground">
              Your review helps us improve our service
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dialog variant
  if (variant === 'dialog') {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open && onDismiss) {
          onDismiss();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>How was your order?</DialogTitle>
          </DialogHeader>
          
          {hasSubmitted ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
                <p className="text-sm text-muted-foreground">
                  Your feedback has been submitted successfully
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Order: #{orderNumber}</p>
                {restaurantName && <p className="font-medium text-foreground">{restaurantName}</p>}
              </div>
              <FeedbackForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                orderId={orderId}
                showCard={false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>How was your order?</CardTitle>
              <CardDescription>
                Order #{orderNumber}
                {restaurantName && ` • ${restaurantName}`}
              </CardDescription>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-8 w-8 -mt-2 -mr-2"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <FeedbackForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            orderId={orderId}
            showCard={false}
          />
        </CardContent>
      </Card>
    );
  }

  // Inline variant
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">How was your order?</h3>
          <p className="text-sm text-muted-foreground">
            Order #{orderNumber}
            {restaurantName && ` • ${restaurantName}`}
          </p>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-8 w-8"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <FeedbackForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        orderId={orderId}
        showCard={false}
      />
    </div>
  );
}
