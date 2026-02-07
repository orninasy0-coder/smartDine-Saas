/**
 * DishDetail Page - Displays complete dish information
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useDish } from '@/features/menu/hooks/useDish';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

export const DishDetail = () => {
  const { restaurantId, dishId } = useParams<{ restaurantId: string; dishId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: dish, isLoading, error } = useDish(restaurantId || '', dishId || '');
  const addItem = useCartStore((state) => state.addItem);

  const handleBack = () => {
    navigate(`/${restaurantId}/menu`);
  };

  const handleAddToCart = () => {
    if (!dish) return;

    addItem(
      {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity,
        image: dish.imageUrl,
      },
      restaurantId || ''
    );

    // Show success feedback (could be a toast notification)
    navigate(`/${restaurantId}/menu`);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  if (error || !dish) {
    return (
      <Container className="py-8">
        <ErrorMessage message="Failed to load dish details" />
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </Container>
    );
  }

  // Create image gallery array (main image + placeholder for future multiple images)
  const images = dish.imageUrl ? [dish.imageUrl] : [];

  return (
    <Container className="py-8">
      {/* Back Button */}
      <Button onClick={handleBack} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Menu
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {images.length > 0 ? (
              <img
                src={images[selectedImageIndex]}
                alt={dish.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-8xl text-muted-foreground">🍽️</span>
              </div>
            )}
            {!dish.isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="rounded-full bg-destructive px-6 py-3 text-lg font-semibold text-destructive-foreground">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <img src={image} alt={`${dish.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dish Information Section */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold">{dish.name}</h1>
            {dish.nameAr && <p className="text-xl text-muted-foreground mt-1">{dish.nameAr}</p>}
            <p className="text-3xl font-bold text-primary mt-4">${dish.price.toFixed(2)}</p>
          </div>

          {/* Category */}
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {dish.category}
            </span>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{dish.description}</p>
            {dish.descriptionAr && (
              <p className="text-muted-foreground leading-relaxed mt-2 text-right" dir="rtl">
                {dish.descriptionAr}
              </p>
            )}
          </div>

          {/* Ingredients */}
          {dish.ingredients.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens */}
          {dish.allergens.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Allergen Information</h2>
              <div className="flex flex-wrap gap-2">
                {dish.allergens.map((allergen, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-sm font-medium text-orange-700 dark:text-orange-300"
                  >
                    ⚠️ {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quantity</h2>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || !dish.isAvailable}
                aria-label="Decrease quantity"
              >
                -
              </Button>
              <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={!dish.isAvailable}
                aria-label="Increase quantity"
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!dish.isAvailable}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - ${(dish.price * quantity).toFixed(2)}
            </Button>
            {!dish.isAvailable && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                This dish is currently unavailable
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
