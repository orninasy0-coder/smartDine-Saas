# SmartDine Folder Structure

This document describes the complete folder structure for the SmartDine SaaS platform.

## Overview

The project follows a **feature-based architecture** with clear separation of concerns:

- **Features**: Self-contained modules with their own components, hooks, services, and types
- **Components**: Shared UI components used across features
- **Services**: Shared services for API communication and utilities
- **Utils**: Utility functions, constants, and types

## Complete Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication & Authorization
│   │   ├── components/   # Auth-specific components
│   │   ├── hooks/        # useAuth, useLogin, useRegister
│   │   ├── services/     # Auth API calls
│   │   ├── types/        # Auth TypeScript types
│   │   └── index.ts      # Public exports
│   │
│   ├── menu/             # QR Menu & Dish Management
│   │   ├── components/   # Menu components
│   │   ├── hooks/        # useMenu, useDish, useMenuSearch
│   │   ├── services/     # Menu API calls
│   │   └── index.ts
│   │
│   ├── cart/             # Shopping Cart
│   │   ├── components/   # Cart components
│   │   ├── hooks/        # useCart
│   │   ├── services/     # Cart storage logic
│   │   └── index.ts
│   │
│   ├── orders/           # Order Processing & Tracking
│   │   ├── components/   # Order components
│   │   ├── hooks/        # useOrders, useOrder, useCreateOrder
│   │   ├── services/     # Order API calls
│   │   └── index.ts
│   │
│   ├── ai-assistant/     # AI Chat Assistant (Future)
│   ├── ar-viewer/        # AR 3D Visualization (Future)
│   ├── kitchen/          # Kitchen Dashboard (Future)
│   ├── delivery/         # Delivery Dashboard (Future)
│   ├── dashboard/        # Restaurant Owner Dashboard (Future)
│   ├── admin/            # Platform Admin Dashboard (Future)
│   ├── feedback/         # Customer Feedback System (Future)
│   ├── analytics/        # Analytics & Reporting (Future)
│   └── README.md
│
├── components/           # Shared components
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── index.ts
│   │
│   ├── common/          # Common reusable components
│   │   ├── Loading.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── index.ts
│   │
│   ├── forms/           # Form components
│   │   ├── FormField.tsx
│   │   └── index.ts
│   │
│   ├── index.ts
│   └── README.md
│
├── services/            # Shared services
│   ├── api/            # API client
│   │   └── client.ts   # Fetch wrapper with auth
│   │
│   ├── storage/        # Storage utilities
│   │   └── index.ts    # localStorage/sessionStorage
│   │
│   ├── websocket/      # WebSocket (Future)
│   ├── notifications/  # Notifications (Future)
│   ├── index.ts
│   └── README.md
│
├── utils/              # Utility functions
│   ├── constants/      # Application constants
│   │   └── index.ts    # Routes, API URLs, enums
│   │
│   ├── types/          # Shared TypeScript types
│   │   └── index.ts    # User, Order, Dish, etc.
│   │
│   ├── validation/     # Validation utilities
│   │   └── index.ts    # Email, password, phone validation
│   │
│   ├── formatting/     # Formatting utilities
│   │   └── index.ts    # Date, price, text formatting
│   │
│   ├── helpers/        # Helper functions
│   │   └── index.ts    # General utilities
│   │
│   ├── index.ts
│   └── README.md
│
├── hooks/              # Shared custom hooks
│   └── useQuery.ts     # React Query wrapper
│
├── lib/                # Third-party library configs
│   ├── queryClient.ts  # React Query config
│   └── utils.ts        # shadcn/ui utils
│
├── pages/              # Page components
│   ├── Home.tsx
│   ├── NotFound.tsx
│   └── ...
│
├── assets/             # Static assets
│   └── react.svg
│
├── examples/           # Example components (temporary)
│   └── ReactQueryExample.tsx
│
├── App.tsx             # Root component
├── main.tsx            # Entry point
├── index.css           # Global styles
└── App.css             # App styles
```

## Key Principles

### 1. Feature-Based Organization

Each feature is self-contained with:

- **components/**: Feature-specific UI components
- **hooks/**: Feature-specific React hooks
- **services/**: API calls and business logic
- **types/**: TypeScript interfaces and types
- **utils/**: Feature-specific utilities (optional)
- **index.ts**: Public API exports

### 2. Shared Components

Located in `src/components/`:

- **ui/**: shadcn/ui components (managed by CLI)
- **layout/**: Page structure components
- **common/**: Generic reusable components
- **forms/**: Form-related components

### 3. Services Layer

Located in `src/services/`:

- **api/**: HTTP client configuration
- **storage/**: Browser storage utilities
- **websocket/**: Real-time communication (future)
- **notifications/**: Notification system (future)

### 4. Utilities

Located in `src/utils/`:

- **constants/**: Application-wide constants
- **types/**: Shared TypeScript types
- **validation/**: Input validation functions
- **formatting/**: Data formatting functions
- **helpers/**: General utility functions

## Import Patterns

### Using Path Aliases

All imports use the `@/` alias for clean imports:

```typescript
// ✅ Good - Using alias
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { formatPrice } from '@/utils/formatting';
import { apiClient } from '@/services/api/client';

// ❌ Bad - Relative paths
import { Button } from '../../../components/ui/button';
```

### Feature Exports

Features export their public API through index.ts:

```typescript
// In src/features/auth/index.ts
export * from './hooks';
export * from './services';
export * from './types';

// Usage
import { useAuth, authService } from '@/features/auth';
```

## Adding New Features

To add a new feature:

1. Create feature directory: `src/features/feature-name/`
2. Add subdirectories: `components/`, `hooks/`, `services/`, `types/`
3. Create `index.ts` for public exports
4. Follow existing patterns

Example:

```bash
src/features/ai-assistant/
├── components/
│   ├── ChatWidget.tsx
│   └── MessageList.tsx
├── hooks/
│   ├── useChat.ts
│   └── index.ts
├── services/
│   └── index.ts
├── types/
│   └── index.ts
└── index.ts
```

## Best Practices

1. **Keep features independent**: Features should not import from other features
2. **Use shared components**: Extract common UI to `src/components/`
3. **Centralize utilities**: Put shared logic in `src/utils/`
4. **Type everything**: Use TypeScript for all code
5. **Export through index**: Always use index.ts for public APIs
6. **Follow naming conventions**: PascalCase for components, camelCase for functions

## Future Additions

Features to be implemented:

- `ai-assistant/` - AI chat functionality
- `ar-viewer/` - 3D model visualization
- `kitchen/` - Kitchen dashboard
- `delivery/` - Delivery dashboard
- `dashboard/` - Restaurant owner dashboard
- `admin/` - Platform admin dashboard
- `feedback/` - Customer feedback system
- `analytics/` - Analytics and reporting

Services to be implemented:

- `websocket/` - Real-time updates
- `notifications/` - Push notifications
