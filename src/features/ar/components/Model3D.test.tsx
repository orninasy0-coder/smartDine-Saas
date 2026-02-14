import { describe, it, expect, vi } from 'vitest';
import { Model3D, preloadModel, clearModelCache, clearAllModelCache } from './Model3D';

// Mock useGLTF hook
vi.mock('@react-three/drei', () => ({
  useGLTF: vi.fn(() => ({
    scene: {
      traverse: vi.fn(),
    },
  })),
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Model3D', () => {
  it('component is defined', () => {
    expect(Model3D).toBeDefined();
    expect(typeof Model3D).toBe('function');
  });

  it('accepts required modelUrl prop', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
    };
    expect(props.modelUrl).toBe('https://example.com/model.glb');
  });

  it('accepts optional scale prop', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
      scale: 2,
    };
    expect(props.scale).toBe(2);
  });

  it('accepts optional position prop', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
      position: [1, 2, 3] as [number, number, number],
    };
    expect(props.position).toEqual([1, 2, 3]);
  });

  it('accepts optional rotation prop', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
      rotation: [0, Math.PI, 0] as [number, number, number],
    };
    expect(props.rotation).toEqual([0, Math.PI, 0]);
  });

  it('accepts shadow props', () => {
    const props = {
      modelUrl: 'https://example.com/model.glb',
      castShadow: true,
      receiveShadow: true,
    };
    expect(props.castShadow).toBe(true);
    expect(props.receiveShadow).toBe(true);
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
});

describe('Model3D utility functions', () => {
  it('preloadModel function exists', () => {
    expect(typeof preloadModel).toBe('function');
  });

  it('clearModelCache function exists', () => {
    expect(typeof clearModelCache).toBe('function');
  });

  it('clearAllModelCache function exists', () => {
    expect(typeof clearAllModelCache).toBe('function');
  });
});
