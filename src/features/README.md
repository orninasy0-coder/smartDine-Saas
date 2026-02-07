# Features Directory

This directory contains feature-based modules for the SmartDine platform.
Each feature is self-contained with its own components, hooks, services, and types.

## Structure

```
features/
├── auth/              # Authentication & Authorization
├── menu/              # QR Menu & Dish Management
├── cart/              # Shopping Cart
├── orders/            # Order Processing & Tracking
├── ai-assistant/      # AI Chat Assistant
├── ar-viewer/         # AR 3D Visualization
├── kitchen/           # Kitchen Dashboard
├── delivery/          # Delivery Dashboard
├── dashboard/         # Restaurant Owner Dashboard
├── admin/             # Platform Admin Dashboard
├── feedback/          # Customer Feedback System
└── analytics/         # Analytics & Reporting
```

## Feature Module Pattern

Each feature follows this structure:

```
feature-name/
├── components/        # Feature-specific components
├── hooks/            # Feature-specific hooks
├── services/         # API calls and business logic
├── types/            # TypeScript types/interfaces
├── utils/            # Feature-specific utilities
└── index.ts          # Public exports
```
