/**
 * DishCard Component - Displays individual dish information
 */

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Dish } from '@/utils/types';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface DishCardProps {
  dish: Dish;
  onClick?: () => void;
  restaurantId?: string;
}

export const DishCard = ({ dish, onClick, restaurantId }: DishCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(
      {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
        image: dish.imageUrl,
      },
      restaurantId || dish.restaurantId
    );
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-4xl text-muted-foreground">🍽️</span>
          </div>
        )}
        {!dish.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{dish.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{dish.description}</p>

        {dish.allergens.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dish.allergens.slice(0, 3).map((allergen) => (
              <span
                key={allergen}
                className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-xs text-orange-700 dark:text-orange-300"
              >
                {allergen}
              </span>
            ))}
            {dish.allergens.length > 3 && (
              <span className="text-xs text-muted-foreground">+{dish.allergens.length - 3}</span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-xl font-bold">${dish.price.toFixed(2)}</span>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!dish.isAvailable}
          aria-label={`Add ${dish.name} to cart`}
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};
