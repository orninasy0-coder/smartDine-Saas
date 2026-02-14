/**
 * RestaurantTable Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RestaurantTable } from './RestaurantTable';
import { Restaurant } from '../types';

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Test Restaurant 1',
    slug: 'test-restaurant-1',
    address: '123 Main St',
    phone: '+1234567890',
    email: 'test1@example.com',
    subscriptionPlan: 'PRO',
    subscriptionStatus: 'ACTIVE',
    subscriptionExpiresAt: '2025-12-31T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Restaurant 2',
    slug: 'test-restaurant-2',
    address: '456 Oak Ave',
    phone: '+0987654321',
    email: 'test2@example.com',
    subscriptionPlan: 'BASIC',
    subscriptionStatus: 'SUSPENDED',
    subscriptionExpiresAt: null,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

describe('RestaurantTable', () => {
  const mockHandlers = {
    onEdit: vi.fn(),
    onCreate: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn(),
    onStatusChange: vi.fn(),
  };

  it('renders loading skeleton when isLoading is true', () => {
    render(<RestaurantTable restaurants={[]} isLoading={true} {...mockHandlers} />);
    
    // Check for skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders restaurant list correctly', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 2')).toBeInTheDocument();
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
  });

  it('displays subscription plan badges correctly', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('displays subscription status badges correctly', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Suspended')).toBeInTheDocument();
  });

  it('filters restaurants by search query', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    const searchInput = screen.getByPlaceholderText('Search restaurants...');
    fireEvent.change(searchInput, { target: { value: 'Restaurant 1' } });
    
    expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Restaurant 2')).not.toBeInTheDocument();
  });

  it('calls onCreate when Add Restaurant button is clicked', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    const addButton = screen.getByText('Add Restaurant');
    fireEvent.click(addButton);
    
    expect(mockHandlers.onCreate).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no restaurants', () => {
    render(<RestaurantTable restaurants={[]} {...mockHandlers} />);
    
    expect(screen.getByText('No restaurants yet.')).toBeInTheDocument();
  });

  it('shows no results message when search has no matches', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    const searchInput = screen.getByPlaceholderText('Search restaurants...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No restaurants found matching your search.')).toBeInTheDocument();
  });

  it('displays correct results count', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    expect(screen.getByText('Showing 2 of 2 restaurants')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<RestaurantTable restaurants={mockRestaurants} {...mockHandlers} />);
    
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('Feb 1, 2024')).toBeInTheDocument();
  });
});
