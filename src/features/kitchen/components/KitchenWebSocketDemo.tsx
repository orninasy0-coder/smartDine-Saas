/**
 * Kitchen WebSocket Demo Component
 * Demonstrates real-time WebSocket integration for kitchen dashboard
 * Shows connection status, order events, and notifications
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKitchenWebSocket } from '@/services/websocket';
import { useKitchenNotification } from './RealTimeNotification';
import { Wifi, WifiOff, Activity, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import type { Order } from '@/utils/types';

interface KitchenWebSocketDemoProps {
  restaurantId: string;
  onOrderReceived?: (order: Order) => void;
}

export const KitchenWebSocketDemo: React.FC<KitchenWebSocketDemoProps> = ({
  restaurantId,
  onOrderReceived,
}) => {
  const notification = useKitchenNotification();
  const [events, setEvents] = useState<Array<{ type: string; message: string; timestamp: Date }>>(
    []
  );

  // Setup WebSocket with callbacks
  const { isConnected, isConnecting, error, connect, disconnect, updateOrderStatus } =
    useKitchenWebSocket({
      restaurantId,
      autoConnect: true,
      debug: true,
      callbacks: {
        onOrderCreated: (order) => {
          // Show notification
          notification.notifyNewOrder(order);

          // Add to events log
          addEvent('order_created', `طلب جديد: ${order.orderNumber}`);

          // Call parent callback
          onOrderReceived?.(order);
        },
        onOrderUpdated: (order) => {
          addEvent('order_updated', `تحديث طلب: ${order.orderNumber}`);
        },
        onOrderStatusChanged: ({ order, status }) => {
          notification.notifyStatusUpdate(order, status);
          addEvent('status_changed', `تغيير حالة ${order.orderNumber} إلى ${status}`);
        },
        onKitchenNotification: (data) => {
          addEvent('notification', data.message);
        },
      },
    });

  const addEvent = (type: string, message: string) => {
    setEvents((prev) => [{ type, message, timestamp: new Date() }, ...prev.slice(0, 9)]);
  };

  const handleConnect = async () => {
    try {
      await connect();
      addEvent('system', 'تم الاتصال بالخادم');
    } catch (err) {
      addEvent('error', 'فشل الاتصال بالخادم');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    addEvent('system', 'تم قطع الاتصال');
  };

  const handleTestOrder = () => {
    // Simulate receiving a test order
    const testOrder: Order = {
      id: `test-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      restaurantId,
      status: 'PENDING',
      totalPrice: 99.99,
      tableNumber: '5',
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notification.notifyNewOrder(testOrder);
    addEvent('test', `طلب تجريبي: ${testOrder.orderNumber}`);
  };

  const handleTestStatusUpdate = () => {
    updateOrderStatus('test-order-id', 'PREPARING');
    addEvent('test', 'إرسال تحديث حالة تجريبي');
  };

  return (
    <div className="space-y-4">
      {/* Connection Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <Wifi className="w-6 h-6 text-green-500" />
            ) : (
              <WifiOff className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <h3 className="text-lg font-semibold">حالة الاتصال</h3>
              <p className="text-sm text-muted-foreground">
                {isConnecting
                  ? 'جاري الاتصال...'
                  : isConnected
                    ? 'متصل'
                    : 'غير متصل'}
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'نشط' : 'غير نشط'}
          </Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error.message}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isConnected ? (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? 'جاري الاتصال...' : 'اتصال'}
            </Button>
          ) : (
            <Button onClick={handleDisconnect} variant="outline">
              قطع الاتصال
            </Button>
          )}
          <Button onClick={handleTestOrder} variant="secondary" disabled={!isConnected}>
            <Bell className="w-4 h-4 mr-2" />
            طلب تجريبي
          </Button>
          <Button onClick={handleTestStatusUpdate} variant="secondary" disabled={!isConnected}>
            <CheckCircle className="w-4 h-4 mr-2" />
            تحديث تجريبي
          </Button>
        </div>
      </Card>

      {/* Events Log Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5" />
          <h3 className="text-lg font-semibold">سجل الأحداث</h3>
          <Badge variant="secondary">{events.length}</Badge>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              لا توجد أحداث بعد. سيتم عرض الأحداث هنا عند استلام الطلبات.
            </p>
          ) : (
            events.map((event, index) => (
              <div
                key={index}
                className="p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          event.type === 'order_created'
                            ? 'default'
                            : event.type === 'error'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-sm">{event.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Integration Info Card */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          معلومات التكامل
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>معرف المطعم:</strong> {restaurantId}
          </p>
          <p>
            <strong>الأحداث المدعومة:</strong>
          </p>
          <ul className="list-disc list-inside mr-4 space-y-1 text-muted-foreground">
            <li>order.created - طلب جديد</li>
            <li>order.updated - تحديث طلب</li>
            <li>order.status.changed - تغيير حالة</li>
            <li>kitchen.notification - إشعار المطبخ</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
