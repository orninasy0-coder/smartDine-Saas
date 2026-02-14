/**
 * Restaurant Details Dialog
 * Displays detailed information about a restaurant
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Restaurant } from '../types';
import { Calendar, Mail, Phone, MapPin, CreditCard, Clock } from 'lucide-react';

interface RestaurantDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant | null;
}

export function RestaurantDetailsDialog({
  open,
  onOpenChange,
  restaurant,
}: RestaurantDetailsDialogProps) {
  if (!restaurant) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubscriptionPlanBadge = () => {
    const variants = {
      BASIC: { variant: 'secondary' as const, label: 'Basic Plan' },
      PRO: { variant: 'default' as const, label: 'Pro Plan' },
      ENTERPRISE: { variant: 'default' as const, label: 'Enterprise Plan', className: 'bg-amber-500' },
    };

    const config = variants[restaurant.subscriptionPlan];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getSubscriptionStatusBadge = () => {
    const variants = {
      ACTIVE: { variant: 'default' as const, label: 'Active', className: 'bg-green-500' },
      SUSPENDED: { variant: 'destructive' as const, label: 'Suspended' },
      CANCELLED: { variant: 'secondary' as const, label: 'Cancelled' },
      GRACE_PERIOD: { variant: 'default' as const, label: 'Grace Period', className: 'bg-amber-500' },
    };

    const config = variants[restaurant.subscriptionStatus];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{restaurant.name}</DialogTitle>
          <DialogDescription>
            Detailed information about this restaurant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{restaurant.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 text-muted-foreground mt-0.5 font-bold text-xs">
                  URL
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Restaurant URL</p>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.slug}.smartdine.com
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Subscription Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Plan</span>
                </div>
                {getSubscriptionPlanBadge()}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                {getSubscriptionStatusBadge()}
              </div>

              {restaurant.subscriptionExpiresAt && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Expires At</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(restaurant.subscriptionExpiresAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Account Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(restaurant.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(restaurant.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 text-muted-foreground mt-0.5 font-bold text-xs">
                  ID
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Restaurant ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{restaurant.id}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Plan Features */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Available Features</h3>
            <div className="space-y-2">
              {restaurant.subscriptionPlan === 'BASIC' && (
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>QR Menu System</li>
                  <li>Basic Order Management</li>
                  <li>Customer Feedback</li>
                </ul>
              )}
              {restaurant.subscriptionPlan === 'PRO' && (
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>QR Menu System</li>
                  <li>AI Ordering Assistant</li>
                  <li>Advanced Analytics</li>
                  <li>Customer Feedback</li>
                  <li>Staff Management</li>
                </ul>
              )}
              {restaurant.subscriptionPlan === 'ENTERPRISE' && (
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>All Pro Features</li>
                  <li>AR 3D Menu Visualization</li>
                  <li>Priority Support</li>
                  <li>Custom Integrations</li>
                  <li>Advanced Reporting</li>
                  <li>White-label Options</li>
                </ul>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
