# Error Pages Documentation

This document describes the error page components available in the SmartDine SaaS platform.

## Overview

The platform includes comprehensive error pages for common HTTP error scenarios:

- **404 Not Found** - When a user navigates to a non-existent route
- **500 Server Error** - When an internal server error occurs
- **403 Unauthorized** - When a user lacks permission (already implemented)

Additionally, a generic `ErrorPage` component is available for creating custom error pages.

## Components

### NotFound (404)

**Location**: `src/pages/NotFound.tsx`

Displays when a user navigates to a route that doesn't exist.

#### Props

```typescript
interface NotFoundProps {
  message?: string;      // Custom error message
  showSearch?: boolean;  // Show search button (default: false)
}
```

#### Features

- Displays the requested path that wasn't found
- Provides suggestions for the user
- "Go Back" button to return to previous page
- "Go Home" button to navigate to home page
- Optional search button
- Animated entrance with Framer Motion
- Responsive design with gradient background

#### Usage

```tsx
import NotFound from './pages/NotFound';

// Default usage
<Route path="*" element={<NotFound />} />

// With custom message
<NotFound message="This restaurant doesn't exist" />

// With search enabled
<NotFound showSearch={true} />
```

### ServerError (500)

**Location**: `src/pages/ServerError.tsx`

Displays when an internal server error occurs.

#### Props

```typescript
interface ServerErrorProps {
  message?: string;           // Custom error message
  errorCode?: string;         // Error reference ID
  showContactSupport?: boolean; // Show contact support button (default: true)
}
```

#### Features

- Displays error reference code for support
- Provides actionable suggestions
- "Refresh" button to reload the page
- "Go Home" button to navigate to home page
- "Contact Support" button (optional)
- Animated icon with shake effect
- Help text about including error reference

#### Usage

```tsx
import ServerError from './pages/ServerError';

// Default usage
<Route path="/server-error" element={<ServerError />} />

// With error code
<ServerError errorCode="ERR-2024-001" />

// With custom message
<ServerError 
  message="Database connection failed. Please try again later."
  errorCode="DB-CONN-001"
/>

// Without contact support button
<ServerError showContactSupport={false} />
```

### ErrorPage (Generic)

**Location**: `src/components/common/ErrorPage.tsx`

A flexible, reusable component for creating custom error pages.

#### Props

```typescript
interface ErrorPageProps {
  code: string | number;           // Error code (e.g., 404, 500)
  title: string;                   // Error title
  description: string;             // Error description
  icon: LucideIcon;               // Icon component
  iconColor?: string;             // Icon color class
  gradientFrom?: string;          // Background gradient start
  gradientVia?: string;           // Background gradient middle
  gradientTo?: string;            // Background gradient end
  details?: React.ReactNode;      // Additional details
  actions?: ErrorPageAction[];    // Action buttons
  helpText?: string;              // Additional help text
  showAnimatedBackground?: boolean; // Show animated background
}

interface ErrorPageAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  icon?: LucideIcon;
}
```

#### Usage

```tsx
import { ErrorPage } from '@/components/common';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CustomErrorPage() {
  const navigate = useNavigate();

  return (
    <ErrorPage
      code="503"
      title="Service Unavailable"
      description="The service is temporarily unavailable. Please try again later."
      icon={AlertTriangle}
      iconColor="text-amber-500"
      gradientFrom="from-amber-50"
      gradientVia="via-orange-50"
      gradientTo="to-red-50"
      actions={[
        {
          label: 'Refresh',
          onClick: () => window.location.reload(),
          icon: RefreshCw,
          variant: 'default',
        },
        {
          label: 'Go Home',
          onClick: () => navigate('/'),
          icon: Home,
          variant: 'outline',
        },
      ]}
      helpText="We're working to restore the service as quickly as possible."
      showAnimatedBackground={true}
    />
  );
}
```

## Routing Setup

Error pages are configured in `src/App.tsx`:

```tsx
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Routes>
      {/* Other routes */}
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/server-error" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

## Error Handling Integration

### With ErrorBoundary

Combine error pages with the ErrorBoundary component for comprehensive error handling:

```tsx
import { ErrorBoundary } from '@/components/common';
import ServerError from './pages/ServerError';

function App() {
  return (
    <ErrorBoundary
      fallback={<ServerError message="An unexpected error occurred" />}
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error('Error:', error, errorInfo);
      }}
    >
      <YourApp />
    </ErrorBoundary>
  );
}
```

### Programmatic Navigation

Navigate to error pages programmatically:

```tsx
import { useNavigate } from 'react-router-dom';

function YourComponent() {
  const navigate = useNavigate();

  const handleApiError = (error: any) => {
    if (error.status === 404) {
      navigate('/404'); // Or just let the catch-all route handle it
    } else if (error.status === 500) {
      navigate('/server-error', { 
        state: { errorCode: error.code } 
      });
    } else if (error.status === 403) {
      navigate('/unauthorized');
    }
  };

  // Use in API calls
  try {
    await fetchData();
  } catch (error) {
    handleApiError(error);
  }
}
```

### With State

Pass error information via navigation state:

```tsx
// Navigate with error details
navigate('/server-error', {
  state: {
    errorCode: 'ERR-2024-001',
    message: 'Database connection failed',
  },
});

// Receive in ServerError component
import { useLocation } from 'react-router-dom';

function ServerError() {
  const location = useLocation();
  const { errorCode, message } = location.state || {};

  return <ServerError errorCode={errorCode} message={message} />;
}
```

## Design System

All error pages follow the SmartDine design system:

- **Colors**: Uses theme colors (primary, destructive, etc.)
- **Components**: Built with shadcn/ui components (Card, Button)
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standard padding and margins
- **Dark Mode**: Full dark mode support
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first responsive design

## Accessibility

Error pages are built with accessibility in mind:

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support

## Testing

Tests are available in `src/pages/ErrorPages.test.tsx`:

```bash
# Run tests
npm run test ErrorPages.test.tsx

# Run with coverage
npm run test -- --coverage ErrorPages.test.tsx
```

## Best Practices

1. **Always provide context**: Include error codes or reference IDs for support
2. **Offer actions**: Give users clear next steps (refresh, go home, contact support)
3. **Be helpful**: Provide suggestions and explanations
4. **Log errors**: Always log errors to monitoring services
5. **Test error states**: Regularly test error pages in development
6. **Maintain consistency**: Use the same design patterns across all error pages
7. **Consider UX**: Make error pages friendly and not intimidating

## Future Enhancements

Potential improvements for error pages:

- [ ] Multi-language support (Arabic/English)
- [ ] Automatic error reporting to backend
- [ ] Recent pages history for easy navigation
- [ ] Suggested pages based on URL similarity
- [ ] Integration with analytics to track error rates
- [ ] Custom illustrations for each error type
- [ ] Offline detection and messaging
- [ ] Error recovery suggestions based on error type

## Related Documentation

- [ErrorBoundary Documentation](../components/common/ERROR_BOUNDARY_README.md)
- [Design System Guide](../design-system/DESIGN_SYSTEM_GUIDE.md)
- [Component Usage Guide](../design-system/COMPONENT_USAGE.md)
