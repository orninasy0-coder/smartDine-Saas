# Delivery Map Integration Guide

## Quick Start

### 1. Import Components

```tsx
import { MapView, RouteOptimizer, DeliveryMapPage } from '@/features/delivery';
import type { DeliveryLocation } from '@/features/delivery';
```

### 2. Basic Usage

#### Standalone Map

```tsx
function MyDeliveryMap() {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const restaurantLocation: [number, number] = [24.7136, 46.6753];

  return (
    <div className="h-[600px]">
      <MapView
        deliveries={deliveries}
        restaurantLocation={restaurantLocation}
        onMarkerClick={(delivery) => console.log('Selected:', delivery)}
      />
    </div>
  );
}
```

#### Standalone Route Optimizer

```tsx
function MyRouteOptimizer() {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const restaurantLocation: [number, number] = [24.7136, 46.6753];

  const handleOptimize = (optimizedRoute: DeliveryLocation[]) => {
    console.log('Optimized route:', optimizedRoute);
    setDeliveries(optimizedRoute);
  };

  return (
    <RouteOptimizer
      deliveries={deliveries}
      restaurantLocation={restaurantLocation}
      onOptimizeRoute={handleOptimize}
    />
  );
}
```

#### Full Page

```tsx
import { DeliveryMapPage } from '@/features/delivery';

function DeliveryDashboard() {
  return <DeliveryMapPage />;
}
```

## Integration with Backend

### Fetching Delivery Data

```tsx
import { useQuery } from '@tanstack/react-query';
import { MapView } from '@/features/delivery';

function DeliveryMapWithData() {
  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries', 'ready'],
    queryFn: async () => {
      const response = await fetch('/api/v1/deliveries?status=ready');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', 'location'],
    queryFn: async () => {
      const response = await fetch('/api/v1/restaurant/location');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading map...</div>;

  return (
    <MapView
      deliveries={deliveries || []}
      restaurantLocation={restaurant?.coordinates || [24.7136, 46.6753]}
    />
  );
}
```

### Real-Time Updates with WebSocket

```tsx
import { useEffect, useState } from 'react';
import { useWebSocket } from '@/services/websocket';
import { MapView } from '@/features/delivery';
import type { DeliveryLocation } from '@/features/delivery';

function RealTimeDeliveryMap() {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    // Subscribe to delivery updates
    const unsubscribe = subscribe('delivery.updated', (updatedDelivery) => {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === updatedDelivery.id ? { ...d, ...updatedDelivery } : d
        )
      );
    });

    // Subscribe to new deliveries
    const unsubscribeNew = subscribe('delivery.created', (newDelivery) => {
      setDeliveries((prev) => [...prev, newDelivery]);
    });

    return () => {
      unsubscribe();
      unsubscribeNew();
    };
  }, [subscribe]);

  return (
    <MapView
      deliveries={deliveries}
      restaurantLocation={[24.7136, 46.6753]}
    />
  );
}
```

## Data Transformation

### Converting Backend Data

If your backend returns data in a different format, transform it:

```tsx
interface BackendDelivery {
  id: string;
  order_id: string;
  order_number: string;
  delivery_address: string;
  latitude: number;
  longitude: number;
  customer: {
    name: string;
    phone: string;
  };
  status: 'READY' | 'IN_TRANSIT' | 'DELIVERED';
}

function transformDelivery(backend: BackendDelivery): DeliveryLocation {
  return {
    id: backend.id,
    orderId: backend.order_id,
    orderNumber: backend.order_number,
    address: backend.delivery_address,
    lat: backend.latitude,
    lng: backend.longitude,
    customerName: backend.customer.name,
    customerPhone: backend.customer.phone,
    status: backend.status.toLowerCase() as DeliveryLocation['status'],
  };
}

// Usage
const deliveries = backendData.map(transformDelivery);
```

## Advanced Features

### Filtering Deliveries

```tsx
function FilterableDeliveryMap() {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDeliveries = useMemo(() => {
    if (statusFilter === 'all') return deliveries;
    return deliveries.filter((d) => d.status === statusFilter);
  }, [deliveries, statusFilter]);

  return (
    <div>
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Deliveries</option>
          <option value="ready">Ready</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <MapView deliveries={filteredDeliveries} />
    </div>
  );
}
```

### Updating Delivery Status

```tsx
function DeliveryMapWithActions() {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

  const updateStatus = async (
    deliveryId: string,
    newStatus: DeliveryLocation['status']
  ) => {
    try {
      await fetch(`/api/v1/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div>
      <MapView
        deliveries={deliveries}
        selectedDeliveryId={selectedId}
        onMarkerClick={(delivery) => setSelectedId(delivery.id)}
      />

      {selectedId && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3>Update Status</h3>
          <div className="flex gap-2 mt-2">
            <button onClick={() => updateStatus(selectedId, 'in_transit')}>
              Mark In Transit
            </button>
            <button onClick={() => updateStatus(selectedId, 'delivered')}>
              Mark Delivered
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Combined Map and Optimizer

```tsx
function FullDeliveryDashboard() {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const restaurantLocation: [number, number] = [24.7136, 46.6753];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map - 2 columns */}
      <div className="lg:col-span-2">
        <div className="h-[600px] bg-white rounded-lg shadow overflow-hidden">
          <MapView
            deliveries={deliveries}
            restaurantLocation={restaurantLocation}
            selectedDeliveryId={selectedId}
            onMarkerClick={(delivery) => setSelectedId(delivery.id)}
          />
        </div>
      </div>

      {/* Optimizer - 1 column */}
      <div className="lg:col-span-1">
        <RouteOptimizer
          deliveries={deliveries}
          restaurantLocation={restaurantLocation}
          onOptimizeRoute={(optimized) => setDeliveries(optimized)}
        />
      </div>
    </div>
  );
}
```

## Geocoding Addresses

If you need to convert addresses to coordinates:

```tsx
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    // Using Nominatim (OpenStreetMap's geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();

    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
}

// Usage
const coordinates = await geocodeAddress('King Fahd Road, Riyadh, Saudi Arabia');
```

## Performance Optimization

### Memoizing Deliveries

```tsx
import { useMemo } from 'react';

function OptimizedDeliveryMap({ deliveries }: { deliveries: DeliveryLocation[] }) {
  // Only recalculate when deliveries actually change
  const memoizedDeliveries = useMemo(() => deliveries, [deliveries]);

  return <MapView deliveries={memoizedDeliveries} />;
}
```

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const MapView = lazy(() =>
  import('@/features/delivery').then((mod) => ({ default: mod.MapView }))
);

function LazyDeliveryMap() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapView deliveries={[]} />
    </Suspense>
  );
}
```

## Troubleshooting

### Map Not Displaying

1. Ensure Leaflet CSS is imported in `main.tsx`:
   ```tsx
   import 'leaflet/dist/leaflet.css';
   ```

2. Check container has explicit height:
   ```tsx
   <div className="h-[600px]">
     <MapView ... />
   </div>
   ```

### Markers Not Showing

1. Verify coordinates are valid numbers
2. Check lat/lng are not swapped (lat first, lng second)
3. Ensure deliveries array is not empty

### Route Optimization Not Working

1. Verify restaurant location is provided
2. Check deliveries have valid coordinates
3. Ensure at least 2 deliveries exist

## Testing

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { MapView } from '@/features/delivery';

describe('MapView', () => {
  it('renders map container', () => {
    render(<MapView deliveries={[]} />);
    // Add assertions
  });

  it('displays markers for deliveries', () => {
    const deliveries = [
      {
        id: '1',
        orderId: 'ord-1',
        orderNumber: 'ORD-001',
        address: 'Test Address',
        lat: 24.7136,
        lng: 46.6753,
        status: 'ready' as const,
      },
    ];

    render(<MapView deliveries={deliveries} />);
    // Add assertions
  });
});
```

## Next Steps

1. Replace mock data with real backend integration
2. Add authentication to API calls
3. Implement error handling and retry logic
4. Add loading states and skeletons
5. Implement delivery assignment to drivers
6. Add turn-by-turn navigation integration
7. Implement delivery time windows
8. Add multi-vehicle route optimization

## Support

For issues or questions:
- Check MAP_COMPONENTS_README.md for detailed documentation
- Review example files in the components directory
- Refer to Leaflet documentation: https://leafletjs.com/
