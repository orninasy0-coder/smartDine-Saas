import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DeliveryLocation } from './MapView';
import { MapPin, Navigation, Clock, TrendingUp } from 'lucide-react';
import {
  calculateDistance,
  calculateDeliveryTimeEstimate,
} from '../utils/deliveryTimeEstimation';

interface RouteOptimizerProps {
  deliveries: DeliveryLocation[];
  restaurantLocation: [number, number];
  onOptimizeRoute?: (optimizedRoute: DeliveryLocation[]) => void;
}

interface RouteSegment {
  from: string;
  to: string;
  distance: number;
  estimatedTime: number;
}

// Nearest neighbor algorithm for route optimization
function optimizeRouteNearestNeighbor(
  deliveries: DeliveryLocation[],
  startLocation: [number, number]
): DeliveryLocation[] {
  if (deliveries.length === 0) return [];
  if (deliveries.length === 1) return deliveries;

  const unvisited = [...deliveries];
  const route: DeliveryLocation[] = [];
  let currentLocation = startLocation;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    unvisited.forEach((delivery, index) => {
      const distance = calculateDistance(
        currentLocation[0],
        currentLocation[1],
        delivery.lat,
        delivery.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    const nearest = unvisited[nearestIndex];
    route.push(nearest);
    currentLocation = [nearest.lat, nearest.lng];
    unvisited.splice(nearestIndex, 1);
  }

  return route;
}

export function RouteOptimizer({
  deliveries,
  restaurantLocation,
  onOptimizeRoute,
}: RouteOptimizerProps) {
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<DeliveryLocation[]>([]);

  // Calculate route statistics
  const routeStats = useMemo(() => {
    const route = isOptimized ? optimizedRoute : deliveries;
    if (route.length === 0) {
      return {
        totalDistance: 0,
        totalTime: 0,
        segments: [],
      };
    }

    const segments: RouteSegment[] = [];
    let totalDistance = 0;
    let totalTime = 0;

    // First segment: restaurant to first delivery
    const firstEstimate = calculateDeliveryTimeEstimate(
      { lat: restaurantLocation[0], lng: restaurantLocation[1] },
      { lat: route[0].lat, lng: route[0].lng }
    );
    segments.push({
      from: 'Restaurant',
      to: route[0].orderNumber,
      distance: firstEstimate.distanceKm,
      estimatedTime: firstEstimate.estimatedMinutes,
    });
    totalDistance += firstEstimate.distanceKm;
    totalTime += firstEstimate.estimatedMinutes;

    // Subsequent segments
    for (let i = 0; i < route.length - 1; i++) {
      const estimate = calculateDeliveryTimeEstimate(
        { lat: route[i].lat, lng: route[i].lng },
        { lat: route[i + 1].lat, lng: route[i + 1].lng }
      );
      segments.push({
        from: route[i].orderNumber,
        to: route[i + 1].orderNumber,
        distance: estimate.distanceKm,
        estimatedTime: estimate.estimatedMinutes,
      });
      totalDistance += estimate.distanceKm;
      totalTime += estimate.estimatedMinutes;
    }

    return {
      totalDistance,
      totalTime,
      segments,
    };
  }, [deliveries, optimizedRoute, isOptimized, restaurantLocation]);

  const handleOptimize = () => {
    const optimized = optimizeRouteNearestNeighbor(deliveries, restaurantLocation);
    setOptimizedRoute(optimized);
    setIsOptimized(true);
    if (onOptimizeRoute) {
      onOptimizeRoute(optimized);
    }
  };

  const handleReset = () => {
    setIsOptimized(false);
    setOptimizedRoute([]);
    if (onOptimizeRoute) {
      onOptimizeRoute(deliveries);
    }
  };

  if (deliveries.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No deliveries to optimize</p>
        </div>
      </Card>
    );
  }

  const currentRoute = isOptimized ? optimizedRoute : deliveries;

  return (
    <div className="space-y-4">
      {/* Optimization Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Route Optimization
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isOptimized
                ? 'Route optimized for shortest distance'
                : 'Optimize delivery route to save time'}
            </p>
          </div>
          <div className="flex gap-2">
            {isOptimized ? (
              <Button onClick={handleReset} variant="outline" size="sm">
                Reset
              </Button>
            ) : (
              <Button onClick={handleOptimize} size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                Optimize Route
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Route Statistics */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
          Route Summary
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentRoute.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stops</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {routeStats.totalDistance.toFixed(1)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">km</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(routeStats.totalTime)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">min</p>
          </div>
        </div>
      </Card>

      {/* Route Segments */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
          Delivery Sequence
        </h4>
        <div className="space-y-2">
          {routeStats.segments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {segment.from} → {segment.to}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {segment.distance.toFixed(2)} km •{' '}
                    {Math.round(segment.estimatedTime)} min
                  </p>
                </div>
              </div>
              <Navigation className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </Card>

      {/* Delivery List */}
      <Card className="p-4">
        <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
          Delivery Details
        </h4>
        <div className="space-y-2">
          {currentRoute.map((delivery, index) => (
            <div
              key={delivery.id}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gray-600 text-white rounded-full text-sm font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {delivery.orderNumber}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {delivery.address}
                </p>
                {delivery.customerName && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {delivery.customerName}
                    {delivery.customerPhone && ` • ${delivery.customerPhone}`}
                  </p>
                )}
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                  delivery.status === 'delivered'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : delivery.status === 'in_transit'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {delivery.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
