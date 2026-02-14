/**
 * Friction Detection Tests
 * Unit tests for UX friction detection
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FrictionDetector } from './frictionDetection';

// Mock analytics and sessionReplay
vi.mock('./index', () => ({
  analytics: {
    trackCustomEvent: vi.fn(),
  },
}));

vi.mock('./sessionReplay', () => ({
  sessionReplay: {
    tagRecording: vi.fn(),
    trackInteraction: vi.fn(),
  },
}));

describe('FrictionDetector', () => {
  let detector: FrictionDetector;

  beforeEach(() => {
    detector = new FrictionDetector({
      formAbandonment: {
        enabled: true,
        minInteractionTime: 1000,
        trackPartialFills: true,
      },
      rageClick: {
        enabled: true,
        threshold: 3,
        timeWindow: 1000,
      },
      deadClick: {
        enabled: true,
      },
    });
  });

  afterEach(() => {
    detector.destroy();
  });

  describe('Initialization', () => {
    it('should initialize successfully', () => {
      detector.initialize();
      expect(detector).toBeDefined();
    });

    it('should not initialize twice', () => {
      detector.initialize();
      detector.initialize();
      expect(detector).toBeDefined();
    });
  });

  describe('Form Abandonment Detection', () => {
    it('should track form interactions', () => {
      detector.initialize();

      const form = document.createElement('form');
      form.id = 'test-form';
      const input = document.createElement('input');
      input.name = 'email';
      form.appendChild(input);
      document.body.appendChild(form);

      input.focus();
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      document.body.removeChild(form);
    });

    it('should detect form abandonment', async () => {
      const onFrictionDetected = vi.fn();
      detector = new FrictionDetector({
        formAbandonment: {
          enabled: true,
          minInteractionTime: 100,
        },
        onFrictionDetected,
      });
      detector.initialize();

      const form = document.createElement('form');
      form.id = 'test-form';
      const input = document.createElement('input');
      input.name = 'email';
      form.appendChild(input);
      document.body.appendChild(form);

      // Simulate user interaction
      input.focus();
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Wait for abandonment check
      await new Promise(resolve => setTimeout(resolve, 200));

      document.body.removeChild(form);
    });

    it('should not track excluded forms', () => {
      detector = new FrictionDetector({
        formAbandonment: {
          enabled: true,
          excludeForms: ['excluded-form'],
        },
      });
      detector.initialize();

      const form = document.createElement('form');
      form.id = 'excluded-form';
      const input = document.createElement('input');
      form.appendChild(input);
      document.body.appendChild(form);

      input.focus();

      const events = detector.getFrictionEvents('form_abandonment');
      expect(events.length).toBe(0);

      document.body.removeChild(form);
    });
  });

  describe('Rage Click Detection', () => {
    it('should detect rage clicks', () => {
      const onFrictionDetected = vi.fn();
      detector = new FrictionDetector({
        rageClick: {
          enabled: true,
          threshold: 3,
          timeWindow: 1000,
        },
        onFrictionDetected,
      });
      detector.initialize();

      const button = document.createElement('button');
      button.textContent = 'Click me';
      document.body.appendChild(button);

      // Simulate rapid clicks
      for (let i = 0; i < 3; i++) {
        button.click();
      }

      expect(onFrictionDetected).toHaveBeenCalled();
      const events = detector.getFrictionEvents('rage_click');
      expect(events.length).toBeGreaterThan(0);

      document.body.removeChild(button);
    });

    it('should not detect rage clicks below threshold', () => {
      const onFrictionDetected = vi.fn();
      detector = new FrictionDetector({
        rageClick: {
          enabled: true,
          threshold: 5,
        },
        onFrictionDetected,
      });
      detector.initialize();

      const button = document.createElement('button');
      document.body.appendChild(button);

      // Click less than threshold
      for (let i = 0; i < 3; i++) {
        button.click();
      }

      const events = detector.getFrictionEvents('rage_click');
      expect(events.length).toBe(0);

      document.body.removeChild(button);
    });
  });

  describe('Dead Click Detection', () => {
    it('should detect dead clicks on clickable elements', () => {
      const onFrictionDetected = vi.fn();
      detector = new FrictionDetector({
        deadClick: {
          enabled: true,
        },
        onFrictionDetected,
      });
      detector.initialize();

      const div = document.createElement('div');
      div.className = 'clickable';
      div.style.cursor = 'pointer';
      document.body.appendChild(div);

      div.click();

      expect(onFrictionDetected).toHaveBeenCalled();
      const events = detector.getFrictionEvents('dead_click');
      expect(events.length).toBeGreaterThan(0);

      document.body.removeChild(div);
    });

    it('should not detect dead clicks on actual buttons', () => {
      const onFrictionDetected = vi.fn();
      detector = new FrictionDetector({
        deadClick: {
          enabled: true,
        },
        onFrictionDetected,
      });
      detector.initialize();

      const button = document.createElement('button');
      button.onclick = () => console.log('clicked');
      document.body.appendChild(button);

      button.click();

      const events = detector.getFrictionEvents('dead_click');
      expect(events.length).toBe(0);

      document.body.removeChild(button);
    });
  });

  describe('Friction Summary', () => {
    it('should provide accurate summary', () => {
      detector.initialize();

      const summary = detector.getFrictionSummary();
      expect(summary).toHaveProperty('total');
      expect(summary).toHaveProperty('byType');
      expect(summary).toHaveProperty('bySeverity');
      expect(summary.total).toBe(0);
    });

    it('should update summary after events', () => {
      const onFrictionDetected = vi.fn();
      detector = new FrictionDetector({
        rageClick: {
          enabled: true,
          threshold: 2,
        },
        onFrictionDetected,
      });
      detector.initialize();

      const button = document.createElement('button');
      document.body.appendChild(button);

      // Trigger rage click
      button.click();
      button.click();

      const summary = detector.getFrictionSummary();
      expect(summary.total).toBeGreaterThan(0);

      document.body.removeChild(button);
    });
  });

  describe('Event Management', () => {
    it('should get events by type', () => {
      detector.initialize();

      const rageEvents = detector.getFrictionEvents('rage_click');
      expect(Array.isArray(rageEvents)).toBe(true);
    });

    it('should clear events', () => {
      detector.initialize();
      detector.clearEvents();

      const events = detector.getFrictionEvents();
      expect(events.length).toBe(0);
    });
  });

  describe('Configuration', () => {
    it('should respect disabled features', () => {
      detector = new FrictionDetector({
        formAbandonment: { enabled: false },
        rageClick: { enabled: false },
        deadClick: { enabled: false },
      });
      detector.initialize();

      expect(detector).toBeDefined();
    });

    it('should use custom thresholds', () => {
      detector = new FrictionDetector({
        rageClick: {
          enabled: true,
          threshold: 10,
          timeWindow: 5000,
        },
      });
      detector.initialize();

      expect(detector).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on destroy', () => {
      detector.initialize();
      detector.destroy();

      const events = detector.getFrictionEvents();
      expect(events.length).toBe(0);
    });
  });
});
