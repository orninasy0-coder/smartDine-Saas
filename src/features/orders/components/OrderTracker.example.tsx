/**
 * OrderTracker Component Examples
 * Demonstrates different usage scenarios
 */

import React from 'react';
import { OrderTracker } from './OrderTracker';
import { Container } from '@/components/common/Container';

export const OrderTrackerExamples: React.FC = () => {
  const mockCreatedAt = new Date().toISOString();

  return (
    <Container className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-8">OrderTracker Component Examples</h1>
      </div>

      {/* Pending Status */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Pending Status</h2>
        <OrderTracker status="PENDING" createdAt={mockCreatedAt} />
      </div>

      {/* Preparing Status */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Preparing Status</h2>
        <OrderTracker status="PREPARING" createdAt={mockCreatedAt} />
      </div>

      {/* Ready Status */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ready Status</h2>
        <OrderTracker status="READY" createdAt={mockCreatedAt} />
      </div>

      {/* Delivered Status */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Delivered Status</h2>
        <OrderTracker status="DELIVERED" createdAt={mockCreatedAt} />
      </div>

      {/* Cancelled Status */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Cancelled Status</h2>
        <OrderTracker status="CANCELLED" createdAt={mockCreatedAt} />
      </div>

      {/* With Custom ClassName */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">With Custom Styling</h2>
        <OrderTracker
          status="PREPARING"
          createdAt={mockCreatedAt}
          className="border-2 border-primary"
        />
      </div>
    </Container>
  );
};

export default OrderTrackerExamples;
