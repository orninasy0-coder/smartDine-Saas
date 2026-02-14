import { useState } from 'react';
import { MapView } from './MapView';
import type { DeliveryLocation } from './MapView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    status: 'delivered',
  },
];

export function MapViewExample() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | undefined>();
  const [showRestaurant, setShowRestaurant] = useState(true);

  const handleMarkerClick = (delivery: DeliveryLocation) => {
    setSelectedDeliveryId(delivery.id);
    console.log('Marker clicked:', delivery);
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">MapView Component Example</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Interactive map showing delivery locations with status indicators
        </p>

        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setShowRestaurant(!showRestaurant)}
            variant="outline"
            size="sm"
          >
            {showRestaurant ? 'Hide' : 'Show'} Restaurant
          </Button>
          <Button
            onClick={() => setSelectedDeliveryId(undefined)}
            variant="outline"
            size="sm"
            disabled={!selectedDeliveryId}
          >
            Clear Selection
          </Button>
        </div>

        {selectedDeliveryId && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium">
              Selected:{' '}
              {mockDeliveries.find((d) => d.id === selectedDeliveryId)?.orderNumber}
            </p>
          </div>
        )}
      </Card>

      <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
        <MapView
          deliveries={mockDeliveries}
          restaurantLocation={showRestaurant ? mockRestaurantLocation : undefined}
          onMarkerClick={handleMarkerClick}
          selectedDeliveryId={selectedDeliveryId}
        />
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Delivery List</h3>
        <div className="space-y-2">
          {mockDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedDeliveryId === delivery.id
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedDeliveryId(delivery.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{delivery.orderNumber}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {delivery.address}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    delivery.status === 'delivered'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : delivery.status === 'in_transit'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {delivery.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
