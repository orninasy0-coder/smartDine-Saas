/**
 * DeliveryQueue Example
 * Shows how to use the DeliveryQueue component in a page
 */

import React from 'react';
import { DeliveryQueue } from './DeliveryQueue';

/**
 * Example 1: Basic Usage
 * Simple delivery queue for a specific restaurant
 */
export const BasicDeliveryQueueExample: React.FC = () => {
  const restaurantId = 'restaurant-123';

  return (
    <div className="container mx-auto py-8">
      <DeliveryQueue restaurantId={restaurantId} />
    </div>
  );
};

/**
 * Example 2: With Custom Styling
 * Delivery queue with custom container styling
 */
export const StyledDeliveryQueueExample: React.FC = () => {
  const restaurantId = 'restaurant-123';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        <DeliveryQueue 
          restaurantId={restaurantId}
          className="max-w-6xl mx-auto"
        />
      </div>
    </div>
  );
};

/**
 * Example 3: In a Dashboard Layout
 * Delivery queue as part of a larger dashboard
 */
export const DashboardDeliveryQueueExample: React.FC = () => {
  const restaurantId = 'restaurant-123';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">لوحة التحكم</h2>
        <nav className="space-y-2">
          <a href="#" className="block p-2 rounded hover:bg-gray-800">
            الطلبات النشطة
          </a>
          <a href="#" className="block p-2 rounded hover:bg-gray-800">
            سجل التوصيل
          </a>
          <a href="#" className="block p-2 rounded hover:bg-gray-800">
            الإحصائيات
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <DeliveryQueue restaurantId={restaurantId} />
      </main>
    </div>
  );
};

/**
 * Example 4: With Header and Stats
 * Complete delivery page with header and statistics
 */
export const CompleteDeliveryPageExample: React.FC = () => {
  const restaurantId = 'restaurant-123';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">مرحباً، أحمد</h1>
              <p className="text-sm text-muted-foreground">موظف توصيل</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">التوصيلات اليوم</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">الأرباح</p>
                <p className="text-2xl font-bold">240 ر.س</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <DeliveryQueue restaurantId={restaurantId} />
      </main>
    </div>
  );
};

/**
 * Example 5: Mobile Optimized
 * Delivery queue optimized for mobile devices
 */
export const MobileDeliveryQueueExample: React.FC = () => {
  const restaurantId = 'restaurant-123';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">طلبات التوصيل</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        <DeliveryQueue restaurantId={restaurantId} />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-card">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center gap-1 px-4 py-2">
            <span className="text-xs">الطلبات</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2">
            <span className="text-xs">الخريطة</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2">
            <span className="text-xs">السجل</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

/**
 * Usage in a Route:
 * 
 * import { DeliveryQueue } from '@/features/delivery';
 * import { useAuth } from '@/features/auth';
 * 
 * const DeliveryPage = () => {
 *   const { user } = useAuth();
 *   
 *   if (!user?.restaurantId) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   return <DeliveryQueue restaurantId={user.restaurantId} />;
 * };
 */
