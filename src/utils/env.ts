/**
 * Environment variable utilities
 * Provides type-safe access to environment variables with validation
 */

interface EnvConfig {
  // Application
  APP_ENV: string;
  APP_NAME: string;
  APP_URL: string;

  // API
  API_BASE_URL: string;
  API_TIMEOUT: number;

  // Authentication
  AUTH_TOKEN_KEY: string;
  SESSION_TIMEOUT: number;

  // Feature Flags
  FEATURE_AI_ASSISTANT: boolean;
  FEATURE_AR_MENU: boolean;
  FEATURE_ANALYTICS: boolean;
  FEATURE_MULTI_LANGUAGE: boolean;
  FEATURE_DARK_MODE: boolean;

  // AI
  OPENAI_API_KEY?: string;
  AI_MODEL: string;
  AI_MAX_TOKENS: number;

  // Storage
  CDN_URL: string;
  STORAGE_URL: string;
  MAX_UPLOAD_SIZE: number;
  MAX_MODEL_SIZE: number;

  // Payment
  STRIPE_PUBLISHABLE_KEY?: string;
  PAYPAL_CLIENT_ID?: string;

  // Maps
  GOOGLE_MAPS_API_KEY?: string;

  // Analytics
  GA_MEASUREMENT_ID?: string;
  SENTRY_DSN?: string;
  POSTHOG_API_KEY?: string;
  POSTHOG_API_HOST?: string;
  DEBUG_MODE: boolean;

  // WebSocket
  WS_URL: string;
  WS_RECONNECT_ATTEMPTS: number;
  WS_RECONNECT_DELAY: number;

  // Localization
  DEFAULT_LANGUAGE: string;
  SUPPORTED_LANGUAGES: string[];

  // Cache
  CACHE_MENU_TTL: number;
  CACHE_RESTAURANT_TTL: number;

  // Rate Limiting
  RATE_LIMIT: number;

  // Subscription Plans
  PLAN_BASIC_PRICE: number;
  PLAN_PRO_PRICE: number;
  PLAN_ENTERPRISE_PRICE: number;

  // Development Tools
  ENABLE_REACT_QUERY_DEVTOOLS: boolean;
  ENABLE_REDUX_DEVTOOLS: boolean;
  MOCK_API: boolean;
}

/**
 * Get environment variable value
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[`VITE_${key}`];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable VITE_${key} is not defined`);
    return '';
  }
  return value ?? defaultValue ?? '';
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue = false): boolean {
  const value = getEnv(key);
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue = 0): number {
  const value = getEnv(key);
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get array environment variable (comma-separated)
 */
function getArrayEnv(key: string, defaultValue: string[] = []): string[] {
  const value = getEnv(key);
  if (!value) return defaultValue;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Environment configuration object
 */
export const env: EnvConfig = {
  // Application
  APP_ENV: getEnv('APP_ENV', 'development'),
  APP_NAME: getEnv('APP_NAME', 'SmartDine'),
  APP_URL: getEnv('APP_URL', 'http://localhost:5173'),

  // API
  API_BASE_URL: getEnv('API_BASE_URL', '/api/v1'),
  API_TIMEOUT: getNumberEnv('API_TIMEOUT', 30000),

  // Authentication
  AUTH_TOKEN_KEY: getEnv('AUTH_TOKEN_KEY', 'smartdine_auth_token'),
  SESSION_TIMEOUT: getNumberEnv('SESSION_TIMEOUT', 60),

  // Feature Flags
  FEATURE_AI_ASSISTANT: getBooleanEnv('FEATURE_AI_ASSISTANT', true),
  FEATURE_AR_MENU: getBooleanEnv('FEATURE_AR_MENU', true),
  FEATURE_ANALYTICS: getBooleanEnv('FEATURE_ANALYTICS', true),
  FEATURE_MULTI_LANGUAGE: getBooleanEnv('FEATURE_MULTI_LANGUAGE', true),
  FEATURE_DARK_MODE: getBooleanEnv('FEATURE_DARK_MODE', true),

  // AI
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY'),
  AI_MODEL: getEnv('AI_MODEL', 'gpt-4'),
  AI_MAX_TOKENS: getNumberEnv('AI_MAX_TOKENS', 500),

  // Storage
  CDN_URL: getEnv('CDN_URL', ''),
  STORAGE_URL: getEnv('STORAGE_URL', ''),
  MAX_UPLOAD_SIZE: getNumberEnv('MAX_UPLOAD_SIZE', 5242880), // 5MB
  MAX_MODEL_SIZE: getNumberEnv('MAX_MODEL_SIZE', 10485760), // 10MB

  // Payment
  STRIPE_PUBLISHABLE_KEY: getEnv('STRIPE_PUBLISHABLE_KEY'),
  PAYPAL_CLIENT_ID: getEnv('PAYPAL_CLIENT_ID'),

  // Maps
  GOOGLE_MAPS_API_KEY: getEnv('GOOGLE_MAPS_API_KEY'),

  // Analytics
  GA_MEASUREMENT_ID: getEnv('GA_MEASUREMENT_ID'),
  SENTRY_DSN: getEnv('SENTRY_DSN'),
  POSTHOG_API_KEY: getEnv('POSTHOG_API_KEY'),
  POSTHOG_API_HOST: getEnv('POSTHOG_API_HOST', 'https://app.posthog.com'),
  DEBUG_MODE: getBooleanEnv('DEBUG_MODE', false),

  // WebSocket
  WS_URL: getEnv('WS_URL', 'ws://localhost:3000'),
  WS_RECONNECT_ATTEMPTS: getNumberEnv('WS_RECONNECT_ATTEMPTS', 5),
  WS_RECONNECT_DELAY: getNumberEnv('WS_RECONNECT_DELAY', 3000),

  // Localization
  DEFAULT_LANGUAGE: getEnv('DEFAULT_LANGUAGE', 'en'),
  SUPPORTED_LANGUAGES: getArrayEnv('SUPPORTED_LANGUAGES', ['en', 'ar']),

  // Cache
  CACHE_MENU_TTL: getNumberEnv('CACHE_MENU_TTL', 3600),
  CACHE_RESTAURANT_TTL: getNumberEnv('CACHE_RESTAURANT_TTL', 3600),

  // Rate Limiting
  RATE_LIMIT: getNumberEnv('RATE_LIMIT', 100),

  // Subscription Plans
  PLAN_BASIC_PRICE: getNumberEnv('PLAN_BASIC_PRICE', 29),
  PLAN_PRO_PRICE: getNumberEnv('PLAN_PRO_PRICE', 99),
  PLAN_ENTERPRISE_PRICE: getNumberEnv('PLAN_ENTERPRISE_PRICE', 299),

  // Development Tools
  ENABLE_REACT_QUERY_DEVTOOLS: getBooleanEnv('ENABLE_REACT_QUERY_DEVTOOLS', true),
  ENABLE_REDUX_DEVTOOLS: getBooleanEnv('ENABLE_REDUX_DEVTOOLS', true),
  MOCK_API: getBooleanEnv('MOCK_API', false),
};

/**
 * Check if running in development mode
 */
export const isDevelopment = env.APP_ENV === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = env.APP_ENV === 'production';

/**
 * Check if running in test mode
 */
export const isTest = env.APP_ENV === 'test';

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
  const requiredVars: (keyof EnvConfig)[] = ['APP_ENV', 'APP_NAME', 'APP_URL', 'API_BASE_URL'];

  const missing: string[] = [];

  for (const key of requiredVars) {
    if (!env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about missing optional but important variables in production
  if (isProduction) {
    const warnings: string[] = [];

    if (!env.OPENAI_API_KEY && env.FEATURE_AI_ASSISTANT) {
      warnings.push('OPENAI_API_KEY (AI Assistant will not work)');
    }

    if (!env.STRIPE_PUBLISHABLE_KEY) {
      warnings.push('STRIPE_PUBLISHABLE_KEY (Payment processing will not work)');
    }

    if (!env.GOOGLE_MAPS_API_KEY) {
      warnings.push('GOOGLE_MAPS_API_KEY (Maps features will not work)');
    }

    if (warnings.length > 0) {
      console.warn(`Missing optional environment variables in production:\n${warnings.join('\n')}`);
    }
  }
}

/**
 * Get feature flag status
 */
export function isFeatureEnabled(
  feature: keyof Pick<
    EnvConfig,
    | 'FEATURE_AI_ASSISTANT'
    | 'FEATURE_AR_MENU'
    | 'FEATURE_ANALYTICS'
    | 'FEATURE_MULTI_LANGUAGE'
    | 'FEATURE_DARK_MODE'
  >
): boolean {
  return env[feature];
}

/**
 * Export individual environment variables for convenience
 */
export const {
  APP_ENV,
  APP_NAME,
  APP_URL,
  API_BASE_URL,
  API_TIMEOUT,
  AUTH_TOKEN_KEY,
  SESSION_TIMEOUT,
  FEATURE_AI_ASSISTANT,
  FEATURE_AR_MENU,
  FEATURE_ANALYTICS,
  FEATURE_MULTI_LANGUAGE,
  FEATURE_DARK_MODE,
  OPENAI_API_KEY,
  AI_MODEL,
  AI_MAX_TOKENS,
  CDN_URL,
  STORAGE_URL,
  MAX_UPLOAD_SIZE,
  MAX_MODEL_SIZE,
  STRIPE_PUBLISHABLE_KEY,
  PAYPAL_CLIENT_ID,
  GOOGLE_MAPS_API_KEY,
  GA_MEASUREMENT_ID,
  SENTRY_DSN,
  DEBUG_MODE,
  WS_URL,
  WS_RECONNECT_ATTEMPTS,
  WS_RECONNECT_DELAY,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  CACHE_MENU_TTL,
  CACHE_RESTAURANT_TTL,
  RATE_LIMIT,
  PLAN_BASIC_PRICE,
  PLAN_PRO_PRICE,
  PLAN_ENTERPRISE_PRICE,
  ENABLE_REACT_QUERY_DEVTOOLS,
  ENABLE_REDUX_DEVTOOLS,
  MOCK_API,
} = env;
