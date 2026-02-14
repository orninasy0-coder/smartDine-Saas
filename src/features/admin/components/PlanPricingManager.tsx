/**
 * Plan Pricing Manager Component
 * Manages subscription plans and their pricing
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlanPricing, SubscriptionPlan } from '../types';
import { DollarSign, Edit, CheckCircle, XCircle } from 'lucide-react';

interface PlanPricingManagerProps {
  plans: PlanPricing[];
  isLoading?: boolean;
  onEdit: (plan: PlanPricing) => void;
}

export function PlanPricingManager({ plans, isLoading = false, onEdit }: PlanPricingManagerProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPlanBadgeVariant = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'BASIC':
        return 'secondary';
      case 'PRO':
        return 'default';
      case 'ENTERPRISE':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Plan Pricing Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure subscription plans and pricing tiers
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-6 relative">
            {plan.isPopular && (
              <Badge className="absolute -top-3 right-4" variant="default">
                Most Popular
              </Badge>
            )}
            <div className="space-y-4">
              <div>
                <Badge variant={getPlanBadgeVariant(plan.plan)} className="mb-2">
                  {plan.plan}
                </Badge>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatCurrency(plan.monthlyPrice)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {plan.yearlyPrice && (
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-semibold">
                      {formatCurrency(plan.yearlyPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground">/year</span>
                    <Badge variant="secondary" className="ml-2">
                      Save {Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Features:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Menu Items</span>
                    <span className="font-medium">
                      {plan.maxMenuItems === -1 ? 'Unlimited' : plan.maxMenuItems}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Tables</span>
                    <span className="font-medium">
                      {plan.maxTables === -1 ? 'Unlimited' : plan.maxTables}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">AI Assistant</span>
                    {plan.hasAI ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">AR 3D Models</span>
                    {plan.hasAR ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => onEdit(plan)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Monthly Price</TableHead>
              <TableHead>Yearly Price</TableHead>
              <TableHead>Active Subscriptions</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPlanBadgeVariant(plan.plan)}>{plan.plan}</Badge>
                    {plan.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{formatCurrency(plan.monthlyPrice)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {plan.yearlyPrice ? (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatCurrency(plan.yearlyPrice)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{plan.activeSubscriptions}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatCurrency(plan.monthlyPrice * plan.activeSubscriptions)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(plan)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
