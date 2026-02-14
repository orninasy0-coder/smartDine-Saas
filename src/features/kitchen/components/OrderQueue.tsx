/**
 * OrderQueue Component
 * Displays list of pending and preparing orders for kitchen staff
 * Sorted by submission time (oldest first)
 * Updates in real-time when new orders arrive
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChefHat, RefreshCw, AlertCircle, Wifi, WifiOff, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { OrderStatus, Order } from '@/utils/types';
import { ORDER_STATUS } from '@/utils/constants';
import { OrderCard } from './OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/features/orders/services';
import { toast } from 'sonner';
import { useKitchenWebSocket } from '@/services/websocket';
import { useKitchenNotification } from './RealTimeNotification';

interface OrderQueueProps {
  restaurantId: string;
  className?: string;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({ restaurantId, className = '' }) => {
  const queryClient = useQueryClient();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const notification = useKitchenNotification();

  // Fetch orders with PENDING or PREPARING status
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrders({
    restaurantId,
    status: undefined, // Will be filtered on backend to show PENDING and PREPARING
  });

  // Setup WebSocket for real-time updates
  const { isConnected, isConnecting, error: wsError, disconnect } = useKitchenWebSocket({
    restaurantId,
    autoConnect: true,
    debug: false,
    callbacks: {
      onOrderCreated: (order: Order) => {
        // Show notification for new order
        notification.notifyNewOrder(order);
        
        // Invalidate queries to refetch orders
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        
        toast.success('طلب جديد!', {
          description: `طلب رقم ${order.orderNumber} - طاولة ${order.tableNumber || 'غير محدد'}`,
        });
      },
      onOrderUpdated: () => {
        // Invalidate queries to refetch orders
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      onOrderStatusChanged: ({ order, status }) => {
        // Show notification for status change
        notification.notifyStatusUpdate(order, status);
        
        // Invalidate queries to refetch orders
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    },
  });

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Filter orders to show only PENDING and PREPARING
  const filteredOrders = orders?.filter(
    (order) => order.status === 'PENDING' || order.status === 'PREPARING'
  ) || [];

  // Apply status filter
  const statusFilteredOrders = statusFilter === 'ALL' 
    ? filteredOrders 
    : filteredOrders.filter((order) => order.status === statusFilter);

  // Sort by createdAt (oldest first)
  const sortedOrders = [...statusFilteredOrders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Calculate counts for each status
  const statusCounts = {
    ALL: filteredOrders.length,
    PENDING: filteredOrders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    PREPARING: filteredOrders.filter((o) => o.status === ORDER_STATUS.PREPARING).length,
  };

  // Mutation for updating order status
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(orderId, status),
    onMutate: async ({ orderId }) => {
      setUpdatingOrderId(orderId);
    },
    onSuccess: (updatedOrder) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(
        updatedOrder.status === 'PREPARING'
          ? 'تم بدء تحضير الطلب'
          : 'تم تجهيز الطلب وهو جاهز للتقديم',
        {
          description: `طلب رقم ${updatedOrder.orderNumber}`,
        }
      );
    },
    onError: (error: Error) => {
      toast.error('فشل تحديث حالة الطلب', {
        description: error.message || 'حدث خطأ أثناء تحديث الطلب',
      });
    },
    onSettled: () => {
      setUpdatingOrderId(null);
    },
  });

  const handleStatusChange = (orderId: string, status: 'PREPARING' | 'READY') => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <Loading size="lg" text="جاري تحميل الطلبات..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={className}>
        <ErrorMessage
          message={error?.message || 'حدث خطأ أثناء تحميل الطلبات'}
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">طلبات المطبخ</h1>
            <p className="text-sm text-muted-foreground">
              {sortedOrders.length} {sortedOrders.length === 1 ? 'طلب' : 'طلبات'} نشطة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* WebSocket Status Indicator */}
          <Badge
            variant={isConnected ? 'default' : 'secondary'}
            className="flex items-center gap-1.5"
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>متصل</span>
              </>
            ) : isConnecting ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>جاري الاتصال...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>غير متصل</span>
              </>
            )}
          </Badge>

          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* WebSocket Error Alert */}
      {wsError && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              تحذير: التحديثات الفورية غير متاحة. يرجى تحديث الصفحة يدوياً.
            </span>
          </div>
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-1">قيد الانتظار</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
            {statusCounts.PENDING}
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">قيد التحضير</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
            {statusCounts.PREPARING}
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">تصفية حسب الحالة:</span>
        </div>
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'ALL')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ALL" className="relative">
              الكل
              {statusCounts.ALL > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {statusCounts.ALL}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value={ORDER_STATUS.PENDING} className="relative">
              قيد الانتظار
              {statusCounts.PENDING > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {statusCounts.PENDING}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value={ORDER_STATUS.PREPARING} className="relative">
              قيد التحضير
              {statusCounts.PREPARING > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {statusCounts.PREPARING}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      {sortedOrders.length === 0 ? (
        <EmptyState
          title={
            statusFilter === 'ALL'
              ? 'لا توجد طلبات نشطة'
              : statusFilter === ORDER_STATUS.PENDING
              ? 'لا توجد طلبات قيد الانتظار'
              : 'لا توجد طلبات قيد التحضير'
          }
          description={
            statusFilter === 'ALL'
              ? 'سيتم عرض الطلبات الجديدة هنا تلقائياً'
              : 'جرب تغيير الفلتر لعرض طلبات أخرى'
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                isUpdating={updatingOrderId === order.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Info Banner */}
      {sortedOrders.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">ملاحظة:</p>
              <p>
                {isConnected
                  ? 'يتم تحديث قائمة الطلبات تلقائياً عند استلام طلبات جديدة. الطلبات مرتبة حسب وقت الاستلام (الأقدم أولاً).'
                  : 'التحديثات الفورية غير متاحة حالياً. يرجى استخدام زر التحديث لتحديث القائمة يدوياً.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
