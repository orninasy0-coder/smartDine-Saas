/**
 * RealTimeNotification Component Example
 * Demonstrates usage of the real-time notification system
 */

import React, { useState } from 'react';
import { RealTimeNotification, useKitchenNotification } from './RealTimeNotification';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Volume2, VolumeX, ChefHat, AlertCircle, CheckCircle } from 'lucide-react';
import type { Order } from '@/utils/types';

export default function RealTimeNotificationExample() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const notification = useKitchenNotification();

  // Mock order data
  const mockOrder: Order = {
    id: '1',
    orderNumber: 'ORD-001',
    restaurantId: 'rest-1',
    status: 'PENDING',
    totalPrice: 150.5,
    tableNumber: '5',
    specialInstructions: 'بدون بصل',
    items: [
      {
        id: '1',
        orderId: '1',
        dishId: 'dish-1',
        quantity: 2,
        price: 75.25,
        dish: {
          id: 'dish-1',
          restaurantId: 'rest-1',
          name: 'Grilled Chicken',
          nameAr: 'دجاج مشوي',
          description: 'Delicious grilled chicken',
          descriptionAr: 'دجاج مشوي لذيذ',
          price: 75.25,
          category: 'Main Course',
          ingredients: ['chicken', 'spices'],
          allergens: [],
          isAvailable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleNotificationClick = (notification: any) => {
    console.log('Notification clicked:', notification);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Real-Time Notification System</h1>
          <p className="text-muted-foreground">
            Kitchen notification component with sound alerts and toast messages
          </p>
        </div>

        {/* Notification Component */}
        <RealTimeNotification
          soundEnabled={soundEnabled}
          volume={volume}
          onNotificationClick={handleNotificationClick}
        />

        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Bell className="w-6 h-6 text-primary" />
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Sound Alerts</p>
              <p className="text-sm text-muted-foreground">
                Enable or disable notification sounds
              </p>
            </div>
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Enabled
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Disabled
                </>
              )}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">Volume</p>
              <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full"
              disabled={!soundEnabled}
            />
          </div>
        </Card>

        {/* Test Buttons */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Test Notifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Order */}
            <Button
              onClick={() => notification.notifyNewOrder(mockOrder)}
              className="h-auto py-4 flex-col items-start"
              variant="default"
            >
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="w-5 h-5" />
                <span className="font-bold">New Order</span>
              </div>
              <span className="text-xs opacity-80">
                Notify kitchen staff of a new order
              </span>
            </Button>

            {/* Status Update */}
            <Button
              onClick={() => notification.notifyStatusUpdate(mockOrder, 'PREPARING')}
              className="h-auto py-4 flex-col items-start"
              variant="secondary"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5" />
                <span className="font-bold">Status Update</span>
              </div>
              <span className="text-xs opacity-80">
                Notify about order status change
              </span>
            </Button>

            {/* Urgent Alert */}
            <Button
              onClick={() => notification.notifyUrgent('طلب عاجل! العميل ينتظر', mockOrder)}
              className="h-auto py-4 flex-col items-start"
              variant="destructive"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-bold">Urgent Alert</span>
              </div>
              <span className="text-xs opacity-80">
                High priority notification with sound
              </span>
            </Button>

            {/* Success */}
            <Button
              onClick={() => notification.notifySuccess('تم تحضير الطلب بنجاح')}
              className="h-auto py-4 flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">Success</span>
              </div>
              <span className="text-xs opacity-80">
                Success notification without sound
              </span>
            </Button>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Toast Notifications:</strong> Non-intrusive notifications using Sonner
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Sound Alerts:</strong> Customizable audio alerts with different tones
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Multiple Types:</strong> New order, status update, urgent, success, error
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Order Details:</strong> Display order number, table, and quick actions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Volume Control:</strong> Adjustable sound volume (0-100%)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Click Actions:</strong> Optional callback when notification is clicked
              </span>
            </li>
          </ul>
        </Card>

        {/* Usage Example */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Usage Example</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
            {`import { RealTimeNotification, useKitchenNotification } from './RealTimeNotification';

function KitchenDashboard() {
  const notification = useKitchenNotification();

  // Show notification for new order
  const handleNewOrder = (order: Order) => {
    notification.notifyNewOrder(order);
  };

  // Show urgent notification
  const handleUrgent = () => {
    notification.notifyUrgent('طلب عاجل!', order);
  };

  return (
    <div>
      <RealTimeNotification
        soundEnabled={true}
        volume={0.5}
        onNotificationClick={(notif) => {
          console.log('Clicked:', notif);
        }}
      />
      {/* Your dashboard content */}
    </div>
  );
}`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
