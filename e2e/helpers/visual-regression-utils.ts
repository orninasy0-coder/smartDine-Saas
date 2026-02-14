/**
 * Visual Regression Testing Utilities
 * 
 * Helper functions for visual regression tests
 */

import { Page, expect } from '@playwright/test';
import visualRegressionConfig from '../visual-regression.config';

/**
 * Wait for page to be fully loaded and stable
 */
export async function waitForPageStable(page: Page, additionalWait = 0) {
  await page.waitForLoadState('networkidle');
  const waitTime = additionalWait || visualRegressionConfig.waitTimes.afterPageLoad;
  await page.waitForTimeout(waitTime);
}

/**
 * Take a full page screenshot with standard options
 */
export async function takeFullPageScreenshot(
  page: Page,
  name: string,
  options: {
    threshold?: number;
    maxDiffPixelRatio?: number;
  } = {}
) {
  await expect(page).toHaveScreenshot(name, {
    ...visualRegressionConfig.screenshotOptions,
    threshold: options.threshold ?? visualRegressionConfig.threshold,
    maxDiffPixelRatio: options.maxDiffPixelRatio ?? visualRegressionConfig.maxDiffPixelRatio,
  });
}

/**
 * Take a component screenshot with standard options
 */
export async function takeComponentScreenshot(
  locator: any,
  name: string,
  options: {
    threshold?: number;
    maxDiffPixelRatio?: number;
  } = {}
) {
  await expect(locator).toHaveScreenshot(name, {
    animations: 'disabled',
    threshold: options.threshold ?? visualRegressionConfig.threshold,
    maxDiffPixelRatio: options.maxDiffPixelRatio ?? visualRegressionConfig.maxDiffPixelRatio,
  });
}

/**
 * Set viewport to predefined size
 */
export async function setViewport(
  page: Page,
  size: 'mobile' | 'tablet' | 'desktop' | 'desktopLarge'
) {
  const viewport = visualRegressionConfig.viewports[size];
  await page.setViewportSize(viewport);
}

/**
 * Toggle theme (light/dark mode)
 */
export async function toggleTheme(page: Page) {
  const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="Toggle theme" i]');
  if (await themeToggle.isVisible()) {
    await themeToggle.click();
    await page.waitForTimeout(visualRegressionConfig.waitTimes.afterThemeChange);
  }
}

/**
 * Switch to dark mode
 */
export async function switchToDarkMode(page: Page) {
  // Check if already in dark mode
  const isDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });

  if (!isDark) {
    await toggleTheme(page);
  }
}

/**
 * Switch to light mode
 */
export async function switchToLightMode(page: Page) {
  // Check if already in light mode
  const isDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark');
  });

  if (isDark) {
    await toggleTheme(page);
  }
}

/**
 * Switch language
 */
export async function switchLanguage(page: Page, language: 'en' | 'ar') {
  const languageSelector = page.locator(
    '[aria-label*="language" i], button:has-text("EN"), button:has-text("AR")'
  ).first();

  if (await languageSelector.isVisible()) {
    await languageSelector.click();
    await page.waitForTimeout(visualRegressionConfig.waitTimes.afterInteraction);

    const languageOption = page.locator(
      language === 'ar' ? 'text=/AR|Arabic|العربية/i' : 'text=/EN|English/i'
    ).first();

    if (await languageOption.isVisible()) {
      await languageOption.click();
      await page.waitForTimeout(visualRegressionConfig.waitTimes.afterLanguageChange);
    }
  }
}

/**
 * Hide dynamic content (dates, times, etc.)
 */
export async function hideDynamicContent(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    await page.evaluate((sel) => {
      const elements = document.querySelectorAll(sel);
      elements.forEach((el) => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    }, selector);
  }
}

/**
 * Mask dynamic regions in screenshot
 */
export async function takeScreenshotWithMask(
  page: Page,
  name: string,
  maskSelectors: string[]
) {
  const masks = [];
  for (const selector of maskSelectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible()) {
      masks.push(element);
    }
  }

  await expect(page).toHaveScreenshot(name, {
    ...visualRegressionConfig.screenshotOptions,
    mask: masks,
  });
}

/**
 * Scroll to element before taking screenshot
 */
export async function scrollToAndScreenshot(
  page: Page,
  selector: string,
  name: string
) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  const element = page.locator(selector);
  await takeComponentScreenshot(element, name);
}

/**
 * Test page across multiple viewports
 */
export async function testAcrossViewports(
  page: Page,
  url: string,
  baseName: string,
  viewports: Array<'mobile' | 'tablet' | 'desktop' | 'desktopLarge'> = ['mobile', 'desktop']
) {
  for (const viewport of viewports) {
    await setViewport(page, viewport);
    await page.goto(url);
    await waitForPageStable(page);
    await takeFullPageScreenshot(page, `${baseName}-${viewport}.png`);
  }
}

/**
 * Test page in both themes
 */
export async function testBothThemes(
  page: Page,
  url: string,
  baseName: string
) {
  // Light mode
  await page.goto(url);
  await waitForPageStable(page);
  await switchToLightMode(page);
  await takeFullPageScreenshot(page, `${baseName}-light.png`);

  // Dark mode
  await switchToDarkMode(page);
  await takeFullPageScreenshot(page, `${baseName}-dark.png`);
}

/**
 * Test page in both languages
 */
export async function testBothLanguages(
  page: Page,
  url: string,
  baseName: string
) {
  // English
  await page.goto(url);
  await waitForPageStable(page);
  await switchLanguage(page, 'en');
  await takeFullPageScreenshot(page, `${baseName}-en.png`);

  // Arabic (RTL)
  await switchLanguage(page, 'ar');
  await takeFullPageScreenshot(page, `${baseName}-ar.png`);
}

/**
 * Test interactive state (hover, focus, active)
 */
export async function testInteractiveState(
  page: Page,
  selector: string,
  state: 'hover' | 'focus' | 'active',
  name: string
) {
  const element = page.locator(selector);

  switch (state) {
    case 'hover':
      await element.hover();
      break;
    case 'focus':
      await element.focus();
      break;
    case 'active':
      await element.click({ noWaitAfter: true });
      break;
  }

  await page.waitForTimeout(visualRegressionConfig.waitTimes.afterInteraction);
  await takeComponentScreenshot(element, name);
}

/**
 * Test form states (empty, filled, error)
 */
export async function testFormStates(
  page: Page,
  formSelector: string,
  baseName: string,
  fillData?: Record<string, string>
) {
  const form = page.locator(formSelector);

  // Empty state
  await takeComponentScreenshot(form, `${baseName}-empty.png`);

  // Filled state
  if (fillData) {
    for (const [selector, value] of Object.entries(fillData)) {
      await page.fill(selector, value);
    }
    await takeComponentScreenshot(form, `${baseName}-filled.png`);
  }
}

/**
 * Wait for images to load
 */
export async function waitForImages(page: Page) {
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    );
  });
}

/**
 * Wait for fonts to load
 */
export async function waitForFonts(page: Page) {
  await page.evaluate(() => {
    return (document as any).fonts.ready;
  });
}

/**
 * Disable animations globally
 */
export async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

/**
 * Set fixed date/time for consistent screenshots
 */
export async function setFixedDateTime(page: Page, date: Date) {
  await page.addInitScript((timestamp) => {
    // Override Date
    const OriginalDate = Date;
    (window as any).Date = class extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(timestamp);
        } else {
          // @ts-ignore - TypeScript doesn't like spreading args to Date constructor
          super(...(args as [number, number?, number?, number?, number?, number?, number?]));
        }
      }
      static now() {
        return timestamp;
      }
    };
  }, date.getTime());
}

/**
 * Mock API responses for consistent data
 */
export async function mockApiResponse(
  page: Page,
  url: string | RegExp,
  response: any
) {
  await page.route(url, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Test component in isolation (useful for Storybook)
 */
export async function testComponentInIsolation(
  page: Page,
  storyUrl: string,
  name: string
) {
  await page.goto(storyUrl);
  await waitForPageStable(page);
  
  // Find the component container
  const component = page.locator('#storybook-root, #root').first();
  await takeComponentScreenshot(component, name);
}
