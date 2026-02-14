/**
 * Funnel Analysis Tests
 */

import { describe, it, expect } from 'vitest';
import {
  analyzeFunnel,
  compareFunnels,
  calculateFunnelTiming,
  type FunnelStageData,
} from './funnelAnalysis';

describe('Funnel Analysis', () => {
  describe('analyzeFunnel', () => {
    it('should analyze funnel with multiple stages', () => {
      const stages: FunnelStageData[] = [
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 800 },
        { name: 'stage3', label: 'Stage 3', count: 600 },
        { name: 'stage4', label: 'Stage 4', count: 400 },
      ];

      const result = analyzeFunnel(stages);

      expect(result.totalUsers).toBe(1000);
      expect(result.overallConversionRate).toBe(40); // 400/1000 * 100
      expect(result.stages).toHaveLength(4);
      expect(result.dropOffPoints).toHaveLength(3);
    });

    it('should calculate correct drop-off rates', () => {
      const stages: FunnelStageData[] = [
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 500 }, // 50% drop-off
        { name: 'stage3', label: 'Stage 3', count: 250 }, // 50% drop-off
      ];

      const result = analyzeFunnel(stages);

      expect(result.stages[1].dropOffRate).toBe(50);
      expect(result.stages[2].dropOffRate).toBe(50);
    });

    it('should identify critical drop-offs', () => {
      const stages: FunnelStageData[] = [
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 300 }, // 70% drop-off (critical)
        { name: 'stage3', label: 'Stage 3', count: 200 },
      ];

      const result = analyzeFunnel(stages);

      expect(result.criticalDropOffs).toHaveLength(1);
      expect(result.criticalDropOffs[0].severity).toBe('critical');
      expect(result.criticalDropOffs[0].dropOffRate).toBe(70);
    });

    it('should handle empty funnel', () => {
      const result = analyzeFunnel([]);

      expect(result.totalUsers).toBe(0);
      expect(result.overallConversionRate).toBe(0);
      expect(result.stages).toHaveLength(0);
      expect(result.dropOffPoints).toHaveLength(0);
    });

    it('should calculate correct percentages', () => {
      const stages: FunnelStageData[] = [
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 750 },
        { name: 'stage3', label: 'Stage 3', count: 500 },
      ];

      const result = analyzeFunnel(stages);

      expect(result.stages[0].percentage).toBe(100);
      expect(result.stages[1].percentage).toBe(75);
      expect(result.stages[2].percentage).toBe(50);
    });

    it('should provide suggestions for drop-offs', () => {
      const stages: FunnelStageData[] = [
        { name: 'qr_scan', label: 'QR Scan', count: 1000 },
        { name: 'menu_view', label: 'Menu View', count: 400 }, // 60% drop-off
      ];

      const result = analyzeFunnel(stages);

      expect(result.dropOffPoints[0].suggestions.length).toBeGreaterThan(0);
      expect(result.dropOffPoints[0].suggestions.some((s) => s.includes('QR code'))).toBe(true);
    });
  });

  describe('compareFunnels', () => {
    it('should compare two funnels and identify improvements', () => {
      const current = analyzeFunnel([
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 800 },
        { name: 'stage3', label: 'Stage 3', count: 700 },
      ]);

      const previous = analyzeFunnel([
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 700 },
        { name: 'stage3', label: 'Stage 3', count: 500 },
      ]);

      const comparison = compareFunnels(current, previous);

      expect(comparison.conversionRateChange).toBeGreaterThan(0);
      expect(comparison.improvingStages.length).toBeGreaterThan(0);
    });

    it('should identify declining stages', () => {
      const current = analyzeFunnel([
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 500 },
      ]);

      const previous = analyzeFunnel([
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 800 },
      ]);

      const comparison = compareFunnels(current, previous);

      expect(comparison.decliningStages.length).toBeGreaterThan(0);
    });

    it('should identify new critical drop-offs', () => {
      const current = analyzeFunnel([
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 200 }, // New critical drop-off
      ]);

      const previous = analyzeFunnel([
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 800 }, // Was not critical
      ]);

      const comparison = compareFunnels(current, previous);

      expect(comparison.newCriticalDropOffs.length).toBeGreaterThan(0);
    });
  });

  describe('calculateFunnelTiming', () => {
    it('should calculate average time to complete', () => {
      const stages: FunnelStageData[] = [
        { name: 'stage1', label: 'Stage 1', count: 1000, timestamp: 0 },
        { name: 'stage2', label: 'Stage 2', count: 800, timestamp: 5000 },
        { name: 'stage3', label: 'Stage 3', count: 600, timestamp: 12000 },
      ];

      const result = calculateFunnelTiming(stages);

      expect(result.stageTimings).toHaveLength(2);
      expect(result.stageTimings[0].averageTime).toBe(5000);
      expect(result.stageTimings[1].averageTime).toBe(7000);
      expect(result.averageTimeToComplete).toBe(6000);
    });

    it('should handle stages without timestamps', () => {
      const stages: FunnelStageData[] = [
        { name: 'stage1', label: 'Stage 1', count: 1000 },
        { name: 'stage2', label: 'Stage 2', count: 800 },
      ];

      const result = calculateFunnelTiming(stages);

      expect(result.stageTimings).toHaveLength(0);
      expect(result.averageTimeToComplete).toBe(0);
    });
  });

  describe('Drop-off severity classification', () => {
    it('should classify drop-offs correctly', () => {
      const testCases = [
        { count1: 1000, count2: 100, expectedSeverity: 'critical' }, // 90% drop-off
        { count1: 1000, count2: 400, expectedSeverity: 'critical' }, // 60% drop-off
        { count1: 1000, count2: 600, expectedSeverity: 'high' }, // 40% drop-off
        { count1: 1000, count2: 800, expectedSeverity: 'medium' }, // 20% drop-off
        { count1: 1000, count2: 900, expectedSeverity: 'low' }, // 10% drop-off
      ];

      testCases.forEach(({ count1, count2, expectedSeverity }) => {
        const stages: FunnelStageData[] = [
          { name: 'stage1', label: 'Stage 1', count: count1 },
          { name: 'stage2', label: 'Stage 2', count: count2 },
        ];

        const result = analyzeFunnel(stages);
        expect(result.dropOffPoints[0].severity).toBe(expectedSeverity);
      });
    });
  });
});
