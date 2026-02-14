import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('displays custom error title and message', () => {
    render(
      <ErrorBoundary
        errorTitle="Custom Error Title"
        errorMessage="Custom error message"
      >
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom fallback UI</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows retry button when enableRetry is true', () => {
    render(
      <ErrorBoundary enableRetry={true}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('hides retry button when enableRetry is false', () => {
    render(
      <ErrorBoundary enableRetry={false}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('shows home button when enableHomeButton is true', () => {
    render(
      <ErrorBoundary enableHomeButton={true}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
  });

  it('hides home button when enableHomeButton is false', () => {
    render(
      <ErrorBoundary enableHomeButton={false}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.queryByRole('button', { name: /go home/i })).not.toBeInTheDocument();
  });

  it('increments retry count when retry button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary maxRetries={3}>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    // After retry, error should be thrown again
    rerender(
      <ErrorBoundary maxRetries={3}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/retry attempt: 1 of 3/i)).toBeInTheDocument();
  });

  it('disables retry button after max retries', () => {
    const { rerender } = render(
      <ErrorBoundary maxRetries={2}>
        <ThrowError />
      </ErrorBoundary>
    );

    // First retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    rerender(
      <ErrorBoundary maxRetries={2}>
        <ThrowError />
      </ErrorBoundary>
    );

    // Second retry
    const retryButton2 = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton2);

    rerender(
      <ErrorBoundary maxRetries={2}>
        <ThrowError />
      </ErrorBoundary>
    );

    // After max retries, button should not be present
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    expect(screen.getByText(/maximum retry attempts reached/i)).toBeInTheDocument();
  });
});
