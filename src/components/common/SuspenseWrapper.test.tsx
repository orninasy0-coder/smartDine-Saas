import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuspenseWrapper } from './SuspenseWrapper';

describe('SuspenseWrapper', () => {
  it('renders children when loaded', () => {
    render(
      <SuspenseWrapper>
        <div>Test Content</div>
      </SuspenseWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows loading fallback with custom text', () => {
    // Create a component that never resolves to test loading state
    const NeverResolve = () => {
      throw new Promise(() => {}); // Never resolves
    };

    render(
      <SuspenseWrapper loadingText="Loading data...">
        <NeverResolve />
      </SuspenseWrapper>
    );

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('uses custom fallback when provided', () => {
    const NeverResolve = () => {
      throw new Promise(() => {});
    };

    render(
      <SuspenseWrapper fallback={<div>Custom Loading</div>}>
        <NeverResolve />
      </SuspenseWrapper>
    );

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
  });

  it('applies fullHeight class when enabled', () => {
    const NeverResolve = () => {
      throw new Promise(() => {});
    };

    const { container } = render(
      <SuspenseWrapper fullHeight>
        <NeverResolve />
      </SuspenseWrapper>
    );

    // Check for the class in the rendered output
    expect(container.innerHTML).toContain('min-h-[400px]');
  });

  it('applies custom fallback className', () => {
    const NeverResolve = () => {
      throw new Promise(() => {});
    };

    const { container } = render(
      <SuspenseWrapper fallbackClassName="custom-class">
        <NeverResolve />
      </SuspenseWrapper>
    );

    const fallbackContainer = container.querySelector('.custom-class');
    expect(fallbackContainer).toBeInTheDocument();
  });

  it('renders with different loading sizes', () => {
    const NeverResolve = () => {
      throw new Promise(() => {});
    };

    const { rerender } = render(
      <SuspenseWrapper loadingSize="sm">
        <NeverResolve />
      </SuspenseWrapper>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <SuspenseWrapper loadingSize="lg">
        <NeverResolve />
      </SuspenseWrapper>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders synchronous children without suspense', () => {
    render(
      <SuspenseWrapper>
        <div>Sync Content</div>
      </SuspenseWrapper>
    );

    expect(screen.getByText('Sync Content')).toBeInTheDocument();
  });
});
