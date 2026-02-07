import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Rocket,
  ShoppingCart,
  Store,
  ChefHat,
  Truck,
  Shield,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export interface GuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subsections?: {
    id: string;
    title: string;
  }[];
}

export const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Quick Start',
    icon: Rocket,
    subsections: [
      { id: 'intro', title: 'Platform Introduction' },
      { id: 'registration', title: 'How to Register' },
      { id: 'subscription', title: 'Choose Subscription Plan' },
      { id: 'setup', title: 'First Account Setup' },
    ],
  },
  {
    id: 'customer-journey',
    title: 'Customer Scenario',
    icon: ShoppingCart,
    subsections: [
      { id: 'qr-scan', title: 'Scan QR Code' },
      { id: 'browse-menu', title: 'Browse Menu' },
      { id: 'search', title: 'Search Dishes' },
      { id: 'ai-assistant', title: 'Use AI Assistant' },
      { id: 'ar-view', title: 'AR Dish View' },
      { id: 'add-cart', title: 'Add to Cart' },
      { id: 'place-order', title: 'Place Order' },
      { id: 'track-order', title: 'Track Order' },
      { id: 'feedback', title: 'Submit Feedback' },
    ],
  },
  {
    id: 'restaurant-owner',
    title: 'Restaurant Owner Scenario',
    icon: Store,
    subsections: [
      { id: 'restaurant-info', title: 'Setup Restaurant Info' },
      { id: 'menu-dishes', title: 'Add Menu & Dishes' },
      { id: 'upload-media', title: 'Upload Images & 3D Models' },
      { id: 'categories', title: 'Manage Categories' },
      { id: 'qr-codes', title: 'Generate QR Codes for Tables' },
      { id: 'staff', title: 'Manage Staff' },
      { id: 'analytics', title: 'View Analytics' },
      { id: 'subscription-mgmt', title: 'Manage Subscription' },
      { id: 'reviews', title: 'View Reviews' },
    ],
  },
  {
    id: 'kitchen-staff',
    title: 'Kitchen Staff Scenario',
    icon: ChefHat,
    subsections: [
      { id: 'login', title: 'Login' },
      { id: 'new-orders', title: 'View New Orders' },
      { id: 'update-status', title: 'Update Order Status' },
      { id: 'notifications', title: 'Handle Notifications' },
    ],
  },
  {
    id: 'delivery-personnel',
    title: 'Delivery Personnel Scenario',
    icon: Truck,
    subsections: [
      { id: 'ready-orders', title: 'View Ready Orders' },
      { id: 'accept-order', title: 'Accept Order' },
      { id: 'map', title: 'Use Map' },
      { id: 'delivery-status', title: 'Update Delivery Status' },
    ],
  },
  {
    id: 'platform-admin',
    title: 'Platform Admin Scenario',
    icon: Shield,
    subsections: [
      { id: 'manage-restaurants', title: 'Manage Restaurants' },
      { id: 'manage-subscriptions', title: 'Manage Subscriptions' },
      { id: 'platform-analytics', title: 'View Platform Analytics' },
      { id: 'system-management', title: 'System Management' },
    ],
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features',
    icon: Sparkles,
    subsections: [
      { id: 'ai-effective', title: 'Use AI Assistant Effectively' },
      { id: 'ar-optimization', title: 'Optimize AR Models' },
      { id: 'data-analysis', title: 'Data Analysis' },
      { id: 'integrations', title: 'External System Integration' },
    ],
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: HelpCircle,
    subsections: [
      { id: 'general', title: 'General Questions' },
      { id: 'technical', title: 'Technical Questions' },
      { id: 'billing', title: 'Billing Questions' },
      { id: 'support', title: 'Support Questions' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: AlertTriangle,
    subsections: [
      { id: 'login-issues', title: 'Login Issues' },
      { id: 'qr-issues', title: 'QR Code Issues' },
      { id: 'ar-issues', title: 'AR Issues' },
      { id: 'payment-issues', title: 'Payment Issues' },
    ],
  },
];

interface GuideSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

export function GuideSidebar({ activeSection, onSectionChange, className }: GuideSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionClick = (sectionId: string, subsectionId?: string) => {
    const fullId = subsectionId ? `${sectionId}-${subsectionId}` : sectionId;
    onSectionChange(fullId);
    
    // Expand parent section if clicking on subsection
    if (subsectionId && !expandedSections.includes(sectionId)) {
      setExpandedSections((prev) => [...prev, sectionId]);
    }
  };

  return (
    <aside
      className={cn(
        'w-80 h-full bg-card border-r border-border overflow-y-auto',
        className
      )}
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">User Guide</h2>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {guideSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);
          const isActive = activeSection.startsWith(section.id);

          return (
            <div key={section.id}>
              <button
                onClick={() => {
                  toggleSection(section.id);
                  if (!section.subsections) {
                    handleSectionClick(section.id);
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-sm">{section.title}</span>
                {section.subsections && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </button>

              {section.subsections && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 mr-4 space-y-1"
                >
                  {section.subsections.map((subsection) => {
                    const subsectionFullId = `${section.id}-${subsection.id}`;
                    const isSubActive = activeSection === subsectionFullId;

                    return (
                      <button
                        key={subsection.id}
                        onClick={() => handleSectionClick(section.id, subsection.id)}
                        className={cn(
                          'w-full text-right px-4 py-2 rounded-lg text-sm transition-colors',
                          isSubActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted text-muted-foreground'
                        )}
                      >
                        {subsection.title}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
