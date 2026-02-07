# Environment Variables Setup Guide

This document explains how to configure environment variables for the SmartDine SaaS platform.

## Overview

The SmartDine platform uses environment variables to configure different aspects of the application, including API endpoints, feature flags, third-party integrations, and more.

## Environment Files

The project includes three environment files:

1. **`.env.example`** - Template file with all available environment variables and their descriptions
2. **`.env.development`** - Development environment configuration (included in repository)
3. **`.env.production`** - Production environment configuration template (included in repository)

## Setup Instructions

### For Development

1. The `.env.development` file is already configured with sensible defaults for local development
2. Copy `.env.development` to `.env` if you want to customize local settings:
   ```bash
   copy .env.development .env
   ```
3. Update any placeholder values (API keys, etc.) with your actual development credentials

### For Production

1. Copy `.env.production` to `.env`:
   ```bash
   copy .env.production .env
   ```
2. **IMPORTANT**: Replace all placeholder values with actual production credentials
3. Never commit the production `.env` file to version control

## Environment Variable Categories

### Application Configuration
- `VITE_APP_ENV` - Application environment (development, staging, production)
- `VITE_APP_NAME` - Application name displayed in UI
- `VITE_APP_URL` - Base URL for the application

### API Configuration
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_API_TIMEOUT` - API request timeout in milliseconds

### Authentication
- `VITE_AUTH_TOKEN_KEY` - Local storage key for JWT token
- `VITE_SESSION_TIMEOUT` - Session timeout in minutes

### Feature Flags
- `VITE_FEATURE_AI_ASSISTANT` - Enable/disable AI assistant feature
- `VITE_FEATURE_AR_MENU` - Enable/disable AR 3D menu feature
- `VITE_FEATURE_ANALYTICS` - Enable/disable analytics feature
- `VITE_FEATURE_MULTI_LANGUAGE` - Enable/disable multi-language support
- `VITE_FEATURE_DARK_MODE` - Enable/disable dark mode

### AI Configuration
- `VITE_OPENAI_API_KEY` - OpenAI API key for AI assistant
- `VITE_AI_MODEL` - AI model to use (e.g., gpt-4)
- `VITE_AI_MAX_TOKENS` - Maximum tokens for AI responses

### Storage & CDN
- `VITE_CDN_URL` - CDN base URL for static assets
- `VITE_STORAGE_URL` - Cloud storage URL for uploads
- `VITE_MAX_UPLOAD_SIZE` - Maximum upload size in bytes
- `VITE_MAX_MODEL_SIZE` - Maximum 3D model size in bytes

### Payment Gateway
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID

### Maps & Location
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key for delivery tracking

### Analytics & Monitoring
- `VITE_GA_MEASUREMENT_ID` - Google Analytics measurement ID
- `VITE_SENTRY_DSN` - Sentry DSN for error tracking
- `VITE_DEBUG_MODE` - Enable debug mode

### WebSocket Configuration
- `VITE_WS_URL` - WebSocket server URL for real-time updates
- `VITE_WS_RECONNECT_ATTEMPTS` - Number of reconnection attempts
- `VITE_WS_RECONNECT_DELAY` - Delay between reconnection attempts

### Localization
- `VITE_DEFAULT_LANGUAGE` - Default language (en, ar)
- `VITE_SUPPORTED_LANGUAGES` - Comma-separated list of supported languages

### Cache Configuration
- `VITE_CACHE_MENU_TTL` - Cache TTL for menu data in seconds
- `VITE_CACHE_RESTAURANT_TTL` - Cache TTL for restaurant data in seconds

### Rate Limiting
- `VITE_RATE_LIMIT` - API rate limit (requests per minute)

### Subscription Plans
- `VITE_PLAN_BASIC_PRICE` - Basic plan monthly price
- `VITE_PLAN_PRO_PRICE` - Pro plan monthly price
- `VITE_PLAN_ENTERPRISE_PRICE` - Enterprise plan monthly price

### Development Tools
- `VITE_ENABLE_REACT_QUERY_DEVTOOLS` - Enable React Query devtools
- `VITE_ENABLE_REDUX_DEVTOOLS` - Enable Redux devtools
- `VITE_MOCK_API` - Use mock API responses

## Accessing Environment Variables

In your code, access environment variables using `import.meta.env`:

```typescript
// Example usage
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const isAIEnabled = import.meta.env.VITE_FEATURE_AI_ASSISTANT === 'true';
```

## Security Best Practices

1. **Never commit sensitive credentials** to version control
2. **Use different keys** for development and production
3. **Rotate API keys regularly** in production
4. **Limit API key permissions** to only what's needed
5. **Use environment-specific configurations** for different deployment stages
6. **Keep `.env` files secure** and restrict access

## Vite Environment Variable Rules

- All environment variables must be prefixed with `VITE_` to be exposed to the client
- Environment variables are statically replaced at build time
- Changes to `.env` files require restarting the dev server

## Troubleshooting

### Environment variables not loading
1. Ensure the variable name starts with `VITE_`
2. Restart the development server after changing `.env` files
3. Check that the `.env` file is in the project root directory

### Build-time vs Runtime
- Vite environment variables are replaced at build time
- For runtime configuration, consider using a config API endpoint

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Environment Variables Best Practices](https://12factor.net/config)

## Support

For questions or issues related to environment configuration, please contact the development team or refer to the project documentation.
