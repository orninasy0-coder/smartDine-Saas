# Retry Logic Documentation

## Overview

The SmartDine platform implements comprehensive retry logic for failed API requests to improve reliability and user experience. This includes automatic retries with exponential backoff, timeout handling, and user-friendly error recovery.

## Features

### 1. Automatic Retry on Transient Failures

The API client automatically retries requests that fail due to:

- **Network errors**: Connection failures, DNS errors
- **Server errors (5xx)**: Internal server errors, service unavailable
- **Timeouts**: Requests that exceed the configured timeout
- **Rate limiting (429)**: Too many requests

### 2. Smart Retry Strategy

- **No retry on client errors (4xx)**: Validation errors, not found, unauthorized (except 408 timeout and 429 rate limit)
- **Exponential backoff**: Delay increases exponentially between retries (1s, 2s, 4s, ...)
- **Jitter**: Random delay added to prevent thundering herd
- **Max delay cap**: Maximum 30 seconds between retries

### 3. Configurable Options

```typescript
interface RequestConfig {
  retries?: number;        // Number of retry attempts (default: 3)
  retryDelay?: number;     // Initial retry delay in ms (default: 1000)
  timeout?: number;        // Request timeout in ms (default: 30000)
  onRetry?: (attempt: number, error: Error) => void; // Callback on retry
}
```

## Usage Examples

### Basic Usage (Default Retry)

```typescript
import { apiClient } from '@/services/api/client';

// Automatically retries up to 3 times on failure
const data = await apiClient.get('/api/v1/menu');
```

### Custom Retry Configuration

```typescript
// Custom retry count and delay
const data = await apiClient.post(
  '/api/v1/orders',
  orderData,
  {
    retries: 5,           // Retry up to 5 times
    retryDelay: 2000,     // Start with 2 second delay
    timeout: 60000,       // 60 second timeout
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message);
    }
  }
);
```

### Disable Retry

```typescript
// No retries for this request
const data = await apiClient.get('/api/v1/data', { retries: 0 });
```

### Using the useRetry Hook

```typescript
import { useRetry } from '@/hooks/useRetry';

function OrderForm() {
  const { retry, retryState, resetRetry } = useRetry({
    maxRetries: 3,
    onRetry: (attempt) => {
      toast.info(`Retrying... (Attempt ${attempt})`);
    },
    onMaxRetriesReached: (error) => {
      toast.error('Failed after multiple attempts. Please try again later.');
    }
  });

  const handleSubmit = async () => {
    try {
      await retry(async () => {
        await apiClient.post('/api/v1/orders', orderData);
      });
      toast.success('Order placed successfully!');
    } catch (error) {
      // Handle final failure
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={retryState.isRetrying}>
        {retryState.isRetrying ? 'Retrying...' : 'Place Order'}
      </button>
    </form>
  );
}
```

### Using RetryButton Component

```typescript
import { RetryButton } from '@/components/common/RetryButton';

function ErrorView({ onRetry, isRetrying }) {
  return (
    <div>
      <p>Failed to load data</p>
      <RetryButton onRetry={onRetry} isRetrying={isRetrying} />
    </div>
  );
}
```

### Using RetryErrorBoundary

```typescript
import { RetryErrorBoundary } from '@/components/common/RetryErrorBoundary';

function App() {
  return (
    <RetryErrorBoundary maxRetries={3}>
      <YourComponent />
    </RetryErrorBoundary>
  );
}
```

## Retry Decision Flow

```
Request Fails
    ↓
Is it a network error? → YES → Retry
    ↓ NO
Is it a 5xx error? → YES → Retry
    ↓ NO
Is it a timeout (408)? → YES → Retry
    ↓ NO
Is it rate limit (429)? → YES → Retry
    ↓ NO
Is it a 4xx error? → YES → Don't Retry (throw error)
    ↓
Have we reached max retries? → YES → Throw error
    ↓ NO
Wait with exponential backoff
    ↓
Retry request
```

## Error Codes

The API client categorizes errors for retry decisions:

- `NETWORK_ERROR`: Network connectivity issues (retryable)
- `TIMEOUT`: Request timeout (retryable)
- `RATE_LIMIT`: Too many requests (retryable)
- `SERVER_ERROR`: 5xx server errors (retryable)
- `CLIENT_ERROR`: 4xx client errors (not retryable)
- `VALIDATION_ERROR`: Invalid input (not retryable)
- `UNAUTHORIZED`: Authentication required (not retryable)
- `FORBIDDEN`: Insufficient permissions (not retryable)
- `NOT_FOUND`: Resource not found (not retryable)

## Best Practices

### 1. Use Appropriate Retry Counts

- **Read operations**: 3-5 retries (safe to retry)
- **Idempotent writes**: 2-3 retries (safe if idempotent)
- **Non-idempotent writes**: 0-1 retries (be cautious)

### 2. Set Reasonable Timeouts

- **Fast operations**: 5-10 seconds
- **Normal operations**: 30 seconds (default)
- **Long operations**: 60-120 seconds

### 3. Provide User Feedback

```typescript
const { retry, retryState } = useRetry({
  onRetry: (attempt) => {
    // Show retry notification
    toast.info(`Retrying... (Attempt ${attempt})`);
  }
});
```

### 4. Handle Final Failures Gracefully

```typescript
try {
  await retry(apiCall);
} catch (error) {
  // Show user-friendly error message
  toast.error('Unable to complete request. Please try again later.');
  // Log error for debugging
  console.error('Request failed after retries:', error);
}
```

### 5. Use Error Boundaries for Component-Level Retry

```typescript
<RetryErrorBoundary
  maxRetries={3}
  fallback={(error, retry) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  )}
>
  <DataComponent />
</RetryErrorBoundary>
```

## React Query Integration

React Query already has built-in retry logic configured in `src/lib/queryClient.ts`:

```typescript
{
  queries: {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    retry: 1,
  }
}
```

The API client retry logic works in conjunction with React Query's retry mechanism:

1. **API Client Retry**: Handles network-level failures (fetch errors, timeouts)
2. **React Query Retry**: Handles query-level failures (after API client gives up)

This provides two layers of retry protection for maximum reliability.

## Testing

### Testing Retry Logic

```typescript
import { apiClient } from '@/services/api/client';

describe('Retry Logic', () => {
  it('should retry on network failure', async () => {
    const mockFetch = vi.fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'success', data: { id: 1 } })
      });

    global.fetch = mockFetch;

    const result = await apiClient.get('/test', { retries: 2 });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ id: 1 });
  });
});
```

## Monitoring and Debugging

### Enable Retry Logging

The API client logs retry attempts to the console:

```
Retrying request (attempt 1/3) after 1234ms Error: Network error
```

### Track Retry Metrics

```typescript
let retryCount = 0;

const data = await apiClient.get('/api/data', {
  onRetry: (attempt) => {
    retryCount = attempt;
    // Send to analytics
    analytics.track('api_retry', { attempt, endpoint: '/api/data' });
  }
});
```

## Performance Considerations

### Exponential Backoff Benefits

- Reduces server load during outages
- Prevents thundering herd problem
- Gives transient issues time to resolve

### Timeout Configuration

- Too short: Premature failures, unnecessary retries
- Too long: Poor user experience, resource waste
- Recommended: 30 seconds for most operations

### Retry Count Trade-offs

- More retries: Higher success rate, longer wait time
- Fewer retries: Faster failure, lower success rate
- Recommended: 3 retries for most operations

## Troubleshooting

### Issue: Too Many Retries

**Symptom**: Requests take too long to fail

**Solution**: Reduce retry count or timeout

```typescript
apiClient.get('/api/data', { retries: 1, timeout: 10000 });
```

### Issue: Not Retrying When Expected

**Symptom**: Request fails immediately without retry

**Cause**: Error is not retryable (4xx client error)

**Solution**: Check error code and fix client-side issue

### Issue: Retrying Non-Idempotent Operations

**Symptom**: Duplicate orders or data

**Solution**: Disable retry for non-idempotent operations

```typescript
apiClient.post('/api/orders', data, { retries: 0 });
```

Or implement idempotency keys:

```typescript
apiClient.post('/api/orders', data, {
  headers: { 'Idempotency-Key': generateUniqueKey() }
});
```

## Future Enhancements

- Circuit breaker pattern for failing endpoints
- Adaptive retry delays based on server response
- Retry budget to prevent excessive retries
- Distributed tracing for retry chains
- Retry metrics dashboard

## References

- [Exponential Backoff](https://en.wikipedia.org/wiki/Exponential_backoff)
- [Idempotency](https://en.wikipedia.org/wiki/Idempotence)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [React Query Retry](https://tanstack.com/query/latest/docs/react/guides/query-retries)
