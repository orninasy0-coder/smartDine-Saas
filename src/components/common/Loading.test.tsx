import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('should render loading spinner', () => {
    render(<Loading />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('should render with default medium size', () => {
    const { container } = render(<Loading />);

    const spinner = container.querySelector('.w-8.h-8');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with small size', () => {
    const { container } = render(<Loading size="sm" />);

    const spinner = container.querySelector('.w-4.h-4');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with large size', () => {
    const { container } = render(<Loading size="lg" />);

    const spinner = container.querySelector('.w-12.h-12');
    expect(spinner).toBeInTheDocument();
  });

  it('should render without text by default', () => {
    render(<Loading />);

    const text = screen.queryByText(/./);
    expect(text).not.toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<Loading text="Loading data..." />);

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should apply correct styling to text', () => {
    render(<Loading text="Please wait" />);

    const text = screen.getByText('Please wait');
    expect(text).toHaveClass('mt-2', 'text-gray-600', 'dark:text-gray-400');
  });

  it('should have spinning animation', () => {
    const { container } = render(<Loading />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct border styling', () => {
    const { container } = render(<Loading />);

    const spinner = container.querySelector('.border-4.border-gray-200.border-t-blue-600');
    expect(spinner).toBeInTheDocument();
  });

  it('should be centered in container', () => {
    const { container } = render(<Loading />);

    const wrapper = container.querySelector('.flex.flex-col.items-center.justify-center');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render multiple loading spinners independently', () => {
    const { container } = render(
      <>
        <Loading size="sm" text="Loading 1" />
        <Loading size="lg" text="Loading 2" />
      </>
    );

    expect(screen.getByText('Loading 1')).toBeInTheDocument();
    expect(screen.getByText('Loading 2')).toBeInTheDocument();
    expect(container.querySelectorAll('.animate-spin')).toHaveLength(2);
  });

  it('should support all size variants', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

    sizes.forEach((size) => {
      const { container } = render(<Loading size={size} />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});
