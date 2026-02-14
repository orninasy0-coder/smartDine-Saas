/**
 * Subscription Manager Component
 * Displays and manages all subscriptions across the platform
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../types';

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onUpgrade: (subscriptionId: string, newPlan: SubscriptionPlan) => void;
  onCancel: (subscriptionId: string) => void;
  onRenew: (subscriptionId: string) => void;
  onView: (subscription: Subscription) => void;
}

export function SubscriptionManager({
  subscriptions,
  isLoading = false,
  onUpgrade,
  onCancel,
  onRenew,
  onView,
}: SubscriptionManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter subscriptions based on search
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const query = searchQuery.toLowerCase();
    return (
      sub.restaurantName.toLowerCase().includes(query) ||
      sub.restaurantEmail.toLowerCase().includes(query) ||
      sub.plan.toLowerCase().includes(query)
    );
  });

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

  const getStatusBadgeVariant = (status: SubscriptionStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'GRACE_PERIOD':
        return 'secondary';
      case 'SUSPENDED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by restaurant name, email, or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No subscriptions found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subscription.restaurantName}</p>
                      <p className="text-sm text-muted-foreground">{subscription.restaurantEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPlanBadgeVariant(subscription.plan)}>
                      {subscription.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(subscription.status)}>
                      {subscription.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(subscription.startDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(subscription.expiresAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatCurrency(subscription.monthlyRevenue)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(subscription)}>
                          View Details
                        </DropdownMenuItem>
                        {subscription.status === 'ACTIVE' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onUpgrade(subscription.id, 'PRO')}
                              disabled={subscription.plan === 'ENTERPRISE'}
                            >
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Upgrade Plan
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onCancel(subscription.id)}
                              className="text-destructive"
                            >
                              Cancel Subscription
                            </DropdownMenuItem>
                          </>
                        )}
                        {(subscription.status === 'CANCELLED' ||
                          subscription.status === 'SUSPENDED') && (
                          <DropdownMenuItem onClick={() => onRenew(subscription.id)}>
                            Renew Subscription
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
