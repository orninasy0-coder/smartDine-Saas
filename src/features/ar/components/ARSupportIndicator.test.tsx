import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ARSupportIndicator } from './ARSupportIndicator';
import * as useARSupportModule from '../hooks/useARSupport';

describe('ARSupportIndicator', () => {
  it('should show checking state', () => {
    vi.spyOn(useARSupportModule, 'useARSupport').mockReturnValue({
      isSupported: false,
      isChecking: true,
      deviceSupport: null,
      message: 'Checking device capabilities...',
      recheck: vi.fn(),
    });

    render(<ARSupportIndicator />);
    expect(screen.getByText('Checking device capabilities...')).toBeInTheDocument();
  });

  it('should show supported state', () => {
    vi.spyOn(useARSupportModule, 'useARSupport').mockReturnValue({
      isSupported: true,
      isChecking: false,
      deviceSupport: {
        webgl: true,
        webgl2: true,
        canRender3D: true,
      },
      message: '3D rendering is supported on your device',
      recheck: vi.fn(),
    });

    render(<ARSupportIndicator />);
    expect(screen.getByText('3D Rendering Supported')).toBeInTheDocument();
    expect(screen.getByText('3D rendering is supported on your device')).toBeInTheDocument();
  });

  it('should show unsupported state', () => {
    vi.spyOn(useARSupportModule, 'useARSupport').mockReturnValue({
      isSupported: false,
      isChecking: false,
      deviceSupport: {
        webgl: false,
        webgl2: false,
        canRender3D: false,
        reason: 'WebGL is not supported on this device',
      },
      message: 'WebGL is not supported on this device',
      recheck: vi.fn(),
    });

    render(<ARSupportIndicator />);
    expect(screen.getByText('3D Rendering Not Available')).toBeInTheDocument();
    expect(screen.getByText('WebGL is not supported on this device')).toBeInTheDocument();
    expect(screen.getByText("Don't worry! You can still view high-quality images of our dishes.")).toBeInTheDocument();
  });

  it('should show detailed capabilities when showDetails is true', () => {
    vi.spyOn(useARSupportModule, 'useARSupport').mockReturnValue({
      isSupported: true,
      isChecking: false,
      deviceSupport: {
        webgl: true,
        webgl2: true,
        canRender3D: true,
        capabilities: {
          maxTextureSize: 4096,
          maxVertexAttributes: 16,
          maxFragmentUniforms: 256,
          renderer: 'Test Renderer',
          vendor: 'Test Vendor',
        },
      },
      message: '3D rendering is supported on your device',
      recheck: vi.fn(),
    });

    render(<ARSupportIndicator showDetails />);
    
    expect(screen.getByText('Device Details:')).toBeInTheDocument();
    expect(screen.getByText('4096px')).toBeInTheDocument();
    expect(screen.getByText('Test Renderer')).toBeInTheDocument();
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
  });

  it('should show WebGL status in details', () => {
    vi.spyOn(useARSupportModule, 'useARSupport').mockReturnValue({
      isSupported: true,
      isChecking: false,
      deviceSupport: {
        webgl: true,
        webgl2: false,
        canRender3D: true,
      },
      message: '3D rendering is supported on your device',
      recheck: vi.fn(),
    });

    render(<ARSupportIndicator showDetails />);
    
    const webglElements = screen.getAllByText('Supported');
    const notSupportedElements = screen.getAllByText('Not Supported');
    
    expect(webglElements.length).toBeGreaterThan(0);
    expect(notSupportedElements.length).toBeGreaterThan(0);
  });

  it('should not show details when showDetails is false', () => {
    vi.spyOn(useARSupportModule, 'useARSupport').mockReturnValue({
      isSupported: true,
      isChecking: false,
      deviceSupport: {
        webgl: true,
        webgl2: true,
        canRender3D: true,
        capabilities: {
          maxTextureSize: 4096,
          maxVertexAttributes: 16,
          maxFragmentUniforms: 256,
          renderer: 'Test Renderer',
          vendor: 'Test Vendor',
        },
      },
      message: '3D rendering is supported on your device',
      recheck: vi.fn(),
    });

    render(<ARSupportIndicator showDetails={false} />);
    
    expect(screen.queryByText('Device Details:')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Renderer')).not.toBeInTheDocument();
  });
});
