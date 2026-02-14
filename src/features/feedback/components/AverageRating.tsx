import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

interface AverageRatingProps {
  averageRating: number;
  reviewCount: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showLabel?: boolean;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export function AverageRating({
  averageRating,
  reviewCount,
  size = 'md',
  showCount = true,
  showLabel = true,
  className,
  layout = 'horizontal',
}: AverageRatingProps) {
  const formattedRating = averageRating.toFixed(1);
  const isVertical = layout === 'vertical';

  return (
    <div
      className={cn(
        'flex items-center',
        isVertical ? 'flex-col gap-2' : 'gap-3',
        className
      )}
    >
      {/* Rating Number */}
      {showLabel && (
        <div className={cn('flex items-baseline gap-1', isVertical && 'text-center')}>
          <span className="text-2xl font-bold">{formattedRating}</span>
          <span className="text-sm text-muted-foreground">/5</span>
        </div>
      )}

      {/* Star Display */}
      <div className={cn('flex items-center gap-2', isVertical && 'flex-col')}>
        <StarRating rating={averageRating} readonly size={size} />
        
        {/* Review Count */}
        {showCount && (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </div>
    </div>
  );
}
