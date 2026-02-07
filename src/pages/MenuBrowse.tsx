/**
 * MenuBrowse Page - Main menu browsing interface
 */

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMenu } from '@/features/menu/hooks/useMenu';
import { MenuGrid, CategoryFilter, SearchBar } from '@/features/menu/components';
import { Container } from '@/components/common/Container';

export const MenuBrowse = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: dishes = [], isLoading, error } = useMenu(restaurantId || '');

  // Extract unique categories from dishes
  const categories = useMemo(() => {
    const uniqueCategories = new Set(dishes.map((dish) => dish.category));
    return Array.from(uniqueCategories).sort();
  }, [dishes]);

  // Filter dishes by category and search query
  const filteredDishes = useMemo(() => {
    let filtered = dishes;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((dish) => dish.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query) ||
          dish.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [dishes, selectedCategory, searchQuery]);

  const handleDishClick = (dishId: string) => {
    navigate(`/${restaurantId}/menu/dish/${dishId}`);
  };

  if (error) {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-destructive">Failed to load menu</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Menu</h1>
          <p className="text-muted-foreground mt-2">Browse our delicious dishes</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, description, or ingredients..."
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <h2 className="text-sm font-medium mb-3">Categories</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="text-sm text-muted-foreground">
            {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'} found
          </div>
        )}

        {/* Menu Grid */}
        <MenuGrid
          dishes={filteredDishes}
          isLoading={isLoading}
          onDishClick={(dish) => handleDishClick(dish.id)}
          restaurantId={restaurantId}
        />
      </div>
    </Container>
  );
};
