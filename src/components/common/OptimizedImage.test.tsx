import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { OptimizedImage } from './OptimizedImage';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe('OptimizedImage', () => {
  beforeEach(() => {
    // Setup IntersectionObserver mock
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('renders with basic props', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  it('applies lazy loading by default', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('uses eager loading when priority is true', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" priority={true} loading="eager" />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('applies custom className', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test image" className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('sets width and height attributes', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" width={800} height={600} />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '600');
  });

  it('calls onLoad callback when image loads', async () => {
    const onLoad = vi.fn();
    render(<OptimizedImage src="/test.jpg" alt="Test image" onLoad={onLoad} priority={true} />);
    
    const img = screen.getByAltText('Test image');
    
    // Simulate image load
    img.dispatchEvent(new Event('load'));
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const onError = vi.fn();
    render(
      <OptimizedImage 
        src="/nonexistent.jpg" 
        alt="Test image" 
        onError={onError}
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Test image');
    
    // Simulate image error
    img.dispatchEvent(new Event('error'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  it('uses fallback image on error', async () => {
    render(
      <OptimizedImage 
        src="/nonexistent.jpg" 
        alt="Test image"
        fallbackSrc="/fallback.jpg"
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Test image') as HTMLImageElement;
    
    // Simulate image error
    img.dispatchEvent(new Event('error'));
    
    await waitFor(() => {
      expect(img.src).toContain('fallback.jpg');
    });
  });

  it('renders picture element with multiple sources', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        priority={true}
        formats={['avif', 'webp', 'original']}
      />
    );
    
    const picture = container.querySelector('picture');
    expect(picture).toBeInTheDocument();
    
    const sources = container.querySelectorAll('source');
    expect(sources.length).toBeGreaterThan(0);
  });

  it('applies correct object-fit class', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" objectFit="contain" />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('object-contain');
  });

  it('sets decoding attribute to async', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('sets fetchpriority to high when priority is true', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" priority={true} />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('renders blur placeholder when provided', () => {
    const blurDataURL = 'data:image/svg+xml;base64,test';
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        blurDataURL={blurDataURL}
      />
    );
    
    const placeholder = container.querySelector('.animate-pulse');
    expect(placeholder).toBeInTheDocument();
  });

  it('applies aspect ratio when width and height are provided', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        width={16}
        height={9}
      />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe('16 / 9');
  });

  it('generates srcset for responsive images', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        priority={true}
      />
    );
    
    const sources = container.querySelectorAll('source');
    sources.forEach(source => {
      const srcset = source.getAttribute('srcset');
      if (srcset) {
        expect(srcset).toContain('w=');
        expect(srcset).toContain('q=');
      }
    });
  });

  it('uses custom sizes attribute', () => {
    const customSizes = '(max-width: 768px) 100vw, 50vw';
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        sizes={customSizes}
        priority={true}
      />
    );
    
    const sources = container.querySelectorAll('source');
    sources.forEach(source => {
      const sizes = source.getAttribute('sizes');
      if (sizes) {
        expect(sizes).toBe(customSizes);
      }
    });
  });

  it('uses custom quality setting', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        quality={90}
        priority={true}
      />
    );
    
    const sources = container.querySelectorAll('source');
    sources.forEach(source => {
      const srcset = source.getAttribute('srcset');
      if (srcset) {
        expect(srcset).toContain('q=90');
      }
    });
  });

  it('shows loading spinner when image is not in view', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        loading="lazy"
      />
    );
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('hides loading spinner when image is loaded', async () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        priority={true}
      />
    );
    
    const img = screen.getByAltText('Test image');
    
    // Simulate image load
    img.dispatchEvent(new Event('load'));
    
    await waitFor(() => {
      expect(img).toHaveClass('opacity-100');
    });
  });

  it('supports custom formats array', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image"
        formats={['webp', 'original']}
        priority={true}
      />
    );
    
    const sources = container.querySelectorAll('source');
    const types = Array.from(sources).map(s => s.getAttribute('type'));
    
    expect(types).toContain('image/webp');
    expect(types).not.toContain('image/avif');
  });
});
