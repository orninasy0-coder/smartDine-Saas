/**
 * ChatWidget Example Usage
 * 
 * This file demonstrates how to integrate the AI Chat Widget
 * into your application pages.
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { ChatWidget, ChatButton } from '@/features/ai';

/**
 * Example 1: Basic Integration in Menu Page
 */
export function MenuPageWithChat() {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  return (
    <div className="min-h-screen">
      {/* Your menu content */}
      <div className="container mx-auto p-4">
        <h1>Restaurant Menu</h1>
        {/* Menu items... */}
      </div>

      {/* Chat Widget - Always available */}
      <ChatButton />
      {restaurantId && <ChatWidget restaurantId={restaurantId} />}
    </div>
  );
}

/**
 * Example 2: Integration with Cart Context
 */
export function MenuPageWithCartIntegration() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { addItem } = useCart();

  const handleAddToCart = (dishId: string) => {
    // Add dish to cart when suggested by AI
    addItem(dishId, 1);
  };

  return (
    <div className="min-h-screen">
      {/* Your menu content */}
      <div className="container mx-auto p-4">
        <h1>Restaurant Menu</h1>
        {/* Menu items... */}
      </div>

      {/* Chat Widget with cart integration */}
      <ChatButton />
      {restaurantId && (
        <ChatWidget 
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
}

/**
 * Example 3: Programmatic Control
 */
export function MenuPageWithProgrammaticControl() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { setChatWidgetOpen } = useUIStore();

  const handleHelpClick = () => {
    // Open chat widget when user clicks help button
    setChatWidgetOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Your menu content */}
      <div className="container mx-auto p-4">
        <h1>Restaurant Menu</h1>
        
        {/* Help button that opens chat */}
        <button onClick={handleHelpClick}>
          Need Help? Ask AI Assistant
        </button>
        
        {/* Menu items... */}
      </div>

      {/* Chat Widget */}
      <ChatButton />
      {restaurantId && <ChatWidget restaurantId={restaurantId} />}
    </div>
  );
}

/**
 * Example 4: Conditional Rendering Based on Subscription
 */
export function MenuPageWithFeatureGating() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { restaurant } = useRestaurant(restaurantId);
  
  // Only show AI assistant for Pro and Enterprise plans
  const hasAIFeature = ['PRO', 'ENTERPRISE'].includes(
    restaurant?.subscriptionPlan || ''
  );

  return (
    <div className="min-h-screen">
      {/* Your menu content */}
      <div className="container mx-auto p-4">
        <h1>Restaurant Menu</h1>
        {/* Menu items... */}
      </div>

      {/* Chat Widget - Only for Pro/Enterprise */}
      {hasAIFeature && (
        <>
          <ChatButton />
          {restaurantId && <ChatWidget restaurantId={restaurantId} />}
        </>
      )}
    </div>
  );
}

// Mock imports for example purposes
function useCart() {
  return {
    addItem: (dishId: string, quantity: number) => {
      console.log('Adding to cart:', dishId, quantity);
    },
  };
}

function useUIStore() {
  return {
    setChatWidgetOpen: (open: boolean) => {
      console.log('Setting chat widget open:', open);
    },
  };
}

function useRestaurant(restaurantId?: string) {
  return {
    restaurant: {
      subscriptionPlan: 'PRO',
    },
  };
}
