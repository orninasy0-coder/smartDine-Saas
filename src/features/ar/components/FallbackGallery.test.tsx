import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FallbackGallery } from './FallbackGallery';

describe('FallbackGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  const defaultProps = {
    images: mockImages,
    dishName: 'Test Dish',
  };

  it('should render with single image', () => {
    render(<FallbackGallery {...defaultProps} images={[mockImages[0]]} />);
    
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
    expect(screen.getByAltText('Test Dish - Image 1')).toBeInTheDocument();
  });

  it('should render with multiple images', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should show description when provided', () => {
    render(
      <FallbackGallery
        {...defaultProps}
        description="Test description"
      />
    );
    
    const infoButton = screen.getByLabelText('Toggle description');
    fireEvent.click(infoButton);
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should navigate to next image', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('should navigate to previous image', () => {
    render(<FallbackGallery {...defaultProps} initialIndex={1} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should wrap around when navigating past last image', () => {
    render(<FallbackGallery {...defaultProps} initialIndex={2} />);
    
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should wrap around when navigating before first image', () => {
    render(<FallbackGallery {...defaultProps} initialIndex={0} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);
    
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('should handle zoom in', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const zoomInButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInButton);
    
    const image = screen.getByAltText('Test Dish - Image 1');
    expect(image).toHaveStyle({ transform: 'scale(1.25)' });
  });

  it('should handle zoom out', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const zoomInButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInButton);
    
    const zoomOutButton = screen.getByLabelText('Zoom out');
    fireEvent.click(zoomOutButton);
    
    const image = screen.getByAltText('Test Dish - Image 1');
    expect(image).toHaveStyle({ transform: 'scale(1)' });
  });

  it('should limit zoom to maximum 3x', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const zoomInButton = screen.getByLabelText('Zoom in');
    
    // Click zoom in 10 times
    for (let i = 0; i < 10; i++) {
      fireEvent.click(zoomInButton);
    }
    
    const image = screen.getByAltText('Test Dish - Image 1');
    expect(image).toHaveStyle({ transform: 'scale(3)' });
  });

  it('should limit zoom to minimum 1x', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const zoomOutButton = screen.getByLabelText('Zoom out');
    fireEvent.click(zoomOutButton);
    
    const image = screen.getByAltText('Test Dish - Image 1');
    expect(image).toHaveStyle({ transform: 'scale(1)' });
  });

  it('should reset zoom when changing images', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const zoomInButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInButton);
    fireEvent.click(zoomInButton);
    
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    const image = screen.getByAltText('Test Dish - Image 2');
    expect(image).toHaveStyle({ transform: 'scale(1)' });
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<FallbackGallery {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close gallery');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard navigation', () => {
    const { container } = render(<FallbackGallery {...defaultProps} />);
    
    const gallery = container.firstChild as HTMLElement;
    
    // Navigate right
    fireEvent.keyDown(gallery, { key: 'ArrowRight' });
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    
    // Navigate left
    fireEvent.keyDown(gallery, { key: 'ArrowLeft' });
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should handle keyboard zoom', () => {
    const { container } = render(<FallbackGallery {...defaultProps} />);
    
    const gallery = container.firstChild as HTMLElement;
    
    // Zoom in
    fireEvent.keyDown(gallery, { key: '+' });
    
    const image = screen.getByAltText('Test Dish - Image 1');
    expect(image).toHaveStyle({ transform: 'scale(1.25)' });
    
    // Zoom out
    fireEvent.keyDown(gallery, { key: '-' });
    expect(image).toHaveStyle({ transform: 'scale(1)' });
  });

  it('should handle keyboard reset zoom', () => {
    const { container } = render(<FallbackGallery {...defaultProps} />);
    
    const gallery = container.firstChild as HTMLElement;
    
    // Zoom in
    fireEvent.keyDown(gallery, { key: '+' });
    fireEvent.keyDown(gallery, { key: '+' });
    
    // Reset zoom
    fireEvent.keyDown(gallery, { key: '0' });
    
    const image = screen.getByAltText('Test Dish - Image 1');
    expect(image).toHaveStyle({ transform: 'scale(1)' });
  });

  it('should handle keyboard close', () => {
    const onClose = vi.fn();
    const { container } = render(
      <FallbackGallery {...defaultProps} onClose={onClose} />
    );
    
    const gallery = container.firstChild as HTMLElement;
    fireEvent.keyDown(gallery, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not show navigation for single image', () => {
    render(<FallbackGallery {...defaultProps} images={[mockImages[0]]} />);
    
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
  });

  it('should not show counter for single image', () => {
    render(<FallbackGallery {...defaultProps} images={[mockImages[0]]} />);
    
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
  });

  it('should hide navigation when showNavigation is false', () => {
    render(<FallbackGallery {...defaultProps} showNavigation={false} />);
    
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
  });

  it('should hide zoom controls when showZoomControls is false', () => {
    render(<FallbackGallery {...defaultProps} showZoomControls={false} />);
    
    expect(screen.queryByLabelText('Zoom in')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Zoom out')).not.toBeInTheDocument();
  });

  it('should hide counter when showCounter is false', () => {
    render(<FallbackGallery {...defaultProps} showCounter={false} />);
    
    expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
  });

  it('should hide info button when showInfo is false', () => {
    render(
      <FallbackGallery
        {...defaultProps}
        description="Test"
        showInfo={false}
      />
    );
    
    expect(screen.queryByLabelText('Toggle description')).not.toBeInTheDocument();
  });

  it('should render thumbnails for multiple images', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const thumbnails = screen.getAllByAltText(/thumbnail/i);
    expect(thumbnails).toHaveLength(3);
  });

  it('should change image when thumbnail is clicked', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const thumbnails = screen.getAllByLabelText(/View image/i);
    fireEvent.click(thumbnails[2]);
    
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('should show reset zoom button when zoomed', () => {
    render(<FallbackGallery {...defaultProps} />);
    
    const zoomInButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInButton);
    
    expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FallbackGallery {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
