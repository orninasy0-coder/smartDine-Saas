/**
 * Tests for Delivery Time Estimation Utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculateDistanceFromCoords,
  estimateTravelTime,
  calculateDeliveryTimeEstimate,
  calculateDeliveryTimeFromArray,
  formatEstimatedTime,
  calculateRouteTimeEstimate,
  DELIVERY_CONFIG,
} from './deliveryTimeEstimation';

describe('deliveryTimeEstimation', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // Riyadh coordinates (approximately 2.5 km apart)
      const distance = calculateDistance(24.7136, 46.6753, 24.7243, 46.6512);
      
      expect(distance).toBeGreaterThan(2);
      expect(distance).toBeLessThan(3);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(24.7136, 46.6753, 24.7136, 46.6753);
      
      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      // Test with coordinates in different hemispheres
      const distance = calculateDistance(-33.8688, 151.2093, 51.5074, -0.1278);
      
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('calculateDistanceFromCoords', () => {
    it('should calculate distance from coordinate objects', () => {
      const from = { lat: 24.7136, lng: 46.6753 };
      const to = { lat: 24.7243, lng: 46.6512 };
      
      const distance = calculateDistanceFromCoords(from, to);
      
      expect(distance).toBeGreaterThan(2);
      expect(distance).toBeLessThan(3);
    });
  });

  describe('estimateTravelTime', () => {
    it('should estimate travel time based on distance', () => {
      const distanceKm = 5;
      const time = estimateTravelTime(distanceKm);
      
      // At 30 km/h with 1.2 traffic factor: (5/30)*60*1.2 = 12 minutes
      expect(time).toBeCloseTo(12, 0);
    });

    it('should use custom speed and traffic factor', () => {
      const distanceKm = 10;
      const speedKmh = 40;
      const trafficFactor = 1.0;
      
      const time = estimateTravelTime(distanceKm, speedKmh, trafficFactor);
      
      // (10/40)*60*1.0 = 15 minutes
      expect(time).toBeCloseTo(15, 0);
    });

    it('should return 0 for 0 distance', () => {
      const time = estimateTravelTime(0);
      
      expect(time).toBe(0);
    });
  });

  describe('calculateDeliveryTimeEstimate', () => {
    it('should calculate comprehensive delivery estimate', () => {
      const from = { lat: 24.7136, lng: 46.6753 };
      const to = { lat: 24.7243, lng: 46.6512 };
      
      const estimate = calculateDeliveryTimeEstimate(from, to);
      
      expect(estimate.distanceKm).toBeGreaterThan(0);
      expect(estimate.travelTimeMinutes).toBeGreaterThan(0);
      expect(estimate.additionalTimeMinutes).toBe(
        DELIVERY_CONFIG.BASE_PREPARATION_TIME_MINUTES +
        DELIVERY_CONFIG.TIME_PER_STOP_MINUTES
      );
      expect(estimate.estimatedMinutes).toBeGreaterThan(
        estimate.travelTimeMinutes
      );
    });

    it('should include preparation and stop time', () => {
      const from = { lat: 24.7136, lng: 46.6753 };
      const to = { lat: 24.7136, lng: 46.6753 }; // Same location
      
      const estimate = calculateDeliveryTimeEstimate(from, to);
      
      // Even with 0 distance, should have preparation + stop time
      expect(estimate.estimatedMinutes).toBeGreaterThanOrEqual(
        DELIVERY_CONFIG.BASE_PREPARATION_TIME_MINUTES +
        DELIVERY_CONFIG.TIME_PER_STOP_MINUTES
      );
    });

    it('should accept custom options', () => {
      const from = { lat: 24.7136, lng: 46.6753 };
      const to = { lat: 24.7243, lng: 46.6512 };
      
      const estimate = calculateDeliveryTimeEstimate(from, to, {
        speedKmh: 40,
        trafficFactor: 1.0,
        preparationTimeMinutes: 10,
        timePerStopMinutes: 5,
      });
      
      expect(estimate.additionalTimeMinutes).toBe(15); // 10 + 5
    });

    it('should round up estimated minutes', () => {
      const from = { lat: 24.7136, lng: 46.6753 };
      const to = { lat: 24.7243, lng: 46.6512 };
      
      const estimate = calculateDeliveryTimeEstimate(from, to);
      
      // Should be a whole number (rounded up)
      expect(estimate.estimatedMinutes).toBe(
        Math.ceil(estimate.estimatedMinutes)
      );
    });
  });

  describe('calculateDeliveryTimeFromArray', () => {
    it('should calculate from coordinate arrays', () => {
      const from: [number, number] = [24.7136, 46.6753];
      const to: [number, number] = [24.7243, 46.6512];
      
      const estimate = calculateDeliveryTimeFromArray(from, to);
      
      expect(estimate.distanceKm).toBeGreaterThan(0);
      expect(estimate.estimatedMinutes).toBeGreaterThan(0);
    });
  });

  describe('formatEstimatedTime', () => {
    it('should format short times in minutes', () => {
      expect(formatEstimatedTime(12)).toBe('10-15 min');
      expect(formatEstimatedTime(28)).toBe('25-30 min');
      expect(formatEstimatedTime(43)).toBe('40-45 min');
    });

    it('should format long times in hours', () => {
      expect(formatEstimatedTime(75)).toBe('1-1.5 hours');
      expect(formatEstimatedTime(90)).toBe('1.5-2 hours');
      expect(formatEstimatedTime(120)).toBe('2-2.5 hours');
    });

    it('should handle edge cases', () => {
      expect(formatEstimatedTime(0)).toBe('0-5 min');
      expect(formatEstimatedTime(59)).toBe('55-60 min');
      expect(formatEstimatedTime(60)).toBe('1-1.5 hours');
    });
  });

  describe('calculateRouteTimeEstimate', () => {
    it('should calculate total time for multiple deliveries', () => {
      const restaurant = { lat: 24.7136, lng: 46.6753 };
      const deliveries = [
        { lat: 24.7243, lng: 46.6512 },
        { lat: 24.7156, lng: 46.6423 },
      ];
      
      const routeEstimate = calculateRouteTimeEstimate(restaurant, deliveries);
      
      expect(routeEstimate.segments).toHaveLength(2);
      expect(routeEstimate.totalMinutes).toBeGreaterThan(0);
      expect(routeEstimate.totalDistanceKm).toBeGreaterThan(0);
    });

    it('should return zero for empty delivery list', () => {
      const restaurant = { lat: 24.7136, lng: 46.6753 };
      const deliveries: Array<{ lat: number; lng: number }> = [];
      
      const routeEstimate = calculateRouteTimeEstimate(restaurant, deliveries);
      
      expect(routeEstimate.segments).toHaveLength(0);
      expect(routeEstimate.totalMinutes).toBe(0);
      expect(routeEstimate.totalDistanceKm).toBe(0);
    });

    it('should calculate cumulative distance correctly', () => {
      const restaurant = { lat: 24.7136, lng: 46.6753 };
      const deliveries = [
        { lat: 24.7243, lng: 46.6512 },
        { lat: 24.7156, lng: 46.6423 },
      ];
      
      const routeEstimate = calculateRouteTimeEstimate(restaurant, deliveries);
      
      // Total distance should be sum of all segments
      const sumOfSegments = routeEstimate.segments.reduce(
        (sum, segment) => sum + segment.distanceKm,
        0
      );
      
      expect(routeEstimate.totalDistanceKm).toBeCloseTo(sumOfSegments, 5);
    });

    it('should use each delivery as starting point for next segment', () => {
      const restaurant = { lat: 24.7136, lng: 46.6753 };
      const deliveries = [
        { lat: 24.7243, lng: 46.6512 },
        { lat: 24.7156, lng: 46.6423 },
      ];
      
      const routeEstimate = calculateRouteTimeEstimate(restaurant, deliveries);
      
      // First segment: restaurant to first delivery
      const firstSegmentDistance = calculateDistanceFromCoords(
        restaurant,
        deliveries[0]
      );
      expect(routeEstimate.segments[0].distanceKm).toBeCloseTo(
        firstSegmentDistance,
        5
      );
      
      // Second segment: first delivery to second delivery
      const secondSegmentDistance = calculateDistanceFromCoords(
        deliveries[0],
        deliveries[1]
      );
      expect(routeEstimate.segments[1].distanceKm).toBeCloseTo(
        secondSegmentDistance,
        5
      );
    });
  });

  describe('DELIVERY_CONFIG', () => {
    it('should have reasonable default values', () => {
      expect(DELIVERY_CONFIG.AVERAGE_SPEED_KMH).toBeGreaterThan(0);
      expect(DELIVERY_CONFIG.BASE_PREPARATION_TIME_MINUTES).toBeGreaterThan(0);
      expect(DELIVERY_CONFIG.TIME_PER_STOP_MINUTES).toBeGreaterThan(0);
      expect(DELIVERY_CONFIG.TRAFFIC_FACTOR).toBeGreaterThanOrEqual(1.0);
    });
  });
});
