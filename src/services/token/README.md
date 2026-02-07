# JWT Token Service

Comprehensive JWT token handling service for authentication and authorization.

## Features

### 1. Token Storage & Retrieval
- Secure storage of auth and refresh tokens in localStorage
- Centralized token management through `tokenService`
- Automatic cleanup of expired tokens

### 2. Token Validation
- JWT token decoding (client-side only, no signature verification)
- Token expiration checking with 10-second buffer for clock skew
- Validation of both auth and refresh tokens

### 3. Automatic Token Refresh
- Proactive token refresh when expiring within 5 minutes
- Background refresh to prevent user interruption
- Automatic retry with refresh token on 401 errors
- Single refresh promise to prevent concurrent refresh requests

### 4. Token Information Extraction
- Extract user ID, email, and role from token payload
- Get token expiration time
- Calculate time remaining until expiration

## Usage

### Basic Token Operations

```typescript
import { tokenService } from '@/services/token';

// Store tokens after login
tokenService.setTokens(authToken, refreshToken);

// Get current auth token
const token = tokenService.getAuthToken();

// Get refresh token
const refreshToken = tokenService.getRefreshToken();

// Clear all tokens (logout)
tokenService.clearTokens();
```

### Token Validation

```typescript
// Check if user has valid token
if (tokenService.hasValidToken()) {
  // User is authenticated
}

// Check if token is expired
if (tokenService.isTokenExpired(token)) {
  // Token needs refresh
}

// Check if token should be refreshed proactively
if (tokenService.shouldRefreshToken()) {
  // Refresh in background
}
```

### Extract User Information

```typescript
const user = tokenService.getUserFromToken(token);
// Returns: { id: string, email: string, role: string } | null
```

### Token Expiration Info

```typescript
// Get expiration timestamp
const expiration = tokenService.getTokenExpiration(token);

// Get time remaining in milliseconds
const timeRemaining = tokenService.getTimeUntilExpiration(token);
```

## API Client Integration

The API client automatically handles token management:

1. **Automatic Token Attachment**: Auth token is automatically added to all requests
2. **Expiration Checking**: Validates token before each request
3. **Automatic Refresh**: Refreshes expired tokens transparently
4. **Background Refresh**: Proactively refreshes tokens expiring within 5 minutes
5. **Skip Auth**: Use `skipAuth: true` in config for public endpoints

```typescript
// Authenticated request (automatic)
const data = await apiClient.get('/protected-endpoint');

// Public endpoint (skip auth)
const publicData = await apiClient.get('/public-endpoint', { skipAuth: true });
```

## Auth Context Integration

The AuthContext uses tokenService for all token operations:

```typescript
// Login - stores tokens
login(token, refreshToken, userData);

// Logout - clears tokens
await logout();

// Refresh - updates tokens
await refreshAuth();
```

## Security Features

1. **Token Expiration Buffer**: 10-second buffer to account for clock skew
2. **Proactive Refresh**: Refreshes tokens 5 minutes before expiration
3. **Single Refresh Promise**: Prevents concurrent refresh requests
4. **Automatic Cleanup**: Clears invalid tokens automatically
5. **Secure Storage**: Uses localStorage with proper key management

## Token Refresh Flow

```
1. User makes API request
2. API client checks token expiration
3. If expired:
   - Attempts refresh with refresh token
   - Updates stored tokens
   - Retries original request
4. If refresh fails:
   - Clears all tokens
   - User is logged out
5. If expiring soon (< 5 min):
   - Refreshes in background
   - User continues uninterrupted
```

## Error Handling

The token service handles various error scenarios:

- **Invalid Token Format**: Returns null for malformed tokens
- **Expired Token**: Attempts automatic refresh
- **No Refresh Token**: Clears tokens and requires re-login
- **Refresh Failed**: Logs out user and clears tokens

## Testing

Comprehensive test suite covers:
- Token decoding and validation
- Expiration checking
- Storage operations
- Refresh logic
- Edge cases and error scenarios

Run tests:
```bash
npm test -- src/services/token/index.test.ts
```

## Best Practices

1. **Never store sensitive data in tokens**: Tokens are decoded client-side
2. **Always validate on server**: Client-side validation is for UX only
3. **Use HTTPS**: Tokens should only be transmitted over secure connections
4. **Short-lived tokens**: Keep auth token TTL short (15-30 minutes)
5. **Longer refresh tokens**: Refresh tokens can have longer TTL (7-30 days)
6. **Rotate refresh tokens**: Issue new refresh token on each refresh

## Constants

- **Expiration Buffer**: 10 seconds
- **Refresh Threshold**: 5 minutes before expiration
- **Storage Keys**: Defined in `src/utils/constants/index.ts`

## Related Files

- `src/services/token/index.ts` - Token service implementation
- `src/services/token/index.test.ts` - Test suite
- `src/services/storage/index.ts` - Storage service
- `src/services/api/client.ts` - API client with token handling
- `src/features/auth/context/AuthContext.tsx` - Auth context integration
