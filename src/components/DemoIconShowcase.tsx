/**
 * Icon System Demo Component
 *
 * Demonstrates the icon system with various sizes, colors, and use cases.
 * This component serves as a visual reference for developers.
 */

import React from 'react';
import { Icon } from '@/components/common';
import {
  Home,
  User,
  Settings,
  Bell,
  ShoppingCart,
  ChefHat,
  Truck,
  BarChart,
  Star,
  Heart,
  Search,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from '@/components/common/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DemoIconShowcase: React.FC = () => {
  const iconSizes = [
    { size: 'xs' as const, label: 'Extra Small (12px)' },
    { size: 'sm' as const, label: 'Small (16px)' },
    { size: 'md' as const, label: 'Medium (20px)' },
    { size: 'lg' as const, label: 'Large (24px)' },
    { size: 'xl' as const, label: 'Extra Large (32px)' },
  ];

  const navigationIcons = [
    { icon: Home, label: 'Home' },
    { icon: User, label: 'User' },
    { icon: Settings, label: 'Settings' },
    { icon: Bell, label: 'Bell' },
    { icon: Search, label: 'Search' },
  ];

  const restaurantIcons = [
    { icon: ShoppingCart, label: 'Cart' },
    { icon: ChefHat, label: 'Chef' },
    { icon: Truck, label: 'Delivery' },
    { icon: BarChart, label: 'Analytics' },
    { icon: Star, label: 'Rating' },
  ];

  const actionIcons = [
    { icon: Plus, label: 'Add' },
    { icon: Edit, label: 'Edit' },
    { icon: Trash, label: 'Delete' },
    { icon: Check, label: 'Confirm' },
    { icon: X, label: 'Close' },
  ];

  const statusIcons = [
    { icon: CheckCircle, label: 'Success', color: 'text-green-500' },
    { icon: XCircle, label: 'Error', color: 'text-red-500' },
    { icon: AlertCircle, label: 'Warning', color: 'text-yellow-500' },
    { icon: Info, label: 'Info', color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Icon System Showcase</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of the Lucide icon system
        </p>
      </div>

      {/* Size Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
          <CardDescription>Icons support 5 predefined size variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {iconSizes.map(({ size, label }) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-40 text-sm font-medium">{label}</div>
                <Icon icon={Home} size={size} />
                <Icon icon={User} size={size} />
                <Icon icon={Settings} size={size} />
                <Icon icon={Bell} size={size} />
                <Icon icon={Star} size={size} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Icons</CardTitle>
          <CardDescription>Common icons for navigation and UI elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-6">
            {navigationIcons.map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon icon={icon} size="lg" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant & Business Icons</CardTitle>
          <CardDescription>Icons specific to restaurant operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-6">
            {restaurantIcons.map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon icon={icon} size="lg" className="text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Action Icons</CardTitle>
          <CardDescription>Icons for user actions and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-6">
            {actionIcons.map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Button variant="outline" size="icon">
                  <Icon icon={icon} />
                </Button>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Status Icons</CardTitle>
          <CardDescription>Icons with semantic colors for status indication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            {statusIcons.map(({ icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon icon={icon} size="lg" className={color} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Icon with Text */}
      <Card>
        <CardHeader>
          <CardTitle>Icons with Text</CardTitle>
          <CardDescription>Common patterns for combining icons with text</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon icon={CheckCircle} size="sm" className="text-green-500" />
              <span>Order completed successfully</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon={AlertCircle} size="sm" className="text-yellow-500" />
              <span>Payment pending verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon={XCircle} size="sm" className="text-red-500" />
              <span>Order cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon={Info} size="sm" className="text-blue-500" />
              <span>New feature available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Animated icons for loading indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </Button>
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Please wait</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Icon Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Buttons</CardTitle>
          <CardDescription>Icons used in button components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Icon icon={Plus} size="sm" className="mr-2" />
              Add Item
            </Button>
            <Button variant="outline">
              <Icon icon={Edit} size="sm" className="mr-2" />
              Edit
            </Button>
            <Button variant="destructive">
              <Icon icon={Trash} size="sm" className="mr-2" />
              Delete
            </Button>
            <Button variant="ghost" size="icon">
              <Icon icon={Settings} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon icon={Bell} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon icon={Heart} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Color Variants</CardTitle>
          <CardDescription>Icons with different color applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-6">
            <div className="flex flex-col items-center gap-2">
              <Icon icon={Star} size="lg" className="text-primary" />
              <span className="text-xs">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon icon={Star} size="lg" className="text-secondary" />
              <span className="text-xs">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon icon={Star} size="lg" className="text-muted-foreground" />
              <span className="text-xs">Muted</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon icon={Star} size="lg" className="text-destructive" />
              <span className="text-xs">Destructive</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon icon={Star} size="lg" className="text-yellow-500" />
              <span className="text-xs">Warning</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon icon={Star} size="lg" className="text-green-500" />
              <span className="text-xs">Success</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
