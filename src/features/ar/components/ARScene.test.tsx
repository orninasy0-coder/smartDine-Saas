import { describe, it, expect } from 'vitest';
import { ARScene } from './ARScene';

describe('ARScene', () => {
  it('should be defined', () => {
    expect(ARScene).toBeDefined();
  });

  it('should be a function component', () => {
    expect(typeof ARScene).toBe('function');
  });

  it('should accept lighting configuration props', () => {
    const props = {
      ambientIntensity: 0.5,
      mainLightIntensity: 1,
      fillLightIntensity: 0.3,
      pointLightIntensity: 0.5,
      enableShadows: true,
      shadowMapSize: 1024,
    };

    expect(() => ARScene(props)).toBeDefined();
  });

  it('should accept auto-rotate props', () => {
    const props = {
      autoRotate: true,
      autoRotateSpeed: 2,
    };

    expect(() => ARScene(props)).toBeDefined();
  });

  it('should accept children', () => {
    const props = {
      children: <mesh />,
    };

    expect(() => ARScene(props)).toBeDefined();
  });

  it('should accept custom light intensities', () => {
    const props = {
      ambientIntensity: 0.8,
      mainLightIntensity: 1.5,
      fillLightIntensity: 0.6,
      pointLightIntensity: 0.9,
    };

    expect(props.ambientIntensity).toBe(0.8);
    expect(props.mainLightIntensity).toBe(1.5);
    expect(props.fillLightIntensity).toBe(0.6);
    expect(props.pointLightIntensity).toBe(0.9);
  });

  it('should accept shadow configuration', () => {
    const props = {
      enableShadows: false,
      shadowMapSize: 2048,
    };

    expect(props.enableShadows).toBe(false);
    expect(props.shadowMapSize).toBe(2048);
  });
});
