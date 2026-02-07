import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000/api/v1',
      VITE_API_TIMEOUT: '30000',
      VITE_SESSION_TIMEOUT: '3600000',
      VITE_FEATURE_AI_ASSISTANT: 'true',
      VITE_FEATURE_AR_MENU: 'true',
      VITE_FEATURE_ANALYTICS: 'true',
      VITE_FEATURE_MULTI_LANGUAGE: 'true',
      VITE_FEATURE_DARK_MODE: 'true',
      VITE_OPENAI_API_KEY: 'test-key',
      VITE_AI_MAX_TOKENS: '500',
      VITE_MAX_UPLOAD_SIZE: '5242880',
      VITE_MAX_MODEL_SIZE: '10485760',
      VITE_STRIPE_PUBLISHABLE_KEY: 'test-key',
      VITE_PAYPAL_CLIENT_ID: 'test-client-id',
      VITE_GOOGLE_MAPS_API_KEY: 'test-key',
      VITE_GA_MEASUREMENT_ID: 'test-id',
      VITE_SENTRY_DSN: 'test-dsn',
      VITE_DEBUG_MODE: 'false',
      VITE_WS_RECONNECT_ATTEMPTS: '3',
      VITE_WS_RECONNECT_DELAY: '1000',
      VITE_SUPPORTED_LANGUAGES: 'en,ar',
      VITE_CACHE_MENU_TTL: '3600',
      VITE_CACHE_RESTAURANT_TTL: '3600',
      VITE_RATE_LIMIT: '100',
      VITE_PLAN_BASIC_PRICE: '29',
      VITE_PLAN_PRO_PRICE: '99',
      VITE_PLAN_ENTERPRISE_PRICE: '299',
      VITE_ENABLE_REACT_QUERY_DEVTOOLS: 'false',
      VITE_ENABLE_REDUX_DEVTOOLS: 'false',
      VITE_MOCK_API: 'true',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
