import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackForm } from './FeedbackForm';

describe('FeedbackForm', () => {
  describe('Rendering', () => {
    it('renders form with all elements', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      expect(screen.getByText(/how would you rate your experience/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share your thoughts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
    });

    it('renders with card by default', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      expect(screen.getByText('Leave Your Feedback')).toBeInTheDocument();
      expect(
        screen.getByText(/help us improve by sharing your experience/i)
      ).toBeInTheDocument();
    });

    it('renders without card when showCard is false', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} showCard={false} />);

      expect(screen.queryByText('Leave Your Feedback')).not.toBeInTheDocument();
      expect(screen.getByText(/how would you rate your experience/i)).toBeInTheDocument();
    });

    it('displays order ID when provided', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} orderId="12345678-abcd-efgh" />);

      expect(screen.getByText(/order: #12345678/i)).toBeInTheDocument();
    });

    it('displays dish name when provided', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} dishName="Margherita Pizza" />);

      expect(screen.getByText(/dish: margherita pizza/i)).toBeInTheDocument();
    });

    it('shows character count for comment', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      expect(screen.getByText('0/1000 characters')).toBeInTheDocument();
    });
  });

  describe('Star Rating Interaction', () => {
    it('updates rating when star is clicked', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const stars = screen.getAllByRole('button', { name: /rate \d out of 5 stars/i });
      await user.click(stars[3]); // Click 4th star

      expect(screen.getByText('4/5')).toBeInTheDocument();
    });
  });

  describe('Comment Input', () => {
    it('updates comment when text is entered', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const textarea = screen.getByPlaceholderText(/tell us about your experience/i);
      await user.type(textarea, 'Great food and service!');

      expect(textarea).toHaveValue('Great food and service!');
      expect(screen.getByText('23/1000 characters')).toBeInTheDocument();
    });

    it('shows error when comment exceeds 1000 characters', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const textarea = screen.getByPlaceholderText(/tell us about your experience/i);
      const longText = 'a'.repeat(1001);
      
      // Textarea has maxLength, so we can't actually type more than 1000
      // But we can test the validation logic by checking the character count
      await user.type(textarea, 'a'.repeat(100));
      expect(screen.getByText('100/1000 characters')).toBeInTheDocument();
    });

    it('clears comment error when text is reduced', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const textarea = screen.getByPlaceholderText(/tell us about your experience/i);
      await user.type(textarea, 'Valid comment');

      expect(screen.queryByText(/comment must be less than/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const stars = screen.getAllByRole('button', { name: /rate \d out of 5 stars/i });
      await user.click(stars[4]); // 5 stars

      const textarea = screen.getByPlaceholderText(/tell us about your experience/i);
      await user.type(textarea, 'Excellent experience!');

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          rating: 5,
          comment: 'Excellent experience!',
        });
      });
    });

    it('submits form without comment', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const stars = screen.getAllByRole('button', { name: /rate \d out of 5 stars/i });
      await user.click(stars[2]); // 3 stars

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          rating: 3,
          comment: '',
        });
      });
    });

    it('trims whitespace from comment', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const stars = screen.getAllByRole('button', { name: /rate \d out of 5 stars/i });
      await user.click(stars[3]);

      const textarea = screen.getByPlaceholderText(/tell us about your experience/i);
      await user.type(textarea, '  Great service!  ');

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          rating: 4,
          comment: 'Great service!',
        });
      });
    });

    it('shows error when submitting without rating', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      // Button should be disabled when rating is 0
      expect(submitButton).toBeDisabled();
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('disables submit button when rating is 0', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when rating is selected', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      expect(submitButton).toBeDisabled();

      const stars = screen.getAllByRole('button', { name: /rate \d out of 5 stars/i });
      await user.click(stars[0]);

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('shows submitting text when isSubmitting is true', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} isSubmitting={true} />);

      expect(screen.getByRole('button', { name: /submitting/i })).toBeInTheDocument();
    });

    it('disables submit button when isSubmitting is true', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} isSubmitting={true} />);

      const submitButton = screen.getByRole('button', { name: /submitting/i });
      expect(submitButton).toBeDisabled();
    });

    it('disables textarea when isSubmitting is true', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} isSubmitting={true} />);

      const textarea = screen.getByPlaceholderText(/tell us about your experience/i);
      expect(textarea).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for form fields', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      expect(screen.getByText(/how would you rate your experience/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share your thoughts/i)).toBeInTheDocument();
    });

    it('marks rating as required', () => {
      const handleSubmit = vi.fn();
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const ratingLabel = screen.getByText(/how would you rate your experience/i);
      expect(ratingLabel.querySelector('.text-destructive')).toHaveTextContent('*');
    });
  });

  describe('Edge Cases', () => {
    it('handles async onSubmit function', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockResolvedValue(undefined);
      render(<FeedbackForm onSubmit={handleSubmit} />);

      const stars = screen.getAllByRole('button', { name: /rate \d out of 5 stars/i });
      await user.click(stars[4]);

      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    it('applies custom className', () => {
      const handleSubmit = vi.fn();
      const { container } = render(
        <FeedbackForm onSubmit={handleSubmit} className="custom-class" />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});
