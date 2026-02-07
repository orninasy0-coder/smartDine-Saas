/**
 * MenuGrid Component - Displays dishes in a responsive grid layout
 */

import type { Dish } from '@/utils/types';
import { DishCard } from './DishCard';

interface MenuGridProps {
  dishes: Dish[];
  isLoading?: boolean;
  onDishClick?: (dish: Dish) => void;
  restaurantId?: string;
}

export const MenuGrid = ({ dishes, isLoading, onDishClick, restaurantId }: MenuGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-80 rounded-xl bg-muted animate-pulse"
            aria-label="Loading dish"
          />
        ))}
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">No dishes found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          onClick={() => onDishClick?.(dish)}
          restaurantId={restaurantId}
        />
      ))}
    </div>
  );
};
