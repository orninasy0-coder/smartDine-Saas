/**
 * Kitchen Dashboard Demo Page
 * Public demo page to showcase kitchen dashboard features
 * Includes real-time notifications and order management
 */

import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { RealTimeNotification, useKitchenNotification } from '@/features/kitchen/components';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Volume2, VolumeX, ChefHat, Info } from 'lucide-react';
import type { Order } from '@/utils/types';

export const KitchenDashboardDemo: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const notification = useKitchenNotification();

  // Mock restaurant ID for demo
  const demoRestaurantId = 'demo-restaurant-1';

  // Mock orders for demo
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      restaurantId: demoRestaurantId,
      status: 'PENDING',
      totalPrice: 150.5,
      tableNumber: '5',
      specialInstructions: 'بدون بصل، مع صلصة إضافية',
      items: [
        {
          id: '1',
          orderId: '1',
          dishId: 'dish-1',
          quantity: 2,
          price: 75.25,
          dish: {
            id: 'dish-1',
            restaurantId: demoRestaurantId,
            name: 'Grilled Chicken',
            nameAr: 'دجاج مشوي',
            description: 'Delicious grilled chicken with herbs',
            descriptionAr: 'دجاج مشوي لذيذ مع الأعشاب',
            price: 75.25,
            category: 'Main Course',
            ingredients: ['chicken', 'herbs', 'spices'],
            allergens: [],
            isAvailable: true,
            createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ],
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      restaurantId: demoRestaurantId,
      status: 'PREPARING',
      totalPrice: 89.99,
      tableNumber: '12',
      items: [
        {
          id: '2',
          orderId: '2',
          dishId: 'dish-2',
          quantity: 1,
          price: 45.0,
          dish: {
            id: 'dish-2',
            restaurantId: demoRestaurantId,
            name: 'Beef Burger',
            nameAr: 'برجر لحم',
            description: 'Juicy beef burger with cheese',
            descriptionAr: 'برجر لحم شهي مع الجبن',
            price: 45.0,
            category: 'Main Course',
            ingredients: ['beef', 'cheese', 'lettuce', 'tomato'],
            allergens: ['dairy'],
            isAvailable: true,
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        {
          id: '3',
          orderId: '2',
          dishId: 'dish-3',
          quantity: 2,
          price: 22.5,
          dish: {
            id: 'dish-3',
            restaurantId: demoRestaurantId,
            name: 'French Fries',
            nameAr: 'بطاطس مقلية',
            description: 'Crispy golden fries',
            descriptionAr: 'بطاطس مقلية مقرمشة',
            price: 22.5,
            category: 'Sides',
            ingredients: ['potato', 'oil', 'salt'],
            allergens: [],
            isAvailable: true,
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ],
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      restaurantId: demoRestaurantId,
      status: 'PENDING',
      totalPrice: 65.0,
      tableNumber: '8',
      specialInstructions: 'عاجل - العميل في عجلة من أمره',
      items: [
        {
          id: '4',
          orderId: '3',
          dishId: 'dish-4',
          quantity: 1,
          price: 35.0,
          dish: {
            id: 'dish-4',
            restaurantId: demoRestaurantId,
            name: 'Caesar Salad',
            nameAr: 'سلطة سيزر',
            description: 'Fresh Caesar salad with chicken',
            descriptionAr: 'سلطة سيزر طازجة مع الدجاج',
            price: 35.0,
            category: 'Appetizers',
            ingredients: ['lettuce', 'chicken', 'parmesan', 'croutons'],
            allergens: ['dairy', 'gluten'],
            isAvailable: true,
            createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        {
          id: '5',
          orderId: '3',
          dishId: 'dish-5',
          quantity: 2,
          price: 15.0,
          dish: {
            id: 'dish-5',
            restaurantId: demoRestaurantId,
            name: 'Orange Juice',
            nameAr: 'عصير برتقال',
            description: 'Fresh orange juice',
            descriptionAr: 'عصير برتقال طازج',
            price: 15.0,
            category: 'Beverages',
            ingredients: ['orange'],
            allergens: [],
            isAvailable: true,
            createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ],
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const handleTestNotification = (type: 'new' | 'urgent' | 'success') => {
    const order = mockOrders[0];
    
    switch (type) {
      case 'new':
        notification.notifyNewOrder(order);
        break;
      case 'urgent':
        notification.notifyUrgent('طلب عاجل! العميل في عجلة من أمره', order);
        break;
      case 'success':
        notification.notifySuccess('تم تحضير الطلب بنجاح');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notification System */}
      <RealTimeNotification
        soundEnabled={soundEnabled}
        volume={volume}
        onNotificationClick={(notif) => {
          console.log('Notification clicked:', notif);
        }}
      />

      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">لوحة تحكم المطبخ - عرض توضيحي</h1>
              <p className="text-muted-foreground">
                عرض توضيحي لنظام إدارة طلبات المطبخ مع الإشعارات الفورية
              </p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <ChefHat className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Info Banner */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-300">
                <p className="font-medium mb-1">ملاحظة:</p>
                <p>
                  هذا عرض توضيحي للوحة تحكم المطبخ. في النظام الحقيقي، ستحتاج إلى تسجيل الدخول
                  كموظف مطبخ للوصول إلى هذه الصفحة على المسار <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">/kitchen/orders</code>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">إعدادات الإشعارات</h2>
            <Bell className="w-6 h-6 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sound Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تنبيهات صوتية</p>
                  <p className="text-sm text-muted-foreground">
                    تفعيل أو إيقاف الأصوات
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
                      مفعل
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      معطل
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">مستوى الصوت</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(volume * 100)}%
                </span>
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
          </div>

          {/* Test Buttons */}
          <div className="mt-6 pt-6 border-t">
            <p className="font-medium mb-3">اختبار الإشعارات:</p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleTestNotification('new')}
                variant="default"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                طلب جديد
              </Button>
              <Button
                onClick={() => handleTestNotification('urgent')}
                variant="destructive"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                تنبيه عاجل
              </Button>
              <Button
                onClick={() => handleTestNotification('success')}
                variant="outline"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                نجاح
              </Button>
            </div>
          </div>
        </Card>

        {/* Order Queue - Using mock data */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">الطلبات النشطة (بيانات تجريبية)</h2>
          
          {/* Status Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-1">قيد الانتظار</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
                {mockOrders.filter((o) => o.status === 'PENDING').length}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">قيد التحضير</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                {mockOrders.filter((o) => o.status === 'PREPARING').length}
              </p>
            </div>
          </div>

          {/* Note about real implementation */}
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>ملاحظة:</strong> في النظام الحقيقي، سيتم عرض الطلبات من قاعدة البيانات
              وسيتم تحديثها تلقائياً عبر WebSocket. هذا العرض يستخدم بيانات تجريبية ثابتة.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default KitchenDashboardDemo;
