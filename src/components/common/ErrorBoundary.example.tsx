/**
 * ErrorBoundary Usage Examples
 * 
 * This file demonstrates various ways to use the ErrorBoundary component
 */

import { ErrorBoundary } from './ErrorBoundary';

// Example 1: Basic usage
export function BasicExample() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}

// Example 2: With custom error handling
export function CustomErrorHandlingExample() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to error tracking service
    console.error('Error logged:', error, errorInfo);
    // You could send to Sentry, LogRocket, etc.
  };

  return (
    <ErrorBoundary
      onError={handleError}
      errorTitle="Oops! Something went wrong"
      errorMessage="We're working on fixing this issue. Please try again later."
    >
      <YourComponent />
    </ErrorBoundary>
  );
}

// Example 3: With custom fallback UI
export function CustomFallbackExample() {
  const customFallback = (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Custom Error UI</h2>
      <p>This is a completely custom error interface</p>
    </div>
  );

  return (
    <ErrorBoundary fallback={customFallback}>
      <YourComponent />
    </ErrorBoundary>
  );
}

// Example 4: Disable retry functionality
export function NoRetryExample() {
  return (
    <ErrorBoundary enableRetry={false} enableHomeButton={true}>
      <YourComponent />
    </ErrorBoundary>
  );
}

// Example 5: Custom max retries
export function CustomMaxRetriesExample() {
  return (
    <ErrorBoundary maxRetries={5}>
      <YourComponent />
    </ErrorBoundary>
  );
}

// Example 6: Reset on props change
export function ResetOnPropsChangeExample({ userId }: { userId: string }) {
  return (
    <ErrorBoundary resetOnPropsChange={true}>
      <UserProfile userId={userId} />
    </ErrorBoundary>
  );
}

// Example 7: Wrapping entire app
export function AppWithErrorBoundary() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Send to error tracking service
        logErrorToService(error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  );
}

// Example 8: Wrapping specific routes
export function RouteWithErrorBoundary() {
  return (
    <ErrorBoundary
      errorTitle="Page Error"
      errorMessage="This page encountered an error. Please try refreshing or go back home."
    >
      <DashboardPage />
    </ErrorBoundary>
  );
}

// Example 9: Nested error boundaries for granular error handling
export function NestedErrorBoundariesExample() {
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

// Dummy components for examples
function YourComponent() {
  return <div>Your component content</div>;
}

function App() {
  return <div>App content</div>;
}

function DashboardPage() {
  return <div>Dashboard content</div>;
}

function UserProfile({ userId }: { userId: string }) {
  return <div>User profile for {userId}</div>;
}

function Header() {
  return <header>Header</header>;
}

function Sidebar() {
  return <aside>Sidebar</aside>;
}

function MainContent() {
  return <div>Main content</div>;
}

function Footer() {
  return <footer>Footer</footer>;
}

function logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
  // Implementation for logging to external service
  console.log('Logging error:', error, errorInfo);
}
