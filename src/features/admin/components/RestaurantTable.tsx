/**
 * Restaurant Table Component
 * Displays all restaurants with CRUD operations for platform admin
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { Restaurant, SubscriptionPlan, SubscriptionStatus } from '../types';

interface RestaurantTableProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onCreate: () => void;
  onDelete: (restaurantId: string) => void;
  onView: (restaurant: Restaurant) => void;
  onStatusChange: (restaurantId: string, status: SubscriptionStatus) => void;
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

function getSubscriptionPlanBadge(plan: SubscriptionPlan) {
  const variants = {
    BASIC: { variant: 'secondary' as const, label: 'Basic' },
    PRO: { variant: 'default' as const, label: 'Pro' },
    ENTERPRISE: { variant: 'default' as const, label: 'Enterprise', className: 'bg-amber-500' },
  };

  const config = variants[plan];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

function getSubscriptionStatusBadge(status: SubscriptionStatus) {
  const variants = {
    ACTIVE: { variant: 'default' as const, label: 'Active', className: 'bg-green-500' },
    SUSPENDED: { variant: 'destructive' as const, label: 'Suspended' },
    CANCELLED: { variant: 'secondary' as const, label: 'Cancelled' },
    GRACE_PERIOD: { variant: 'default' as const, label: 'Grace Period', className: 'bg-amber-500' },
  };

  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

export function RestaurantTable({
  restaurants,
  isLoading,
  onEdit,
  onCreate,
  onDelete,
  onView,
  onStatusChange,
}: RestaurantTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Create */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestaurants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No restaurants found matching your search.' : 'No restaurants yet.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{restaurant.name}</div>
                      <div className="text-sm text-muted-foreground">/{restaurant.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{restaurant.email}</div>
                      <div className="text-sm text-muted-foreground">{restaurant.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getSubscriptionPlanBadge(restaurant.subscriptionPlan)}</TableCell>
                  <TableCell>{getSubscriptionStatusBadge(restaurant.subscriptionStatus)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(restaurant.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(restaurant)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(restaurant)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {restaurant.subscriptionStatus === 'ACTIVE' ? (
                          <DropdownMenuItem
                            onClick={() => onStatusChange(restaurant.id, 'SUSPENDED')}
                            className="text-amber-600"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        ) : restaurant.subscriptionStatus === 'SUSPENDED' ? (
                          <DropdownMenuItem
                            onClick={() => onStatusChange(restaurant.id, 'ACTIVE')}
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(restaurant.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      {filteredRestaurants.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredRestaurants.length} of {restaurants.length} restaurants
        </div>
      )}
    </div>
  );
}
