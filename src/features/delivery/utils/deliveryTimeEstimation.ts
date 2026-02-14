/**
 * Delivery Time Estimation Utilities
 * 
 * Provides functions to calculate estimated delivery times based on:
 * - Distance between locations (using Haversine formula)
 * - Average delivery speed in urban areas
 * - Traffic and preparation time factors
 */

/**
 * Configuration for delivery time estimation
 */
export const DELIVERY_CONFIG = {
  /** Average delivery speed in km/h (urban areas with traffic) */
  AVERAGE_SPEED_KMH: 30,
  
  /** Base preparation time in minutes (order handoff, vehicle prep) */
  BASE_PREPARATION_TIME_MINUTES: 5,
  
  /** Additional time per stop in minutes (parking, finding address, handoff) */
  TIME_PER_STOP_MINUTES: 3,
  
  /** Traffic factor multiplier (1.0 = no traffic, 1.5 = heavy traffic) */
  TRAFFIC_FACTOR: 1.2,
} as const;

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Delivery time estimation result
 */
export interface DeliveryTimeEstimate {
  /** Estimated delivery time in minutes */
  estimatedMinutes: number;
  
  /** Distance in kilometers */
  distanceKm: number;
  
  /** Travel time in minutes (without preparation/stop time) */
  travelTimeMinutes: number;
  
  /** Additional time for preparation and stops */
  additionalTimeMinutes: number;
}

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * 
 * The Haversine formula determines the great-circle distance between two points
 * on a sphere given their longitudes and latitudes.
 * 
 * @param lat1 - Latitude of first point in degrees
 * @param lon1 - Longitude of first point in degrees
 * @param lat2 - Latitude of second point in degrees
 * @param lon2 - Longitude of second point in degrees
 * @returns Distance in kilometers
 * 
 * @example
 * ```ts
 * const distance = calculateDistance(24.7136, 46.6753, 24.7243, 46.6512);
 * console.log(`Distance: ${distance.toFixed(2)} km`);
 * ```
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  
  // Convert degrees to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Calculate distance between two coordinate objects
 * 
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Distance in kilometers
 * 
 * @example
 * ```ts
 * const restaurant = { lat: 24.7136, lng: 46.6753 };
 * const customer = { lat: 24.7243, lng: 46.6512 };
 * const distance = calculateDistanceFromCoords(restaurant, customer);
 * ```
 */
export function calculateDistanceFromCoords(
  from: Coordinates,
  to: Coordinates
): number {
  return calculateDistance(from.lat, from.lng, to.lat, to.lng);
}

/**
 * Estimate travel time based on distance
 * 
 * Uses average urban delivery speed and traffic factor to calculate
 * realistic travel time.
 * 
 * @param distanceKm - Distance in kilometers
 * @param speedKmh - Average speed in km/h (defaults to DELIVERY_CONFIG.AVERAGE_SPEED_KMH)
 * @param trafficFactor - Traffic multiplier (defaults to DELIVERY_CONFIG.TRAFFIC_FACTOR)
 * @returns Estimated travel time in minutes
 * 
 * @example
 * ```ts
 * const time = estimateTravelTime(5.2); // 5.2 km
 * console.log(`Travel time: ${time.toFixed(0)} minutes`);
 * ```
 */
export function estimateTravelTime(
  distanceKm: number,
  speedKmh: number = DELIVERY_CONFIG.AVERAGE_SPEED_KMH,
  trafficFactor: number = DELIVERY_CONFIG.TRAFFIC_FACTOR
): number {
  const baseTimeMinutes = (distanceKm / speedKmh) * 60;
  return baseTimeMinutes * trafficFactor;
}

/**
 * Calculate comprehensive delivery time estimate
 * 
 * Includes:
 * - Travel time based on distance
 * - Base preparation time (order handoff, vehicle prep)
 * - Additional time per stop (parking, finding address)
 * - Traffic factor
 * 
 * @param from - Starting location (restaurant)
 * @param to - Delivery destination
 * @param options - Optional configuration overrides
 * @returns Detailed delivery time estimate
 * 
 * @example
 * ```ts
 * const restaurant = { lat: 24.7136, lng: 46.6753 };
 * const customer = { lat: 24.7243, lng: 46.6512 };
 * 
 * const estimate = calculateDeliveryTimeEstimate(restaurant, customer);
 * console.log(`Estimated delivery: ${estimate.estimatedMinutes} minutes`);
 * console.log(`Distance: ${estimate.distanceKm.toFixed(2)} km`);
 * ```
 */
export function calculateDeliveryTimeEstimate(
  from: Coordinates,
  to: Coordinates,
  options?: {
    speedKmh?: number;
    trafficFactor?: number;
    preparationTimeMinutes?: number;
    timePerStopMinutes?: number;
  }
): DeliveryTimeEstimate {
  const {
    speedKmh = DELIVERY_CONFIG.AVERAGE_SPEED_KMH,
    trafficFactor = DELIVERY_CONFIG.TRAFFIC_FACTOR,
    preparationTimeMinutes = DELIVERY_CONFIG.BASE_PREPARATION_TIME_MINUTES,
    timePerStopMinutes = DELIVERY_CONFIG.TIME_PER_STOP_MINUTES,
  } = options || {};

  // Calculate distance
  const distanceKm = calculateDistanceFromCoords(from, to);

  // Calculate travel time
  const travelTimeMinutes = estimateTravelTime(distanceKm, speedKmh, trafficFactor);

  // Calculate additional time (preparation + stop time)
  const additionalTimeMinutes = preparationTimeMinutes + timePerStopMinutes;

  // Total estimated time
  const estimatedMinutes = Math.ceil(travelTimeMinutes + additionalTimeMinutes);

  return {
    estimatedMinutes,
    distanceKm,
    travelTimeMinutes,
    additionalTimeMinutes,
  };
}

/**
 * Calculate delivery time estimate from coordinates arrays
 * 
 * Convenience function for working with [lat, lng] arrays
 * 
 * @param from - Starting location as [latitude, longitude]
 * @param to - Destination as [latitude, longitude]
 * @param options - Optional configuration overrides
 * @returns Detailed delivery time estimate
 * 
 * @example
 * ```ts
 * const estimate = calculateDeliveryTimeFromArray(
 *   [24.7136, 46.6753],
 *   [24.7243, 46.6512]
 * );
 * ```
 */
export function calculateDeliveryTimeFromArray(
  from: [number, number],
  to: [number, number],
  options?: Parameters<typeof calculateDeliveryTimeEstimate>[2]
): DeliveryTimeEstimate {
  return calculateDeliveryTimeEstimate(
    { lat: from[0], lng: from[1] },
    { lat: to[0], lng: to[1] },
    options
  );
}

/**
 * Format estimated time for display
 * 
 * @param minutes - Time in minutes
 * @returns Formatted string (e.g., "25-30 min" or "1-1.5 hours")
 * 
 * @example
 * ```ts
 * formatEstimatedTime(28); // "25-30 min"
 * formatEstimatedTime(75); // "1-1.5 hours"
 * ```
 */
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) {
    // Round to nearest 5 minutes and provide range
    const lower = Math.floor(minutes / 5) * 5;
    const upper = lower + 5;
    return `${lower}-${upper} min`;
  } else {
    // For longer times, show hours
    const hours = minutes / 60;
    const lowerHours = Math.floor(hours * 2) / 2; // Round to nearest 0.5
    const upperHours = lowerHours + 0.5;
    return `${lowerHours}-${upperHours} hours`;
  }
}

/**
 * Calculate estimated time for multiple deliveries (route)
 * 
 * Calculates total time for a delivery route with multiple stops
 * 
 * @param restaurantLocation - Starting location
 * @param deliveryLocations - Array of delivery destinations in order
 * @param options - Optional configuration overrides
 * @returns Total estimated time and distance for the route
 * 
 * @example
 * ```ts
 * const restaurant = { lat: 24.7136, lng: 46.6753 };
 * const deliveries = [
 *   { lat: 24.7243, lng: 46.6512 },
 *   { lat: 24.7156, lng: 46.6423 },
 * ];
 * 
 * const routeEstimate = calculateRouteTimeEstimate(restaurant, deliveries);
 * console.log(`Total time: ${routeEstimate.totalMinutes} minutes`);
 * console.log(`Total distance: ${routeEstimate.totalDistanceKm.toFixed(2)} km`);
 * ```
 */
export function calculateRouteTimeEstimate(
  restaurantLocation: Coordinates,
  deliveryLocations: Coordinates[],
  options?: Parameters<typeof calculateDeliveryTimeEstimate>[2]
): {
  totalMinutes: number;
  totalDistanceKm: number;
  segments: DeliveryTimeEstimate[];
} {
  if (deliveryLocations.length === 0) {
    return {
      totalMinutes: 0,
      totalDistanceKm: 0,
      segments: [],
    };
  }

  const segments: DeliveryTimeEstimate[] = [];
  let totalMinutes = 0;
  let totalDistanceKm = 0;
  let currentLocation = restaurantLocation;

  // Calculate each segment
  for (const destination of deliveryLocations) {
    const estimate = calculateDeliveryTimeEstimate(
      currentLocation,
      destination,
      options
    );

    segments.push(estimate);
    totalMinutes += estimate.estimatedMinutes;
    totalDistanceKm += estimate.distanceKm;
    currentLocation = destination;
  }

  return {
    totalMinutes,
    totalDistanceKm,
    segments,
  };
}
