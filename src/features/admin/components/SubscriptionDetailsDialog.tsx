/**
 * Subscription Details Dialog
 * Displays comprehensive information about a subscription
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../types';
import {
  Calendar,
  DollarSign,
  CreditCard,
  Building,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface SubscriptionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

export function SubscriptionDetailsDialog({
  open,
  onOpenChange,
  subscription,
}: SubscriptionDetailsDialogProps) {
  if (!subscription) return null;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPlanFeatures = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'BASIC':
        return [
          'Digital QR Menu',
          'Up to 50 menu items',
          'Basic analytics',
          'Email support',
        ];
      case 'PRO':
        return [
          'Everything in Basic',
          'Unlimited menu items',
          'AI Assistant',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
        ];
      case 'ENTERPRISE':
        return [
          'Everything in Pro',
          'AR 3D Models',
          'Multi-location support',
          'API access',
          'Dedicated account manager',
          'Custom integrations',
          'SLA guarantee',
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Restaurant Information
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{subscription.restaurantName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{subscription.restaurantEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Restaurant ID</span>
                <span className="text-sm font-mono">{subscription.restaurantId}</span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Subscription Details
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant={getPlanBadgeVariant(subscription.plan)}>
                  {subscription.plan}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusBadgeVariant(subscription.status)}>
                  {subscription.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Billing Cycle</span>
                <span className="text-sm font-medium capitalize">{subscription.billingCycle}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Important Dates
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm">{formatDate(subscription.startDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Period Start</span>
                <span className="text-sm">{formatDate(subscription.currentPeriodStart)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Period End</span>
                <span className="text-sm">{formatDate(subscription.currentPeriodEnd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires At</span>
                <span className="text-sm">{formatDate(subscription.expiresAt)}</span>
              </div>
              {subscription.cancelledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cancelled At</span>
                  <span className="text-sm">{formatDate(subscription.cancelledAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Billing */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Billing Information
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                <span className="text-sm font-medium">
                  {formatCurrency(subscription.monthlyRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <span className="text-sm font-medium">
                  {formatCurrency(subscription.totalPaid)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next Billing Date</span>
                <span className="text-sm">{formatDate(subscription.nextBillingDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auto Renew</span>
                {subscription.autoRenew ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Available Features
            </h3>
            <div className="pl-6">
              <ul className="space-y-2">
                {getPlanFeatures(subscription.plan).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Metadata
            </h3>
            <div className="space-y-2 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subscription ID</span>
                <span className="text-sm font-mono">{subscription.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-sm">{formatDate(subscription.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">{formatDate(subscription.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
