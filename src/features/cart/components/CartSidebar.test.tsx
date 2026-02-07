/**
 * CartSidebar Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartSidebar } from './CartSidebar';
import * as cartHooks from '../hooks/useCart';

// Mock the useCart hook
vi.mock('../hooks/useCart');

describe('CartSidebar', () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display empty cart message when cart is empty', () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: { items: [], total: 0, restaurantId: '' },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 0,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('سلة التسوق فارغة')).toBeInTheDocument();
    expect(screen.getByText('أضف بعض الأطباق لتبدأ طلبك')).toBeInTheDocument();
  });

  it('should display cart items when cart has items', () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: {
        items: [
          {
            dishId: '1',
            name: 'برجر لحم',
            price: 45.0,
            quantity: 2,
            image: '/test-image.jpg',
          },
          {
            dishId: '2',
            name: 'بيتزا مارجريتا',
            price: 55.0,
            quantity: 1,
          },
        ],
        total: 145.0,
        restaurantId: 'rest-1',
      },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 2,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('برجر لحم')).toBeInTheDocument();
    expect(screen.getByText('بيتزا مارجريتا')).toBeInTheDocument();
    expect(screen.getByText('145.00 ر.س')).toBeInTheDocument();
  });

  it('should update quantity when plus button is clicked', async () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: {
        items: [
          {
            dishId: '1',
            name: 'برجر لحم',
            price: 45.0,
            quantity: 2,
          },
        ],
        total: 90.0,
        restaurantId: 'rest-1',
      },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 1,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    const plusButtons = screen.getAllByRole('button');
    const plusButton = plusButtons.find((btn) => btn.querySelector('svg')?.classList.contains('lucide-plus'));

    if (plusButton) {
      fireEvent.click(plusButton);
      await waitFor(() => {
        expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
      });
    }
  });

  it('should update quantity when minus button is clicked', async () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: {
        items: [
          {
            dishId: '1',
            name: 'برجر لحم',
            price: 45.0,
            quantity: 2,
          },
        ],
        total: 90.0,
        restaurantId: 'rest-1',
      },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 1,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    const minusButtons = screen.getAllByRole('button');
    const minusButton = minusButtons.find((btn) => btn.querySelector('svg')?.classList.contains('lucide-minus'));

    if (minusButton) {
      fireEvent.click(minusButton);
      await waitFor(() => {
        expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
      });
    }
  });

  it('should remove item when trash button is clicked', async () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: {
        items: [
          {
            dishId: '1',
            name: 'برجر لحم',
            price: 45.0,
            quantity: 2,
          },
        ],
        total: 90.0,
        restaurantId: 'rest-1',
      },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 1,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    const trashButtons = screen.getAllByRole('button');
    const trashButton = trashButtons.find((btn) => btn.querySelector('svg')?.classList.contains('lucide-trash-2'));

    if (trashButton) {
      fireEvent.click(trashButton);
      await waitFor(() => {
        expect(mockRemoveItem).toHaveBeenCalledWith('1');
      });
    }
  });

  it('should calculate and display correct total', () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: {
        items: [
          {
            dishId: '1',
            name: 'برجر لحم',
            price: 45.0,
            quantity: 2,
          },
          {
            dishId: '2',
            name: 'بيتزا مارجريتا',
            price: 55.0,
            quantity: 1,
          },
        ],
        total: 145.0,
        restaurantId: 'rest-1',
      },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 2,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('145.00 ر.س')).toBeInTheDocument();
  });

  it('should close sidebar when close button is clicked', () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: { items: [], total: 0, restaurantId: '' },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 0,
    });

    render(<CartSidebar isOpen={true} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find((btn) => btn.querySelector('svg')?.classList.contains('lucide-x'));

    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should not render when isOpen is false', () => {
    vi.mocked(cartHooks.useCart).mockReturnValue({
      cart: { items: [], total: 0, restaurantId: '' },
      addItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      clearCart: vi.fn(),
      itemCount: 0,
    });

    const { container } = render(<CartSidebar isOpen={false} onClose={mockOnClose} />);

    expect(container.querySelector('.fixed.right-0')).not.toBeInTheDocument();
  });
});
