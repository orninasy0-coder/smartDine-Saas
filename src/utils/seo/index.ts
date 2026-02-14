/**
 * SEO Utilities - Main Export
 * Centralized exports for all SEO-related utilities
 */

// Types
export type { SEOMetaTags, PageSEOConfig } from './types';

// Configuration
export { defaultSEO, pageSEOConfigs, getSEOConfig, mergeSEOConfig } from './config';

// Helpers
export {
  generatePageTitle,
  truncateDescription,
  generateCanonicalUrl,
  generateOGImageUrl,
  formatKeywords,
  generateStructuredData,
  sanitizeMetaContent,
  generateDynamicSEO,
  getCurrentPath,
  getCurrentUrl,
} from './helpers';

// Structured Data
export {
  generateRestaurantSchema,
  generateMenuSchema,
  generateReviewSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  type RestaurantSchemaData,
  type MenuSchemaData,
  type MenuItemSchemaData,
  type MenuSectionSchemaData,
  type ReviewSchemaData,
} from './structuredData';
