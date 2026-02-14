/**
 * Subscriptions Management Page
 * Platform admin page for managing all subscriptions and pricing plans
 */

import { useState, useEffect } from 'react';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionManager } from '../components/SubscriptionManager';
import { SubscriptionDetailsDialog } from '../components/SubscriptionDetailsDialog';
import { PlanPricingManager } from '../components/PlanPricingManager';
import { PlanPricingDialog } from '../components/PlanPricingDialog';
import { Subscription, PlanPricing, SubscriptionPlan } from '../types';
import { toast } from 'sonner';

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<PlanPricing[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanPricing | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  // Fetch subscriptions on mount
  useEffect(() => {
    fetchSubscriptions();
    fetchPlans();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoadingSubscriptions(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockSubscriptions: Subscription[] = [
        {
          id: 'sub_1',
          restaurantId: '1',
          restaurantName: 'The Golden Fork',
          restaurantEmail: 'contact@goldenfork.com',
          plan: 'PRO',
          status: 'ACTIVE',
          billingCycle: 'monthly',
          monthlyRevenue: 99,
          totalPaid: 1188,
          startDate: '2024-01-15T10:00:00Z',
          currentPeriodStart: '2025-01-15T10:00:00Z',
          currentPeriodEnd: '2025-02-15T10:00:00Z',
          expiresAt: '2025-12-31T23:59:59Z',
          nextBillingDate: '2025-02-15T10:00:00Z',
          cancelledAt: null,
          autoRenew: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        },
        {
          id: 'sub_2',
          restaurantId: '2',
          restaurantName: 'Sushi Paradise',
          restaurantEmail: 'info@sushiparadise.com',
          plan: 'ENTERPRISE',
          status: 'ACTIVE',
          billingCycle: 'yearly',
          monthlyRevenue: 299,
          totalPaid: 3588,
          startDate: '2024-02-01T14:30:00Z',
          currentPeriodStart: '2025-02-01T14:30:00Z',
          currentPeriodEnd: '2026-02-01T14:30:00Z',
          expiresAt: '2026-02-01T14:30:00Z',
          nextBillingDate: '2026-02-01T14:30:00Z',
          cancelledAt: null,
          autoRenew: true,
          createdAt: '2024-02-01T14:30:00Z',
          updatedAt: '2025-02-01T14:30:00Z',
        },
        {
          id: 'sub_3',
          restaurantId: '3',
          restaurantName: 'Pizza Corner',
          restaurantEmail: 'hello@pizzacorner.com',
          plan: 'BASIC',
          status: 'SUSPENDED',
          billingCycle: 'monthly',
          monthlyRevenue: 29,
          totalPaid: 348,
          startDate: '2024-03-10T09:15:00Z',
          currentPeriodStart: '2025-01-10T09:15:00Z',
          currentPeriodEnd: '2025-02-10T09:15:00Z',
          expiresAt: null,
          nextBillingDate: null,
          cancelledAt: null,
          autoRenew: false,
          createdAt: '2024-03-10T09:15:00Z',
          updatedAt: '2025-01-10T09:15:00Z',
        },
      ];

      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockPlans: PlanPricing[] = [
        {
          id: 'plan_1',
          plan: 'BASIC',
          name: 'Basic Plan',
          description: 'Perfect for small restaurants getting started with digital menus',
          monthlyPrice: 29,
          yearlyPrice: 290,
          features: [
            'Digital QR Menu',
            'Up to 50 menu items',
            'Basic analytics',
            'Email support',
            'Mobile responsive design',
          ],
          maxMenuItems: 50,
          maxTables: 10,
          hasAI: false,
          hasAR: false,
          isPopular: false,
          activeSubscriptions: 45,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'plan_2',
          plan: 'PRO',
          name: 'Pro Plan',
          description: 'Advanced features for growing restaurants',
          monthlyPrice: 99,
          yearlyPrice: 990,
          features: [
            'Everything in Basic',
            'Unlimited menu items',
            'AI Assistant for recommendations',
            'Advanced analytics & insights',
            'Priority support',
            'Custom branding',
            'Multi-language support',
          ],
          maxMenuItems: -1,
          maxTables: 50,
          hasAI: true,
          hasAR: false,
          isPopular: true,
          activeSubscriptions: 78,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'plan_3',
          plan: 'ENTERPRISE',
          name: 'Enterprise Plan',
          description: 'Complete solution for restaurant chains and large establishments',
          monthlyPrice: 299,
          yearlyPrice: 2990,
          features: [
            'Everything in Pro',
            'AR 3D dish models',
            'Multi-location support',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
            'White-label options',
          ],
          maxMenuItems: -1,
          maxTables: -1,
          hasAI: true,
          hasAR: true,
          isPopular: false,
          activeSubscriptions: 19,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      setPlans(mockPlans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleUpgrade = async (subscriptionId: string, newPlan: SubscriptionPlan) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId
            ? {
                ...sub,
                plan: newPlan,
                updatedAt: new Date().toISOString(),
              }
            : sub
        )
      );

      toast.success(`Subscription upgraded to ${newPlan} plan`);
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      toast.error('Failed to upgrade subscription');
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId
            ? {
                ...sub,
                status: 'CANCELLED',
                cancelledAt: new Date().toISOString(),
                autoRenew: false,
                updatedAt: new Date().toISOString(),
              }
            : sub
        )
      );

      toast.success('Subscription cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleRenew = async (subscriptionId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId
            ? {
                ...sub,
                status: 'ACTIVE',
                cancelledAt: null,
                autoRenew: true,
                updatedAt: new Date().toISOString(),
              }
            : sub
        )
      );

      toast.success('Subscription renewed successfully');
    } catch (error) {
      console.error('Failed to renew subscription:', error);
      toast.error('Failed to renew subscription');
    }
  };

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsDialogOpen(true);
  };

  const handleEditPlan = (plan: PlanPricing) => {
    setSelectedPlan(plan);
    setIsPlanDialogOpen(true);
  };

  const handleSavePlan = async (data: Partial<PlanPricing>) => {
    if (!selectedPlan) return;

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPlans((prev) =>
        prev.map((p) =>
          p.id === selectedPlan.id
            ? {
                ...p,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );

      toast.success('Plan pricing updated successfully');
    } catch (error) {
      console.error('Failed to update plan:', error);
      toast.error('Failed to update plan');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Subscription Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage all subscriptions and configure pricing plans across the platform.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="subscriptions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
              <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="subscriptions">
              <SubscriptionManager
                subscriptions={subscriptions}
                isLoading={isLoadingSubscriptions}
                onUpgrade={handleUpgrade}
                onCancel={handleCancel}
                onRenew={handleRenew}
                onView={handleViewSubscription}
              />
            </TabsContent>

            <TabsContent value="plans">
              <PlanPricingManager
                plans={plans}
                isLoading={isLoadingPlans}
                onEdit={handleEditPlan}
              />
            </TabsContent>
          </Tabs>

          {/* Dialogs */}
          <SubscriptionDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            subscription={selectedSubscription}
          />

          <PlanPricingDialog
            open={isPlanDialogOpen}
            onOpenChange={setIsPlanDialogOpen}
            plan={selectedPlan}
            onSave={handleSavePlan}
          />
        </Section>
      </Container>
    </div>
  );
}
