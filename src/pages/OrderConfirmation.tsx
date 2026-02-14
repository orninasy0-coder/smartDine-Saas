/**
 * Order Confirmation Page
 * Displays order details after successful submission
 * Shows order number, items, status, and tracking information
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  ChefHat,
  Package,
  Home,
  ShoppingCart,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/common/Container';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { Order, OrderStatus } from '@/utils/types';

// Mock order data - will be replaced with API call
const mockOrder: Order = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  orderNumber: 'ORD-2024-001',
  restaurantId: 'restaurant-1',
  customerId: 'customer-1',
  status: 'PENDING',
  totalPrice: 125.5,
  tableNumber: '5',
  specialInstructions: 'لا بصل من فضلك',
  items: [
    {
      id: 'item-1',
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      dishId: 'dish-1',
      quantity: 2,
      price: 45.0,
      dish: {
        id: 'dish-1',
        restaurantId: 'restaurant-1',
        name: 'برجر كلاسيك',
        description: 'برجر لحم بقري مع الخضار الطازجة',
        price: 45.0,
        category: 'main',
        imageUrl: '/images/burger.jpg',
        ingredients: ['لحم بقري', 'خس', 'طماطم', 'بصل'],
        allergens: ['جلوتين'],
        isAvailable: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    },
    {
      id: 'item-2',
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      dishId: 'dish-2',
      quantity: 1,
      price: 35.5,
      dish: {
        id: 'dish-2',
        restaurantId: 'restaurant-1',
        name: 'سلطة سيزر',
        description: 'سلطة سيزر كلاسيكية مع الدجاج المشوي',
        price: 35.5,
        category: 'appetizer',
        imageUrl: '/images/salad.jpg',
        ingredients: ['خس', 'دجاج', 'جبن بارميزان', 'خبز محمص'],
        allergens: ['ألبان', 'جلوتين'],
        isAvailable: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const statusConfig: Record<
  OrderStatus,
  {
    icon: React.ElementType;
    label: string;
    description: string;
    color: string;
  }
> = {
  PENDING: {
    icon: Clock,
    label: 'قيد الانتظار',
    description: 'تم استلام طلبك وسيتم تحضيره قريباً',
    color: 'text-yellow-500',
  },
  PREPARING: {
    icon: ChefHat,
    label: 'قيد التحضير',
    description: 'يتم تحضير طلبك الآن في المطبخ',
    color: 'text-blue-500',
  },
  READY: {
    icon: Package,
    label: 'جاهز',
    description: 'طلبك جاهز للتوصيل',
    color: 'text-green-500',
  },
  DELIVERED: {
    icon: CheckCircle,
    label: 'تم التوصيل',
    description: 'تم توصيل طلبك بنجاح',
    color: 'text-green-600',
  },
  CANCELLED: {
    icon: Clock,
    label: 'ملغي',
    description: 'تم إلغاء الطلب',
    color: 'text-red-500',
  },
};

export const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId, orderId } = useParams<{ restaurantId: string; orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOrder(mockOrder);
      } catch (err) {
        setError('فشل في تحميل تفاصيل الطلب');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleBackToMenu = () => {
    navigate(`/${restaurantId}/menu`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Container className="py-8">
          <ErrorMessage message={error || 'لم يتم العثور على الطلب'} />
          <div className="text-center mt-6">
            <Button onClick={handleBackToMenu}>العودة إلى القائمة</Button>
          </div>
        </Container>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">تم تأكيد طلبك!</h1>
          <p className="text-muted-foreground text-lg">
            رقم الطلب: <span className="font-semibold text-primary">{order.orderNumber}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-muted ${statusInfo.color}`}>
                    <statusInfo.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">{statusInfo.label}</h2>
                    <p className="text-muted-foreground">{statusInfo.description}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.status !== 'CANCELLED' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">تم استلام الطلب</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        ['PREPARING', 'READY', 'DELIVERED'].includes(order.status)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">قيد التحضير</p>
                      <p className="text-sm text-muted-foreground">
                        {['PREPARING', 'READY', 'DELIVERED'].includes(order.status)
                          ? 'جاري التحضير'
                          : 'في انتظار التحضير'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        ['READY', 'DELIVERED'].includes(order.status)
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">جاهز للتوصيل</p>
                      <p className="text-sm text-muted-foreground">
                        {['READY', 'DELIVERED'].includes(order.status)
                          ? 'الطلب جاهز'
                          : 'في انتظار الجاهزية'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">تم التوصيل</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === 'DELIVERED' ? 'تم التوصيل بنجاح' : 'في انتظار التوصيل'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">تفاصيل الطلب</h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      {item.dish?.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.dish.imageUrl}
                            alt={item.dish.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.dish?.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          الكمية: {item.quantity}
                        </p>
                        <p className="text-primary font-medium">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">ملاحظات خاصة:</p>
                    <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Delivery Information */}
            {order.tableNumber && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">معلومات التوصيل</h2>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رقم الطاولة:</span>
                      <span className="font-medium">{order.tableNumber}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8"
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">ملخص الطلب</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">عدد الأصناف</span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">إجمالي القطع</span>
                    <span className="font-medium">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">الإجمالي</span>
                      <span className="text-2xl font-bold text-primary">
                        {order.totalPrice.toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" onClick={handleBackToMenu}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    طلب المزيد
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleGoHome}>
                    <Home className="w-5 h-5 mr-2" />
                    العودة للرئيسية
                  </Button>
                </div>

                {/* Estimated Time */}
                {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium">الوقت المتوقع</p>
                    </div>
                    <p className="text-2xl font-bold">20-30 دقيقة</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};
