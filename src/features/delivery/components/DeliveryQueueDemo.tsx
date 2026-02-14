/**
 * DeliveryQueueDemo Component
 * Demo/Example component showcasing the DeliveryQueue functionality
 * For development and testing purposes
 */

import React from 'react';
import { DeliveryQueue } from './DeliveryQueue';
import { Container } from '@/components/common/Container';

export const DeliveryQueueDemo: React.FC = () => {
  // Mock restaurant ID for demo
  const mockRestaurantId = 'demo-restaurant-123';

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">لوحة تحكم التوصيل - عرض توضيحي</h1>
        <p className="text-muted-foreground">
          هذه صفحة توضيحية لعرض واجهة موظف التوصيل. في الإنتاج، سيتم استخدام معرف المطعم الفعلي من بيانات المستخدم.
        </p>
      </div>

      <DeliveryQueue restaurantId={mockRestaurantId} />

      {/* Demo Instructions */}
      <div className="mt-8 p-6 bg-muted/50 border border-border rounded-lg">
        <h2 className="text-lg font-semibold mb-3">تعليمات الاستخدام:</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">1.</span>
            <span>الطلبات الجاهزة للتوصيل تظهر في القسم "جاهز للتوصيل"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">2.</span>
            <span>اضغط على "بدء التوصيل" لبدء توصيل الطلب</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">3.</span>
            <span>بعد التوصيل، اضغط على "تم التسليم" لإكمال الطلب</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">4.</span>
            <span>استخدم الفلاتر لعرض طلبات محددة (الكل، جاهز، قيد التوصيل)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">5.</span>
            <span>يتم تحديث القائمة تلقائياً عند جاهزية طلبات جديدة</span>
          </li>
        </ul>
      </div>

      {/* Feature Status */}
      <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-300">
          الميزات المتاحة:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span>عرض الطلبات الجاهزة للتوصيل</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span>تحديثات فورية عبر WebSocket</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span>تصفية حسب الحالة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span>عرض تفاصيل الطلب</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">⏳</span>
            <span>خريطة التوصيل (قريباً)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">⏳</span>
            <span>تحسين المسار (قريباً)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">⏳</span>
            <span>مؤقت التوصيل (قريباً)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">⏳</span>
            <span>معلومات الاتصال بالعميل (قريباً)</span>
          </div>
        </div>
      </div>
    </Container>
  );
};
