/**
 * Notification Sender Component
 * Allows platform admins to send broadcast notifications to restaurants
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

export type NotificationType = 'info' | 'warning' | 'success' | 'critical';
export type NotificationTarget = 'all' | 'active' | 'trial' | 'suspended' | 'specific';

export interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  target: NotificationTarget;
  specificRestaurantIds?: string[];
}

interface NotificationSenderProps {
  onSend: (data: NotificationData) => Promise<void>;
  restaurantCount?: {
    all: number;
    active: number;
    trial: number;
    suspended: number;
  };
}

export function NotificationSender({
  onSend,
  restaurantCount = { all: 0, active: 0, trial: 0, suspended: 0 },
}: NotificationSenderProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const [target, setTarget] = useState<NotificationTarget>('all');
  const [isSending, setIsSending] = useState(false);

  const getTypeIcon = (notifType: NotificationType) => {
    switch (notifType) {
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (notifType: NotificationType) => {
    switch (notifType) {
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-amber-500';
      case 'success':
        return 'bg-green-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  const getTargetCount = (targetType: NotificationTarget): number => {
    switch (targetType) {
      case 'all':
        return restaurantCount.all;
      case 'active':
        return restaurantCount.active;
      case 'trial':
        return restaurantCount.trial;
      case 'suspended':
        return restaurantCount.suspended;
      case 'specific':
        return 0; // Will be determined by specific selection
      default:
        return 0;
    }
  };

  const handleSend = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a notification title');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a notification message');
      return;
    }

    if (title.length > 100) {
      toast.error('Title must be 100 characters or less');
      return;
    }

    if (message.length > 500) {
      toast.error('Message must be 500 characters or less');
      return;
    }

    const recipientCount = getTargetCount(target);
    if (recipientCount === 0 && target !== 'specific') {
      toast.error('No recipients available for the selected target');
      return;
    }

    setIsSending(true);
    try {
      await onSend({
        title: title.trim(),
        message: message.trim(),
        type,
        target,
      });

      toast.success(
        `Notification sent successfully to ${recipientCount} restaurant${recipientCount !== 1 ? 's' : ''}`
      );

      // Reset form
      setTitle('');
      setMessage('');
      setType('info');
      setTarget('all');
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Send Notification</h3>
      </div>

      <div className="space-y-4">
        {/* Notification Type */}
        <div className="space-y-2">
          <Label htmlFor="notification-type">Notification Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as NotificationType)}>
            <SelectTrigger id="notification-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span>Information</span>
                </div>
              </SelectItem>
              <SelectItem value="success">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Success</span>
                </div>
              </SelectItem>
              <SelectItem value="warning">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Warning</span>
                </div>
              </SelectItem>
              <SelectItem value="critical">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Critical</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label htmlFor="notification-target">Target Audience</Label>
          <Select value={target} onValueChange={(value) => setTarget(value as NotificationTarget)}>
            <SelectTrigger id="notification-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center justify-between w-full">
                  <span>All Restaurants</span>
                  <Badge variant="secondary" className="ml-2">
                    {restaurantCount.all}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="active">
                <div className="flex items-center justify-between w-full">
                  <span>Active Subscriptions</span>
                  <Badge variant="secondary" className="ml-2">
                    {restaurantCount.active}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="trial">
                <div className="flex items-center justify-between w-full">
                  <span>Trial Subscriptions</span>
                  <Badge variant="secondary" className="ml-2">
                    {restaurantCount.trial}
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="suspended">
                <div className="flex items-center justify-between w-full">
                  <span>Suspended Accounts</span>
                  <Badge variant="secondary" className="ml-2">
                    {restaurantCount.suspended}
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="notification-title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="notification-title"
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            disabled={isSending}
          />
          <p className="text-xs text-muted-foreground">
            {title.length}/100 characters
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="notification-message">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="notification-message"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            disabled={isSending}
          />
          <p className="text-xs text-muted-foreground">
            {message.length}/500 characters
          </p>
        </div>

        {/* Preview */}
        {(title || message) && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className={`p-4 rounded-lg border-l-4 ${getTypeColor(type)} bg-muted/50`}>
              <div className="flex items-start gap-3">
                <div className={`${getTypeColor(type)} p-2 rounded-full text-white`}>
                  {getTypeIcon(type)}
                </div>
                <div className="flex-1">
                  {title && <p className="font-semibold mb-1">{title}</p>}
                  {message && <p className="text-sm text-muted-foreground">{message}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              Will be sent to {getTargetCount(target)} restaurant{getTargetCount(target) !== 1 ? 's' : ''}
            </span>
          </div>
          <Button onClick={handleSend} disabled={isSending || !title || !message}>
            {isSending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
