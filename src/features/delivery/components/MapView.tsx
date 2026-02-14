import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export interface DeliveryLocation {
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

interface MapViewProps {
  deliveries: DeliveryLocation[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (delivery: DeliveryLocation) => void;
  selectedDeliveryId?: string;
  restaurantLocation?: [number, number];
}

export function MapView({
  deliveries,
  center = [24.7136, 46.6753], // Default: Riyadh, Saudi Arabia
  zoom = 12,
  onMarkerClick,
  selectedDeliveryId,
  restaurantLocation,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  // Add restaurant marker
  useEffect(() => {
    if (!mapRef.current || !restaurantLocation) return;

    const restaurantIcon = L.divIcon({
      className: 'custom-restaurant-marker',
      html: `
        <div class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker(restaurantLocation, { icon: restaurantIcon })
      .addTo(mapRef.current)
      .bindPopup('<strong>Restaurant Location</strong>');

    return () => {
      marker.remove();
    };
  }, [restaurantLocation]);

  // Update delivery markers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove markers that are no longer in deliveries
    markersRef.current.forEach((marker, id) => {
      if (!deliveries.find((d) => d.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    deliveries.forEach((delivery) => {
      let marker = markersRef.current.get(delivery.id);

      const isSelected = delivery.id === selectedDeliveryId;
      const statusColor =
        delivery.status === 'delivered'
          ? 'green'
          : delivery.status === 'in_transit'
            ? 'orange'
            : 'red';

      const customIcon = L.divIcon({
        className: 'custom-delivery-marker',
        html: `
          <div class="flex items-center justify-center w-10 h-10 bg-${statusColor}-600 rounded-full border-${isSelected ? '4' : '2'} border-white shadow-lg ${isSelected ? 'ring-4 ring-blue-400' : ''}">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      if (!marker) {
        marker = L.marker([delivery.lat, delivery.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `
            <div class="p-2">
              <strong class="text-sm font-semibold">${delivery.orderNumber}</strong>
              <p class="text-xs text-gray-600 mt-1">${delivery.address}</p>
              ${delivery.customerName ? `<p class="text-xs mt-1"><strong>Customer:</strong> ${delivery.customerName}</p>` : ''}
              ${delivery.customerPhone ? `<p class="text-xs"><strong>Phone:</strong> ${delivery.customerPhone}</p>` : ''}
              <p class="text-xs mt-1 capitalize"><strong>Status:</strong> ${delivery.status.replace('_', ' ')}</p>
            </div>
          `
          )
          .on('click', () => {
            if (onMarkerClick) {
              onMarkerClick(delivery);
            }
          });

        markersRef.current.set(delivery.id, marker);
      } else {
        marker.setIcon(customIcon);
        marker.setLatLng([delivery.lat, delivery.lng]);
      }
    });

    // Fit bounds to show all markers
    if (deliveries.length > 0) {
      const bounds = L.latLngBounds(
        deliveries.map((d) => [d.lat, d.lng] as [number, number])
      );
      if (restaurantLocation) {
        bounds.extend(restaurantLocation);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [deliveries, selectedDeliveryId, onMarkerClick, restaurantLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-xs font-semibold mb-2 text-gray-900 dark:text-white">
          Status Legend
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              In Transit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Delivered
            </span>
          </div>
          {restaurantLocation && (
            <div className="flex items-center gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Restaurant
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
