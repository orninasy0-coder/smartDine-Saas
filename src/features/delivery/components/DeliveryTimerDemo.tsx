/**
 * DeliveryTimerDemo Component
 * Interactive demo showcasing DeliveryTimer component
 * Allows testing different scenarios and configurations
 */

import React, { useState } from 'react';
import { DeliveryTimer } from './DeliveryTimer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, RotateCcw, Plus, Minus } from 'lucide-react';

export const DeliveryTimerDemo: React.FC = () => {
  const [readyAt, setReadyAt] = useState<Date>(new Date());
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [compact, setCompact] = useState<boolean>(false);

  // Preset scenarios
  const scenarios = [
    { label: 'الآن', minutes: 0 },
    { label: '5 دقائق', minutes: 5 },
    { label: '15 دقيقة', minutes: 15 },
    { label: '25 دقيقة', minutes: 25 },
    { label: '35 دقيقة', minutes: 35 },
    { label: '1 ساعة', minutes: 60 },
  ];

  const handleSetScenario = (minutesAgo: number) => {
    const newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() - minutesAgo);
    setReadyAt(newTime);
  };

  const handleReset = () => {
    setReadyAt(new Date());
    setEstimatedMinutes(30);
    setCompact(false);
  };

  const adjustEstimatedTime = (delta: number) => {
    setEstimatedMinutes((prev) => Math.max(5, Math.min(120, prev + delta)));
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">DeliveryTimer Demo</h1>
        <p className="text-muted-foreground">
          تجربة تفاعلية لمكون مؤقت التوصيل
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">التحكم في المؤقت</h2>

        {/* Scenario Buttons */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              اختر سيناريو (الوقت المنقضي):
            </label>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((scenario) => (
                <Button
                  key={scenario.minutes}
                  onClick={() => handleSetScenario(scenario.minutes)}
                  variant="outline"
                  size="sm"
                >
                  {scenario.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Estimated Time Control */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              الوقت المتوقع للتوصيل: {estimatedMinutes} دقيقة
            </label>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => adjustEstimatedTime(-5)}
                variant="outline"
                size="sm"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(estimatedMinutes / 120) * 100}%` }}
                />
              </div>
              <Button
                onClick={() => adjustEstimatedTime(5)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5 دقائق</span>
              <span>120 دقيقة</span>
            </div>
          </div>

          {/* Display Mode Toggle */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              وضع العرض:
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setCompact(false)}
                variant={!compact ? 'default' : 'outline'}
                size="sm"
              >
                كامل
              </Button>
              <Button
                onClick={() => setCompact(true)}
                variant={compact ? 'default' : 'outline'}
                size="sm"
              >
                مضغوط
              </Button>
            </div>
          </div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="secondary" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* Timer Display */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">المؤقت</h2>
          <Badge variant="outline">
            تحديث مباشر
          </Badge>
        </div>
        <DeliveryTimer
          readyAt={readyAt}
          estimatedDeliveryMinutes={estimatedMinutes}
          compact={compact}
        />
      </Card>

      {/* Example Integration */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">مثال على التكامل</h2>
        <p className="text-sm text-muted-foreground mb-4">
          كيف يظهر المؤقت في بطاقة طلب توصيل حقيقية
        </p>
        
        <div className="border rounded-lg p-6 bg-card">
          {/* Order Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">طلب #ORD-12345</h3>
              <p className="text-sm text-muted-foreground">طاولة 8</p>
            </div>
            <Badge variant="secondary">قيد التوصيل</Badge>
          </div>

          {/* Timer */}
          <DeliveryTimer
            readyAt={readyAt}
            estimatedDeliveryMinutes={estimatedMinutes}
            className="mb-4"
          />

          {/* Order Details */}
          <div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>برجر كلاسيك</span>
              <span className="text-muted-foreground">×2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>بطاطس مقلية</span>
              <span className="text-muted-foreground">×1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>مشروب غازي</span>
              <span className="text-muted-foreground">×2</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-medium">الإجمالي:</span>
            <span className="text-xl font-bold">125.50 ر.س</span>
          </div>

          {/* Action Button */}
          <Button className="w-full mt-4" size="lg">
            تم التسليم
          </Button>
        </div>
      </Card>

      {/* Features List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">الميزات</h2>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>
              <strong>تحديث تلقائي:</strong> يتم تحديث المؤقت كل ثانية تلقائياً
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>
              <strong>مؤشرات الإلحاح:</strong> ثلاثة مستويات (عادي، تحذير، حرج) بناءً على الوقت المنقضي
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>
              <strong>شريط التقدم:</strong> عرض مرئي لنسبة الوقت المنقضي
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>
              <strong>وضع مضغوط:</strong> عرض مبسط للاستخدام في الأماكن الضيقة
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>
              <strong>تنبيهات مرئية:</strong> رموز وألوان متحركة للحالات الحرجة
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>
              <strong>دعم الوضع الداكن:</strong> يعمل بشكل مثالي في كلا الوضعين
            </span>
          </li>
        </ul>
      </Card>

      {/* Usage Code */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">مثال على الكود</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import { DeliveryTimer } from '@/features/delivery';

// Full version
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30}
/>

// Compact version
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30}
  compact
/>`}</code>
        </pre>
      </Card>
    </div>
  );
};

export default DeliveryTimerDemo;
