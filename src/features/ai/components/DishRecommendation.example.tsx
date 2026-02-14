/**
 * DishRecommendation Component Example
 * Demonstrates usage of the DishRecommendation component
 */

import React, { useState } from 'react';
import { DishRecommendation } from './DishRecommendation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DishSuggestion } from '../types';

const mockSuggestions: DishSuggestion[] = [
  {
    dishId: '1',
    name: 'برجر كلاسيك',
    reason: 'طبق شهير ومحبوب من قبل العملاء، يحتوي على لحم بقري طازج مع الخضروات',
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  },
  {
    dishId: '2',
    name: 'سلطة سيزر',
    reason: 'خيار صحي ومنعش، مثالي للوجبات الخفيفة',
    price: 30.0,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
  },
  {
    dishId: '3',
    name: 'بيتزا مارغريتا',
    reason: 'بيتزا إيطالية كلاسيكية بالجبن والطماطم الطازجة',
    price: 55.0,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
  },
  {
    dishId: '4',
    name: 'باستا ألفريدو',
    reason: 'طبق كريمي غني بالنكهة، مناسب لمحبي المعكرونة',
    price: 40.0,
  },
];

export const DishRecommendationExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<DishSuggestion[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const handleLoadRecommendations = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 1500);
  };

  const handleAddToCart = (dishId: string) => {
    setCart((prev) => [...prev, dishId]);
    const dish = suggestions.find((s) => s.dishId === dishId);
    alert(`تمت إضافة "${dish?.name}" إلى السلة`);
  };

  const handleViewDetails = (dishId: string) => {
    const dish = suggestions.find((s) => s.dishId === dishId);
    alert(`عرض تفاصيل: ${dish?.name}`);
  };

  const handleClear = () => {
    setSuggestions([]);
    setCart([]);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          مثال: مكون توصيات الأطباق
        </h1>
        
        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">
            هذا المكون يعرض الأطباق المقترحة من المساعد الذكي مع أسباب التوصية
            والقدرة على إضافتها للسلة أو عرض التفاصيل.
          </p>

          <div className="flex gap-2">
            <Button onClick={handleLoadRecommendations} disabled={isLoading}>
              {isLoading ? 'جاري التحميل...' : 'تحميل التوصيات'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              مسح
            </Button>
          </div>

          {cart.length > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-semibold">
                عدد العناصر في السلة: {cart.length}
              </p>
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <DishRecommendation
            suggestions={suggestions}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};

export default DishRecommendationExample;
