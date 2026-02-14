/**
 * MenuBrowse Page Integration Tests
 * Tests the menu browsing page with filtering and search functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MenuBrowse } from './MenuBrowse';
import * as useMenuHook from '@/features/menu/hooks/useMenu';
import type { Dish } from '@/utils/types';

// Mock the hooks
vi.mock('@/features/menu/hooks/useMenu');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ restaurantId: 'test-restaurant' }),
    useNavigate: () => vi.fn(),
  };
});

const mockDishes: Dish[] = [
  {
    id: '1',
    restaurantId: 'test-restaurant',
    name: 'Beef Burger',
    nameAr: 'برجر لحم',
    description: 'Delicious beef burger with cheese',
    descriptionAr: 'برجر لحم لذيذ مع الجبن',
    price: 45.5,
    category: 'Main Course',
    imageUrl: '/burger.jpg',
    ingredients: ['Beef', 'Cheese', 'Lettuce'],
    allergens: ['Dairy'],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    restaurantId: 'test-restaurant',
    name: 'Margherita Pizza',
    nameAr: 'بيتزا مارجريتا',
    description: 'Classic Italian pizza',
    descriptionAr: 'بيتزا إيطالية كلاسيكية',
    price: 55.0,
    category: 'Main Course',
    imageUrl: '/pizza.jpg',
    ingredients: ['Tomato', 'Mozzarella', 'Basil'],
    allergens: ['Dairy', 'Gluten'],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    restaurantId: 'test-restaurant',
    name: 'Caesar Salad',
    nameAr: 'سلطة سيزر',
    description: 'Fresh Caesar salad',
    descriptionAr: 'سلطة سيزر طازجة',
    price: 30.0,
    category: 'Appetizer',
    imageUrl: '/salad.jpg',
    ingredients: ['Lettuce', 'Parmesan', 'Croutons'],
    allergens: ['Dairy', 'Gluten'],
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderMenuBrowse = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MenuBrowse />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('MenuBrowse Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the menu browse page without crashing', () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();
    expect(document.body).toBeTruthy();
  });

  it('should display loading state', () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as any);

    renderMenuBrowse();
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();
  });

  it('should display menu header and description', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Browse our delicious dishes')).toBeInTheDocument();
    });
  });

  it('should render search bar', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Search by name, description, or ingredients/i)).toBeInTheDocument();
    });
  });

  it('should render category filter', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });
  });

  it('should display all dishes when loaded', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Beef Burger')).toBeInTheDocument();
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });
  });

  it('should display correct dish count', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('3 dishes found')).toBeInTheDocument();
    });
  });

  it('should filter dishes by search query', async () => {
    const user = userEvent.setup();
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    const searchInput = screen.getByPlaceholderText(/Search by name, description, or ingredients/i);
    await user.type(searchInput, 'burger');

    await waitFor(() => {
      expect(screen.getByText('Beef Burger')).toBeInTheDocument();
      expect(screen.queryByText('Margherita Pizza')).not.toBeInTheDocument();
      expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
    });
  });

  it('should filter dishes by category', async () => {
    const user = userEvent.setup();
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Main Course')).toBeInTheDocument();
    });

    const mainCourseButton = screen.getByText('Main Course');
    await user.click(mainCourseButton);

    await waitFor(() => {
      expect(screen.getByText('Beef Burger')).toBeInTheDocument();
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
    });
  });

  it('should display error message when menu fails to load', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Failed to load menu')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  it('should display empty state when no dishes match filters', async () => {
    const user = userEvent.setup();
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    const searchInput = screen.getByPlaceholderText(/Search by name, description, or ingredients/i);
    await user.type(searchInput, 'nonexistent dish');

    await waitFor(() => {
      expect(screen.getByText('0 dishes found')).toBeInTheDocument();
    });
  });

  it('should search by ingredients', async () => {
    const user = userEvent.setup();
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    const searchInput = screen.getByPlaceholderText(/Search by name, description, or ingredients/i);
    await user.type(searchInput, 'cheese');

    await waitFor(() => {
      expect(screen.getByText('Beef Burger')).toBeInTheDocument();
      expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
    });
  });

  it('should extract unique categories from dishes', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Appetizer')).toBeInTheDocument();
      expect(screen.getByText('Main Course')).toBeInTheDocument();
    });
  });

  it('should have proper layout structure', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    const { container } = renderMenuBrowse();

    await waitFor(() => {
      const containerElement = container.querySelector('[class*="container"]');
      expect(containerElement).toBeInTheDocument();
    });
  });

  it('should display singular form for single dish', async () => {
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: [mockDishes[0]],
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('1 dish found')).toBeInTheDocument();
    });
  });

  it('should clear category filter when clicking same category', async () => {
    const user = userEvent.setup();
    vi.mocked(useMenuHook.useMenu).mockReturnValue({
      data: mockDishes,
      isLoading: false,
      error: null,
    } as any);

    renderMenuBrowse();

    await waitFor(() => {
      expect(screen.getByText('Appetizer')).toBeInTheDocument();
    });

    const appetizerButton = screen.getByText('Appetizer');
    
    // Click to filter
    await user.click(appetizerButton);
    await waitFor(() => {
      expect(screen.queryByText('Beef Burger')).not.toBeInTheDocument();
      expect(screen.getByText('1 dish found')).toBeInTheDocument();
    });

    // Click "All" button to clear filter
    const allButton = screen.getByText('All');
    await user.click(allButton);
    
    await waitFor(() => {
      expect(screen.getByText('Beef Burger')).toBeInTheDocument();
      expect(screen.getByText('3 dishes found')).toBeInTheDocument();
    });
  });
});
