import { describe, it, expect, vi } from 'vitest';
import { useLODLevels, LODPresets } from './ModelLOD';

// Note: Full component rendering tests are skipped due to ResizeObserver requirements
// These tests focus on the utility functions and presets

describe('useLODLevels', () => {
  it('generates correct number of LOD levels', () => {
    const baseUrl = '/models/dish.glb';
    const levels = useLODLevels(baseUrl, { levels: 3 });

    expect(levels).toHaveLength(3);
  });

  it('generates correct model URLs', () => {
    const baseUrl = '/models/dish.glb';
    const levels = useLODLevels(baseUrl, { levels: 3 });

    expect(levels[0].modelUrl).toBe('/models/dish_lod0.glb');
    expect(levels[1].modelUrl).toBe('/models/dish_lod1.glb');
    expect(levels[2].modelUrl).toBe('/models/dish_lod2.glb');
  });

  it('generates correct distances with multiplier', () => {
    const baseUrl = '/models/dish.glb';
    const levels = useLODLevels(baseUrl, {
      levels: 3,
      baseDistance: 5,
      distanceMultiplier: 2,
    });

    expect(levels[0].distance).toBe(5);
    expect(levels[1].distance).toBe(10);
    expect(levels[2].distance).toBe(20);
  });

  it('uses default options when not provided', () => {
    const baseUrl = '/models/dish.glb';
    const levels = useLODLevels(baseUrl);

    expect(levels).toHaveLength(3); // Default levels
    expect(levels[0].distance).toBe(5); // Default base distance
  });

  it('handles gltf extension', () => {
    const baseUrl = '/models/dish.gltf';
    const levels = useLODLevels(baseUrl, { levels: 2 });

    expect(levels[0].modelUrl).toBe('/models/dish_lod0.gltf');
    expect(levels[1].modelUrl).toBe('/models/dish_lod1.gltf');
  });
});

describe('LODPresets', () => {
  it('has high preset', () => {
    expect(LODPresets.high).toBeDefined();
    expect(LODPresets.high.levels).toBe(3);
    expect(LODPresets.high.distanceMultiplier).toBe(1.5);
  });

  it('has medium preset', () => {
    expect(LODPresets.medium).toBeDefined();
    expect(LODPresets.medium.levels).toBe(3);
    expect(LODPresets.medium.distanceMultiplier).toBe(2);
  });

  it('has low preset', () => {
    expect(LODPresets.low).toBeDefined();
    expect(LODPresets.low.levels).toBe(2);
    expect(LODPresets.low.distanceMultiplier).toBe(3);
  });

  it('has mobile preset', () => {
    expect(LODPresets.mobile).toBeDefined();
    expect(LODPresets.mobile.levels).toBe(2);
    expect(LODPresets.mobile.distanceMultiplier).toBe(2.5);
  });
});
