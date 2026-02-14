/**
 * StatusButtons Component Examples
 * Demonstrates various usage patterns for the StatusButtons component
 */

import React, { useState } from 'react';
import { StatusButtons } from './StatusButtons';
import { Card } from '@/components/ui/card';
import type { OrderStatus } from '@/utils/types';

export const StatusButtonsExamples: React.FC = () => {
  const [status1, setStatus1] = useState<OrderStatus>('PENDING');
  const [status2, setStatus2] = useState<OrderStatus>('PREPARING');
  const [status3, setStatus3] = useState<OrderStatus>('PENDING');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (
    setter: React.Dispatch<React.SetStateAction<OrderStatus>>
  ) => {
    return (newStatus: 'PREPARING' | 'READY') => {
      setIsUpdating(true);
      // Simulate API call
      setTimeout(() => {
        setter(newStatus);
        setIsUpdating(false);
      }, 1000);
    };
  };

  return (
    <div className="p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-3xl font-bold mb-2">StatusButtons Component Examples</h1>
        <p className="text-muted-foreground">
          Various usage patterns for the StatusButtons component
        </p>
      </div>

      {/* Example 1: Basic Usage - PENDING Status */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 1: PENDING Status</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Shows "بدء التحضير" (Start Preparing) button for pending orders
        </p>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">Current Status:</span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status1}
          </span>
        </div>
        <StatusButtons
          status={status1}
          onStatusChange={handleStatusChange(setStatus1)}
          isUpdating={isUpdating}
        />
      </Card>

      {/* Example 2: PREPARING Status */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 2: PREPARING Status</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Shows "جاهز للتقديم" (Mark Ready) button for orders being prepared
        </p>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">Current Status:</span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {status2}
          </span>
        </div>
        <StatusButtons
          status={status2}
          onStatusChange={handleStatusChange(setStatus2)}
          isUpdating={isUpdating}
        />
      </Card>

      {/* Example 3: Different Sizes */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 3: Different Sizes</h2>
        <p className="text-sm text-muted-foreground mb-4">
          StatusButtons supports multiple size variants
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Small (sm)</p>
            <StatusButtons
              status="PENDING"
              onStatusChange={() => {}}
              size="sm"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Default</p>
            <StatusButtons
              status="PENDING"
              onStatusChange={() => {}}
              size="default"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Large (lg)</p>
            <StatusButtons
              status="PENDING"
              onStatusChange={() => {}}
              size="lg"
            />
          </div>
        </div>
      </Card>

      {/* Example 4: Full Width vs Auto Width */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 4: Width Variants</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Control button width with the fullWidth prop
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Full Width (fullWidth=true)</p>
            <StatusButtons
              status="PENDING"
              onStatusChange={() => {}}
              fullWidth={true}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Auto Width (fullWidth=false)</p>
            <StatusButtons
              status="PENDING"
              onStatusChange={() => {}}
              fullWidth={false}
            />
          </div>
        </div>
      </Card>

      {/* Example 5: Loading State */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 5: Loading State</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Buttons are disabled during status updates (isUpdating=true)
        </p>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium">Current Status:</span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {status3}
          </span>
          {isUpdating && (
            <span className="text-sm text-muted-foreground">Updating...</span>
          )}
        </div>
        <StatusButtons
          status={status3}
          onStatusChange={handleStatusChange(setStatus3)}
          isUpdating={isUpdating}
        />
      </Card>

      {/* Example 6: Terminal States */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 6: Terminal States</h2>
        <p className="text-sm text-muted-foreground mb-4">
          No buttons shown for READY, DELIVERED, or CANCELLED orders
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">READY Status</p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                READY
              </span>
              <StatusButtons
                status="READY"
                onStatusChange={() => {}}
              />
              <span className="text-sm text-muted-foreground">(No buttons shown)</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">DELIVERED Status</p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                DELIVERED
              </span>
              <StatusButtons
                status="DELIVERED"
                onStatusChange={() => {}}
              />
              <span className="text-sm text-muted-foreground">(No buttons shown)</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">CANCELLED Status</p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                CANCELLED
              </span>
              <StatusButtons
                status="CANCELLED"
                onStatusChange={() => {}}
              />
              <span className="text-sm text-muted-foreground">(No buttons shown)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Example 7: In Order Card Layout */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 7: Order Card Layout</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Typical usage in an order card with details button
        </p>
        <Card className="p-6 bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">طلب #1234</h3>
              <p className="text-sm text-muted-foreground">طاولة 5</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              قيد الانتظار
            </span>
          </div>
          <div className="mb-4 p-3 bg-background rounded-lg">
            <p className="text-sm">2x برجر لحم</p>
            <p className="text-sm">1x بطاطس مقلية</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted">
              التفاصيل
            </button>
            <StatusButtons
              status="PENDING"
              onStatusChange={() => {}}
              size="default"
              fullWidth={true}
            />
          </div>
        </Card>
      </Card>

      {/* Example 8: Custom Styling */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 8: Custom Styling</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Apply custom classes with the className prop
        </p>
        <StatusButtons
          status="PENDING"
          onStatusChange={() => {}}
          className="border-t pt-4 mt-4"
        />
      </Card>

      {/* Example 9: Compact Layout */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Example 9: Compact Layout</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Small size with auto-width for compact layouts
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">حالة الطلب:</span>
          <StatusButtons
            status="PREPARING"
            onStatusChange={() => {}}
            size="sm"
            fullWidth={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default StatusButtonsExamples;
