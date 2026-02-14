# Delivery Map Components

This document describes the map and route optimization components for the delivery dashboard.

## Components

### MapView

Interactive map component that displays delivery locations with status indicators.

**Features:**
- OpenStreetMap integration via Leaflet
- Color-coded markers based on delivery status (ready, in_transit, delivered)
- Restaurant location marker
- Interactive marker popups with delivery details
- Auto-fit bounds to show all deliveries
- Click handlers for marker selection
- Status legend

**Props:**
```typescript
interface MapViewProps {
  deliveries: DeliveryLocation[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (delivery: DeliveryLocation) => void;
  selectedDeliveryId?: string;
  restaurantLocation?: [number, number];
}
```

**Usage:**
```tsx
import { MapView } from '@/features/delivery';

<MapView
  deliveries={deliveries}
  restaurantLocation={[24.7136, 46.6753]}
  onMarkerClick={(delivery) => console.log(delivery)}
  selectedDeliveryId={selectedId}
/>
```

### RouteOptimizer

Component that optimizes delivery routes using the nearest neighbor algorithm.

**Features:**
- Route optimization using nearest neighbor algorithm
- Distance calculation using Haversine formula
- Time estimation based on average city speed (30 km/h)
- Total distance and time statistics
- Segment-by-segment route breakdown
- Delivery sequence visualization
- Reset to original order

**Props:**
```typescript
interface RouteOptimizerProps {
  deliveries: DeliveryLocation[];
  restaurantLocation: [number, number];
  onOptimizeRoute?: (optimizedRoute: DeliveryLocation[]) => void;
}
```

**Usage:**
```tsx
import { RouteOptimizer } from '@/features/delivery';

<RouteOptimizer
  deliveries={deliveries}
  restaurantLocation={[24.7136, 46.6753]}
  onOptimizeRoute={(route) => setOptimizedRoute(route)}
/>
```

### DeliveryMapPage

Full page component that combines MapView and RouteOptimizer.

**Usage:**
```tsx
import { DeliveryMapPage } from '@/features/delivery';

<DeliveryMapPage />
```

## Data Types

### DeliveryLocation

```typescript
interface DeliveryLocation {
  id: string;
  orderId: string;
  orderNumber: string;
  address: string;
  lat: number;
  lng: number;
  customerName?: string;
  customerPhone?: string;
  status: 'ready' | 'in_transit' | 'delivered';
}
```

## Algorithm Details

### Distance Calculation

Uses the Haversine formula to calculate great-circle distance between two coordinates:

```typescript
function calculateDistance(lat1, lon1, lat2, lon2): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

### Time Estimation

Estimates delivery time based on distance and average city speed:

```typescript
function estimateTime(distanceKm: number): number {
  const avgSpeedKmh = 30; // Average city speed
  return (distanceKm / avgSpeedKmh) * 60; // Return in minutes
}
```

### Route Optimization

Uses the nearest neighbor algorithm:

1. Start at restaurant location
2. Find the nearest unvisited delivery
3. Move to that delivery
4. Repeat until all deliveries are visited

This is a greedy algorithm that provides a good approximation for the traveling salesman problem.

## Dependencies

- **leaflet**: Map rendering library
- **react-leaflet**: React bindings for Leaflet (not used directly, but available)
- **@types/leaflet**: TypeScript definitions

## Styling

The components use Tailwind CSS for styling and support both light and dark modes.

### Marker Colors

- **Red**: Ready for delivery
- **Orange**: In transit
- **Green**: Delivered
- **Blue**: Restaurant location

## Examples

See the following example files:
- `MapView.example.tsx` - MapView component examples
- `RouteOptimizer.example.tsx` - RouteOptimizer component examples
- `DeliveryMapDemo.tsx` - Combined demo with tabs

## Integration

### With Real Data

Replace mock data with actual delivery data from your backend:

```tsx
import { useQuery } from '@tanstack/react-query';
import { MapView } from '@/features/delivery';

function DeliveryMap() {
  const { data: deliveries } = useQuery({
    queryKey: ['deliveries'],
    queryFn: fetchDeliveries,
  });

  return (
    <MapView
      deliveries={deliveries || []}
      restaurantLocation={restaurantCoordinates}
    />
  );
}
```

### With WebSocket Updates

For real-time delivery updates:

```tsx
import { useEffect } from 'react';
import { MapView } from '@/features/delivery';
import { useWebSocket } from '@/services/websocket';

function DeliveryMap() {
  const [deliveries, setDeliveries] = useState([]);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe('delivery.updated', (delivery) => {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === delivery.id ? delivery : d))
      );
    });

    return unsubscribe;
  }, []);

  return <MapView deliveries={deliveries} />;
}
```

## Performance Considerations

- Map instance is created once and reused
- Markers are cached and updated only when necessary
- Bounds are auto-fitted only when deliveries change
- Route optimization runs on-demand, not automatically

## Future Enhancements

- Support for multiple route optimization algorithms (2-opt, genetic algorithm)
- Real-time traffic data integration
- Turn-by-turn navigation
- Delivery time windows
- Multi-vehicle route optimization
- Export routes to navigation apps
