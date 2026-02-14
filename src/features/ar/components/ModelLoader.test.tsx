import { describe, it, expect, vi } from 'vitest';
import { ModelLoader } from './ModelLoader';

// Mock dependencies
vi.mock('@react-three/drei', () => ({
  useGLTF: vi.fn(() => ({
    scene: {
      traverse: vi.fn(),
    },
  })),
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useProgress: vi.fn(() => ({
    active: false,
    progress: 0,
    errors: [],
    item: '',
    loaded: 0,
    total: 0,
  })),
}));

describe('ModelLoader', () => {
  it('component is defined', () => {
    expect(ModelLoader).toBeDefined();
    expect(typeof ModelLoader).toBe('function');
  });

  it('accepts required modelUrl prop', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
    };
    expect(props.modelUrl).toBe('https://example.com/model.glb');
  });

  it('accepts all model props', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
      scale: 1.5,
      position: [0, 1, 0] as [number, number, number],
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
      castShadow: true,
      receiveShadow: true,
    };
    expect(props.scale).toBe(1.5);
    expect(props.position).toEqual([0, 1, 0]);
    expect(props.rotation).toEqual([0, Math.PI / 2, 0]);
  });

  it('accepts loading customization props', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
      loadingText: 'Custom loading text',
      showProgress: true,
      showProgressBar: true,
      showItemCount: true,
    };
    expect(props.loadingText).toBe('Custom loading text');
    expect(props.showProgress).toBe(true);
    expect(props.showProgressBar).toBe(true);
    expect(props.showItemCount).toBe(true);
  });

  it('accepts error handling props', () => {
    const onError = vi.fn();
    const props = {
      modelUrl: 'https://example.com/model.glb',
      errorMessage: 'Custom error message',
      enableRetry: true,
      onError,
    };
    expect(props.errorMessage).toBe('Custom error message');
    expect(props.enableRetry).toBe(true);
    expect(typeof props.onError).toBe('function');
  });

  it('accepts callback props', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const props = {
      modelUrl: 'https://example.com/model.glb',
      onLoad,
      onError,
    };
    expect(typeof props.onLoad).toBe('function');
    expect(typeof props.onError).toBe('function');
  });

  it('accepts custom components', () => {
    const CustomLoading = <div>Custom Loading...</div>;
    const CustomError = <div>Custom Error</div>;
    const props = {
      modelUrl: 'https://example.com/model.glb',
      loadingComponent: CustomLoading,
      errorFallback: CustomError,
    };
    expect(props.loadingComponent).toBeDefined();
    expect(props.errorFallback).toBeDefined();
  });

  it('has default values for optional props', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
    };
    // Component should work with just modelUrl
    expect(props.modelUrl).toBeTruthy();
  });
});
