import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dish, DISH_CATEGORIES } from '../types';

interface MenuEditorProps {
  dishes: Dish[];
  onAddDish: () => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dishId: string) => void;
  isLoading?: boolean;
}

export function MenuEditor({
  dishes,
  onAddDish,
  onEditDish,
  onDeleteDish,
  isLoading = false,
}: MenuEditorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  // Filter dishes based on search and filters
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      searchQuery === '' ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || dish.category === selectedCategory;

    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && dish.isAvailable) ||
      (availabilityFilter === 'unavailable' && !dish.isAvailable);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-muted-foreground">
            Manage your restaurant's menu items
          </p>
        </div>
        <Button onClick={onAddDish}>
          <Plus className="mr-2 h-4 w-4" />
          Add Dish
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DISH_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Availability Filter */}
          <Select
            value={availabilityFilter}
            onValueChange={setAvailabilityFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Dishes Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredDishes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'No dishes found matching your filters'
              : 'No dishes yet. Add your first dish to get started!'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDishes.map((dish) => (
            <Card
              key={dish.id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              {/* Dish Image */}
              <div className="relative h-48 bg-muted">
                {dish.imageUrl ? (
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {!dish.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Badge variant="destructive">Unavailable</Badge>
                  </div>
                )}
              </div>

              {/* Dish Info */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{dish.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary">{dish.category}</Badge>
                  <span className="text-lg font-bold">${dish.price}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEditDish(dish)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteDish(dish.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredDishes.length} of {dishes.length} dishes
        </span>
        <span>
          {dishes.filter((d) => d.isAvailable).length} available •{' '}
          {dishes.filter((d) => !d.isAvailable).length} unavailable
        </span>
      </div>
    </div>
  );
}
