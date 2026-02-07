# Menu Components

This directory contains the components for the menu browsing feature.

## Components

### MenuGrid
Displays dishes in a responsive grid layout with loading and empty states.

**Props:**
- `dishes: Dish[]` - Array of dishes to display
- `isLoading?: boolean` - Loading state
- `onDishClick?: (dish: Dish) => void` - Callback when a dish is clicked

**Features:**
- Responsive grid (1-4 columns based on screen size)
- Loading skeleton with 8 placeholders
- Empty state message
- Click handler for navigation

### DishCard
Displays individual dish information with image, details, and add-to-cart button.

**Props:**
- `dish: Dish` - Dish data to display
- `onClick?: () => void` - Callback when card is clicked

**Features:**
- Image with fallback emoji
- Dish name, description, and price
- Allergen badges (shows first 3)
- Unavailable overlay
- Add to cart button
- Hover effects

### CategoryFilter
Filters dishes by category with button-based selection.

**Props:**
- `categories: string[]` - Available categories
- `selectedCategory: string | null` - Currently selected category
- `onCategoryChange: (category: string | null) => void` - Callback when category changes

**Features:**
- "All" button to clear filter
- Active state styling
- Responsive flex layout

### SearchBar
Search input with clear button for filtering dishes.

**Props:**
- `value: string` - Current search value
- `onChange: (value: string) => void` - Callback when value changes
- `placeholder?: string` - Input placeholder text

**Features:**
- Search icon
- Clear button (shown when value is not empty)
- Accessible labels

## Usage Example

```tsx
import { MenuGrid, CategoryFilter, SearchBar } from '@/features/menu/components';
import { useMenu } from '@/features/menu/hooks/useMenu';

function MenuPage() {
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { data: dishes, isLoading } = useMenu('restaurant-id');

  const filtered = dishes?.filter(dish => 
    (!category || dish.category === category) &&
    (!search || dish.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter 
        categories={['Appetizers', 'Main', 'Desserts']}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
      <MenuGrid 
        dishes={filtered} 
        isLoading={isLoading}
        onDishClick={(dish) => navigate(`/dish/${dish.id}`)}
      />
    </div>
  );
}
```

## Testing

All components have unit tests covering:
- Rendering with different props
- User interactions
- Loading and empty states
- Accessibility

Run tests with:
```bash
npm test src/features/menu/components
```
