import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  describe('Rendering', () => {
    it('renders correct number of stars', () => {
      render(<StarRating rating={3} maxRating={5} />);
      const stars = screen.getAllByRole('button');
      expect(stars).toHaveLength(5);
    });

    it('renders filled stars based on rating', () => {
      render(<StarRating rating={3} maxRating={5} />);
      const stars = screen.getAllByRole('button');
      
      // First 3 stars should be filled (yellow)
      stars.slice(0, 3).forEach((star) => {
        const svg = star.querySelector('svg');
        expect(svg).toHaveClass('fill-yellow-400');
      });
      
      // Last 2 stars should be empty
      stars.slice(3).forEach((star) => {
        const svg = star.querySelector('svg');
        expect(svg).toHaveClass('fill-none');
      });
    });

    it('renders with custom max rating', () => {
      render(<StarRating rating={2} maxRating={10} />);
      const stars = screen.getAllByRole('button');
      expect(stars).toHaveLength(10);
    });

    it('shows label when showLabel is true', () => {
      render(<StarRating rating={4} maxRating={5} showLabel />);
      expect(screen.getByText('4/5')).toBeInTheDocument();
    });

    it('shows "No rating" label when rating is 0', () => {
      render(<StarRating rating={0} maxRating={5} showLabel />);
      expect(screen.getByText('No rating')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(<StarRating rating={3} size="sm" />);
      let stars = screen.getAllByRole('button');
      expect(stars[0].querySelector('svg')).toHaveClass('w-4', 'h-4');

      rerender(<StarRating rating={3} size="md" />);
      stars = screen.getAllByRole('button');
      expect(stars[0].querySelector('svg')).toHaveClass('w-6', 'h-6');

      rerender(<StarRating rating={3} size="lg" />);
      stars = screen.getAllByRole('button');
      expect(stars[0].querySelector('svg')).toHaveClass('w-8', 'h-8');
    });
  });

  describe('Interaction', () => {
    it('calls onRatingChange when star is clicked', async () => {
      const user = userEvent.setup();
      const handleRatingChange = vi.fn();
      
      render(<StarRating rating={0} onRatingChange={handleRatingChange} />);
      const stars = screen.getAllByRole('button');
      
      await user.click(stars[2]); // Click 3rd star
      expect(handleRatingChange).toHaveBeenCalledWith(3);
    });

    it('updates rating when different stars are clicked', async () => {
      const user = userEvent.setup();
      const handleRatingChange = vi.fn();
      
      render(<StarRating rating={2} onRatingChange={handleRatingChange} />);
      const stars = screen.getAllByRole('button');
      
      await user.click(stars[4]); // Click 5th star
      expect(handleRatingChange).toHaveBeenCalledWith(5);
      
      await user.click(stars[0]); // Click 1st star
      expect(handleRatingChange).toHaveBeenCalledWith(1);
    });

    it('does not call onRatingChange when readonly', async () => {
      const user = userEvent.setup();
      const handleRatingChange = vi.fn();
      
      render(<StarRating rating={3} onRatingChange={handleRatingChange} readonly />);
      const stars = screen.getAllByRole('button');
      
      await user.click(stars[4]);
      expect(handleRatingChange).not.toHaveBeenCalled();
    });

    it('handles keyboard navigation with Enter key', async () => {
      const user = userEvent.setup();
      const handleRatingChange = vi.fn();
      
      render(<StarRating rating={0} onRatingChange={handleRatingChange} />);
      const stars = screen.getAllByRole('button');
      
      stars[2].focus();
      await user.keyboard('{Enter}');
      expect(handleRatingChange).toHaveBeenCalledWith(3);
    });

    it('handles keyboard navigation with Space key', async () => {
      const user = userEvent.setup();
      const handleRatingChange = vi.fn();
      
      render(<StarRating rating={0} onRatingChange={handleRatingChange} />);
      const stars = screen.getAllByRole('button');
      
      stars[3].focus();
      await user.keyboard(' ');
      expect(handleRatingChange).toHaveBeenCalledWith(4);
    });

    it('does not respond to keyboard when readonly', async () => {
      const user = userEvent.setup();
      const handleRatingChange = vi.fn();
      
      render(<StarRating rating={3} onRatingChange={handleRatingChange} readonly />);
      const stars = screen.getAllByRole('button');
      
      stars[4].focus();
      await user.keyboard('{Enter}');
      expect(handleRatingChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for each star', () => {
      render(<StarRating rating={3} maxRating={5} />);
      
      expect(screen.getByLabelText('Rate 1 out of 5 stars')).toBeInTheDocument();
      expect(screen.getByLabelText('Rate 3 out of 5 stars')).toBeInTheDocument();
      expect(screen.getByLabelText('Rate 5 out of 5 stars')).toBeInTheDocument();
    });

    it('sets tabIndex to -1 when readonly', () => {
      render(<StarRating rating={3} readonly />);
      const stars = screen.getAllByRole('button');
      
      stars.forEach((star) => {
        expect(star).toHaveAttribute('tabIndex', '-1');
      });
    });

    it('allows tab navigation when not readonly', () => {
      render(<StarRating rating={3} />);
      const stars = screen.getAllByRole('button');
      
      stars.forEach((star) => {
        expect(star).toHaveAttribute('tabIndex', '0');
      });
    });

    it('disables buttons when readonly', () => {
      render(<StarRating rating={3} readonly />);
      const stars = screen.getAllByRole('button');
      
      stars.forEach((star) => {
        expect(star).toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rating of 0', () => {
      render(<StarRating rating={0} maxRating={5} />);
      const stars = screen.getAllByRole('button');
      
      stars.forEach((star) => {
        const svg = star.querySelector('svg');
        expect(svg).toHaveClass('fill-none');
      });
    });

    it('handles rating equal to maxRating', () => {
      render(<StarRating rating={5} maxRating={5} />);
      const stars = screen.getAllByRole('button');
      
      stars.forEach((star) => {
        const svg = star.querySelector('svg');
        expect(svg).toHaveClass('fill-yellow-400');
      });
    });

    it('applies custom className', () => {
      const { container } = render(<StarRating rating={3} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
