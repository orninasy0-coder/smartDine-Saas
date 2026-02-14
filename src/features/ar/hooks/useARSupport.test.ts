import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useARSupport } from './useARSupport';
import * as deviceDetection from '../utils/deviceDetection';

describe('useARSupport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start with isChecking true', () => {
    vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
      webgl: true,
      webgl2: true,
      canRender3D: true,
    });

    const { result } = renderHook(() => useARSupport());
    
    expect(result.current.isChecking).toBe(true);
  });

  it('should detect supported device', async () => {
    vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
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
    });

    const { result } = renderHook(() => useARSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isSupported).toBe(true);
    expect(result.current.deviceSupport?.webgl).toBe(true);
    expect(result.current.deviceSupport?.webgl2).toBe(true);
    expect(result.current.message).toBe('3D rendering is supported on your device');
  });

  it('should detect unsupported device', async () => {
    vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
      webgl: false,
      webgl2: false,
      canRender3D: false,
      reason: 'WebGL is not supported on this device',
    });

    const { result } = renderHook(() => useARSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isSupported).toBe(false);
    expect(result.current.deviceSupport?.webgl).toBe(false);
    expect(result.current.message).toBe('WebGL is not supported on this device');
  });

  it('should provide device capabilities when supported', async () => {
    const mockCapabilities = {
      maxTextureSize: 8192,
      maxVertexAttributes: 32,
      maxFragmentUniforms: 512,
      renderer: 'Advanced GPU',
      vendor: 'GPU Vendor',
    };

    vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
      webgl: true,
      webgl2: true,
      canRender3D: true,
      capabilities: mockCapabilities,
    });

    const { result } = renderHook(() => useARSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.deviceSupport?.capabilities).toEqual(mockCapabilities);
  });

  it('should allow rechecking device support', async () => {
    const detectSpy = vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
      webgl: true,
      webgl2: true,
      canRender3D: true,
    });

    const { result } = renderHook(() => useARSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(detectSpy).toHaveBeenCalledTimes(1);

    // Recheck
    result.current.recheck();

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(detectSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle device with WebGL but no WebGL2', async () => {
    vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
      webgl: true,
      webgl2: false,
      canRender3D: true,
      capabilities: {
        maxTextureSize: 2048,
        maxVertexAttributes: 8,
        maxFragmentUniforms: 128,
        renderer: 'Basic GPU',
        vendor: 'GPU Vendor',
      },
    });

    const { result } = renderHook(() => useARSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isSupported).toBe(true);
    expect(result.current.deviceSupport?.webgl).toBe(true);
    expect(result.current.deviceSupport?.webgl2).toBe(false);
  });

  it('should provide default message when no reason is given', async () => {
    vi.spyOn(deviceDetection, 'detectDeviceSupport').mockReturnValue({
      webgl: false,
      webgl2: false,
      canRender3D: false,
    });

    const { result } = renderHook(() => useARSupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.message).toBe('Your device does not support 3D rendering');
  });
});
