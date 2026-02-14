import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ChevronRight, Search } from 'lucide-react';
import { RTLIcon } from './RTLIcon';

describe('RTLIcon', () => {
  let originalDir: string;

  beforeEach(() => {
    originalDir = document.documentElement.dir;
  });

  afterEach(() => {
    document.documentElement.dir = originalDir;
  });

  it('renders icon component', () => {
    const { container } = render(<RTLIcon icon={ChevronRight} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RTLIcon icon={ChevronRight} className="custom-class" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('applies custom size', () => {
    const { container } = render(<RTLIcon icon={ChevronRight} size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('automatically applies rtl-mirror class to directional icons', () => {
    const { container } = render(<RTLIcon icon={ChevronRight} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('rtl-mirror');
  });

  it('does not apply rtl-mirror class to non-directional icons', () => {
    const { container } = render(<RTLIcon icon={Search} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveClass('rtl-mirror');
  });

  it('respects explicit mirror prop when true', () => {
    const { container } = render(<RTLIcon icon={Search} mirror={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('rtl-mirror');
  });

  it('respects explicit mirror prop when false', () => {
    const { container } = render(<RTLIcon icon={ChevronRight} mirror={false} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveClass('rtl-mirror');
  });

  it('combines rtl-mirror with custom className', () => {
    const { container } = render(
      <RTLIcon icon={ChevronRight} className="text-blue-500" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('rtl-mirror');
    expect(svg).toHaveClass('text-blue-500');
  });
});
