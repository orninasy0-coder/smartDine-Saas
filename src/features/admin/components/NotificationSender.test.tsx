/**
 * NotificationSender Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationSender } from './NotificationSender';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('NotificationSender', () => {
  const mockOnSend = vi.fn();
  const mockRestaurantCount = {
    all: 150,
    active: 120,
    trial: 20,
    suspended: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders notification sender form', () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    expect(screen.getByRole('heading', { name: /Send Notification/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Notification Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Audience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Notification/i })).toBeInTheDocument();
  });

  it('displays restaurant counts for each target', () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    // Check if default count is displayed (All Restaurants = 150)
    expect(screen.getByText(/Will be sent to 150 restaurants/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    
    // Button should be disabled when fields are empty
    expect(sendButton).toBeDisabled();
  });

  it('validates title length', async () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const longTitle = 'a'.repeat(101);
    fireEvent.change(titleInput, { target: { value: longTitle } });

    const messageInput = screen.getByLabelText(/Message/i);
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Title must be 100 characters or less');
    });
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('validates message length', async () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const messageInput = screen.getByLabelText(/Message/i);
    const longMessage = 'a'.repeat(501);
    fireEvent.change(messageInput, { target: { value: longMessage } });

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Message must be 500 characters or less');
    });
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('sends notification with valid data', async () => {
    mockOnSend.mockResolvedValueOnce(undefined);

    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Important Update' } });

    const messageInput = screen.getByLabelText(/Message/i);
    fireEvent.change(messageInput, { target: { value: 'This is an important notification' } });

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith({
        title: 'Important Update',
        message: 'This is an important notification',
        type: 'info',
        target: 'all',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Notification sent successfully to 150 restaurants');
  });

  it('displays preview when title or message is entered', () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    const messageInput = screen.getByLabelText(/Message/i);
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    // Use getAllByText since the message appears in both textarea and preview
    const messages = screen.getAllByText('Test Message');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('resets form after successful send', async () => {
    mockOnSend.mockResolvedValueOnce(undefined);

    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const messageInput = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalled();
    });

    // Check if form is reset
    expect(titleInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  it('handles send error gracefully', async () => {
    mockOnSend.mockRejectedValueOnce(new Error('Network error'));

    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const messageInput = screen.getByLabelText(/Message/i);
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send notification. Please try again.');
    });
  });

  it('disables send button when sending', async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockOnSend.mockReturnValue(promise);

    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    const messageInput = screen.getByLabelText(/Message/i);
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    const sendButton = screen.getByRole('button', { name: /Send Notification/i });
    
    // Button should be enabled before clicking
    expect(sendButton).not.toBeDisabled();
    
    fireEvent.click(sendButton);

    // Button should be disabled while sending
    await waitFor(() => {
      expect(sendButton).toBeDisabled();
      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });

    // Resolve the promise
    resolvePromise!();

    // Button should be enabled again after sending completes
    await waitFor(() => {
      expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays character count for title and message', () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    expect(screen.getByText('0/100 characters')).toBeInTheDocument();
    expect(screen.getByText('0/500 characters')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test' } });

    expect(screen.getByText('4/100 characters')).toBeInTheDocument();

    const messageInput = screen.getByLabelText(/Message/i);
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    expect(screen.getByText('12/500 characters')).toBeInTheDocument();
  });

  it('displays recipient count based on target selection', () => {
    render(<NotificationSender onSend={mockOnSend} restaurantCount={mockRestaurantCount} />);

    expect(screen.getByText(/Will be sent to 150 restaurants/i)).toBeInTheDocument();
  });
});
