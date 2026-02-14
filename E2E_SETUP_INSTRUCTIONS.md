# E2E Testing Setup Instructions

## Quick Setup

Follow these steps to set up and run E2E tests:

### 1. Install Dependencies

First, install the required npm packages (including @playwright/test):

```bash
npm install
```

### 2. Install Playwright Browsers

Install the browsers that Playwright will use for testing:

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers.

To install specific browsers only:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### 3. Install System Dependencies (Linux only)

If you're on Linux, you may need to install system dependencies:

```bash
npx playwright install-deps
```

### 4. Verify Installation

Check that Playwright is installed correctly:

```bash
npx playwright --version
```

You should see: `Version 1.58.2`

### 5. Run Tests

Now you can run the E2E tests:

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (recommended for first time)
npm run test:e2e:ui

# Run smoke tests only
npx playwright test e2e/smoke.spec.ts
```

## Development Workflow

### Running Tests During Development

1. **Start the dev server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Run tests** (in another terminal):
   ```bash
   npm run test:e2e:ui
   ```

The UI mode allows you to:
- See tests running in real-time
- Debug failing tests
- Inspect elements
- View screenshots and traces

### Debugging Tests

```bash
# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/landing.spec.ts --debug

# Run specific test by name
npx playwright test -g "should display hero section" --debug
```

### Running Tests in Different Browsers

```bash
# Chromium only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox

# WebKit only
npm run test:e2e:webkit

# Mobile browsers
npm run test:e2e:mobile
```

## Viewing Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

This opens an interactive report showing:
- Test results
- Screenshots
- Videos (for failed tests)
- Traces
- Execution timeline

## Common Issues and Solutions

### Issue 1: "Cannot find package '@playwright/test'"

**Solution**: Install dependencies
```bash
npm install
```

### Issue 2: "Executable doesn't exist"

**Solution**: Install Playwright browsers
```bash
npx playwright install
```

### Issue 3: Tests timeout or fail

**Solution**: Ensure dev server is running
```bash
npm run dev
```

### Issue 4: Port 5173 already in use

**Solution**: Either:
1. Stop the process using port 5173
2. Or change the port in `playwright.config.ts`:
   ```typescript
   webServer: {
     command: 'npm run dev',
     url: 'http://localhost:5174', // Change port
     // ...
   }
   ```

### Issue 5: Tests are flaky

**Solution**: 
1. Add explicit waits in tests
2. Increase timeout in `playwright.config.ts`
3. Use `waitForLoadState('networkidle')`

## CI/CD Setup

The project includes a GitHub Actions workflow that automatically runs E2E tests on:
- Push to main/develop branches
- Pull requests to main/develop branches

The workflow:
- Runs tests across multiple browsers
- Uploads test reports as artifacts
- Uploads videos for failed tests
- Retries failed tests (2 retries)

## File Structure

```
project-root/
├── e2e/                          # E2E test files
│   ├── landing.spec.ts           # Landing page tests
│   ├── auth.spec.ts              # Authentication tests
│   ├── menu.spec.ts              # Menu and ordering tests
│   ├── pricing.spec.ts           # Pricing page tests
│   ├── dashboard.spec.ts         # Dashboard tests
│   ├── ai-assistant.spec.ts      # AI assistant tests
│   ├── accessibility.spec.ts     # Accessibility tests
│   ├── user-journey.spec.ts      # Complete user journeys
│   ├── smoke.spec.ts             # Smoke tests
│   ├── helpers/
│   │   └── test-utils.ts         # Shared test utilities
│   └── README.md                 # E2E tests documentation
├── playwright.config.ts          # Playwright configuration
├── .github/
│   └── workflows/
│       └── e2e-tests.yml         # CI/CD workflow
├── E2E_TESTING_GUIDE.md          # Comprehensive testing guide
├── E2E_IMPLEMENTATION_SUMMARY.md # Implementation summary
└── E2E_SETUP_INSTRUCTIONS.md     # This file
```

## Next Steps

1. **Run smoke tests** to verify setup:
   ```bash
   npx playwright test e2e/smoke.spec.ts
   ```

2. **Explore tests in UI mode**:
   ```bash
   npm run test:e2e:ui
   ```

3. **Read the documentation**:
   - `e2e/README.md` - Quick reference
   - `E2E_TESTING_GUIDE.md` - Comprehensive guide
   - `E2E_IMPLEMENTATION_SUMMARY.md` - What's implemented

4. **Write your own tests**:
   - Follow existing test patterns
   - Use semantic locators
   - Handle bilingual content (EN/AR)
   - Add tests to appropriate spec files

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Support

For questions or issues:
1. Check this guide
2. Review `E2E_TESTING_GUIDE.md`
3. Check Playwright documentation
4. Review existing tests for examples

---

**Happy Testing! 🎭**
