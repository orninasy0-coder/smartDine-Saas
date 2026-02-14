import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FloatingShapes } from './FloatingShapes';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock animation optimization utility
vi.mock('@/utils/animationOptimization', () => ({
  prefersReducedMotion: vi.fn(() => false),
}));

describe('FloatingShapes', () => {
  it('should render floating shapes container', () => {
    const { container } = render(<FloatingShapes />);
    const shapesContainer = container.querySelector('.fixed.inset-0');
    expect(shapesContainer).toBeInTheDocument();
  });

  it('should render default number of shapes (8)', () => {
    const { container } = render(<FloatingShapes />);
    const shapes = container.querySelectorAll('.absolute');
    expect(shapes.length).toBe(8);
  });

  it('should render custom number of shapes', () => {
    const { container } = render(<FloatingShapes count={5} />);
    const shapes = container.querySelectorAll('.absolute');
    expect(shapes.length).toBe(5);
  });

  it('should apply custom className to container', () => {
    const { container } = render(<FloatingShapes className="custom-class" />);
    const shapesContainer = container.querySelector('.fixed.inset-0');
    expect(shapesContainer).toHaveClass('custom-class');
  });

  it('should have pointer-events-none class', () => {
    const { container } = render(<FloatingShapes />);
    const shapesContainer = container.querySelector('.fixed.inset-0');
    expect(shapesContainer).toHaveClass('pointer-events-none');
  });

  it('should have overflow-hidden class', () => {
    const { container } = render(<FloatingShapes />);
    const shapesContainer = container.querySelector('.fixed.inset-0');
    expect(shapesContainer).toHaveClass('overflow-hidden');
  });

  it('should have aria-hidden attribute', () => {
    const { container } = render(<FloatingShapes />);
    const shapesContainer = container.querySelector('.fixed.inset-0');
    expect(shapesContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply blur effect to shapes', () => {
    const { container } = render(<FloatingShapes />);
    const shapes = container.querySelectorAll('.absolute');
    shapes.forEach((shape) => {
      expect(shape).toHaveClass('blur-2xl');
    });
  });

  it('should not render when reduced motion is preferred', async () => {
    const animationOptimization = await import('@/utils/animationOptimization');
    const prefersReducedMotion = animationOptimization.prefersReducedMotion as any;
    prefersReducedMotion.mockReturnValue(true);

    const { container } = render(<FloatingShapes />);
    const shapesContainer = container.querySelector('.fixed.inset-0');
    expect(shapesContainer).not.toBeInTheDocument();

    // Reset mock
    prefersReducedMotion.mockReturnValue(false);
  });

  it('should render shapes with different colors', () => {
    const { container } = render(<FloatingShapes count={4} />);
    const shapes = container.querySelectorAll('.absolute');
    
    // Check that shapes have color classes
    shapes.forEach((shape) => {
      const hasColorClass = 
        shape.classList.contains('bg-primary-200/20') ||
        shape.classList.contains('bg-secondary-200/20') ||
        shape.classList.contains('bg-primary-300/15') ||
        shape.classList.contains('bg-secondary-300/15');
      expect(hasColorClass).toBe(true);
    });
  });

  it('should render shapes with rounded classes', () => {
    const { container } = render(<FloatingShapes />);
    const shapes = container.querySelectorAll('.absolute');
    
    shapes.forEach((shape) => {
      const hasRoundedClass = 
        shape.classList.contains('rounded-full') ||
        shape.classList.contains('rounded-lg');
      expect(hasRoundedClass).toBe(true);
    });
  });

  it('should have will-change style for GPU acceleration', () => {
    const { container } = render(<FloatingShapes />);
    const shapes = container.querySelectorAll('.absolute');
    
    shapes.forEach((shape) => {
      const style = (shape as HTMLElement).style;
      expect(style.willChange).toBe('transform');
    });
  });

  it('should have positioning styles', () => {
    const { container } = render(<FloatingShapes />);
    const shapes = container.querySelectorAll('.absolute');
    
    shapes.forEach((shape) => {
      const style = (shape as HTMLElement).style;
      expect(style.left).toBeTruthy();
      expect(style.top).toBeTruthy();
      expect(style.width).toBeTruthy();
      expect(style.height).toBeTruthy();
    });
  });

  it('should render with zero shapes', () => {
    const { container } = render(<FloatingShapes count={0} />);
    const shapes = container.querySelectorAll('.absolute');
    expect(shapes.length).toBe(0);
  });

  it('should render with large number of shapes', () => {
    const { container } = render(<FloatingShapes count={20} />);
    const shapes = container.querySelectorAll('.absolute');
    expect(shapes.length).toBe(20);
  });
});
