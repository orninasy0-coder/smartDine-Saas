import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Testing Utilities
 * 
 * Helper functions for automated accessibility testing
 */

export interface AccessibilityViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export interface AccessibilityScanOptions {
  /**
   * WCAG tags to test against
   * @default ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
   */
  tags?: string[];
  
  /**
   * CSS selector to include in the scan
   */
  include?: string;
  
  /**
   * CSS selector to exclude from the scan
   */
  exclude?: string;
  
  /**
   * Rules to disable during the scan
   */
  disableRules?: string[];
  
  /**
   * Whether to include best practices
   * @default false
   */
  includeBestPractices?: boolean;
}

/**
 * Run an accessibility scan on a page
 * 
 * @param page - Playwright page object
 * @param options - Scan options
 * @returns Accessibility scan results
 */
export async function runAccessibilityScan(
  page: Page,
  options: AccessibilityScanOptions = {}
) {
  const {
    tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    include,
    exclude,
    disableRules = [],
    includeBestPractices = false,
  } = options;

  let builder = new AxeBuilder({ page });

  // Add tags
  const allTags = includeBestPractices ? [...tags, 'best-practice'] : tags;
  builder = builder.withTags(allTags);

  // Include/exclude selectors
  if (include) {
    builder = builder.include(include);
  }
  if (exclude) {
    builder = builder.exclude(exclude);
  }

  // Disable specific rules
  if (disableRules.length > 0) {
    builder = builder.disableRules(disableRules);
  }

  return await builder.analyze();
}

/**
 * Format accessibility violations for readable output
 * 
 * @param violations - Array of accessibility violations
 * @returns Formatted string
 */
export function formatViolations(violations: AccessibilityViolation[]): string {
  if (violations.length === 0) {
    return 'No accessibility violations found!';
  }

  return violations
    .map((violation, index) => {
      const nodeCount = violation.nodes.length;
      const nodeText = nodeCount === 1 ? 'element' : 'elements';
      
      return `
${index + 1}. ${violation.id} (${violation.impact})
   Description: ${violation.description}
   Help: ${violation.help}
   Help URL: ${violation.helpUrl}
   Affected ${nodeText}: ${nodeCount}
   
   Nodes:
   ${violation.nodes.map((node, i) => `
     ${i + 1}. Target: ${node.target.join(' > ')}
        HTML: ${node.html}
        Issue: ${node.failureSummary}
   `).join('\n')}
`;
    })
    .join('\n---\n');
}

/**
 * Check if a page has any critical accessibility violations
 * 
 * @param page - Playwright page object
 * @returns True if critical violations exist
 */
export async function hasCriticalViolations(page: Page): Promise<boolean> {
  const results = await runAccessibilityScan(page);
  return results.violations.some(v => v.impact === 'critical');
}

/**
 * Get accessibility violations by impact level
 * 
 * @param page - Playwright page object
 * @param impact - Impact level (critical, serious, moderate, minor)
 * @returns Violations of the specified impact level
 */
export async function getViolationsByImpact(
  page: Page,
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
): Promise<AccessibilityViolation[]> {
  const results = await runAccessibilityScan(page);
  return results.violations.filter(v => v.impact === impact);
}

/**
 * Toggle dark mode on a page
 * 
 * @param page - Playwright page object
 * @param enable - Whether to enable or disable dark mode
 */
export async function toggleDarkMode(page: Page, enable: boolean = true): Promise<void> {
  const html = page.locator('html');
  
  if (enable) {
    await html.evaluate((el) => el.classList.add('dark'));
  } else {
    await html.evaluate((el) => el.classList.remove('dark'));
  }
  
  // Wait for theme transition
  await page.waitForTimeout(300);
}

/**
 * Switch language on a page
 * 
 * @param page - Playwright page object
 * @param language - Language code (en, ar)
 */
export async function switchLanguage(page: Page, language: 'en' | 'ar'): Promise<void> {
  const langSelector = page.getByRole('button', { name: /language|اللغة/i }).or(
    page.locator('[aria-label*="language"]')
  );

  if (await langSelector.isVisible({ timeout: 3000 }).catch(() => false)) {
    await langSelector.click();
    await page.waitForTimeout(300);

    const langOption = language === 'ar' 
      ? page.getByText(/العربية|Arabic/i)
      : page.getByText(/English|الإنجليزية/i);
    
    if (await langOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await langOption.click();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Check keyboard navigation on a page
 * 
 * @param page - Playwright page object
 * @param tabCount - Number of times to press Tab
 * @returns Array of focused element selectors
 */
export async function checkKeyboardNavigation(
  page: Page,
  tabCount: number = 5
): Promise<string[]> {
  const focusedElements: string[] = [];

  for (let i = 0; i < tabCount; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    const focusedElement = page.locator(':focus');
    
    if (await focusedElement.isVisible({ timeout: 1000 }).catch(() => false)) {
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      const id = await focusedElement.getAttribute('id');
      const className = await focusedElement.getAttribute('class');
      
      const selector = id ? `${tagName}#${id}` : `${tagName}.${className?.split(' ')[0] || ''}`;
      focusedElements.push(selector);
    }
  }

  return focusedElements;
}

/**
 * Check if focus is visible on a page
 * 
 * @param page - Playwright page object
 * @returns True if focus indicator is visible
 */
export async function isFocusVisible(page: Page): Promise<boolean> {
  await page.keyboard.press('Tab');
  await page.waitForTimeout(100);

  const focusedElement = page.locator(':focus');
  
  if (await focusedElement.isVisible({ timeout: 1000 }).catch(() => false)) {
    // Check if element has visible outline or focus styles
    const styles = await focusedElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        outlineStyle: computed.outlineStyle,
        boxShadow: computed.boxShadow,
      };
    });

    // Check if any focus indicator is present
    return (
      styles.outlineWidth !== '0px' ||
      styles.outlineStyle !== 'none' ||
      styles.boxShadow !== 'none'
    );
  }

  return false;
}

/**
 * Check color contrast on a page
 * 
 * @param page - Playwright page object
 * @returns Contrast violations
 */
export async function checkColorContrast(page: Page): Promise<AccessibilityViolation[]> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .disableRules([
      'aria-allowed-attr',
      'aria-required-attr',
      'button-name',
      'image-alt',
      'label',
      'link-name',
    ])
    .analyze();

  return results.violations.filter(v => 
    v.id === 'color-contrast' || 
    v.id === 'color-contrast-enhanced'
  );
}

/**
 * Check ARIA attributes on a page
 * 
 * @param page - Playwright page object
 * @returns ARIA-related violations
 */
export async function checkAriaAttributes(page: Page): Promise<AccessibilityViolation[]> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  return results.violations.filter(v => 
    v.id.startsWith('aria-') || 
    v.id === 'button-name' ||
    v.id === 'link-name' ||
    v.id === 'label'
  );
}

/**
 * Check semantic HTML on a page
 * 
 * @param page - Playwright page object
 * @returns Semantic HTML violations
 */
export async function checkSemanticHTML(page: Page): Promise<AccessibilityViolation[]> {
  const results = await new AxeBuilder({ page })
    .withTags(['best-practice'])
    .analyze();

  return results.violations.filter(v => 
    v.id === 'landmark-one-main' ||
    v.id === 'page-has-heading-one' ||
    v.id === 'region' ||
    v.id === 'bypass'
  );
}

/**
 * Generate an accessibility report
 * 
 * @param page - Playwright page object
 * @param pageName - Name of the page being tested
 * @returns Formatted accessibility report
 */
export async function generateAccessibilityReport(
  page: Page,
  pageName: string
): Promise<string> {
  const results = await runAccessibilityScan(page, { includeBestPractices: true });
  
  const criticalCount = results.violations.filter(v => v.impact === 'critical').length;
  const seriousCount = results.violations.filter(v => v.impact === 'serious').length;
  const moderateCount = results.violations.filter(v => v.impact === 'moderate').length;
  const minorCount = results.violations.filter(v => v.impact === 'minor').length;

  return `
Accessibility Report for: ${pageName}
Generated: ${new Date().toISOString()}

Summary:
- Total Violations: ${results.violations.length}
- Critical: ${criticalCount}
- Serious: ${seriousCount}
- Moderate: ${moderateCount}
- Minor: ${minorCount}

Passes: ${results.passes.length}
Incomplete: ${results.incomplete.length}

${results.violations.length > 0 ? `
Violations:
${formatViolations(results.violations)}
` : 'No violations found! ✓'}
`;
}
