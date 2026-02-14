/**
 * Lazy-loaded Chart Components
 * 
 * Code-split heavy chart library (recharts) to reduce initial bundle size.
 * Charts are only loaded when needed.
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loading } from '@/components/common';

// Lazy load chart components
const RevenueChart = lazy(() =>
  import('@/features/restaurant-owner/components/RevenueChart').then((m) => ({
    default: m.RevenueChart,
  }))
);

const OrderVolumeChart = lazy(() =>
  import('@/features/restaurant-owner/components/OrderVolumeChart').then(
    (m) => ({
      default: m.OrderVolumeChart,
    })
  )
);

// Chart loading fallback
const ChartLoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-card rounded-lg border">
    <Loading size="md" text="Loading chart..." />
  </div>
);

// Wrapper components with Suspense
export function LazyRevenueChart(
  props: ComponentType<typeof RevenueChart> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <RevenueChart {...props} />
    </Suspense>
  );
}

export function LazyOrderVolumeChart(
  props: ComponentType<typeof OrderVolumeChart> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <OrderVolumeChart {...props} />
    </Suspense>
  );
}
