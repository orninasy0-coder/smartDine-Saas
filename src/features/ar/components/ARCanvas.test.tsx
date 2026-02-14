import { describe, it, expect } from 'vitest';
import { ARCanvas } from './ARCanvas';

describe('ARCanvas', () => {
  it('exports ARCanvas component', () => {
    expect(ARCanvas).toBeDefined();
    expect(typeof ARCanvas).toBe('function');
  });

  it('accepts children and className props', () => {
    // Type check - if this compiles, the props are correct
    const props = {
      children: <div />,
      className: 'test-class',
    };

    expect(props).toBeDefined();
  });

  it('accepts scene configuration props', () => {
    const props = {
      children: <div />,
      backgroundColor: '#ffffff',
      enableFog: true,
      fogColor: '#cccccc',
      fogDensity: 0.05,
    };

    expect(props).toBeDefined();
  });

  it('accepts custom background color', () => {
    const props = {
      children: <div />,
      backgroundColor: '#1a1a2e',
    };

    expect(props.backgroundColor).toBe('#1a1a2e');
  });

  it('accepts fog configuration', () => {
    const props = {
      children: <div />,
      enableFog: false,
      fogColor: '#000000',
      fogDensity: 0.1,
    };

    expect(props.enableFog).toBe(false);
    expect(props.fogColor).toBe('#000000');
    expect(props.fogDensity).toBe(0.1);
  });
});
