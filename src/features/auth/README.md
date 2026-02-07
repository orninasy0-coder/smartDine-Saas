# Authentication Module

This module provides authentication functionality including context, hooks, and services for managing user authentication state.

## Structure

```
auth/
├── context/
│   ├── AuthContext.tsx      # Auth context provider and hook
│   ├── AuthContext.test.tsx # Tests for auth context
│   └── index.ts             # Context exports
├── hooks/
│   ├── useAuth.ts           # Main auth hook (wraps context)
│   ├── useLogin.ts          # Login hook with error handling
│   ├── useRegister.ts       # Registration hook
│   └── index.ts             # Hook exports
├── services/
│   └── index.ts             # Auth API services
├── types/
│   └── index.ts             # Auth type definitions
├── validation/
│   ├── loginSchema.ts       # Login validation schema
│   ├── registerSchema.ts    # Registration validation schema
│   └── resetPasswordSchema.ts # Password reset validation
└── index.ts                 # Main module exports
```

## Usage

### 1. Setup AuthProvider

Wrap your app with `AuthProvider` to provide authentication context:

```tsx
import { AuthProvider } from '@/features/auth';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Use Authentication in Components

#### Basic Auth State

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.email}!</div>;
}
```

#### Login

```tsx
import { useLogin } from '@/features/auth';

function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Login successful - user is now authenticated
    } catch (err) {
      // Error is already set in the hook
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### Register

```tsx
import { useRegister } from '@/features/auth';

function RegisterForm() {
  const { register, isLoading, error } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password, confirmPassword });
      // Registration successful - user is now authenticated
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

#### Logout

```tsx
import { useAuth } from '@/features/auth';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## API Reference

### AuthContext

The `AuthContext` provides the following values:

- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Whether user is authenticated
- `isLoading: boolean` - Whether auth state is being initialized
- `login(token, refreshToken, userData)` - Set authentication state
- `logout()` - Clear authentication state
- `refreshAuth()` - Refresh authentication token
- `updateUser(userData)` - Update user data

### useAuth()

Main hook to access authentication context. Returns all values from `AuthContext`.

```tsx
const { user, isAuthenticated, isLoading, login, logout, refreshAuth, updateUser } = useAuth();
```

### useLogin()

Hook for handling login with error handling.

```tsx
const { login, isLoading, error, clearError } = useLogin();
```

**Methods:**
- `login(credentials)` - Login with email and password
- `clearError()` - Clear error state

**Error Codes:**
- `INVALID_CREDENTIALS` - Invalid email or password
- `ACCOUNT_LOCKED` - Account has been locked
- `ACCOUNT_NOT_VERIFIED` - Email not verified
- `TOO_MANY_ATTEMPTS` - Too many failed login attempts
- `NETWORK_ERROR` - Network connection issue

### useRegister()

Hook for handling registration.

```tsx
const { register, isLoading, error } = useRegister();
```

**Methods:**
- `register(data)` - Register new user with email, password, and confirmPassword

## Types

### User

```typescript
interface User {
  id: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### LoginCredentials

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### RegisterData

```typescript
interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}
```

### AuthResponse

```typescript
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
```

## Token Management

Tokens are automatically managed by the auth context:

- **Access Token**: Stored in localStorage as `auth_token`
- **Refresh Token**: Stored in localStorage as `refresh_token`
- **Auto-refresh**: Use `refreshAuth()` to refresh expired tokens
- **Auto-cleanup**: Tokens are removed on logout

## Testing

The auth module includes comprehensive tests. Run tests with:

```bash
npm test src/features/auth
```

## Best Practices

1. **Always use AuthProvider**: Wrap your app with `AuthProvider` at the root level
2. **Check isLoading**: Always check `isLoading` before rendering auth-dependent content
3. **Handle errors**: Use the `error` state from hooks to display user-friendly messages
4. **Secure routes**: Create protected route components that check `isAuthenticated`
5. **Token refresh**: Implement automatic token refresh for long-lived sessions

## Next Steps

- Implement Protected Route component (Task 4.6)
- Add JWT token handling and validation (Task 4.7)
- Integrate with backend authentication APIs
