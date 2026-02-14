/**
 * Top Dishes Display Component
 * Shows the most popular dishes by order count and revenue
 */

import { Card } from '@/components/ui/card';
import type { TopDish } from '../types';
import { Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TopDishesDisplayProps {
  dishes: TopDish[];
  isLoading?: boolean;
}

function DishCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-muted animate-pulse rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}

interface DishCardProps {
  dish: TopDish;
  rank: number;
}

function DishCard({ dish, rank }: DishCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankBadge = (rank: number) => {
    const colors = {
      1: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      2: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
      3: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };

    return colors[rank as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <Badge
            variant="outline"
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${getRankBadge(rank)}`}
          >
            {rank}
          </Badge>
        </div>

        {/* Dish Image */}
        <div className="flex-shrink-0">
          {dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Dish Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base truncate">{dish.name}</h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{dish.orders} orders</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatCurrency(dish.revenue)}</span>
            </div>
          </div>
        </div>

        {/* Trophy Icon for Top 3 */}
        {rank <= 3 && (
          <div className="flex-shrink-0">
            <Trophy className={`w-6 h-6 ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : 'text-orange-500'}`} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function TopDishesDisplay({ dishes, isLoading }: TopDishesDisplayProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <DishCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Top Performing Dishes</h3>
            <p className="text-sm text-muted-foreground">
              Most popular items by order volume and revenue
            </p>
          </div>
        </div>

        {/* Dishes List */}
        <div className="space-y-3">
          {dishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No dish data available for this period
              </p>
            </div>
          ) : (
            dishes.map((dish, index) => (
              <DishCard key={dish.id} dish={dish} rank={index + 1} />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
