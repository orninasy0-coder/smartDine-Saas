/**
 * useSEO Hook
 * Custom hook for managing SEO meta tags in components
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { SEOMetaTags } from '../utils/seo/types';
import { getSEOConfig, mergeSEOConfig } from '../utils/seo/config';

interface UseSEOOptions {
  // Override default SEO config
  override?: Partial<SEOMetaTags>;
  // Whether to use path-based config
  usePathConfig?: boolean;
}

/**
 * Hook to get SEO configuration for current page
 * Automatically merges path-based config with overrides
 */
export const useSEO = (options: UseSEOOptions = {}): SEOMetaTags => {
  const location = useLocation();
  const { override = {}, usePathConfig = true } = options;

  // Get path-based config if enabled
  const pathConfig = usePathConfig ? getSEOConfig(location.pathname) : {};

  // Merge configs: default -> path-based -> override
  const finalConfig = mergeSEOConfig({
    ...pathConfig,
    ...override,
  });

  // Update document title as fallback (in case Helmet fails)
  useEffect(() => {
    if (finalConfig.title) {
      document.title = finalConfig.title;
    }
  }, [finalConfig.title]);

  return finalConfig;
};

/**
 * Hook to dynamically update SEO based on data
 * Useful for dynamic pages like dish details, restaurant pages
 */
export const useDynamicSEO = (
  data: {
    title?: string;
    description?: string;
    image?: string;
    [key: string]: any;
  } | null,
  baseConfig: Partial<SEOMetaTags> = {}
): SEOMetaTags => {
  const location = useLocation();

  // If no data yet, use path-based config
  if (!data) {
    return mergeSEOConfig(getSEOConfig(location.pathname));
  }

  // Merge data with base config
  const dynamicConfig: Partial<SEOMetaTags> = {
    ...baseConfig,
    title: data.title || baseConfig.title,
    description: data.description || baseConfig.description,
    ogTitle: data.title || baseConfig.ogTitle,
    ogDescription: data.description || baseConfig.ogDescription,
    ogImage: data.image || baseConfig.ogImage,
    twitterImage: data.image || baseConfig.twitterImage,
  };

  return mergeSEOConfig(dynamicConfig);
};

export default useSEO;
