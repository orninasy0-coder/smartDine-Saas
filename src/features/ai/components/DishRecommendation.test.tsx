/**
 * DishRecommendation Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DishRecommendation } from './DishRecommendation';
import type { DishSuggestion } from '../types';

const mockSuggestions: DishSuggestion[] = [
  {
    dishId: '1',
    name: 'برجر كلاسيك',
    reason: 'طبق شهير ومحبوب من قبل العملاء',
    price: 45.0,
    image: '/images/burger.jpg',
  },
  {
    dishId: '2',
    name: 'سلطة سيزر',
    reason: 'خيار صحي ومنعش',
    price: 30.0,
  },
];

describe('DishRecommendation', () => {
  it('renders loading state', () => {
    render(<DishRecommendation suggestions={[]} isLoading={true} />);
    
    const loadingCards = screen.getAllByRole('generic').filter(
      (el) => el.className.includes('animate-pulse')
    );
    expect(loadingCards.length).toBeGreaterThan(0);
  });

  it('renders nothing when no suggestions', () => {
    const { container } = render(<DishRecommendation suggestions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders dish suggestions', () => {
    render(<DishRecommendation suggestions={mockSuggestions} />);
    
    expect(screen.getByText('برجر كلاسيك')).toBeInTheDocument();
    expect(screen.getByText('سلطة سيزر')).toBeInTheDocument();
    expect(screen.getByText('طبق شهير ومحبوب من قبل العملاء')).toBeInTheDocument();
    expect(screen.getByText('خيار صحي ومنعش')).toBeInTheDocument();
  });

  it('displays prices correctly', () => {
    render(<DishRecommendation suggestions={mockSuggestions} />);
    
    expect(screen.getByText('45.00 ر.س')).toBeInTheDocument();
    expect(screen.getByText('30.00 ر.س')).toBeInTheDocument();
  });

  it('calls onAddToCart when add button clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    
    render(
      <DishRecommendation
        suggestions={mockSuggestions}
        onAddToCart={onAddToCart}
      />
    );
    
    const addButtons = screen.getAllByTitle('إضافة للسلة');
    await user.click(addButtons[0]);
    
    expect(onAddToCart).toHaveBeenCalledWith('1');
  });

  it('calls onViewDetails when info button clicked', async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();
    
    render(
      <DishRecommendation
        suggestions={mockSuggestions}
        onViewDetails={onViewDetails}
      />
    );
    
    const infoButtons = screen.getAllByTitle('عرض التفاصيل');
    await user.click(infoButtons[0]);
    
    expect(onViewDetails).toHaveBeenCalledWith('1');
  });

  it('renders image when provided', () => {
    render(<DishRecommendation suggestions={mockSuggestions} />);
    
    const image = screen.getByAltText('برجر كلاسيك');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/burger.jpg');
  });

  it('renders placeholder when no image', () => {
    render(<DishRecommendation suggestions={mockSuggestions} />);
    
    const cards = screen.getAllByRole('generic').filter(
      (el) => el.className.includes('bg-muted')
    );
    expect(cards.length).toBeGreaterThan(0);
  });
});
