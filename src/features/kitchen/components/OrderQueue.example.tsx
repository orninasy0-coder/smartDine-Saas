/**
 * OrderQueue Example
 * Demonstrates the kitchen dashboard with sample data
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

export const OrderQueueExample: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Kitchen Dashboard Example</h1>
          
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h2 className="font-semibold mb-2">Demo Information:</h2>
            <ul className="text-sm space-y-1">
              <li>• This example shows the kitchen order queue interface</li>
              <li>• Orders are fetched from the API and auto-refresh every 5 seconds</li>
              <li>• Kitchen staff can mark orders as "Preparing" or "Ready"</li>
              <li>• Timers update in real-time and are color-coded by urgency</li>
              <li>• Orders are sorted by creation time (oldest first)</li>
            </ul>
          </div>

          <OrderQueue restaurantId="demo-restaurant-123" />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default OrderQueueExample;
