import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  readonly = false,
  showLabel = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleStarClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, value: number) => {
    if (!readonly && onRatingChange && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onRatingChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleStarClick(starValue)}
              onKeyDown={(e) => handleKeyDown(e, starValue)}
              disabled={readonly}
              className={cn(
                'transition-all duration-200',
                !readonly && 'hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
                readonly && 'cursor-default'
              )}
              aria-label={`Rate ${starValue} out of ${maxRating} stars`}
              tabIndex={readonly ? -1 : 0}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors duration-200',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300 dark:text-gray-600',
                  !readonly && 'hover:text-yellow-400'
                )}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">
          {rating > 0 ? `${rating}/${maxRating}` : 'No rating'}
        </span>
      )}
    </div>
  );
}
