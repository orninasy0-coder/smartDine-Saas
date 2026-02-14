/**
 * OrderCard Component
 * Displays individual order details for kitchen staff
 * Shows order items, quantities, special instructions, and status controls
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Hash, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Order } from '@/utils/types';
import { OrderTimer } from './OrderTimer';
import { StatusButtons } from './StatusButtons';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: 'PREPARING' | 'READY') => void;
  isUpdating?: boolean;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  isUpdating = false,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/kitchen/orders/${order.id}`);
  };

  const handleStatusChange = (newStatus: 'PREPARING' | 'READY') => {
    onStatusChange(order.id, newStatus);
  };

  const isPending = order.status === 'PENDING';

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
            <OrderTimer createdAt={order.createdAt} />
          </div>

          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPending
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
          >
            {isPending ? 'قيد الانتظار' : 'قيد التحضير'}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground">الأصناف:</h4>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{item.dish?.name || 'طبق غير معروف'}</p>
                {item.dish?.nameAr && (
                  <p className="text-sm text-muted-foreground">{item.dish.nameAr}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-primary">×{item.quantity}</span>
                <span className="text-sm text-muted-foreground">
                  {item.price.toFixed(2)} ر.س
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-300 mb-1">
                  ملاحظات خاصة:
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-400">
                  {order.specialInstructions}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t">
          <span className="text-sm font-medium text-muted-foreground">الإجمالي:</span>
          <span className="text-xl font-bold">{order.totalPrice.toFixed(2)} ر.س</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleViewDetails}
            variant="outline"
            size="lg"
            className="flex-shrink-0"
          >
            <Eye className="w-4 h-4 mr-2" />
            التفاصيل
          </Button>

          <StatusButtons
            status={order.status}
            onStatusChange={handleStatusChange}
            isUpdating={isUpdating}
            size="lg"
            fullWidth={true}
          />
        </div>
      </Card>
    </motion.div>
  );
};
