/**
 * DashboardStats Component Example
 * Demonstrates usage of the DashboardStats component
 */

import { DashboardStats } from './DashboardStats';
import { DashboardStats as DashboardStatsType } from '../types';

export default function DashboardStatsExample() {
  // Example with high-performing restaurant
  const highPerformingStats: DashboardStatsType = {
    totalRevenue: 125680,
    totalOrders: 3247,
    averageRating: 4.8,
    activeOrders: 18,
    todayRevenue: 8420,
    todayOrders: 87,
    weekRevenue: 42950,
    weekOrders: 567,
    monthRevenue: 125680,
    monthOrders: 3247,
  };

  // Example with new restaurant
  const newRestaurantStats: DashboardStatsType = {
    totalRevenue: 2340,
    totalOrders: 45,
    averageRating: 4.2,
    activeOrders: 3,
    todayRevenue: 420,
    todayOrders: 8,
    weekRevenue: 1850,
    weekOrders: 32,
    monthRevenue: 2340,
    monthOrders: 45,
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Stats Examples</h1>
        <p className="text-muted-foreground">
          Different scenarios for the restaurant owner dashboard statistics
        </p>
      </div>

      {/* High Performing Restaurant */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">High Performing Restaurant</h2>
        <DashboardStats stats={highPerformingStats} isLoading={false} />
      </section>

      {/* New Restaurant */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">New Restaurant</h2>
        <DashboardStats stats={newRestaurantStats} isLoading={false} />
      </section>

      {/* Loading State */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Loading State</h2>
        <DashboardStats stats={highPerformingStats} isLoading={true} />
      </section>
    </div>
  );
}
