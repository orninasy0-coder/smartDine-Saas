/**
 * Conversion Funnel Tracking
 * Track user progress through conversion funnels
 */

import { analytics } from './index';

/**
 * Funnel stages for different user journeys
 */
export const FUNNELS = {
  ORDER_PLACEMENT: {
    name: 'order_placement',
    stages: {
      QR_SCAN: 'qr_scan',
      MENU_VIEW: 'menu_view',
      DISH_VIEW: 'dish_view',
      ADD_TO_CART: 'add_to_cart',
      CART_VIEW: 'cart_view',
      ORDER_CONFIRM: 'order_confirm',
      ORDER_COMPLETE: 'order_complete',
    },
  },
  RESTAURANT_SIGNUP: {
    name: 'restaurant_signup',
    stages: {
      LANDING_VIEW: 'landing_view',
      PRICING_VIEW: 'pricing_view',
      SIGNUP_START: 'signup_start',
      SIGNUP_COMPLETE: 'signup_complete',
      ONBOARDING_START: 'onboarding_start',
      ONBOARDING_COMPLETE: 'onboarding_complete',
    },
  },
  AI_ASSISTANT: {
    name: 'ai_assistant',
    stages: {
      WIDGET_VIEW: 'widget_view',
      CHAT_START: 'chat_start',
      RECOMMENDATION_VIEW: 'recommendation_view',
      RECOMMENDATION_ACCEPT: 'recommendation_accept',
      ADD_TO_CART: 'add_to_cart',
    },
  },
  AR_VIEWER: {
    name: 'ar_viewer',
    stages: {
      AR_BUTTON_VIEW: 'ar_button_view',
      AR_OPEN: 'ar_open',
      MODEL_LOAD: 'model_load',
      INTERACTION: 'interaction',
      ADD_TO_CART: 'add_to_cart',
    },
  },
} as const;

/**
 * Track funnel stage
 */
export function trackFunnelStage(
  funnelName: string,
  stage: string,
  metadata?: Record<string, unknown>
): void {
  analytics.trackEvent({
    category: 'funnel',
    action: `${funnelName}_${stage}`,
    label: stage,
    metadata: {
      funnel_name: funnelName,
      funnel_stage: stage,
      ...metadata,
    },
  });
}

/**
 * Track order placement funnel
 */
export const orderFunnel = {
  qrScan: (tableId?: string) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.QR_SCAN, {
      table_id: tableId,
    });
  },

  menuView: (restaurantId: string) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.MENU_VIEW, {
      restaurant_id: restaurantId,
    });
  },

  dishView: (dishId: string, dishName: string) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.DISH_VIEW, {
      dish_id: dishId,
      dish_name: dishName,
    });
  },

  addToCart: (dishId: string, quantity: number, price: number) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.ADD_TO_CART, {
      dish_id: dishId,
      quantity,
      price,
    });
  },

  cartView: (itemCount: number, totalValue: number) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.CART_VIEW, {
      item_count: itemCount,
      total_value: totalValue,
    });
  },

  orderConfirm: (orderId: string, totalValue: number) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.ORDER_CONFIRM, {
      order_id: orderId,
      total_value: totalValue,
    });
  },

  orderComplete: (orderId: string, totalValue: number, itemCount: number) => {
    trackFunnelStage(FUNNELS.ORDER_PLACEMENT.name, FUNNELS.ORDER_PLACEMENT.stages.ORDER_COMPLETE, {
      order_id: orderId,
      total_value: totalValue,
      item_count: itemCount,
    });

    // Also track as conversion
    analytics.trackConversion({
      eventName: 'purchase',
      value: totalValue,
      currency: 'USD',
      transactionId: orderId,
    });
  },
};

/**
 * Track restaurant signup funnel
 */
export const signupFunnel = {
  landingView: () => {
    trackFunnelStage(
      FUNNELS.RESTAURANT_SIGNUP.name,
      FUNNELS.RESTAURANT_SIGNUP.stages.LANDING_VIEW
    );
  },

  pricingView: () => {
    trackFunnelStage(
      FUNNELS.RESTAURANT_SIGNUP.name,
      FUNNELS.RESTAURANT_SIGNUP.stages.PRICING_VIEW
    );
  },

  signupStart: (plan?: string) => {
    trackFunnelStage(FUNNELS.RESTAURANT_SIGNUP.name, FUNNELS.RESTAURANT_SIGNUP.stages.SIGNUP_START, {
      plan,
    });
  },

  signupComplete: (userId: string, plan: string) => {
    trackFunnelStage(
      FUNNELS.RESTAURANT_SIGNUP.name,
      FUNNELS.RESTAURANT_SIGNUP.stages.SIGNUP_COMPLETE,
      {
        user_id: userId,
        plan,
      }
    );

    // Track as conversion
    analytics.trackConversion({
      eventName: 'sign_up',
      value: 0,
    });
  },

  onboardingStart: (userId: string) => {
    trackFunnelStage(
      FUNNELS.RESTAURANT_SIGNUP.name,
      FUNNELS.RESTAURANT_SIGNUP.stages.ONBOARDING_START,
      {
        user_id: userId,
      }
    );
  },

  onboardingComplete: (userId: string, restaurantId: string) => {
    trackFunnelStage(
      FUNNELS.RESTAURANT_SIGNUP.name,
      FUNNELS.RESTAURANT_SIGNUP.stages.ONBOARDING_COMPLETE,
      {
        user_id: userId,
        restaurant_id: restaurantId,
      }
    );
  },
};

/**
 * Track AI assistant funnel
 */
export const aiFunnel = {
  widgetView: () => {
    trackFunnelStage(FUNNELS.AI_ASSISTANT.name, FUNNELS.AI_ASSISTANT.stages.WIDGET_VIEW);
  },

  chatStart: () => {
    trackFunnelStage(FUNNELS.AI_ASSISTANT.name, FUNNELS.AI_ASSISTANT.stages.CHAT_START);
  },

  recommendationView: (dishIds: string[]) => {
    trackFunnelStage(FUNNELS.AI_ASSISTANT.name, FUNNELS.AI_ASSISTANT.stages.RECOMMENDATION_VIEW, {
      dish_count: dishIds.length,
      dish_ids: dishIds,
    });
  },

  recommendationAccept: (dishId: string) => {
    trackFunnelStage(FUNNELS.AI_ASSISTANT.name, FUNNELS.AI_ASSISTANT.stages.RECOMMENDATION_ACCEPT, {
      dish_id: dishId,
    });
  },

  addToCart: (dishId: string, fromRecommendation: boolean) => {
    trackFunnelStage(FUNNELS.AI_ASSISTANT.name, FUNNELS.AI_ASSISTANT.stages.ADD_TO_CART, {
      dish_id: dishId,
      from_recommendation: fromRecommendation,
    });
  },
};

/**
 * Track AR viewer funnel
 */
export const arFunnel = {
  buttonView: (dishId: string) => {
    trackFunnelStage(FUNNELS.AR_VIEWER.name, FUNNELS.AR_VIEWER.stages.AR_BUTTON_VIEW, {
      dish_id: dishId,
    });
  },

  arOpen: (dishId: string) => {
    trackFunnelStage(FUNNELS.AR_VIEWER.name, FUNNELS.AR_VIEWER.stages.AR_OPEN, {
      dish_id: dishId,
    });
  },

  modelLoad: (dishId: string, loadTime: number) => {
    trackFunnelStage(FUNNELS.AR_VIEWER.name, FUNNELS.AR_VIEWER.stages.MODEL_LOAD, {
      dish_id: dishId,
      load_time: loadTime,
    });
  },

  interaction: (dishId: string, interactionType: string) => {
    trackFunnelStage(FUNNELS.AR_VIEWER.name, FUNNELS.AR_VIEWER.stages.INTERACTION, {
      dish_id: dishId,
      interaction_type: interactionType,
    });
  },

  addToCart: (dishId: string) => {
    trackFunnelStage(FUNNELS.AR_VIEWER.name, FUNNELS.AR_VIEWER.stages.ADD_TO_CART, {
      dish_id: dishId,
    });
  },
};
