/**
 * Feature Adoption Tracking
 * Track user adoption and usage of platform features
 */

import { analytics } from './index';

/**
 * Platform features to track
 */
export const FEATURES = {
  // Core Features
  QR_MENU: 'qr_menu',
  AI_ASSISTANT: 'ai_assistant',
  AR_VIEWER: 'ar_viewer',
  CART: 'cart',
  ORDER_TRACKING: 'order_tracking',
  
  // Restaurant Owner Features
  MENU_MANAGEMENT: 'menu_management',
  ANALYTICS_DASHBOARD: 'analytics_dashboard',
  STAFF_MANAGEMENT: 'staff_management',
  QR_GENERATOR: 'qr_generator',
  FEEDBACK_VIEW: 'feedback_view',
  
  // Kitchen Features
  KITCHEN_DASHBOARD: 'kitchen_dashboard',
  ORDER_STATUS_UPDATE: 'order_status_update',
  
  // Delivery Features
  DELIVERY_DASHBOARD: 'delivery_dashboard',
  ROUTE_OPTIMIZER: 'route_optimizer',
  
  // Admin Features
  PLATFORM_ANALYTICS: 'platform_analytics',
  RESTAURANT_MANAGEMENT: 'restaurant_management',
  SUBSCRIPTION_MANAGEMENT: 'subscription_management',
  
  // Advanced Features
  MULTI_LANGUAGE: 'multi_language',
  DARK_MODE: 'dark_mode',
  NOTIFICATIONS: 'notifications',
  SEARCH: 'search',
  FILTERS: 'filters',
} as const;

/**
 * Feature action types
 */
export type FeatureAction = 'viewed' | 'used' | 'completed';

/**
 * Track feature adoption
 */
export function trackFeature(
  featureName: string,
  action: FeatureAction,
  metadata?: Record<string, unknown>
): void {
  analytics.trackFeatureAdoption({
    featureName,
    action,
    metadata,
  });
}

/**
 * QR Menu feature tracking
 */
export const qrMenuFeature = {
  viewed: (restaurantId: string) => {
    trackFeature(FEATURES.QR_MENU, 'viewed', { restaurant_id: restaurantId });
  },
  
  used: (restaurantId: string, dishCount: number) => {
    trackFeature(FEATURES.QR_MENU, 'used', {
      restaurant_id: restaurantId,
      dish_count: dishCount,
    });
  },
  
  completed: (restaurantId: string, orderPlaced: boolean) => {
    trackFeature(FEATURES.QR_MENU, 'completed', {
      restaurant_id: restaurantId,
      order_placed: orderPlaced,
    });
  },
};

/**
 * AI Assistant feature tracking
 */
export const aiAssistantFeature = {
  viewed: () => {
    trackFeature(FEATURES.AI_ASSISTANT, 'viewed');
  },
  
  used: (messageCount: number) => {
    trackFeature(FEATURES.AI_ASSISTANT, 'used', { message_count: messageCount });
  },
  
  completed: (recommendationAccepted: boolean, addedToCart: boolean) => {
    trackFeature(FEATURES.AI_ASSISTANT, 'completed', {
      recommendation_accepted: recommendationAccepted,
      added_to_cart: addedToCart,
    });
  },
};

/**
 * AR Viewer feature tracking
 */
export const arViewerFeature = {
  viewed: (dishId: string) => {
    trackFeature(FEATURES.AR_VIEWER, 'viewed', { dish_id: dishId });
  },
  
  used: (dishId: string, interactionCount: number, duration: number) => {
    trackFeature(FEATURES.AR_VIEWER, 'used', {
      dish_id: dishId,
      interaction_count: interactionCount,
      duration,
    });
  },
  
  completed: (dishId: string, addedToCart: boolean) => {
    trackFeature(FEATURES.AR_VIEWER, 'completed', {
      dish_id: dishId,
      added_to_cart: addedToCart,
    });
  },
};

/**
 * Menu Management feature tracking
 */
export const menuManagementFeature = {
  viewed: (restaurantId: string) => {
    trackFeature(FEATURES.MENU_MANAGEMENT, 'viewed', { restaurant_id: restaurantId });
  },
  
  used: (restaurantId: string, action: 'add' | 'edit' | 'delete', dishId?: string) => {
    trackFeature(FEATURES.MENU_MANAGEMENT, 'used', {
      restaurant_id: restaurantId,
      action,
      dish_id: dishId,
    });
  },
  
  completed: (restaurantId: string, totalDishes: number) => {
    trackFeature(FEATURES.MENU_MANAGEMENT, 'completed', {
      restaurant_id: restaurantId,
      total_dishes: totalDishes,
    });
  },
};

/**
 * Analytics Dashboard feature tracking
 */
export const analyticsDashboardFeature = {
  viewed: (restaurantId: string) => {
    trackFeature(FEATURES.ANALYTICS_DASHBOARD, 'viewed', { restaurant_id: restaurantId });
  },
  
  used: (restaurantId: string, period: string, chartType?: string) => {
    trackFeature(FEATURES.ANALYTICS_DASHBOARD, 'used', {
      restaurant_id: restaurantId,
      period,
      chart_type: chartType,
    });
  },
  
  completed: (restaurantId: string, insightsViewed: number) => {
    trackFeature(FEATURES.ANALYTICS_DASHBOARD, 'completed', {
      restaurant_id: restaurantId,
      insights_viewed: insightsViewed,
    });
  },
};

/**
 * QR Generator feature tracking
 */
export const qrGeneratorFeature = {
  viewed: (restaurantId: string) => {
    trackFeature(FEATURES.QR_GENERATOR, 'viewed', { restaurant_id: restaurantId });
  },
  
  used: (restaurantId: string, tableCount: number) => {
    trackFeature(FEATURES.QR_GENERATOR, 'used', {
      restaurant_id: restaurantId,
      table_count: tableCount,
    });
  },
  
  completed: (restaurantId: string, qrCodesGenerated: number) => {
    trackFeature(FEATURES.QR_GENERATOR, 'completed', {
      restaurant_id: restaurantId,
      qr_codes_generated: qrCodesGenerated,
    });
  },
};

/**
 * Kitchen Dashboard feature tracking
 */
export const kitchenDashboardFeature = {
  viewed: (restaurantId: string) => {
    trackFeature(FEATURES.KITCHEN_DASHBOARD, 'viewed', { restaurant_id: restaurantId });
  },
  
  used: (restaurantId: string, ordersProcessed: number) => {
    trackFeature(FEATURES.KITCHEN_DASHBOARD, 'used', {
      restaurant_id: restaurantId,
      orders_processed: ordersProcessed,
    });
  },
  
  completed: (restaurantId: string, averageProcessingTime: number) => {
    trackFeature(FEATURES.KITCHEN_DASHBOARD, 'completed', {
      restaurant_id: restaurantId,
      average_processing_time: averageProcessingTime,
    });
  },
};

/**
 * Multi-language feature tracking
 */
export const multiLanguageFeature = {
  viewed: () => {
    trackFeature(FEATURES.MULTI_LANGUAGE, 'viewed');
  },
  
  used: (fromLanguage: string, toLanguage: string) => {
    trackFeature(FEATURES.MULTI_LANGUAGE, 'used', {
      from_language: fromLanguage,
      to_language: toLanguage,
    });
  },
  
  completed: (language: string, sessionDuration: number) => {
    trackFeature(FEATURES.MULTI_LANGUAGE, 'completed', {
      language,
      session_duration: sessionDuration,
    });
  },
};

/**
 * Dark Mode feature tracking
 */
export const darkModeFeature = {
  viewed: () => {
    trackFeature(FEATURES.DARK_MODE, 'viewed');
  },
  
  used: (enabled: boolean) => {
    trackFeature(FEATURES.DARK_MODE, 'used', { enabled });
  },
  
  completed: (preference: 'light' | 'dark' | 'system') => {
    trackFeature(FEATURES.DARK_MODE, 'completed', { preference });
  },
};

/**
 * Search feature tracking
 */
export const searchFeature = {
  viewed: (context: string) => {
    trackFeature(FEATURES.SEARCH, 'viewed', { context });
  },
  
  used: (query: string, resultsCount: number) => {
    trackFeature(FEATURES.SEARCH, 'used', {
      query_length: query.length,
      results_count: resultsCount,
    });
  },
  
  completed: (query: string, resultClicked: boolean) => {
    trackFeature(FEATURES.SEARCH, 'completed', {
      query_length: query.length,
      result_clicked: resultClicked,
    });
  },
};

/**
 * Helper to track first-time feature usage
 */
export function trackFirstTimeFeatureUse(featureName: string, userId?: string): void {
  const storageKey = `feature_first_use_${featureName}`;
  const hasUsedBefore = localStorage.getItem(storageKey);
  
  if (!hasUsedBefore) {
    analytics.trackEvent({
      category: 'feature_adoption',
      action: 'first_time_use',
      label: featureName,
      metadata: {
        feature_name: featureName,
        user_id: userId,
        timestamp: new Date().toISOString(),
      },
    });
    
    localStorage.setItem(storageKey, 'true');
  }
}
