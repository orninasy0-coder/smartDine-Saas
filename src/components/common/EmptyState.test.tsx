import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render title correctly', () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('should render title and description', () => {
    render(<EmptyState title="No items" description="Try adding some items" />);

    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Try adding some items')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    render(
      <EmptyState
        title="No items"
        description="Get started"
        action={<button>Add Item</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<EmptyState title="Test" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'p-8', 'text-center');
  });

  it('should render complex action elements', () => {
    render(
      <EmptyState
        title="Empty"
        action={
          <div>
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        }
      />
    );

    expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
  });
});
