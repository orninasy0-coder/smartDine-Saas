import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ARControlsUI } from './ARControlsUI';
import type { ARControlsRef } from './ARControls';

describe('ARControlsUI', () => {
  it('should render zoom and reset buttons by default', () => {
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} />);

    expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
    expect(screen.getByTitle('Reset View')).toBeInTheDocument();
  });

  it('should hide zoom controls when showZoomControls is false', () => {
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} showZoomControls={false} />);

    expect(screen.queryByTitle('Zoom In')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Zoom Out')).not.toBeInTheDocument();
    expect(screen.getByTitle('Reset View')).toBeInTheDocument();
  });

  it('should hide reset button when showResetButton is false', () => {
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} showResetButton={false} />);

    expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
    expect(screen.queryByTitle('Reset View')).not.toBeInTheDocument();
  });

  it('should call zoomIn when zoom in button is clicked', async () => {
    const user = userEvent.setup();
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} zoomStep={2} />);

    const zoomInButton = screen.getByTitle('Zoom In');
    await user.click(zoomInButton);

    expect(mockRef.current?.zoomIn).toHaveBeenCalledWith(2);
  });

  it('should call zoomOut when zoom out button is clicked', async () => {
    const user = userEvent.setup();
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} zoomStep={2} />);

    const zoomOutButton = screen.getByTitle('Zoom Out');
    await user.click(zoomOutButton);

    expect(mockRef.current?.zoomOut).toHaveBeenCalledWith(2);
  });

  it('should call reset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} />);

    const resetButton = screen.getByTitle('Reset View');
    await user.click(resetButton);

    expect(mockRef.current?.reset).toHaveBeenCalled();
  });

  it('should apply correct position classes', () => {
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    const { container, rerender } = render(
      <ARControlsUI controlsRef={mockRef} position="top-left" />
    );

    expect(container.firstChild).toHaveClass('top-4', 'left-4');

    rerender(<ARControlsUI controlsRef={mockRef} position="bottom-right" />);
    expect(container.firstChild).toHaveClass('bottom-4', 'right-4');
  });

  it('should apply custom className', () => {
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    const { container } = render(
      <ARControlsUI controlsRef={mockRef} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should use default zoomStep of 1 when not provided', async () => {
    const user = userEvent.setup();
    const mockRef = {
      current: {
        reset: vi.fn(),
        zoomIn: vi.fn(),
        zoomOut: vi.fn(),
        getZoomLevel: vi.fn(() => 5),
        setZoomLevel: vi.fn(),
      },
    } as React.RefObject<ARControlsRef>;

    render(<ARControlsUI controlsRef={mockRef} />);

    const zoomInButton = screen.getByTitle('Zoom In');
    await user.click(zoomInButton);

    expect(mockRef.current?.zoomIn).toHaveBeenCalledWith(1);
  });
});
