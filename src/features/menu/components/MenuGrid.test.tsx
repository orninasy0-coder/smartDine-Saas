/**
 * MenuGrid Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuGrid } from './MenuGrid';
import { Dish } from '@/utils/types';

// Mock DishCard component
vi.mock('./DishCard', () => ({
  DishCard: ({ dish }: { dish: Dish }) => <div data-testid={`dish-${dish.id}`}>{dish.name}</div>,
}));

const mockDishes: Dish[] = [
  {
    id: '1',
    restaurantId: 'rest-1',
    name: 'Burger',
    description: 'Delicious burger',
    price: 10.99,
    category: 'Main',
    ingredients: ['beef', 'bun'],
    allergens: [],
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    restaurantId: 'rest-1',
    name: 'Pizza',
    description: 'Tasty pizza',
    price: 12.99,
    category: 'Main',
    ingredients: ['dough', 'cheese'],
    allergens: ['dairy'],
    isAvailable: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('MenuGrid', () => {
  it('renders loading state', () => {
    render(<MenuGrid dishes={[]} isLoading={true} />);
    const loadingElements = screen.getAllByLabelText('Loading dish');
    expect(loadingElements).toHaveLength(8);
  });

  it('renders empty state when no dishes', () => {
    render(<MenuGrid dishes={[]} isLoading={false} />);
    expect(screen.getByText('No dishes found')).toBeInTheDocument();
  });

  it('renders dishes in grid', () => {
    render(<MenuGrid dishes={mockDishes} isLoading={false} />);
    expect(screen.getByTestId('dish-1')).toBeInTheDocument();
    expect(screen.getByTestId('dish-2')).toBeInTheDocument();
  });
});
