import { useState } from 'react';
import { MapView } from './MapView';
import type { DeliveryLocation } from './MapView';
import { RouteOptimizer } from './RouteOptimizer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    status: 'delivered',
  },
];

export function DeliveryMapDemo() {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | undefined>();
  const [currentDeliveries, setCurrentDeliveries] = useState<DeliveryLocation[]>(mockDeliveries);

  const handleMarkerClick = (delivery: DeliveryLocation) => {
    setSelectedDeliveryId(delivery.id);
  };

  const handleOptimizeRoute = (optimizedRoute: DeliveryLocation[]) => {
    setCurrentDeliveries(optimizedRoute);
  };

  const handleStatusChange = (deliveryId: string, newStatus: DeliveryLocation['status']) => {
    setCurrentDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d))
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Delivery Map & Route Optimizer Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demonstration of the delivery map with route optimization
        </p>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="combined">Combined View</TabsTrigger>
          <TabsTrigger value="map">Map Only</TabsTrigger>
          <TabsTrigger value="optimizer">Optimizer Only</TabsTrigger>
        </TabsList>

        {/* Combined View */}
        <TabsContent value="combined" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="h-[600px]">
                  <MapView
                    deliveries={currentDeliveries}
                    restaurantLocation={mockRestaurantLocation}
                    onMarkerClick={handleMarkerClick}
                    selectedDeliveryId={selectedDeliveryId}
                  />
                </div>
              </Card>
            </div>

            {/* Route Optimizer */}
            <div className="lg:col-span-1">
              <RouteOptimizer
                deliveries={mockDeliveries}
                restaurantLocation={mockRestaurantLocation}
                onOptimizeRoute={handleOptimizeRoute}
              />
            </div>
          </div>
        </TabsContent>

        {/* Map Only View */}
        <TabsContent value="map" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Map View</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click on markers to select deliveries
                </p>
              </div>
              {selectedDeliveryId && (
                <Button
                  onClick={() => setSelectedDeliveryId(undefined)}
                  variant="outline"
                  size="sm"
                >
                  Clear Selection
                </Button>
              )}
            </div>

            {selectedDeliveryId && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Selected:{' '}
                  {currentDeliveries.find((d) => d.id === selectedDeliveryId)?.orderNumber}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusChange(selectedDeliveryId, 'ready')}
                    size="sm"
                    variant="outline"
                  >
                    Ready
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedDeliveryId, 'in_transit')}
                    size="sm"
                    variant="outline"
                  >
                    In Transit
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedDeliveryId, 'delivered')}
                    size="sm"
                    variant="outline"
                  >
                    Delivered
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <div className="h-[600px]">
              <MapView
                deliveries={currentDeliveries}
                restaurantLocation={mockRestaurantLocation}
                onMarkerClick={handleMarkerClick}
                selectedDeliveryId={selectedDeliveryId}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Optimizer Only View */}
        <TabsContent value="optimizer" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Route Optimizer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimize delivery routes to minimize distance and time
            </p>
          </Card>

          <div className="max-w-2xl">
            <RouteOptimizer
              deliveries={mockDeliveries}
              restaurantLocation={mockRestaurantLocation}
              onOptimizeRoute={handleOptimizeRoute}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">
              Map View
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Interactive OpenStreetMap integration</li>
              <li>Color-coded delivery status markers</li>
              <li>Restaurant location marker</li>
              <li>Click markers to view details</li>
              <li>Auto-fit bounds to show all deliveries</li>
              <li>Status legend for easy reference</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">
              Route Optimizer
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Nearest neighbor optimization algorithm</li>
              <li>Total distance and time calculation</li>
              <li>Segment-by-segment route breakdown</li>
              <li>Delivery sequence visualization</li>
              <li>Reset to original order</li>
              <li>Real-time statistics updates</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
