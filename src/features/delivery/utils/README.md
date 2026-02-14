# Delivery Time Estimation Utilities

This module provides comprehensive utilities for calculating estimated delivery times based on geographic distance, traffic conditions, and operational factors.

## Features

- **Distance Calculation**: Uses the Haversine formula for accurate great-circle distance between coordinates
- **Time Estimation**: Calculates realistic delivery times considering:
  - Average urban delivery speed (30 km/h)
  - Traffic factor (1.2x multiplier)
  - Base preparation time (5 minutes)
  - Time per stop (3 minutes)
- **Route Optimization**: Calculate total time for multi-stop delivery routes
- **Flexible Configuration**: Override default settings per calculation
- **Type-Safe**: Full TypeScript support with comprehensive types

## Installation

The utilities are part of the delivery feature and can be imported from:

```typescript
import {
  calculateDeliveryTimeEstimate,
  calculateRouteTimeEstimate,
  formatEstimatedTime,
  DELIVERY_CONFIG,
} from '@/features/delivery';
```

## Basic Usage

### Single Delivery Estimation

```typescript
import { calculateDeliveryTimeEstimate } from '@/features/delivery';

const restaurant = { lat: 24.7136, lng: 46.6753 };
const customer = { lat: 24.7243, lng: 46.6512 };

const estimate = calculateDeliveryTimeEstimate(restaurant, customer);

console.log(`Distance: ${estimate.distanceKm.toFixed(2)} km`);
console.log(`Travel time: ${estimate.travelTimeMinutes.toFixed(0)} minutes`);
console.log(`Total estimated time: ${estimate.estimatedMinutes} minutes`);
```

### Multiple Deliveries Route

```typescript
import { calculateRouteTimeEstimate } from '@/features/delivery';

const restaurant = { lat: 24.7136, lng: 46.6753 };
const deliveries = [
  { lat: 24.7243, lng: 46.6512 },
  { lat: 24.7156, lng: 46.6423 },
  { lat: 24.7089, lng: 46.6598 },
];

const route = calculateRouteTimeEstimate(restaurant, deliveries);

console.log(`Total distance: ${route.totalDistanceKm.toFixed(2)} km`);
console.log(`Total time: ${route.totalMinutes} minutes`);
console.log(`Number of stops: ${route.segments.length}`);
```

### Format for Display

```typescript
import { formatEstimatedTime } from '@/features/delivery';

const minutes = 28;
console.log(formatEstimatedTime(minutes)); // "25-30 min"

const longTime = 75;
console.log(formatEstimatedTime(longTime)); // "1-1.5 hours"
```

## Advanced Usage

### Custom Configuration

Override default settings for specific calculations:

```typescript
const estimate = calculateDeliveryTimeEstimate(restaurant, customer, {
  speedKmh: 40, // Faster delivery (highway)
  trafficFactor: 1.0, // No traffic
  preparationTimeMinutes: 3, // Quick handoff
  timePerStopMinutes: 2, // Efficient delivery
});
```

### Working with Arrays

If you have coordinates as arrays instead of objects:

```typescript
import { calculateDeliveryTimeFromArray } from '@/features/delivery';

const estimate = calculateDeliveryTimeFromArray(
  [24.7136, 46.6753], // [lat, lng]
  [24.7243, 46.6512]
);
```

### Distance Only

If you only need distance without time estimation:

```typescript
import { calculateDistance, calculateDistanceFromCoords } from '@/features/delivery';

// Using raw coordinates
const distance1 = calculateDistance(24.7136, 46.6753, 24.7243, 46.6512);

// Using coordinate objects
const distance2 = calculateDistanceFromCoords(
  { lat: 24.7136, lng: 46.6753 },
  { lat: 24.7243, lng: 46.6512 }
);
```

## API Reference

### Types

#### `Coordinates`
```typescript
interface Coordinates {
  lat: number;  // Latitude in degrees
  lng: number;  // Longitude in degrees
}
```

#### `DeliveryTimeEstimate`
```typescript
interface DeliveryTimeEstimate {
  estimatedMinutes: number;        // Total estimated time (rounded up)
  distanceKm: number;              // Distance in kilometers
  travelTimeMinutes: number;       // Travel time only
  additionalTimeMinutes: number;   // Prep + stop time
}
```

### Functions

#### `calculateDistance(lat1, lon1, lat2, lon2): number`
Calculate distance between two points using Haversine formula.

**Parameters:**
- `lat1`, `lon1`: First point coordinates in degrees
- `lat2`, `lon2`: Second point coordinates in degrees

**Returns:** Distance in kilometers

#### `calculateDistanceFromCoords(from, to): number`
Calculate distance between two coordinate objects.

**Parameters:**
- `from`: Starting coordinates
- `to`: Destination coordinates

**Returns:** Distance in kilometers

#### `estimateTravelTime(distanceKm, speedKmh?, trafficFactor?): number`
Estimate travel time based on distance.

**Parameters:**
- `distanceKm`: Distance in kilometers
- `speedKmh`: Average speed (default: 30 km/h)
- `trafficFactor`: Traffic multiplier (default: 1.2)

**Returns:** Travel time in minutes

#### `calculateDeliveryTimeEstimate(from, to, options?): DeliveryTimeEstimate`
Calculate comprehensive delivery time estimate.

**Parameters:**
- `from`: Starting location
- `to`: Delivery destination
- `options`: Optional configuration overrides
  - `speedKmh`: Average speed
  - `trafficFactor`: Traffic multiplier
  - `preparationTimeMinutes`: Base prep time
  - `timePerStopMinutes`: Time per stop

**Returns:** Detailed delivery time estimate

#### `calculateDeliveryTimeFromArray(from, to, options?): DeliveryTimeEstimate`
Calculate delivery time from coordinate arrays.

**Parameters:**
- `from`: Starting location as `[lat, lng]`
- `to`: Destination as `[lat, lng]`
- `options`: Optional configuration overrides

**Returns:** Detailed delivery time estimate

#### `formatEstimatedTime(minutes): string`
Format estimated time for display.

**Parameters:**
- `minutes`: Time in minutes

**Returns:** Formatted string (e.g., "25-30 min" or "1-1.5 hours")

#### `calculateRouteTimeEstimate(restaurantLocation, deliveryLocations, options?)`
Calculate total time for multi-stop delivery route.

**Parameters:**
- `restaurantLocation`: Starting location
- `deliveryLocations`: Array of delivery destinations in order
- `options`: Optional configuration overrides

**Returns:** Object with:
- `totalMinutes`: Total estimated time
- `totalDistanceKm`: Total distance
- `segments`: Array of estimates for each segment

### Configuration

#### `DELIVERY_CONFIG`
Default configuration constants:

```typescript
{
  AVERAGE_SPEED_KMH: 30,                    // Urban delivery speed
  BASE_PREPARATION_TIME_MINUTES: 5,        // Order handoff time
  TIME_PER_STOP_MINUTES: 3,                // Parking + delivery time
  TRAFFIC_FACTOR: 1.2,                     // Traffic multiplier
}
```

## Implementation Details

### Distance Calculation

Uses the **Haversine formula** to calculate the great-circle distance between two points on a sphere:

```
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c
```

Where:
- φ is latitude
- λ is longitude
- R is Earth's radius (6,371 km)

### Time Estimation Formula

```
Total Time = (Distance / Speed × Traffic Factor) + Preparation Time + Stop Time
```

Example for 5 km delivery:
- Travel time: (5 km / 30 km/h) × 60 min × 1.2 = 12 minutes
- Preparation: 5 minutes
- Stop time: 3 minutes
- **Total: 20 minutes**

### Rounding Strategy

All estimated times are rounded **up** to the nearest minute to ensure realistic expectations and avoid under-promising.

## Testing

Comprehensive test suite included:

```bash
npm test -- src/features/delivery/utils/deliveryTimeEstimation.test.ts
```

Tests cover:
- Distance calculations (same point, different hemispheres)
- Time estimations (various distances and configurations)
- Route calculations (single, multiple, empty)
- Edge cases (zero distance, very long distances)
- Configuration validation

## Examples

See `deliveryTimeEstimation.example.tsx` for interactive examples demonstrating:
- Single delivery estimation with adjustable coordinates
- Multiple delivery route calculation
- Configuration display
- Code usage examples

## Integration

### With DeliveryTimer Component

```typescript
import { DeliveryTimer } from '@/features/delivery';
import { calculateDeliveryTimeEstimate } from '@/features/delivery';

const estimate = calculateDeliveryTimeEstimate(restaurant, customer);

<DeliveryTimer
  readyAt={order.readyAt}
  estimatedDeliveryMinutes={estimate.estimatedMinutes}
/>
```

### With RouteOptimizer Component

The `RouteOptimizer` component uses these utilities internally for route calculation and optimization.

### With MapView Component

```typescript
import { MapView } from '@/features/delivery';
import { calculateDeliveryTimeEstimate } from '@/features/delivery';

const deliveries = orders.map(order => {
  const estimate = calculateDeliveryTimeEstimate(restaurant, order.location);
  return {
    ...order,
    estimatedTime: estimate.estimatedMinutes,
  };
});

<MapView deliveries={deliveries} />
```

## Performance Considerations

- **Distance calculations**: O(1) - constant time per calculation
- **Route calculations**: O(n) - linear with number of stops
- **No external dependencies**: Pure JavaScript/TypeScript implementation
- **Lightweight**: ~5KB minified

## Future Enhancements

Potential improvements for future versions:

1. **Real-time traffic data**: Integration with traffic APIs
2. **Historical data**: Learn from actual delivery times
3. **Weather conditions**: Adjust estimates based on weather
4. **Vehicle type**: Different speeds for bikes, cars, etc.
5. **Time of day**: Rush hour vs. off-peak adjustments
6. **Road network**: Use actual road distances instead of straight-line

## License

Part of the SmartDine SaaS Platform.
