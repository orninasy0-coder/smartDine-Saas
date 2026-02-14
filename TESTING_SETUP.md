# Testing Setup Documentation

## Overview

This project uses **Vitest** instead of Jest as the testing framework. Vitest is a modern, blazing-fast test runner that is fully compatible with Jest's API while providing better performance and native ESM support.

## Why Vitest?

- **Faster**: Significantly faster than Jest, especially for large codebases
- **Native ESM**: First-class support for ES modules
- **Vite Integration**: Seamless integration with Vite build tool
- **Jest Compatible**: Uses the same API as Jest, making migration easy
- **Better DX**: Improved developer experience with better error messages

## Installed Dependencies

```json
{
  "devDependencies": {
    "vitest": "^4.0.18",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.9.1",
    "jsdom": "^28.0.0",
    "@vitest/coverage-v8": "^4.0.18",
    "fast-check": "^4.5.3"
  }
}
```

## Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup (`src/test/setup.ts`)

```typescript
import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    }),
  });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

Tests use the same API as Jest, so the syntax is identical:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Property-Based Testing

The project also includes `fast-check` for property-based testing:

```typescript
import { fc } from 'fast-check';

it('should maintain invariant', () => {
  fc.assert(
    fc.property(fc.integer(), (num) => {
      expect(num + 0).toBe(num);
    })
  );
});
```

## Test Coverage

Run coverage reports with:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- Text format (console)
- JSON format (`coverage/coverage-final.json`)
- HTML format (`coverage/index.html`)

## Best Practices

1. **Co-locate tests**: Place test files next to the components they test (e.g., `Button.tsx` and `Button.test.tsx`)
2. **Use descriptive test names**: Clearly describe what the test is verifying
3. **Test user behavior**: Focus on testing what users see and do, not implementation details
4. **Use Testing Library queries**: Prefer `getByRole`, `getByLabelText`, etc. over `getByTestId`
5. **Clean up**: The setup file automatically cleans up after each test
6. **Mock sparingly**: Only mock when necessary (external APIs, timers, etc.)

## Migration from Jest

If you're familiar with Jest, you can use Vitest with minimal changes:

- Replace `jest` imports with `vitest`
- Most Jest APIs work identically in Vitest
- `jest.fn()` → `vi.fn()`
- `jest.mock()` → `vi.mock()`
- `jest.spyOn()` → `vi.spyOn()`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Fast-check Documentation](https://fast-check.dev/)
