/**
 * DishRecommendation Component
 * Displays AI-recommended dishes with reasons and actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DishSuggestion } from '../types';

interface DishRecommendationProps {
  suggestions: DishSuggestion[];
  onAddToCart?: (dishId: string) => void;
  onViewDetails?: (dishId: string) => void;
  isLoading?: boolean;
}

export const DishRecommendation: React.FC<DishRecommendationProps> = ({
  suggestions,
  onAddToCart,
  onViewDetails,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">الأطباق المقترحة</h3>
      </div>

      {suggestions.map((suggestion) => (
        <motion.div key={suggestion.dishId} variants={itemVariants}>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {/* Dish Image */}
              <div className="relative w-20 h-20 flex-shrink-0">
                {suggestion.image ? (
                  <img
                    src={suggestion.image}
                    alt={suggestion.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Dish Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {suggestion.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {suggestion.reason}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {suggestion.price.toFixed(2)} ر.س
                  </span>
                  <div className="flex gap-1">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onViewDetails(suggestion.dishId)}
                        title="عرض التفاصيل"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    )}
                    {onAddToCart && (
                      <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onAddToCart(suggestion.dishId)}
                        title="إضافة للسلة"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
