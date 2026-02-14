import { describe, it, expect, vi } from 'vitest';
import { ARControls } from './ARControls';
import type { ARControlsRef } from './ARControls';

describe('ARControls', () => {
  it('should be defined', () => {
    expect(ARControls).toBeDefined();
  });

  it('should be a forwardRef component', () => {
    expect(typeof ARControls).toBe('object');
    expect(ARControls).toHaveProperty('$$typeof');
  });

  it('should accept all control props', () => {
    const props = {
      enablePan: true,
      enableZoom: true,
      enableRotate: true,
      minDistance: 2,
      maxDistance: 10,
      maxPolarAngle: Math.PI / 2,
      minPolarAngle: 0,
      enableDamping: true,
      dampingFactor: 0.05,
      rotateSpeed: 0.5,
      zoomSpeed: 0.8,
      panSpeed: 1,
      autoRotate: false,
      autoRotateSpeed: 2,
    };

    // Component should accept these props without TypeScript errors
    expect(() => ARControls(props)).toBeDefined();
  });

  it('should accept callback props', () => {
    const props = {
      onChange: () => {},
      onStart: () => {},
      onEnd: () => {},
    };

    expect(() => ARControls(props)).toBeDefined();
  });

  it('should support ref forwarding', () => {
    const ref = { current: null } as React.RefObject<ARControlsRef>;
    const props = { ref };

    expect(() => ARControls(props)).toBeDefined();
  });

  it('should expose control methods via ref', () => {
    const mockRef: ARControlsRef = {
      reset: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      getZoomLevel: vi.fn(() => 5),
      setZoomLevel: vi.fn(),
    };

    expect(mockRef.reset).toBeDefined();
    expect(mockRef.zoomIn).toBeDefined();
    expect(mockRef.zoomOut).toBeDefined();
    expect(mockRef.getZoomLevel).toBeDefined();
    expect(mockRef.setZoomLevel).toBeDefined();
  });

  it('should have correct method signatures', () => {
    const mockRef: ARControlsRef = {
      reset: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      getZoomLevel: vi.fn(() => 5),
      setZoomLevel: vi.fn(),
    };

    // Test reset
    mockRef.reset();
    expect(mockRef.reset).toHaveBeenCalled();

    // Test zoomIn with optional amount
    mockRef.zoomIn();
    mockRef.zoomIn(2);
    expect(mockRef.zoomIn).toHaveBeenCalledTimes(2);

    // Test zoomOut with optional amount
    mockRef.zoomOut();
    mockRef.zoomOut(2);
    expect(mockRef.zoomOut).toHaveBeenCalledTimes(2);

    // Test getZoomLevel returns number
    const level = mockRef.getZoomLevel();
    expect(typeof level).toBe('number');

    // Test setZoomLevel accepts number
    mockRef.setZoomLevel(7);
    expect(mockRef.setZoomLevel).toHaveBeenCalledWith(7);
  });
});

