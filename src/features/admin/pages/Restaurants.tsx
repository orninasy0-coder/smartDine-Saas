/**
 * Restaurants Management Page
 * Platform admin page for managing all restaurants with CRUD operations
 */

import { useState, useEffect } from 'react';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';
import { RestaurantTable } from '../components/RestaurantTable';
import { RestaurantDialog } from '../components/RestaurantDialog';
import { DeleteRestaurantDialog } from '../components/DeleteRestaurantDialog';
import { RestaurantDetailsDialog } from '../components/RestaurantDetailsDialog';
import { Restaurant, CreateRestaurantInput, SubscriptionStatus } from '../types';
import { toast } from 'sonner';

export function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'The Golden Fork',
          slug: 'the-golden-fork',
          address: '123 Main Street, New York, NY 10001',
          phone: '+1 (555) 123-4567',
          email: 'contact@goldenfork.com',
          subscriptionPlan: 'PRO',
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: '2025-12-31T23:59:59Z',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Sushi Paradise',
          slug: 'sushi-paradise',
          address: '456 Oak Avenue, Los Angeles, CA 90001',
          phone: '+1 (555) 987-6543',
          email: 'info@sushiparadise.com',
          subscriptionPlan: 'ENTERPRISE',
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: '2025-06-30T23:59:59Z',
          createdAt: '2024-02-01T14:30:00Z',
          updatedAt: '2024-02-01T14:30:00Z',
        },
        {
          id: '3',
          name: 'Pizza Corner',
          slug: 'pizza-corner',
          address: '789 Elm Street, Chicago, IL 60601',
          phone: '+1 (555) 456-7890',
          email: 'hello@pizzacorner.com',
          subscriptionPlan: 'BASIC',
          subscriptionStatus: 'SUSPENDED',
          subscriptionExpiresAt: null,
          createdAt: '2024-03-10T09:15:00Z',
          updatedAt: '2024-03-10T09:15:00Z',
        },
      ];

      setRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRestaurant(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleView = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    if (restaurant) {
      setRestaurantToDelete(restaurant);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleSave = async (data: CreateRestaurantInput) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedRestaurant) {
        // Update existing restaurant
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === selectedRestaurant.id
              ? {
                  ...r,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : r
          )
        );
        toast.success('Restaurant updated successfully');
      } else {
        // Create new restaurant
        const newRestaurant: Restaurant = {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          subscriptionStatus: 'ACTIVE',
          subscriptionExpiresAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setRestaurants((prev) => [newRestaurant, ...prev]);
        toast.success('Restaurant created successfully');
      }
    } catch (error) {
      console.error('Failed to save restaurant:', error);
      toast.error('Failed to save restaurant');
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantToDelete.id));
      toast.success('Restaurant deleted successfully');
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
      toast.error('Failed to delete restaurant');
      throw error;
    }
  };

  const handleStatusChange = async (restaurantId: string, status: SubscriptionStatus) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === restaurantId
            ? {
                ...r,
                subscriptionStatus: status,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      const action = status === 'ACTIVE' ? 'activated' : 'suspended';
      toast.success(`Restaurant ${action} successfully`);
    } catch (error) {
      console.error('Failed to update restaurant status:', error);
      toast.error('Failed to update restaurant status');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Restaurants Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage all restaurants on the platform. Create, edit, and monitor restaurant accounts.
            </p>
          </div>

          {/* Restaurant Table */}
          <RestaurantTable
            restaurants={restaurants}
            isLoading={isLoading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onStatusChange={handleStatusChange}
          />

          {/* Dialogs */}
          <RestaurantDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            restaurant={selectedRestaurant}
            onSave={handleSave}
          />

          <DeleteRestaurantDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            restaurant={restaurantToDelete}
            onConfirm={handleConfirmDelete}
          />

          <RestaurantDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            restaurant={selectedRestaurant}
          />
        </Section>
      </Container>
    </div>
  );
}
