import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AverageRating } from './AverageRating';

describe('AverageRating', () => {
  describe('Rendering', () => {
    it('should render average rating with stars and review count', () => {
      render(<AverageRating averageRating={4.5} reviewCount={10} />);

      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('/5')).toBeInTheDocument();
      expect(screen.getByText('(10 reviews)')).toBeInTheDocument();
    });

    it('should render with singular "review" for count of 1', () => {
      render(<AverageRating averageRating={5.0} reviewCount={1} />);

      expect(screen.getByText('(1 review)')).toBeInTheDocument();
    });

    it('should render with plural "reviews" for count > 1', () => {
      render(<AverageRating averageRating={3.5} reviewCount={25} />);

      expect(screen.getByText('(25 reviews)')).toBeInTheDocument();
    });

    it('should format rating to 1 decimal place', () => {
      render(<AverageRating averageRating={4.567} reviewCount={5} />);

      expect(screen.getByText('4.6')).toBeInTheDocument();
    });

    it('should render 0 reviews correctly', () => {
      render(<AverageRating averageRating={0} reviewCount={0} />);

      expect(screen.getByText('0.0')).toBeInTheDocument();
      expect(screen.getByText('(0 reviews)')).toBeInTheDocument();
    });
  });

  describe('Display Options', () => {
    it('should hide review count when showCount is false', () => {
      render(<AverageRating averageRating={4.5} reviewCount={10} showCount={false} />);

      expect(screen.queryByText('(10 reviews)')).not.toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should hide rating label when showLabel is false', () => {
      render(<AverageRating averageRating={4.5} reviewCount={10} showLabel={false} />);

      expect(screen.queryByText('4.5')).not.toBeInTheDocument();
      expect(screen.queryByText('/5')).not.toBeInTheDocument();
      expect(screen.getByText('(10 reviews)')).toBeInTheDocument();
    });

    it('should hide both label and count when both are false', () => {
      render(
        <AverageRating
          averageRating={4.5}
          reviewCount={10}
          showLabel={false}
          showCount={false}
        />
      );

      expect(screen.queryByText('4.5')).not.toBeInTheDocument();
      expect(screen.queryByText('(10 reviews)')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render with small size', () => {
      const { container } = render(
        <AverageRating averageRating={4.5} reviewCount={10} size="sm" />
      );

      const stars = container.querySelectorAll('svg');
      expect(stars.length).toBeGreaterThan(0);
      expect(stars[0]).toHaveClass('w-4', 'h-4');
    });

    it('should render with medium size (default)', () => {
      const { container } = render(
        <AverageRating averageRating={4.5} reviewCount={10} size="md" />
      );

      const stars = container.querySelectorAll('svg');
      expect(stars[0]).toHaveClass('w-6', 'h-6');
    });

    it('should render with large size', () => {
      const { container } = render(
        <AverageRating averageRating={4.5} reviewCount={10} size="lg" />
      );

      const stars = container.querySelectorAll('svg');
      expect(stars[0]).toHaveClass('w-8', 'h-8');
    });
  });

  describe('Layout Variants', () => {
    it('should render horizontal layout by default', () => {
      const { container } = render(
        <AverageRating averageRating={4.5} reviewCount={10} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('flex-col');
    });

    it('should render vertical layout when specified', () => {
      const { container } = render(
        <AverageRating averageRating={4.5} reviewCount={10} layout="vertical" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex-col');
    });
  });

  describe('Star Display', () => {
    it('should display correct number of filled stars for whole number rating', () => {
      const { container } = render(<AverageRating averageRating={4.0} reviewCount={10} />);

      const filledStars = container.querySelectorAll('.fill-yellow-400');
      expect(filledStars.length).toBe(4);
    });

    it('should display stars as readonly', () => {
      const { container } = render(<AverageRating averageRating={4.5} reviewCount={10} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('cursor-default');
        expect(button).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <AverageRating
          averageRating={4.5}
          reviewCount={10}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rating of 0', () => {
      render(<AverageRating averageRating={0} reviewCount={0} />);

      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('should handle rating of 5', () => {
      render(<AverageRating averageRating={5.0} reviewCount={100} />);

      expect(screen.getByText('5.0')).toBeInTheDocument();
    });

    it('should handle large review counts', () => {
      render(<AverageRating averageRating={4.8} reviewCount={9999} />);

      expect(screen.getByText('(9999 reviews)')).toBeInTheDocument();
    });

    it('should handle decimal ratings correctly', () => {
      render(<AverageRating averageRating={3.14159} reviewCount={5} />);

      expect(screen.getByText('3.1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      const { container } = render(
        <AverageRating averageRating={4.5} reviewCount={10} />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute('aria-label', `Rate ${index + 1} out of 5 stars`);
      });
    });

    it('should be keyboard inaccessible (readonly)', () => {
      const { container } = render(<AverageRating averageRating={4.5} reviewCount={10} />);

      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabindex', '-1');
        expect(button).toBeDisabled();
      });
    });
  });
});
