/**
 * Funnel Visualization Component
 * Displays conversion funnel data with visual representation
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Users } from 'lucide-react';

export interface FunnelStage {
  name: string;
  label: string;
  count: number;
  percentage?: number;
  dropOffRate?: number;
}

export interface FunnelData {
  name: string;
  stages: FunnelStage[];
  totalUsers: number;
  conversionRate: number;
}

interface FunnelVisualizationProps {
  data: FunnelData;
  className?: string;
}

export function FunnelVisualization({ data, className = '' }: FunnelVisualizationProps) {
  const maxCount = data.stages[0]?.count || 1;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {data.name}
        </CardTitle>
        <CardDescription>
          {data.totalUsers.toLocaleString()} total users • {data.conversionRate.toFixed(1)}%
          conversion rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.stages.map((stage, index) => {
            const widthPercentage = (stage.count / maxCount) * 100;
            const conversionFromPrevious =
              index > 0 ? (stage.count / data.stages[index - 1].count) * 100 : 100;

            return (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stage.label}</span>
                    {index > 0 && stage.dropOffRate !== undefined && (
                      <span
                        className={`flex items-center gap-1 text-xs ${
                          stage.dropOffRate > 30
                            ? 'text-red-600 dark:text-red-400'
                            : stage.dropOffRate > 15
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {stage.dropOffRate > 15 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {stage.dropOffRate.toFixed(1)}% drop-off
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{stage.count.toLocaleString()} users</span>
                    {stage.percentage !== undefined && (
                      <span className="font-medium">{stage.percentage.toFixed(1)}%</span>
                    )}
                  </div>
                </div>

                {/* Funnel bar */}
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {widthPercentage > 20 && (
                      <span className="text-xs font-medium text-primary-foreground">
                        {conversionFromPrevious.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="text-2xl font-bold">{data.stages[0]?.count.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">
                {data.stages[data.stages.length - 1]?.count.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
