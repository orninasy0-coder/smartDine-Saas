import { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface FeedbackFormData {
  rating: number;
  comment: string;
}

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  orderId?: string;
  dishName?: string;
  className?: string;
  showCard?: boolean;
}

export function FeedbackForm({
  onSubmit,
  isSubmitting = false,
  orderId,
  dishName,
  className,
  showCard = true,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { rating?: string; comment?: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (comment.length > 1000) {
      newErrors.comment = 'Comment must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({ rating, comment: comment.trim() });
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (errors.comment && e.target.value.length <= 1000) {
      setErrors((prev) => ({ ...prev, comment: undefined }));
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order/Dish Info */}
      {(orderId || dishName) && (
        <div className="text-sm text-muted-foreground">
          {orderId && <p>Order: #{orderId.slice(0, 8)}</p>}
          {dishName && <p className="font-medium text-foreground">Dish: {dishName}</p>}
        </div>
      )}

      {/* Star Rating */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          How would you rate your experience? <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-4">
          <StarRating
            rating={rating}
            onRatingChange={handleRatingChange}
            size="lg"
            showLabel
            className="py-2"
          />
        </div>
        {errors.rating && (
          <p className="text-sm text-destructive" role="alert" aria-live="polite">
            {errors.rating}
          </p>
        )}
      </div>

      {/* Text Review */}
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-base font-semibold">
          Share your thoughts (optional)
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Tell us about your experience..."
          className={cn(
            'min-h-[120px] resize-none',
            errors.comment && 'border-destructive focus-visible:ring-destructive'
          )}
          maxLength={1000}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{comment.length}/1000 characters</span>
          {errors.comment && (
            <span className="text-destructive" role="alert">
              {errors.comment}
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );

  if (!showCard) {
    return <div className={className}>{formContent}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Leave Your Feedback</CardTitle>
        <CardDescription>
          Help us improve by sharing your experience with this order
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
