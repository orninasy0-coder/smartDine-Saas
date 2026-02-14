/**
 * DeliveryCard with Timer Integration Example
 * Shows how to integrate DeliveryTimer into DeliveryCard
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, MapPin, Package, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeliveryTimer } from './DeliveryTimer';
import type { Order } from '@/utils/types/index';
import { ORDER_STATUS } from '@/utils/constants';

interface EnhancedDeliveryCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: 'DELIVERING' | 'DELIVERED') => void;
  isUpdating?: boolean;
  estimatedDeliveryMinutes?: number;
  className?: string;
}

/**
 * Enhanced DeliveryCard with integrated DeliveryTimer
 * Combines order details with real-time delivery timing
 */
export const DeliveryCardWithTimer: React.FC<EnhancedDeliveryCardProps> = ({
  order,
  onStatusChange,
  isUpdating = false,
  estimatedDeliveryMinutes = 30,
  className = '',
}) => {
  const isReady = order.status === ORDER_STATUS.READY;
  const isDelivering = order.status === ORDER_STATUS.DELIVERING;

  const handleStartDelivery = () => {
    onStatusChange(order.id, ORDER_STATUS.DELIVERING);
  };

  const handleMarkDelivered = () => {
    onStatusChange(order.id, ORDER_STATUS.DELIVERED);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-xl font-bold">{order.orderNumber}</h3>
              {order.tableNumber && (
                <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                  طاولة {order.tableNumber}
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={isReady ? 'default' : 'secondary'}
            className={
              isReady
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }
          >
            {isReady ? 'جاهز للتوصيل' : 'قيد التوصيل'}
          </Badge>
        </div>

        {/* Delivery Timer - NEW INTEGRATION */}
        <DeliveryTimer
          readyAt={order.updatedAt}
          estimatedDeliveryMinutes={estimatedDeliveryMinutes}
          className="mb-4"
        />

        {/* Order Items Summary */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              الأصناف ({order.items.length}):
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">
                  {item.dish?.name || 'طبق غير معروف'}
                </span>
                <span className="text-muted-foreground">×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                عنوان التوصيل:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                {order.tableNumber 
                  ? `طاولة ${order.tableNumber} - داخل المطعم`
                  : 'سيتم إضافة عنوان التوصيل في المراحل القادمة'}
              </p>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t">
          <span className="text-sm font-medium text-muted-foreground">الإجمالي:</span>
          <span className="text-xl font-bold">{order.totalPrice.toFixed(2)} ر.س</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isReady && (
            <Button
              onClick={handleStartDelivery}
              disabled={isUpdating}
              size="lg"
              className="flex-1"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  بدء التوصيل
                </>
              )}
            </Button>
          )}

          {isDelivering && (
            <Button
              onClick={handleMarkDelivered}
              disabled={isUpdating}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  تم التسليم
                </>
              )}
            </Button>
          )}
        </div>

        {/* Delivery Instructions */}
        {order.specialInstructions && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm font-medium text-orange-900 dark:text-orange-300 mb-1">
              ملاحظات التوصيل:
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-400">
              {order.specialInstructions}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

/**
 * Example Usage Component
 */
export const DeliveryCardWithTimerExample: React.FC = () => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Mock orders with different elapsed times
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      restaurantId: 'rest-1',
      status: ORDER_STATUS.READY,
      totalPrice: 125.50,
      tableNumber: '5',
      items: [
        {
          id: 'item-1',
          orderId: '1',
          dishId: 'dish-1',
          quantity: 2,
          price: 45.00,
          dish: { id: 'dish-1', name: 'برجر كلاسيك' } as any,
        },
        {
          id: 'item-2',
          orderId: '1',
          dishId: 'dish-2',
          quantity: 1,
          price: 35.50,
          dish: { id: 'dish-2', name: 'بطاطس مقلية' } as any,
        },
      ],
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Ready 5 minutes ago
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      restaurantId: 'rest-1',
      status: ORDER_STATUS.DELIVERING,
      totalPrice: 287.00,
      tableNumber: '12',
      specialInstructions: 'يرجى التوصيل بسرعة - طلب عاجل',
      items: [
        {
          id: 'item-3',
          orderId: '2',
          dishId: 'dish-3',
          quantity: 3,
          price: 95.67,
          dish: { id: 'dish-3', name: 'بيتزا مارجريتا' } as any,
        },
      ],
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // Ready 35 minutes ago (CRITICAL)
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      restaurantId: 'rest-1',
      status: ORDER_STATUS.READY,
      totalPrice: 156.75,
      tableNumber: '8',
      items: [
        {
          id: 'item-4',
          orderId: '3',
          dishId: 'dish-4',
          quantity: 2,
          price: 78.38,
          dish: { id: 'dish-4', name: 'سلطة سيزر' } as any,
        },
      ],
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // Ready 20 minutes ago (WARNING)
    },
  ];

  const handleStatusChange = (orderId: string, status: 'DELIVERING' | 'DELIVERED') => {
    setUpdatingOrderId(orderId);
    
    // Simulate API call
    setTimeout(() => {
      console.log(`Order ${orderId} status changed to ${status}`);
      setUpdatingOrderId(null);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2">DeliveryCard with Timer Integration</h1>
        <p className="text-muted-foreground">
          Enhanced delivery cards with real-time timing information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockOrders.map((order) => (
          <DeliveryCardWithTimer
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            isUpdating={updatingOrderId === order.id}
            estimatedDeliveryMinutes={30}
          />
        ))}
      </div>

      {/* Integration Notes */}
      <Card className="p-6 bg-muted/50">
        <h2 className="text-xl font-semibold mb-4">Integration Benefits</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✅ Real-time elapsed time display</li>
          <li>✅ Visual urgency indicators (green → orange → red)</li>
          <li>✅ Progress bar for quick assessment</li>
          <li>✅ Estimated vs actual time comparison</li>
          <li>✅ Automatic updates every second</li>
          <li>✅ Consistent with existing card design</li>
          <li>✅ Dark mode support</li>
          <li>✅ Responsive layout</li>
        </ul>
      </Card>
    </div>
  );
};

export default DeliveryCardWithTimerExample;
