# ErrorBoundary Component

A general-purpose React error boundary component that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of crashing the entire application.

## Features

- ✅ Catches and handles React component errors
- ✅ Customizable error UI with title and message
- ✅ Retry functionality with configurable max attempts
- ✅ Home navigation button
- ✅ Custom fallback UI support
- ✅ Error callback for logging to external services
- ✅ Development mode error details
- ✅ Responsive and accessible design
- ✅ Dark mode support
- ✅ TypeScript support

## Installation

The ErrorBoundary is already included in the common components. Import it from:

```tsx
import { ErrorBoundary } from '@/components/common';
```

## Basic Usage

### Simple Wrapper

```tsx
import { ErrorBoundary } from '@/components/common';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### With Custom Error Messages

```tsx
<ErrorBoundary
  errorTitle="Oops! Something went wrong"
  errorMessage="We're working on fixing this issue. Please try again later."
>
  <YourComponent />
</ErrorBoundary>
```

### With Error Logging

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to your error tracking service
    logErrorToService(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | The component tree to wrap |
| `fallback` | `ReactNode` | `undefined` | Custom fallback UI to render on error |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | `undefined` | Callback when an error occurs |
| `enableRetry` | `boolean` | `true` | Show retry button |
| `enableHomeButton` | `boolean` | `true` | Show home navigation button |
| `errorMessage` | `string` | Auto-generated | Custom error message |
| `errorTitle` | `string` | "Something went wrong" | Custom error title |
| `maxRetries` | `number` | `3` | Maximum retry attempts |
| `resetOnPropsChange` | `boolean` | `false` | Reset error when children change |

## Advanced Usage

### Custom Fallback UI

```tsx
const customFallback = (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Custom Error UI</h2>
    <p>This is a completely custom error interface</p>
    <button onClick={() => window.location.reload()}>
      Reload Page
    </button>
  </div>
);

<ErrorBoundary fallback={customFallback}>
  <YourComponent />
</ErrorBoundary>
```

### Disable Retry

```tsx
<ErrorBoundary enableRetry={false}>
  <YourComponent />
</ErrorBoundary>
```

### Custom Max Retries

```tsx
<ErrorBoundary maxRetries={5}>
  <YourComponent />
</ErrorBoundary>
```

### Reset on Props Change

Useful when you want the error boundary to reset when the component receives new props:

```tsx
<ErrorBoundary resetOnPropsChange={true}>
  <UserProfile userId={userId} />
</ErrorBoundary>
```

## Best Practices

### 1. Wrap at Multiple Levels

Use error boundaries at different levels of your component tree for granular error handling:

```tsx
function App() {
  return (
    <ErrorBoundary errorTitle="App Error">
      <Header />
      
      <ErrorBoundary errorTitle="Sidebar Error" enableHomeButton={false}>
        <Sidebar />
      </ErrorBoundary>
      
      <main>
        <ErrorBoundary errorTitle="Content Error">
          <MainContent />
        </ErrorBoundary>
      </main>
      
      <Footer />
    </ErrorBoundary>
  );
}
```

### 2. Log Errors to External Services

Always log errors to an error tracking service in production:

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Sentry
    Sentry.captureException(error, { extra: errorInfo });
    
    // LogRocket
    LogRocket.captureException(error, { extra: errorInfo });
    
    // Custom service
    fetch('/api/log-error', {
      method: 'POST',
      body: JSON.stringify({ error: error.toString(), errorInfo }),
    });
  }}
>
  <App />
</ErrorBoundary>
```

### 3. Provide Helpful Error Messages

Customize error messages based on the context:

```tsx
// For user-facing features
<ErrorBoundary
  errorTitle="Unable to Load Dashboard"
  errorMessage="We're having trouble loading your dashboard. Please try again or contact support if the problem persists."
>
  <Dashboard />
</ErrorBoundary>

// For critical features
<ErrorBoundary
  errorTitle="Payment Processing Error"
  errorMessage="We couldn't process your payment. Please check your payment details and try again."
  enableRetry={true}
  maxRetries={1}
>
  <PaymentForm />
</ErrorBoundary>
```

### 4. Wrap Route Components

Wrap each route with an error boundary to prevent one page's error from crashing the entire app:

```tsx
import { Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ErrorBoundary>
            <HomePage />
          </ErrorBoundary>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ErrorBoundary>
            <DashboardPage />
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}
```

### 5. Development vs Production

The ErrorBoundary automatically shows error details in development mode. In production, only user-friendly messages are shown.

## What Error Boundaries Don't Catch

Error boundaries do **NOT** catch errors in:

- Event handlers (use try-catch instead)
- Asynchronous code (e.g., setTimeout, promises)
- Server-side rendering
- Errors thrown in the error boundary itself

For these cases, use traditional error handling:

```tsx
// Event handler
function handleClick() {
  try {
    // Your code
  } catch (error) {
    console.error(error);
  }
}

// Async code
async function fetchData() {
  try {
    const data = await fetch('/api/data');
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

## Accessibility

The ErrorBoundary component is built with accessibility in mind:

- Uses semantic HTML with proper ARIA roles
- Keyboard navigable buttons
- Screen reader friendly error messages
- High contrast error indicators
- Focus management on error state

## Styling

The ErrorBoundary uses Tailwind CSS and shadcn/ui components, ensuring:

- Consistent design with the rest of your app
- Dark mode support
- Responsive design
- Customizable through Tailwind classes

## Testing

The ErrorBoundary includes comprehensive tests. Run them with:

```bash
npm test ErrorBoundary.test.tsx
```

## Examples

See `ErrorBoundary.example.tsx` for more usage examples.

## Related Components

- `ModelErrorBoundary` - Specialized error boundary for 3D model loading
- `ErrorMessage` - Simple error message component for inline errors
- `EmptyState` - Component for empty states (not errors)

## Support

For issues or questions about the ErrorBoundary component, please refer to the main project documentation or contact the development team.
