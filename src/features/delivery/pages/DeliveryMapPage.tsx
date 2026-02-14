import { useState } from 'react';
import { MapView } from '../components/MapView';
import type { DeliveryLocation } from '../components/MapView';
import { RouteOptimizer } from '../components/RouteOptimizer';

// Mock data for demonstration
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
];

export function DeliveryMapPage() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | undefined>();
  const [currentDeliveries, setCurrentDeliveries] = useState<DeliveryLocation[]>(mockDeliveries);

  const handleMarkerClick = (delivery: DeliveryLocation) => {
    setSelectedDeliveryId(delivery.id);
  };

  const handleOptimizeRoute = (optimizedRoute: DeliveryLocation[]) => {
    setCurrentDeliveries(optimizedRoute);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Delivery Map
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View and optimize delivery routes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="h-[600px]">
                <MapView
                  deliveries={currentDeliveries}
                  restaurantLocation={mockRestaurantLocation}
                  onMarkerClick={handleMarkerClick}
                  selectedDeliveryId={selectedDeliveryId}
                />
              </div>
            </div>
          </div>

          {/* Route Optimizer - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <RouteOptimizer
              deliveries={mockDeliveries}
              restaurantLocation={mockRestaurantLocation}
              onOptimizeRoute={handleOptimizeRoute}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
