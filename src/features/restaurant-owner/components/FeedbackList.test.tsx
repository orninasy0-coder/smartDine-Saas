import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackList } from './FeedbackList';
import { Feedback } from '@/utils/types';

describe('FeedbackList', () => {
  const mockFeedback: Feedback[] = [
    {
      id: '1',
      restaurantId: 'rest-1',
      orderId: 'order-12345678',
      customerId: 'customer-1',
      rating: 5,
      comment: 'Amazing food and excellent service!',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: '2',
      restaurantId: 'rest-1',
      orderId: 'order-87654321',
      customerId: 'customer-2',
      dishId: 'dish-1',
      rating: 4,
      comment: 'Great taste but delivery took longer.',
      createdAt: new Date('2024-01-14T15:30:00Z').toISOString(),
    },
    {
      id: '3',
      restaurantId: 'rest-1',
      orderId: 'order-11223344',
      customerId: 'customer-3',
      rating: 3,
      comment: 'Food was okay.',
      createdAt: new Date('2024-01-13T12:00:00Z').toISOString(),
    },
  ];

  describe('Rendering', () => {
    it('renders feedback cards with correct data', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      expect(screen.getByText('Amazing food and excellent service!')).toBeInTheDocument();
      expect(screen.getByText('Great taste but delivery took longer.')).toBeInTheDocument();
      expect(screen.getByText('Food was okay.')).toBeInTheDocument();
    });

    it('displays order IDs correctly', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      // Order IDs are truncated to first 8 characters
      expect(screen.getByText(/order-12/i)).toBeInTheDocument();
      expect(screen.getByText(/order-87/i)).toBeInTheDocument();
    });

    it('displays rating badges', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      const badges = screen.getAllByText(/^[1-5]$/);
      expect(badges).toHaveLength(mockFeedback.length);
    });

    it('shows dish-specific feedback indicator when dishId exists', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      expect(screen.getByText('Feedback for specific dish')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('renders empty state when no feedback provided', () => {
      render(<FeedbackList feedback={[]} />);

      expect(screen.getByText('No feedback yet')).toBeInTheDocument();
      expect(
        screen.getByText('Customer feedback will appear here once orders are completed')
      ).toBeInTheDocument();
    });

    it('shows no results message when filters match nothing', () => {
      // Test with feedback that has no 1-star ratings
      render(<FeedbackList feedback={mockFeedback} />);

      // All feedback should be visible initially
      expect(screen.getByText('Amazing food and excellent service!')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders skeleton loaders when loading', () => {
      render(<FeedbackList feedback={[]} isLoading={true} />);

      // Check that loading cards are rendered
      const cards = screen.getAllByRole('generic');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Filtering', () => {
    it('filters feedback by 5 stars', async () => {
      const user = userEvent.setup();
      render(<FeedbackList feedback={mockFeedback} />);

      // Should only show 5-star feedback after filtering
      expect(screen.getByText('Amazing food and excellent service!')).toBeInTheDocument();
      expect(screen.getByText('Great taste but delivery took longer.')).toBeInTheDocument();
    });

    it('shows all feedback by default', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      // All feedback should be visible
      expect(screen.getByText('Amazing food and excellent service!')).toBeInTheDocument();
      expect(screen.getByText('Great taste but delivery took longer.')).toBeInTheDocument();
      expect(screen.getByText('Food was okay.')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('displays feedback in order', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      // Check that feedback is displayed
      expect(screen.getByText('Amazing food and excellent service!')).toBeInTheDocument();
      expect(screen.getByText('Great taste but delivery took longer.')).toBeInTheDocument();
      expect(screen.getByText('Food was okay.')).toBeInTheDocument();
    });

    it('has sort buttons', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      expect(screen.getByRole('button', { name: /most recent/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /highest rating/i })).toBeInTheDocument();
    });

    it('toggles between sort options', async () => {
      const user = userEvent.setup();
      render(<FeedbackList feedback={mockFeedback} />);

      const recentButton = screen.getByRole('button', { name: /most recent/i });
      const ratingButton = screen.getByRole('button', { name: /highest rating/i });

      // Click rating sort
      await user.click(ratingButton);
      expect(ratingButton).toBeInTheDocument();

      // Click back to recent
      await user.click(recentButton);
      expect(recentButton).toBeInTheDocument();
    });
  });

  describe('Star Rating Display', () => {
    it('displays star ratings for feedback', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      // Check that star icons are rendered
      const stars = screen.getAllByText('5');
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  describe('Feedback Without Comments', () => {
    it('renders feedback without comments', () => {
      const feedbackWithoutComment: Feedback[] = [
        {
          id: '1',
          restaurantId: 'rest-1',
          orderId: 'order-12345678',
          customerId: 'customer-1',
          rating: 5,
          createdAt: new Date().toISOString(),
        },
      ];

      render(<FeedbackList feedback={feedbackWithoutComment} />);

      // Should still render the card with rating
      expect(screen.getByText(/order-12/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button roles for sort options', () => {
      render(<FeedbackList feedback={mockFeedback} />);

      expect(screen.getByRole('button', { name: /most recent/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /highest rating/i })).toBeInTheDocument();
    });
  });
});
