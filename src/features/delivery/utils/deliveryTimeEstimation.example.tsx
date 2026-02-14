/**
 * Delivery Time Estimation Examples
 * 
 * Demonstrates how to use the delivery time estimation utilities
 * in various scenarios
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateDeliveryTimeEstimate,
  calculateRouteTimeEstimate,
  formatEstimatedTime,
  DELIVERY_CONFIG,
  type Coordinates,
} from './deliveryTimeEstimation';
import { MapPin, Clock, Navigation, TrendingUp } from 'lucide-react';

export const DeliveryTimeEstimationExamples: React.FC = () => {
  // Example 1: Single delivery estimation
  const [singleDelivery, setSingleDelivery] = useState({
    restaurantLat: 24.7136,
    restaurantLng: 46.6753,
    customerLat: 24.7243,
    customerLng: 46.6512,
  });

  const singleEstimate = calculateDeliveryTimeEstimate(
    { lat: singleDelivery.restaurantLat, lng: singleDelivery.restaurantLng },
    { lat: singleDelivery.customerLat, lng: singleDelivery.customerLng }
  );

  // Example 2: Multiple deliveries route
  const restaurant: Coordinates = { lat: 24.7136, lng: 46.6753 };
  const multipleDeliveries: Coordinates[] = [
    { lat: 24.7243, lng: 46.6512 }, // ~2.5 km
    { lat: 24.7156, lng: 46.6423 }, // ~1.2 km from previous
    { lat: 24.7089, lng: 46.6598 }, // ~1.8 km from previous
  ];

  const routeEstimate = calculateRouteTimeEstimate(restaurant, multipleDeliveries);

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2">Delivery Time Estimation</h1>
        <p className="text-muted-foreground">
          Examples of calculating estimated delivery times based on distance
        </p>
      </div>

      {/* Configuration Display */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Average Speed</p>
            <p className="text-2xl font-bold">
              {DELIVERY_CONFIG.AVERAGE_SPEED_KMH} km/h
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Traffic Factor</p>
            <p className="text-2xl font-bold">
              {DELIVERY_CONFIG.TRAFFIC_FACTOR}x
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prep Time</p>
            <p className="text-2xl font-bold">
              {DELIVERY_CONFIG.BASE_PREPARATION_TIME_MINUTES} min
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stop Time</p>
            <p className="text-2xl font-bold">
              {DELIVERY_CONFIG.TIME_PER_STOP_MINUTES} min
            </p>
          </div>
        </div>
      </Card>

      {/* Example 1: Single Delivery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Example 1: Single Delivery</h2>
        
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Restaurant Location */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Restaurant Location
              </h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="rest-lat">Latitude</Label>
                  <Input
                    id="rest-lat"
                    type="number"
                    step="0.0001"
                    value={singleDelivery.restaurantLat}
                    onChange={(e) =>
                      setSingleDelivery({
                        ...singleDelivery,
                        restaurantLat: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="rest-lng">Longitude</Label>
                  <Input
                    id="rest-lng"
                    type="number"
                    step="0.0001"
                    value={singleDelivery.restaurantLng}
                    onChange={(e) =>
                      setSingleDelivery({
                        ...singleDelivery,
                        restaurantLng: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Customer Location */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Customer Location
              </h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="cust-lat">Latitude</Label>
                  <Input
                    id="cust-lat"
                    type="number"
                    step="0.0001"
                    value={singleDelivery.customerLat}
                    onChange={(e) =>
                      setSingleDelivery({
                        ...singleDelivery,
                        customerLat: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cust-lng">Longitude</Label>
                  <Input
                    id="cust-lng"
                    type="number"
                    step="0.0001"
                    value={singleDelivery.customerLng}
                    onChange={(e) =>
                      setSingleDelivery({
                        ...singleDelivery,
                        customerLng: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Estimation Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {singleEstimate.distanceKm.toFixed(2)}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">km</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {Math.round(singleEstimate.travelTimeMinutes)}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  travel min
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {singleEstimate.additionalTimeMinutes}
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  prep min
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Navigation className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {singleEstimate.estimatedMinutes}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  total min
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-center text-lg font-semibold">
                Estimated Delivery Time:{' '}
                <span className="text-primary">
                  {formatEstimatedTime(singleEstimate.estimatedMinutes)}
                </span>
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Example 2: Multiple Deliveries Route */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Example 2: Multiple Deliveries Route</h2>
        
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Route Overview</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  R
                </div>
                <div>
                  <p className="font-medium">Restaurant</p>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.lat.toFixed(4)}, {restaurant.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              {multipleDeliveries.map((delivery, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">Delivery {index + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.lat.toFixed(4)}, {delivery.lng.toFixed(4)}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-medium">
                      {routeEstimate.segments[index].distanceKm.toFixed(2)} km
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {routeEstimate.segments[index].estimatedMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Totals */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Route Totals</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {multipleDeliveries.length}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">stops</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {routeEstimate.totalDistanceKm.toFixed(2)}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">km</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {routeEstimate.totalMinutes}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  total min
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-center text-lg font-semibold">
                Total Route Time:{' '}
                <span className="text-primary">
                  {formatEstimatedTime(routeEstimate.totalMinutes)}
                </span>
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Code Examples</h2>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Basic Usage</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`import {
  calculateDeliveryTimeEstimate,
  formatEstimatedTime,
} from '@/features/delivery';

// Calculate delivery time
const restaurant = { lat: 24.7136, lng: 46.6753 };
const customer = { lat: 24.7243, lng: 46.6512 };

const estimate = calculateDeliveryTimeEstimate(restaurant, customer);

console.log(\`Distance: \${estimate.distanceKm.toFixed(2)} km\`);
console.log(\`Estimated time: \${estimate.estimatedMinutes} minutes\`);
console.log(\`Formatted: \${formatEstimatedTime(estimate.estimatedMinutes)}\`);`}
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Route Calculation</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`import { calculateRouteTimeEstimate } from '@/features/delivery';

const restaurant = { lat: 24.7136, lng: 46.6753 };
const deliveries = [
  { lat: 24.7243, lng: 46.6512 },
  { lat: 24.7156, lng: 46.6423 },
];

const route = calculateRouteTimeEstimate(restaurant, deliveries);

console.log(\`Total distance: \${route.totalDistanceKm.toFixed(2)} km\`);
console.log(\`Total time: \${route.totalMinutes} minutes\`);
console.log(\`Segments: \${route.segments.length}\`);`}
          </pre>
        </Card>
      </section>

      {/* Notes */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
          Implementation Notes
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• Uses Haversine formula for accurate distance calculation</li>
          <li>• Assumes average urban speed of 30 km/h with 1.2x traffic factor</li>
          <li>• Includes 5 minutes preparation time and 3 minutes per stop</li>
          <li>• All times are rounded up to ensure realistic estimates</li>
          <li>• Configuration can be customized per calculation</li>
        </ul>
      </Card>
    </div>
  );
};

export default DeliveryTimeEstimationExamples;
