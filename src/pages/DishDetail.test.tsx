/**
 * DishDetail Page Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DishDetail } from './DishDetail';
import * as useDishHook from '@/features/menu/hooks/useDish';
import type { Dish } from '@/utils/types';

// Mock the hooks
vi.mock('@/features/menu/hooks/useDish');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ restaurantId: 'test-restaurant', dishId: 'test-dish' }),
    useNavigate: () => vi.fn(),
  };
});

const mockDish: Dish = {
  id: 'test-dish',
  restaurantId: 'test-restaurant',
  name: 'Test Dish',
  nameAr: 'طبق تجريبي',
  description: 'A delicious test dish',
  descriptionAr: 'طبق تجريبي لذيذ',
  price: 15.99,
  category: 'Main Course',
  imageUrl: 'https://example.com/dish.jpg',
  modelUrl: undefined,
  ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
  allergens: ['Nuts', 'Dairy'],
  isAvailable: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderDishDetail = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DishDetail />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('DishDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state', () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { container } = renderDishDetail();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should display dish information when loaded', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: mockDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('Test Dish')).toBeInTheDocument();
      expect(screen.getByText('طبق تجريبي')).toBeInTheDocument();
      expect(screen.getByText('$15.99')).toBeInTheDocument();
      expect(screen.getByText('A delicious test dish')).toBeInTheDocument();
      expect(screen.getByText('Main Course')).toBeInTheDocument();
    });
  });

  it('should display ingredients', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: mockDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Ingredient 1')).toBeInTheDocument();
      expect(screen.getByText('Ingredient 2')).toBeInTheDocument();
      expect(screen.getByText('Ingredient 3')).toBeInTheDocument();
    });
  });

  it('should display allergen information', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: mockDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('Allergen Information')).toBeInTheDocument();
      expect(screen.getByText(/Nuts/)).toBeInTheDocument();
      expect(screen.getByText(/Dairy/)).toBeInTheDocument();
    });
  });

  it('should display quantity selector', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: mockDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    });
  });

  it('should display add to cart button', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: mockDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument();
    });
  });

  it('should display error message when dish fails to load', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('Failed to load dish details')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Back to Menu/i })).toBeInTheDocument();
    });
  });

  it('should display unavailable message for unavailable dishes', async () => {
    const unavailableDish = { ...mockDish, isAvailable: false };
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: unavailableDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('Currently Unavailable')).toBeInTheDocument();
      expect(screen.getByText('This dish is currently unavailable')).toBeInTheDocument();
    });
  });

  it('should display image gallery', async () => {
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: mockDish,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      const image = screen.getByAltText('Test Dish');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/dish.jpg');
    });
  });

  it('should display placeholder when no image is available', async () => {
    const dishWithoutImage = { ...mockDish, imageUrl: '' };
    vi.mocked(useDishHook.useDish).mockReturnValue({
      data: dishWithoutImage,
      isLoading: false,
      error: null,
    } as any);

    renderDishDetail();

    await waitFor(() => {
      expect(screen.getByText('🍽️')).toBeInTheDocument();
    });
  });
});
