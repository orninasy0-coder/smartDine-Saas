/**
 * Kitchen Order Detail Page
 * Detailed view of a single order for kitchen staff
 * Shows complete order information with status management
 */

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, AlertCircle, Hash, Clock, User, MapPin } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OrderTimer } from '@/features/kitchen/components/OrderTimer';
import { StatusButtons } from '@/features/kitchen/components/StatusButtons';
import { useAuthStore } from '@/store/authStore';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/features/orders/services';
import { toast } from 'sonner';
import { ROUTES } from '@/utils/constants';
import type { OrderStatus } from '@/utils/types';

export const KitchenOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated or not kitchen staff
  if (!isAuthenticated || user?.role !== 'kitchen') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const restaurantId = user?.restaurantId;

  if (!restaurantId) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">خطأ</h1>
          <p className="text-muted-foreground">
            لم يتم العثور على معرف المطعم. يرجى التواصل مع المسؤول.
          </p>
        </div>
      </Container>
    );
  }

  // Fetch all orders and find the specific one
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrders({
    restaurantId,
  });

  const order = orders?.find((o) => o.id === orderId);

  // Mutation for updating order status
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: (updatedOrder) => {
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
  });

  const handleBack = () => {
    navigate('/kitchen/orders');
  };

  const handleStatusChange = (newStatus: 'PREPARING' | 'READY') => {
    if (orderId) {
      updateStatusMutation.mutate({ orderId, status: newStatus });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loading size="lg" text="جاري تحميل تفاصيل الطلب..." />
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="py-8">
          <ErrorMessage
            message={error?.message || 'حدث خطأ أثناء تحميل تفاصيل الطلب'}
            onRetry={refetch}
          />
        </Container>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">الطلب غير موجود</h1>
            <p className="text-muted-foreground mb-6">
              لم يتم العثور على الطلب المطلوب
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة إلى قائمة الطلبات
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const isPending = order.status === 'PENDING';
  const isPreparing = order.status === 'PREPARING';
  const isReady = order.status === 'READY';
  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  const getStatusBadge = () => {
    if (isPending) {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          قيد الانتظار
        </span>
      );
    }
    if (isPreparing) {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          قيد التحضير
        </span>
      );
    }
    if (isReady) {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          جاهز للتقديم
        </span>
      );
    }
    if (isDelivered) {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
          تم التوصيل
        </span>
      );
    }
    if (isCancelled) {
      return (
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          ملغي
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة إلى قائمة الطلبات
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">تفاصيل الطلب</h1>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    <span className="font-mono">{order.orderNumber}</span>
                  </div>
                  {order.tableNumber && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>طاولة {order.tableNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                الأصناف المطلوبة
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {item.dish?.name || 'طبق غير معروف'}
                      </h3>
                      {item.dish?.nameAr && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.dish.nameAr}
                        </p>
                      )}
                      {item.dish?.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.dish.description}
                        </p>
                      )}
                      {item.dish?.ingredients && item.dish.ingredients.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            المكونات:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.dish.ingredients.map((ingredient, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-background border rounded"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ×{item.quantity}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)} ر.س
                      </span>
                      <span className="text-sm font-medium">
                        {(item.price * item.quantity).toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-xl">
                  <span className="font-medium">الإجمالي:</span>
                  <span className="font-bold text-2xl">
                    {order.totalPrice.toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </Card>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <Card className="p-6 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">
                      ملاحظات خاصة
                    </h3>
                    <p className="text-orange-800 dark:text-orange-400 leading-relaxed">
                      {order.specialInstructions}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">معلومات الطلب</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">الوقت المنقضي</p>
                    <OrderTimer createdAt={order.createdAt} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">رقم الطلب</p>
                    <p className="font-mono font-medium">{order.orderNumber}</p>
                  </div>
                </div>

                {order.tableNumber && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">رقم الطاولة</p>
                      <p className="font-medium">طاولة {order.tableNumber}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">عدد الأصناف</p>
                    <p className="font-medium">{order.items.length} صنف</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">تاريخ الطلب</p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleString('ar-SA', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            {(isPending || isPreparing) && (
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">إجراءات</h2>
                <StatusButtons
                  status={order.status}
                  onStatusChange={handleStatusChange}
                  isUpdating={updateStatusMutation.isPending}
                  size="lg"
                  fullWidth={true}
                />
              </Card>
            )}

            {/* Status History */}
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">حالة الطلب</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isPending || isPreparing || isReady || isDelivered
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">تم استلام الطلب</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString('ar-SA')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isPreparing || isReady || isDelivered
                      ? 'bg-green-500'
                      : isPending
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">قيد التحضير</p>
                    {isPreparing && (
                      <p className="text-xs text-muted-foreground">جاري التحضير الآن</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isReady || isDelivered
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">جاهز للتقديم</p>
                    {isReady && (
                      <p className="text-xs text-muted-foreground">في انتظار التوصيل</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isDelivered ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">تم التوصيل</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
