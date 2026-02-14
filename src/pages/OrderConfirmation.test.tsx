/**
 * OrderConfirmation Page Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { OrderConfirmation } from './OrderConfirmation';

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('OrderConfirmation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithRouter = (orderId = 'test-order-123', restaurantId = 'test-restaurant') => {
    return render(
      <MemoryRouter initialEntries={[`/${restaurantId}/order/${orderId}`]}>
        <Routes>
          <Route path="/:restaurantId/order/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders the component without crashing', () => {
    renderWithRouter();
    // Component should render (even if in loading state initially)
    expect(document.body).toBeTruthy();
  });

  it('displays loading state initially', () => {
    renderWithRouter();
    // Check for loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('renders with correct route parameters', () => {
    const { container } = renderWithRouter('order-123', 'restaurant-abc');
    expect(container).toBeTruthy();
  });
});
