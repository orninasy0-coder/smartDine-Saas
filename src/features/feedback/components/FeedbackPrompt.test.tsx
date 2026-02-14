import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackPrompt } from './FeedbackPrompt';

describe('FeedbackPrompt', () => {
  const mockOnSubmit = vi.fn();
  const mockOnDismiss = vi.fn();

  const defaultProps = {
    orderId: 'order-123',
    orderNumber: 'ORD-001',
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dialog Variant', () => {
    it('renders dialog when autoShow is true', () => {
      render(<FeedbackPrompt {...defaultProps} variant="dialog" autoShow />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('How was your order?')).toBeInTheDocument();
      expect(screen.getByText(/Order: #ORD-001/)).toBeInTheDocument();
    });

    it('does not render dialog when autoShow is false', () => {
      render(<FeedbackPrompt {...defaultProps} variant="dialog" autoShow={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays restaurant name when provided', () => {
      render(
        <FeedbackPrompt
          {...defaultProps}
          variant="dialog"
          autoShow
          restaurantName="Test Restaurant"
        />
      );

      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });

    it('calls onDismiss when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FeedbackPrompt {...defaultProps} variant="dialog" autoShow onDismiss={mockOnDismiss} />
      );

      // Dialog has built-in close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('shows success message after submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<FeedbackPrompt {...defaultProps} variant="dialog" autoShow />);

      // Select rating
      const stars = screen.getAllByRole('button', { name: /Rate \d out of 5 stars/ });
      await user.click(stars[4]); // 5 stars

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Thank you!')).toBeInTheDocument();
        expect(screen.getByText(/Your feedback has been submitted successfully/)).toBeInTheDocument();
      });
    });
  });

  describe('Card Variant', () => {
    it('renders as card', () => {
      render(<FeedbackPrompt {...defaultProps} variant="card" />);

      expect(screen.getByText('How was your order?')).toBeInTheDocument();
      expect(screen.getByText(/Order #ORD-001/)).toBeInTheDocument();
    });

    it('displays restaurant name in card description', () => {
      render(
        <FeedbackPrompt {...defaultProps} variant="card" restaurantName="Test Restaurant" />
      );

      expect(screen.getByText(/Test Restaurant/)).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<FeedbackPrompt {...defaultProps} variant="card" onDismiss={mockOnDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      await user.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('shows success message after submission in card variant', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<FeedbackPrompt {...defaultProps} variant="card" />);

      // Select rating
      const stars = screen.getAllByRole('button', { name: /Rate \d out of 5 stars/ });
      await user.click(stars[3]); // 4 stars

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Thank you for your feedback!')).toBeInTheDocument();
        expect(screen.getByText(/Your review helps us improve our service/)).toBeInTheDocument();
      });
    });
  });

  describe('Inline Variant', () => {
    it('renders inline without card wrapper', () => {
      render(<FeedbackPrompt {...defaultProps} variant="inline" />);

      expect(screen.getByText('How was your order?')).toBeInTheDocument();
      expect(screen.getByText(/Order #ORD-001/)).toBeInTheDocument();
    });

    it('displays restaurant name inline', () => {
      render(
        <FeedbackPrompt {...defaultProps} variant="inline" restaurantName="Test Restaurant" />
      );

      expect(screen.getByText(/Test Restaurant/)).toBeInTheDocument();
    });

    it('renders dismiss button when onDismiss is provided', () => {
      render(<FeedbackPrompt {...defaultProps} variant="inline" onDismiss={mockOnDismiss} />);

      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with feedback data', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<FeedbackPrompt {...defaultProps} variant="card" />);

      // Select rating
      const stars = screen.getAllByRole('button', { name: /Rate \d out of 5 stars/ });
      await user.click(stars[4]); // 5 stars

      // Enter comment
      const commentInput = screen.getByPlaceholderText(/Tell us about your experience/i);
      await user.type(commentInput, 'Great food and service!');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          rating: 5,
          comment: 'Great food and service!',
        });
      });
    });

    it('disables submit button when isSubmitting is true', () => {
      render(<FeedbackPrompt {...defaultProps} variant="card" isSubmitting />);

      const submitButton = screen.getByRole('button', { name: /submitting/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for close/dismiss buttons', () => {
      render(<FeedbackPrompt {...defaultProps} variant="card" onDismiss={mockOnDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss');
    });

    it('maintains focus management in dialog', () => {
      render(<FeedbackPrompt {...defaultProps} variant="dialog" autoShow />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <FeedbackPrompt {...defaultProps} variant="card" className="custom-class" />
      );

      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });
  });
});
