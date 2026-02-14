/**
 * OrderQueue with Status Filter Example
 * Demonstrates the new status filtering feature in the Kitchen Dashboard
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderQueue } from './OrderQueue';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const OrderQueueWithFilterExample: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Kitchen Dashboard - Status Filter Feature</h1>
            <p className="text-muted-foreground mb-6">
              Task 8.6 Implementation: Filter orders by status (PENDING, PREPARING, or ALL)
            </p>
          </div>

          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h2 className="font-semibold text-lg mb-3">✨ New Feature: Status Filtering</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <p>
                  <strong>Three Filter Options:</strong> View all orders, only pending orders, or only preparing orders
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <p>
                  <strong>Real-time Badge Counts:</strong> Each filter tab shows the number of orders in that status
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <p>
                  <strong>Color-Coded Badges:</strong> Yellow for pending, blue for preparing orders
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <p>
                  <strong>Dynamic Empty States:</strong> Contextual messages when no orders match the filter
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <p>
                  <strong>Seamless Integration:</strong> Works perfectly with real-time WebSocket updates
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h2 className="font-semibold text-lg mb-3">🎯 How to Use</h2>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Look for the filter tabs below the status summary cards</li>
              <li>Click on "الكل" to see all active orders (default view)</li>
              <li>Click on "قيد الانتظار" to see only pending orders waiting to be started</li>
              <li>Click on "قيد التحضير" to see only orders currently being prepared</li>
              <li>Notice the badge counts on each tab showing the number of orders</li>
              <li>The order list updates instantly when you change filters</li>
            </ol>
          </div>

          <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h2 className="font-semibold text-lg mb-3">💡 Benefits for Kitchen Staff</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">Focus on Priority</h3>
                <p className="text-muted-foreground">
                  Quickly filter to see only pending orders that need immediate attention
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor how many orders are currently being prepared
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Quick Overview</h3>
                <p className="text-muted-foreground">
                  Use "All" view to see the complete picture of active orders
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Visual Feedback</h3>
                <p className="text-muted-foreground">
                  Badge counts update in real-time as orders progress through stages
                </p>
              </div>
            </div>
          </div>

          {/* The actual OrderQueue component with the new filter feature */}
          <OrderQueue restaurantId="demo-restaurant-123" />

          <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This example demonstrates the status filtering feature implemented in Task 8.6.
              The filter tabs appear below the status summary cards and above the order list.
              Try clicking different filter options to see how the order list updates.
            </p>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default OrderQueueWithFilterExample;
