/**
 * Lazy-loaded Map Components
 * 
 * Code-split heavy Leaflet library to reduce initial bundle size.
 * Maps are only loaded when needed (e.g., delivery tracking).
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loading } from '@/components/common';

// Lazy load map components - will be created when delivery feature is implemented
const DeliveryMap = lazy(() =>
  import('@/features/delivery/components/DeliveryMap').then((m) => ({
    default: m.DeliveryMap,
  })).catch(() => ({
    // Fallback if component doesn't exist yet
    default: () => (
      <div className="flex items-center justify-center h-96 bg-card rounded-lg border">
        <p className="text-muted-foreground">Map component not yet implemented</p>
      </div>
    ),
  }))
);

// Map loading fallback
const MapLoadingFallback = () => (
  <div className="flex items-center justify-center h-96 bg-card rounded-lg border">
    <Loading size="lg" text="Loading map..." />
  </div>
);

// Wrapper component with Suspense
export function LazyDeliveryMap(
  props: ComponentType<typeof DeliveryMap> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<MapLoadingFallback />}>
      <DeliveryMap {...props} />
    </Suspense>
  );
}
