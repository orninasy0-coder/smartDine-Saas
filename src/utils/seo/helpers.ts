/**
 * SEO Helper Functions
 * Utility functions for generating and managing SEO meta tags
 */

import type { SEOMetaTags } from './types';

/**
 * Generate full page title with site name
 */
export const generatePageTitle = (title?: string, siteName: string = 'SmartDine'): string => {
  if (!title) return siteName;
  return title.includes(siteName) ? title : `${title} | ${siteName}`;
};

/**
 * Truncate description to optimal length for SEO
 * Google typically displays 155-160 characters
 */
export const truncateDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string, baseUrl: string = window.location.origin): string => {
  // Remove trailing slash from baseUrl and leading slash from path if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};

/**
 * Generate Open Graph image URL
 * Falls back to default OG image if not provided
 */
export const generateOGImageUrl = (
  imagePath?: string,
  baseUrl: string = window.location.origin
): string => {
  if (!imagePath) {
    // Default OG image path
    return `${baseUrl}/og-image.png`;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend base URL
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Format keywords array to comma-separated string
 */
export const formatKeywords = (keywords?: string[]): string => {
  if (!keywords || keywords.length === 0) return '';
  return keywords.join(', ');
};

/**
 * Generate structured data for rich snippets
 */
export const generateStructuredData = (type: 'Organization' | 'Restaurant' | 'Product', data: any) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  
  return JSON.stringify({ ...baseStructure, ...data });
};

/**
 * Validate and sanitize meta tag content
 */
export const sanitizeMetaContent = (content: string): string => {
  // Remove HTML tags
  const withoutTags = content.replace(/<[^>]*>/g, '');
  // Remove extra whitespace
  const withoutExtraSpaces = withoutTags.replace(/\s+/g, ' ').trim();
  return withoutExtraSpaces;
};

/**
 * Generate meta tags object for dynamic pages (e.g., menu items, restaurants)
 */
export const generateDynamicSEO = (
  type: 'dish' | 'restaurant' | 'menu',
  data: {
    name: string;
    description?: string;
    image?: string;
    price?: number;
    rating?: number;
  }
): Partial<SEOMetaTags> => {
  const baseConfig: Partial<SEOMetaTags> = {
    title: data.name,
    description: data.description || `Discover ${data.name} on SmartDine`,
    ogTitle: data.name,
    ogDescription: data.description || `Discover ${data.name} on SmartDine`,
    ogImage: data.image,
    twitterCard: 'summary_large_image',
    twitterImage: data.image,
  };
  
  switch (type) {
    case 'dish':
      return {
        ...baseConfig,
        ogType: 'product',
        keywords: ['dish', 'menu item', 'restaurant food', data.name],
      };
    
    case 'restaurant':
      return {
        ...baseConfig,
        ogType: 'website',
        keywords: ['restaurant', 'dining', 'menu', data.name],
      };
    
    case 'menu':
      return {
        ...baseConfig,
        ogType: 'website',
        keywords: ['menu', 'digital menu', 'restaurant menu', data.name],
      };
    
    default:
      return baseConfig;
  }
};

/**
 * Get current page path from window location
 */
export const getCurrentPath = (): string => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

/**
 * Get current full URL
 */
export const getCurrentUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};
