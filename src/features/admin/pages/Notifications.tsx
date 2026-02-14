/**
 * Platform Admin Notifications Page
 * Allows admins to send broadcast notifications to restaurants
 */

import { useState, useEffect } from 'react';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NotificationSender, NotificationData } from '../components/NotificationSender';
import { Bell, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'critical';
  target: string;
  recipientCount: number;
  sentAt: string;
  sentBy: string;
}

export function Notifications() {
  const [restaurantCount, setRestaurantCount] = useState({
    all: 0,
    active: 0,
    trial: 0,
    suspended: 0,
  });
  const [recentNotifications, setRecentNotifications] = useState<SentNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // GET /api/v1/admin/restaurants/count
      // GET /api/v1/admin/notifications/recent

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      setRestaurantCount({
        all: 156,
        active: 142,
        trial: 14,
        suspended: 0,
      });

      setRecentNotifications([
        {
          id: '1',
          title: 'System Maintenance Scheduled',
          message: 'We will be performing system maintenance on Sunday at 2 AM UTC.',
          type: 'info',
          target: 'All Restaurants',
          recipientCount: 156,
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          sentBy: 'Admin User',
        },
        {
          id: '2',
          title: 'New Feature Available',
          message: 'Check out our new AI-powered menu recommendations!',
          type: 'success',
          target: 'Active Subscriptions',
          recipientCount: 142,
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          sentBy: 'Admin User',
        },
        {
          id: '3',
          title: 'Payment Reminder',
          message: 'Your subscription will expire in 3 days. Please update your payment method.',
          type: 'warning',
          target: 'Trial Subscriptions',
          recipientCount: 14,
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          sentBy: 'Admin User',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load notification data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async (data: NotificationData) => {
    // TODO: Replace with actual API call
    // POST /api/v1/admin/notifications/broadcast
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add to recent notifications
    const newNotification: SentNotification = {
      id: Date.now().toString(),
      title: data.title,
      message: data.message,
      type: data.type,
      target: getTargetLabel(data.target),
      recipientCount: getRecipientCount(data.target),
      sentAt: new Date().toISOString(),
      sentBy: 'Admin User',
    };

    setRecentNotifications([newNotification, ...recentNotifications]);
  };

  const getTargetLabel = (target: string): string => {
    switch (target) {
      case 'all':
        return 'All Restaurants';
      case 'active':
        return 'Active Subscriptions';
      case 'trial':
        return 'Trial Subscriptions';
      case 'suspended':
        return 'Suspended Accounts';
      default:
        return 'Specific Restaurants';
    }
  };

  const getRecipientCount = (target: string): number => {
    switch (target) {
      case 'all':
        return restaurantCount.all;
      case 'active':
        return restaurantCount.active;
      case 'trial':
        return restaurantCount.trial;
      case 'suspended':
        return restaurantCount.suspended;
      default:
        return 0;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-amber-500';
      case 'success':
        return 'bg-green-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              Send broadcast notifications to restaurants on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notification Sender */}
            <div className="lg:col-span-2">
              <NotificationSender
                onSend={handleSendNotification}
                restaurantCount={restaurantCount}
              />
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Quick Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Restaurants</span>
                    <Badge variant="secondary">{restaurantCount.all}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Badge variant="default" className="bg-green-500">
                      {restaurantCount.active}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trial</span>
                    <Badge variant="default" className="bg-blue-500">
                      {restaurantCount.trial}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Suspended</span>
                    <Badge variant="default" className="bg-amber-500">
                      {restaurantCount.suspended}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Best Practices</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Keep titles concise and clear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use appropriate notification types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Target specific audiences when possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Avoid sending too many notifications</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recent Notifications</h3>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${getTypeColor(notification.type)} p-2 rounded-full`} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {notification.recipientCount} recipients
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Target: {notification.target}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(notification.sentAt)}</span>
                            <span>•</span>
                            <span>By: {notification.sentBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </Section>
      </Container>
    </div>
  );
}
