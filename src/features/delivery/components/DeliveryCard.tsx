/**
 * DeliveryCard Component
 * Displays individual delivery order details
 * Shows order items, delivery address, and status controls
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Hash, MapPin, Clock, Package, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/utils/types/index';
import { ORDER_STATUS } from '@/utils/constants';

interface DeliveryCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: 'DELIVERING' | 'DELIVERED') => void;
  isUpdating?: boolean;
  className?: string;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  order,
  onStatusChange,
  isUpdating = false,
  className = '',
}) => {
  const isReady = order.status === ORDER_STATUS.READY;
  const isDelivering = order.status === ORDER_STATUS.DELIVERING;

  // Calculate time since order was ready
  const getTimeSinceReady = () => {
    const now = new Date();
    const readyTime = new Date(order.updatedAt);
    const diffMs = now.getTime() - readyTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `${diffMins} دقيقة`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}`;
  };

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
            
            {/* Time Since Ready */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>جاهز منذ {getTimeSinceReady()}</span>
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

        {/* Delivery Address (Placeholder - will be enhanced in future tasks) */}
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
            <>
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
            </>
          )}

          {isDelivering && (
            <>
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
            </>
          )}
        </div>

        {/* Delivery Instructions (if any) */}
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
