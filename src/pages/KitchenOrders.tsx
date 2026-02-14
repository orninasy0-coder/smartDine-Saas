/**
 * Kitchen Orders Page
 * Main page for kitchen staff to view and manage orders
 * Displays order queue with real-time updates
 */

import React from 'react';
import { Container } from '@/components/common/Container';
import { OrderQueue } from '@/features/kitchen';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export const KitchenOrders: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated or not kitchen staff
  if (!isAuthenticated || user?.role !== 'kitchen') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Get restaurant ID from user
  const restaurantId = user?.restaurantId;

  if (!restaurantId) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">خطأ</h1>
          <p className="text-muted-foreground">
            لم يتم العثور على معرف المطعم. يرجى التواصل مع المسؤول.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-8">
        <OrderQueue restaurantId={restaurantId} />
      </Container>
    </div>
  );
};
