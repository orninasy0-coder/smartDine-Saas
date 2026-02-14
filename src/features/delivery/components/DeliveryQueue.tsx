/**
 * DeliveryQueue Component
 * Displays list of ready orders awaiting delivery
 * Sorted by ready time (oldest first)
 * Updates in real-time when orders become ready
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Truck, RefreshCw, AlertCircle, Wifi, WifiOff, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { OrderStatus, Order } from '@/utils/types/index';
import { ORDER_STATUS } from '@/utils/constants';
import { DeliveryCard } from './DeliveryCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/features/orders/services';
import { toast } from 'sonner';
import { useKitchenWebSocket } from '@/services/websocket';

interface DeliveryQueueProps {
  restaurantId: string;
  className?: string;
}

export const DeliveryQueue: React.FC<DeliveryQueueProps> = ({ restaurantId, className = '' }) => {
  const queryClient = useQueryClient();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  // Fetch orders with READY or DELIVERING status
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrders({
    restaurantId,
    status: undefined, // Will be filtered to show READY and DELIVERING
  });

  // Setup WebSocket for real-time updates
  const { isConnected, isConnecting, error: wsError, disconnect } = useKitchenWebSocket({
    restaurantId,
    autoConnect: true,
    debug: false,
    callbacks: {
      onOrderStatusChanged: ({ order, status }) => {
        // Invalidate queries when order status changes to READY
        if (status === ORDER_STATUS.READY) {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          toast.success('طلب جديد جاهز للتوصيل!', {
            description: `طلب رقم ${order.orderNumber}`,
          });
        }
      },
      onOrderUpdated: () => {
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

  // Filter orders to show only READY and DELIVERING
  const filteredOrders = orders?.filter(
    (order) => order.status === ORDER_STATUS.READY || order.status === ORDER_STATUS.DELIVERING
  ) || [];

  // Apply status filter
  const statusFilteredOrders = statusFilter === 'ALL' 
    ? filteredOrders 
    : filteredOrders.filter((order) => order.status === statusFilter);

  // Sort by updatedAt (oldest ready orders first)
  const sortedOrders = [...statusFilteredOrders].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  // Calculate counts for each status
  const statusCounts = {
    ALL: filteredOrders.length,
    READY: filteredOrders.filter((o) => o.status === ORDER_STATUS.READY).length,
    DELIVERING: filteredOrders.filter((o) => o.status === ORDER_STATUS.DELIVERING).length,
  };

  // Mutation for updating order status
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(orderId, status),
    onMutate: async ({ orderId }) => {
      setUpdatingOrderId(orderId);
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(
        updatedOrder.status === ORDER_STATUS.DELIVERING
          ? 'تم بدء التوصيل'
          : 'تم تسليم الطلب بنجاح',
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

  const handleStatusChange = (orderId: string, status: 'DELIVERING' | 'DELIVERED') => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <Loading size="lg" text="جاري تحميل طلبات التوصيل..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={className}>
        <ErrorMessage
          message={error?.message || 'حدث خطأ أثناء تحميل طلبات التوصيل'}
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
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">طلبات التوصيل</h1>
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
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300 mb-1">جاهز للتوصيل</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-200">
            {statusCounts.READY}
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">قيد التوصيل</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
            {statusCounts.DELIVERING}
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
            <TabsTrigger value={ORDER_STATUS.READY} className="relative">
              جاهز
              {statusCounts.READY > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {statusCounts.READY}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value={ORDER_STATUS.DELIVERING} className="relative">
              قيد التوصيل
              {statusCounts.DELIVERING > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {statusCounts.DELIVERING}
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
              ? 'لا توجد طلبات جاهزة للتوصيل'
              : statusFilter === ORDER_STATUS.READY
              ? 'لا توجد طلبات جاهزة'
              : 'لا توجد طلبات قيد التوصيل'
          }
          description={
            statusFilter === 'ALL'
              ? 'سيتم عرض الطلبات الجاهزة هنا تلقائياً'
              : 'جرب تغيير الفلتر لعرض طلبات أخرى'
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedOrders.map((order) => (
              <DeliveryCard
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
                  ? 'يتم تحديث قائمة الطلبات تلقائياً عند جاهزية طلبات جديدة. الطلبات مرتبة حسب وقت الجاهزية (الأقدم أولاً).'
                  : 'التحديثات الفورية غير متاحة حالياً. يرجى استخدام زر التحديث لتحديث القائمة يدوياً.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
