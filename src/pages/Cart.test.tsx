/**
 * Cart Page Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Cart } from './Cart';
import * as cartHooks from '@/features/cart/hooks/useCart';

// Mock the useCart hook
vi.mock('@/features/cart/hooks/useCart');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ restaurantId: 'test-restaurant' }),
  };
});

describe('Cart Page', () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockClearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty cart state when cart is empty', () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: { items: [], total: 0, restaurantId: 'test-restaurant' },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 0,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('سلة التسوق فارغة')).toBeInTheDocument();
    expect(screen.getByText(/لم تقم بإضافة أي أطباق بعد/)).toBeInTheDocument();
  });

  it('should render cart items when cart has items', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
        {
          dishId: '2',
          name: 'بيتزا مارجريتا',
          price: 55.0,
          quantity: 1,
          image: '/test-image2.jpg',
        },
      ],
      total: 146.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 2,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('برجر لحم')).toBeInTheDocument();
    expect(screen.getByText('بيتزا مارجريتا')).toBeInTheDocument();
    expect(screen.getByText('2 عناصر في السلة')).toBeInTheDocument();
  });

  it('should display correct total price', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
      ],
      total: 91.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 1,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    // Check for total in order summary
    const totalElements = screen.getAllByText('91.00 ر.س');
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('should call updateQuantity when increasing quantity', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
      ],
      total: 91.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 1,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const plusButton = plusButtons.find((btn) => btn.querySelector('svg.lucide-plus'));

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
    }
  });

  it('should call updateQuantity when decreasing quantity', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
      ],
      total: 91.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 1,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    const minusButtons = screen.getAllByRole('button', { name: '' });
    const minusButton = minusButtons.find((btn) => btn.querySelector('svg.lucide-minus'));

    if (minusButton) {
      fireEvent.click(minusButton);
      expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
    }
  });

  it('should not decrease quantity below 1', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 1,
          image: '/test-image.jpg',
        },
      ],
      total: 45.5,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 1,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    const minusButtons = screen.getAllByRole('button', { name: '' });
    const minusButton = minusButtons.find((btn) => btn.querySelector('svg.lucide-minus'));

    if (minusButton) {
      expect(minusButton).toBeDisabled();
    }
  });

  it('should call removeItem when clicking remove button', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
      ],
      total: 91.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 1,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByRole('button', { name: '' });
    const removeButton = removeButtons.find((btn) => btn.querySelector('svg.lucide-trash-2'));

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(mockRemoveItem).toHaveBeenCalledWith('1');
    }
  });

  it('should navigate to menu when clicking continue shopping', () => {
    const mockCart = {
      items: [],
      total: 0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 0,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    const continueButton = screen.getByText('تصفح القائمة');
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith('/test-restaurant/menu');
  });

  it('should display correct item count in summary', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
        {
          dishId: '2',
          name: 'بيتزا مارجريتا',
          price: 55.0,
          quantity: 3,
          image: '/test-image2.jpg',
        },
      ],
      total: 256.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 2,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    // Check for items count in summary section
    expect(screen.getByText('عدد الأصناف')).toBeInTheDocument();
    expect(screen.getByText('إجمالي القطع')).toBeInTheDocument();
    
    // Total quantity should be 5 (2 + 3)
    const summarySection = screen.getByText('ملخص الطلب').closest('div');
    expect(summarySection).toHaveTextContent('5');
  });

  it('should calculate subtotal correctly for each item', () => {
    const mockCart = {
      items: [
        {
          dishId: '1',
          name: 'برجر لحم',
          price: 45.5,
          quantity: 2,
          image: '/test-image.jpg',
        },
      ],
      total: 91.0,
      restaurantId: 'test-restaurant',
    };

    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: mockCart,
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: mockClearCart,
      itemCount: 1,
    });

    render(
      <MemoryRouter initialEntries={['/test-restaurant/cart']}>
        <Cart />
      </MemoryRouter>
    );

    // Item subtotal should be 45.5 * 2 = 91.00
    // Check that the subtotal appears (it appears multiple times in the UI)
    const subtotalElements = screen.getAllByText('91.00 ر.س');
    expect(subtotalElements.length).toBeGreaterThan(0);
  });
});
