import { RouteOptimizer } from './RouteOptimizer';
import type { DeliveryLocation } from './MapView';
import { Card } from '@/components/ui/card';

const mockRestaurantLocation: [number, number] = [24.7136, 46.6753]; // Riyadh

const mockDeliveries: DeliveryLocation[] = [
  {
    id: '1',
    orderId: 'ord-001',
    orderNumber: 'ORD-001',
    address: 'King Fahd Road, Riyadh',
    lat: 24.7242,
    lng: 46.6847,
    customerName: 'Ahmed Ali',
    customerPhone: '+966 50 123 4567',
    status: 'ready',
  },
  {
    id: '2',
    orderId: 'ord-002',
    orderNumber: 'ORD-002',
    address: 'Olaya Street, Riyadh',
    lat: 24.7089,
    lng: 46.6758,
    customerName: 'Sara Mohammed',
    customerPhone: '+966 55 234 5678',
    status: 'ready',
  },
  {
    id: '3',
    orderId: 'ord-003',
    orderNumber: 'ORD-003',
    address: 'Al Malaz, Riyadh',
    lat: 24.6877,
    lng: 46.7219,
    customerName: 'Khalid Hassan',
    customerPhone: '+966 56 345 6789',
    status: 'in_transit',
  },
  {
    id: '4',
    orderId: 'ord-004',
    orderNumber: 'ORD-004',
    address: 'Al Murabba, Riyadh',
    lat: 24.6547,
    lng: 46.7089,
    customerName: 'Fatima Abdullah',
    customerPhone: '+966 54 456 7890',
    status: 'ready',
  },
  {
    id: '5',
    orderId: 'ord-005',
    orderNumber: 'ORD-005',
    address: 'Al Naseem, Riyadh',
    lat: 24.7456,
    lng: 46.6234,
    customerName: 'Omar Youssef',
    customerPhone: '+966 53 567 8901',
    status: 'ready',
  },
];

export function RouteOptimizerExample() {
  const handleOptimizeRoute = (optimizedRoute: DeliveryLocation[]) => {
    console.log('Optimized route:', optimizedRoute);
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">RouteOptimizer Component Example</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Optimize delivery routes using nearest neighbor algorithm to minimize travel
          distance and time
        </p>
      </Card>

      <div className="max-w-2xl">
        <RouteOptimizer
          deliveries={mockDeliveries}
          restaurantLocation={mockRestaurantLocation}
          onOptimizeRoute={handleOptimizeRoute}
        />
      </div>

      <Card className="p-4 max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Features</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Calculates optimal route using nearest neighbor algorithm</li>
          <li>Shows total distance and estimated time</li>
          <li>Displays route segments with individual distances</li>
          <li>Lists deliveries in optimized order</li>
          <li>Supports reset to original order</li>
          <li>Real-time statistics update</li>
        </ul>
      </Card>

      <Card className="p-4 max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Algorithm Details</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p>
            <strong>Distance Calculation:</strong> Uses Haversine formula to calculate
            great-circle distance between coordinates
          </p>
          <p>
            <strong>Time Estimation:</strong> Assumes average city speed of 30 km/h
          </p>
          <p>
            <strong>Optimization:</strong> Nearest neighbor algorithm - always selects
            the closest unvisited delivery from current location
          </p>
        </div>
      </Card>
    </div>
  );
}
