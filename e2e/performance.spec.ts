import { test, expect } from '@playwright/test';

/**
 * Performance Testing Suite
 * Tests page load times, resource loading, and Core Web Vitals
 */

test.describe('Performance Tests - Page Load Times', () => {
  test('Landing page should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    console.log(`Landing page loaded in ${loadTime}ms`);
  });

  test('Login page should load within 1.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 1.5 seconds
    expect(loadTime).toBeLessThan(1500);
    
    console.log(`Login page loaded in ${loadTime}ms`);
  });

  test('Register page should load within 1.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 1.5 seconds
    expect(loadTime).toBeLessThan(1500);
    
    console.log(`Register page loaded in ${loadTime}ms`);
  });

  test('Pricing page should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    console.log(`Pricing page loaded in ${loadTime}ms`);
  });

  test('Menu page should load within 2.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 2.5 seconds (may have images)
    expect(loadTime).toBeLessThan(2500);
    
    console.log(`Menu page loaded in ${loadTime}ms`);
  });

  test('Dashboard page should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    console.log(`Dashboard page loaded in ${loadTime}ms`);
  });
});

test.describe('Performance Tests - Network Idle', () => {
  test('Landing page should reach network idle within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should reach network idle within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Landing page reached network idle in ${loadTime}ms`);
  });

  test('Menu page should reach network idle within 4 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/menu', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should reach network idle within 4 seconds (includes images)
    expect(loadTime).toBeLessThan(4000);
    
    console.log(`Menu page reached network idle in ${loadTime}ms`);
  });
});

test.describe('Performance Tests - Resource Loading', () => {
  test('Landing page should load minimal resources', async ({ page }) => {
    const resources: string[] = [];
    
    page.on('response', response => {
      resources.push(response.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should load reasonable number of resources (< 50)
    expect(resources.length).toBeLessThan(50);
    
    console.log(`Landing page loaded ${resources.length} resources`);
  });

  test('JavaScript bundles should be reasonably sized', async ({ page }) => {
    const jsResources: { url: string; size: number }[] = [];
    
    page.on('response', async response => {
      const url = response.url();
      if (url.endsWith('.js') || url.includes('.js?')) {
        try {
          const buffer = await response.body();
          jsResources.push({
            url,
            size: buffer.length,
          });
        } catch (e) {
          // Ignore errors for resources we can't access
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that no single JS bundle is too large (< 500KB)
    for (const resource of jsResources) {
      expect(resource.size).toBeLessThan(500 * 1024);
      console.log(`JS bundle: ${resource.url.split('/').pop()} - ${(resource.size / 1024).toFixed(2)}KB`);
    }
  });

  test('CSS bundles should be reasonably sized', async ({ page }) => {
    const cssResources: { url: string; size: number }[] = [];
    
    page.on('response', async response => {
      const url = response.url();
      if (url.endsWith('.css') || url.includes('.css?')) {
        try {
          const buffer = await response.body();
          cssResources.push({
            url,
            size: buffer.length,
          });
        } catch (e) {
          // Ignore errors for resources we can't access
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that no single CSS bundle is too large (< 200KB)
    for (const resource of cssResources) {
      expect(resource.size).toBeLessThan(200 * 1024);
      console.log(`CSS bundle: ${resource.url.split('/').pop()} - ${(resource.size / 1024).toFixed(2)}KB`);
    }
  });

  test('Images should be optimized', async ({ page }) => {
    const imageResources: { url: string; size: number }[] = [];
    
    page.on('response', async response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.startsWith('image/')) {
        try {
          const buffer = await response.body();
          imageResources.push({
            url,
            size: buffer.length,
          });
        } catch (e) {
          // Ignore errors for resources we can't access
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that no single image is too large (< 500KB)
    for (const resource of imageResources) {
      expect(resource.size).toBeLessThan(500 * 1024);
      console.log(`Image: ${resource.url.split('/').pop()} - ${(resource.size / 1024).toFixed(2)}KB`);
    }
  });
});

test.describe('Performance Tests - Core Web Vitals', () => {
  test('Landing page - First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('/');
    
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(-1), 5000);
      });
    });
    
    if (fcp > 0) {
      // FCP should be under 1.8 seconds (good threshold)
      expect(fcp).toBeLessThan(1800);
      console.log(`FCP: ${fcp.toFixed(2)}ms`);
    }
  });

  test('Landing page - Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let largestPaint = 0;
        
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            largestPaint = lastEntry.startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Wait a bit for LCP to stabilize
        setTimeout(() => resolve(largestPaint), 2000);
      });
    });
    
    if (lcp > 0) {
      // LCP should be under 2.5 seconds (good threshold)
      expect(lcp).toBeLessThan(2500);
      console.log(`LCP: ${lcp.toFixed(2)}ms`);
    }
  });

  test('Landing page - Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for layout to stabilize
    await page.waitForTimeout(2000);
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Wait for shifts to settle
        setTimeout(() => resolve(clsValue), 1000);
      });
    });
    
    // CLS should be under 0.1 (good threshold)
    expect(cls).toBeLessThan(0.1);
    console.log(`CLS: ${cls.toFixed(4)}`);
  });

  test('Landing page - Time to Interactive (TTI)', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');
    
    // Try to interact with the page
    const button = page.getByRole('button').first();
    if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
      await button.hover();
    }
    
    const tti = Date.now() - startTime;
    
    // TTI should be under 3.8 seconds (good threshold)
    expect(tti).toBeLessThan(3800);
    console.log(`TTI: ${tti}ms`);
  });
});

test.describe('Performance Tests - Interaction Responsiveness', () => {
  test('Button clicks should respond quickly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const button = page.getByRole('button').first();
    
    if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
      const startTime = Date.now();
      await button.click();
      const responseTime = Date.now() - startTime;
      
      // Should respond within 100ms
      expect(responseTime).toBeLessThan(100);
      console.log(`Button response time: ${responseTime}ms`);
    }
  });

  test('Navigation should be fast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const link = page.getByRole('link').first();
    
    if (await link.isVisible({ timeout: 1000 }).catch(() => false)) {
      const startTime = Date.now();
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      const navigationTime = Date.now() - startTime;
      
      // Navigation should complete within 2 seconds
      expect(navigationTime).toBeLessThan(2000);
      console.log(`Navigation time: ${navigationTime}ms`);
    }
  });

  test('Form inputs should respond immediately', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const input = page.getByRole('textbox').first();
    
    if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
      const startTime = Date.now();
      await input.fill('test@example.com');
      const responseTime = Date.now() - startTime;
      
      // Should respond within 50ms
      expect(responseTime).toBeLessThan(50);
      console.log(`Input response time: ${responseTime}ms`);
    }
  });
});

test.describe('Performance Tests - Memory Usage', () => {
  test('Landing page should not leak memory', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Interact with the page
    for (let i = 0; i < 5; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const increasePercentage = (memoryIncrease / initialMemory) * 100;
      
      // Memory should not increase by more than 50% after reloads
      expect(increasePercentage).toBeLessThan(50);
      
      console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Increase: ${increasePercentage.toFixed(2)}%`);
    }
  });
});

test.describe('Performance Tests - Animation Performance', () => {
  test('Animations should run at 60fps', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Measure frame rate during scroll
    const fps = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFrames = () => {
          frameCount++;
          const currentTime = performance.now();
          
          if (currentTime - lastTime >= 1000) {
            resolve(frameCount);
          } else {
            requestAnimationFrame(measureFrames);
          }
        };
        
        requestAnimationFrame(measureFrames);
      });
    });
    
    // Should maintain at least 50fps (allowing some variance)
    expect(fps).toBeGreaterThan(50);
    console.log(`Animation FPS: ${fps}`);
  });

  test('Scroll performance should be smooth', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Scroll down the page
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Wait for scroll to complete
    await page.waitForTimeout(1000);
    
    const scrollTime = Date.now() - startTime;
    
    // Scroll should complete within 1.5 seconds
    expect(scrollTime).toBeLessThan(1500);
    console.log(`Scroll time: ${scrollTime}ms`);
  });
});

test.describe('Performance Tests - Mobile Performance', () => {
  test.use({ 
    ...test.use,
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  test('Mobile landing page should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Mobile should load within 3 seconds (allowing for slower connections)
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Mobile landing page loaded in ${loadTime}ms`);
  });

  test('Mobile menu page should load within 3.5 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Mobile menu should load within 3.5 seconds
    expect(loadTime).toBeLessThan(3500);
    
    console.log(`Mobile menu page loaded in ${loadTime}ms`);
  });
});
