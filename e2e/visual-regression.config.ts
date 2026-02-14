/**
 * Visual Regression Testing Configuration
 * 
 * This file contains configuration options for visual regression tests.
 */

export const visualRegressionConfig = {
  /**
   * Screenshot comparison threshold
   * Value between 0 and 1, where 0 means pixel-perfect match
   * and 1 means any difference is acceptable
   */
  threshold: 0.2,

  /**
   * Maximum allowed pixel difference ratio
   * If more than this ratio of pixels differ, the test fails
   */
  maxDiffPixelRatio: 0.01,

  /**
   * Screenshot options
   */
  screenshotOptions: {
    /**
     * Disable CSS animations and transitions
     */
    animations: 'disabled' as const,

    /**
     * Wait for fonts to load
     */
    fonts: 'ready' as const,

    /**
     * Capture full page or just viewport
     */
    fullPage: true,

    /**
     * Omit background (useful for transparent backgrounds)
     */
    omitBackground: false,

    /**
     * Image format
     */
    type: 'png' as const,
  },

  /**
   * Viewport sizes for responsive testing
   */
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    desktopLarge: { width: 1920, height: 1080 },
  },

  /**
   * Wait times (in milliseconds)
   */
  waitTimes: {
    /**
     * Wait after page load for animations to settle
     */
    afterPageLoad: 1000,

    /**
     * Wait after interactions (clicks, hovers)
     */
    afterInteraction: 300,

    /**
     * Wait for theme changes
     */
    afterThemeChange: 500,

    /**
     * Wait for language changes
     */
    afterLanguageChange: 500,
  },

  /**
   * Pages to test
   */
  pages: [
    { path: '/', name: 'landing' },
    { path: '/pricing', name: 'pricing' },
    { path: '/contact', name: 'contact' },
    { path: '/guide', name: 'guide' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' },
    { path: '/reset-password', name: 'reset-password' },
    { path: '/menu', name: 'menu' },
    { path: '/cart', name: 'cart' },
  ],

  /**
   * Themes to test
   */
  themes: ['light', 'dark'],

  /**
   * Languages to test
   */
  languages: ['en', 'ar'],

  /**
   * Browsers to test
   */
  browsers: ['chromium', 'firefox', 'webkit'],
};

export default visualRegressionConfig;
