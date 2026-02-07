/**
 * Sidebar component - Navigation sidebar for dashboards
 * Features:
 * - Collapsible sidebar
 * - Navigation menu items with icons
 * - Active state indication
 * - Role-based menu items
 * - Responsive mobile drawer
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  Users,
  Settings,
  QrCode,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Truck,
  ChefHat,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role?: 'owner' | 'kitchen' | 'delivery' | 'admin';
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role = 'owner',
  collapsed = false,
  onCollapsedChange,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [activeItem, setActiveItem] = useState('/dashboard');

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  // Menu items based on role
  const menuItems: Record<string, MenuItem[]> = {
    owner: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Orders', icon: ShoppingBag, href: '/orders', badge: 5 },
      { label: 'Menu', icon: UtensilsCrossed, href: '/menu' },
      { label: 'Analytics', icon: BarChart3, href: '/analytics' },
      { label: 'Staff', icon: Users, href: '/staff' },
      { label: 'QR Codes', icon: QrCode, href: '/qr-codes' },
      { label: 'Feedback', icon: MessageSquare, href: '/feedback' },
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
    kitchen: [
      { label: 'Orders', icon: ShoppingBag, href: '/kitchen/orders', badge: 8 },
      { label: 'Menu', icon: UtensilsCrossed, href: '/kitchen/menu' },
      { label: 'Settings', icon: Settings, href: '/kitchen/settings' },
    ],
    delivery: [
      {
        label: 'Deliveries',
        icon: Truck,
        href: '/delivery/orders',
        badge: 3,
      },
      { label: 'Map', icon: LayoutDashboard, href: '/delivery/map' },
      { label: 'Settings', icon: Settings, href: '/delivery/settings' },
    ],
    admin: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { label: 'Restaurants', icon: ChefHat, href: '/admin/restaurants' },
      { label: 'Subscriptions', icon: ShoppingBag, href: '/admin/subscriptions' },
      { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
      { label: 'System Health', icon: Settings, href: '/admin/health' },
    ],
  };

  const items = menuItems[role] || menuItems.owner;

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SmartDine
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className={cn('h-8 w-8', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item.href);
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium">Need help?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Check our documentation or contact support.
            </p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              Get Help
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
};
