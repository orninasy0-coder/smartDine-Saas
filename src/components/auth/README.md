# Protected Route Component

The `ProtectedRoute` component is used to protect routes that require authentication and optionally specific user roles.

## Features

- ✅ Authentication check
- ✅ Role-based access control
- ✅ Loading state handling
- ✅ Automatic redirect to login
- ✅ Custom redirect paths
- ✅ Location state preservation (return to original page after login)

## Usage

### Basic Authentication Protection

Protect a route that requires any authenticated user:

```tsx
import { ProtectedRoute } from '@/components/auth';
import Dashboard from './pages/Dashboard';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Role-Based Protection

Protect a route that requires specific user roles:

```tsx
import { ProtectedRoute } from '@/components/auth';
import { USER_ROLES } from '@/utils/constants';
import AdminPanel from './pages/AdminPanel';

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={[USER_ROLES.PLATFORM_ADMIN]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Multiple Roles

Allow access to users with any of the specified roles:

```tsx
import { ProtectedRoute } from '@/components/auth';
import { USER_ROLES } from '@/utils/constants';
import KitchenDashboard from './pages/KitchenDashboard';

<Route
  path="/kitchen"
  element={
    <ProtectedRoute
      requiredRoles={[
        USER_ROLES.KITCHEN_STAFF,
        USER_ROLES.RESTAURANT_OWNER
      ]}
    >
      <KitchenDashboard />
    </ProtectedRoute>
  }
/>
```

### Custom Redirect Path

Specify a custom redirect path instead of the default `/login`:

```tsx
import { ProtectedRoute } from '@/components/auth';
import Settings from './pages/Settings';

<Route
  path="/settings"
  element={
    <ProtectedRoute redirectTo="/custom-login">
      <Settings />
    </ProtectedRoute>
  }
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | The component(s) to render when access is granted |
| `requiredRoles` | `UserRole[]` | No | `undefined` | Array of roles that are allowed to access the route |
| `redirectTo` | `string` | No | `'/login'` | Path to redirect to when user is not authenticated |

## Behavior

### Loading State
While checking authentication status, a loading spinner is displayed.

### Not Authenticated
If the user is not authenticated, they are redirected to the login page (or custom redirect path). The original location is preserved in the navigation state, allowing the app to redirect back after successful login.

### Insufficient Permissions
If the user is authenticated but doesn't have the required role, they are redirected to the `/unauthorized` page.

### Successful Access
If the user is authenticated and has the required role (if specified), the protected content is rendered.

## Available User Roles

```typescript
USER_ROLES.CUSTOMER
USER_ROLES.RESTAURANT_OWNER
USER_ROLES.KITCHEN_STAFF
USER_ROLES.DELIVERY_PERSONNEL
USER_ROLES.PLATFORM_ADMIN
```

## Example: Complete App Setup

```tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth';
import { USER_ROLES } from '@/utils/constants';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes - any authenticated user */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Protected routes - specific roles */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.PLATFORM_ADMIN]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.KITCHEN_STAFF]}>
            <KitchenDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Error pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

## Testing

The component includes comprehensive tests covering:
- Loading state display
- Redirect when not authenticated
- Successful rendering when authenticated
- Role-based access control
- Multiple role support
- Custom redirect paths

Run tests with:
```bash
npm test src/components/auth/ProtectedRoute.test.tsx
```
