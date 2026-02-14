/**
 * ARButton Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ARButton } from './ARButton';

describe('ARButton', () => {
  it('should render button when modelUrl is provided', () => {
    render(<ARButton modelUrl="https://example.com/model.glb" />);
    expect(screen.getByRole('button', { name: /view in ar/i })).toBeInTheDocument();
  });

  it('should not render when modelUrl is not provided', () => {
    const { container } = render(<ARButton />);
    expect(container.firstChild).toBeNull();
  });

  it('should call onARClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ARButton modelUrl="https://example.com/model.glb" onARClick={handleClick} />);

    const button = screen.getByRole('button', { name: /view in ar/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should stop event propagation when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const handleParentClick = vi.fn();

    render(
      <div onClick={handleParentClick}>
        <ARButton modelUrl="https://example.com/model.glb" onARClick={handleClick} />
      </div>
    );

    const button = screen.getByRole('button', { name: /view in ar/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('should render with custom text', () => {
    render(<ARButton modelUrl="https://example.com/model.glb" text="3D View" />);
    expect(screen.getByRole('button', { name: /3d view/i })).toBeInTheDocument();
  });

  it('should render without text when showText is false', () => {
    render(<ARButton modelUrl="https://example.com/model.glb" showText={false} />);
    const button = screen.getByRole('button', { name: /view in ar/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveTextContent('View in AR');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ARButton modelUrl="https://example.com/model.glb" disabled />);
    const button = screen.getByRole('button', { name: /view in ar/i });
    expect(button).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<ARButton modelUrl="https://example.com/model.glb" className="custom-class" />);
    const button = screen.getByRole('button', { name: /view in ar/i });
    expect(button).toHaveClass('custom-class');
  });

  it('should render with different size variants', () => {
    const { rerender } = render(<ARButton modelUrl="https://example.com/model.glb" size="sm" />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ARButton modelUrl="https://example.com/model.glb" size="lg" />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ARButton modelUrl="https://example.com/model.glb" size="icon" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render with different style variants', () => {
    const { rerender } = render(
      <ARButton modelUrl="https://example.com/model.glb" variant="default" />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ARButton modelUrl="https://example.com/model.glb" variant="secondary" />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ARButton modelUrl="https://example.com/model.glb" variant="ghost" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
