import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from './Icon';
import { Home, User, Settings } from 'lucide-react';

describe('Icon', () => {
  it('should render icon component', () => {
    const { container } = render(<Icon icon={Home} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with default medium size', () => {
    const { container } = render(<Icon icon={Home} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-5', 'w-5');
  });

  it('should render with extra small size', () => {
    const { container } = render(<Icon icon={Home} size="xs" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-3', 'w-3');
  });

  it('should render with small size', () => {
    const { container } = render(<Icon icon={Home} size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-4', 'w-4');
  });

  it('should render with large size', () => {
    const { container } = render(<Icon icon={Home} size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-6', 'w-6');
  });

  it('should render with extra large size', () => {
    const { container } = render(<Icon icon={Home} size="xl" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-8', 'w-8');
  });

  it('should apply custom className', () => {
    const { container } = render(<Icon icon={Home} className="text-blue-500" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-blue-500');
  });

  it('should merge custom className with size classes', () => {
    const { container } = render(<Icon icon={Home} size="lg" className="text-red-500" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-6', 'w-6', 'text-red-500');
  });

  it('should render different icon types', () => {
    const { container: container1 } = render(<Icon icon={Home} />);
    const { container: container2 } = render(<Icon icon={User} />);
    const { container: container3 } = render(<Icon icon={Settings} />);

    expect(container1.querySelector('svg')).toBeInTheDocument();
    expect(container2.querySelector('svg')).toBeInTheDocument();
    expect(container3.querySelector('svg')).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Icon icon={Home} aria-label="Home icon" data-testid="home-icon" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Home icon');
    expect(svg).toHaveAttribute('data-testid', 'home-icon');
  });

  it('should support all size variants', () => {
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = ['xs', 'sm', 'md', 'lg', 'xl'];
    const expectedClasses = ['h-3 w-3', 'h-4 w-4', 'h-5 w-5', 'h-6 w-6', 'h-8 w-8'];

    sizes.forEach((size, index) => {
      const { container } = render(<Icon icon={Home} size={size} />);
      const svg = container.querySelector('svg');
      const [height, width] = expectedClasses[index].split(' ');
      expect(svg).toHaveClass(height, width);
    });
  });
});
