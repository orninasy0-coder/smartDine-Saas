/**
 * SEO Meta Tags Types
 * Defines types for dynamic meta tag generation including Open Graph and Twitter Cards
 */

export interface SEOMetaTags {
  // Basic Meta Tags
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  robots?: string;
  canonical?: string;
  
  // Open Graph Tags
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  ogSiteName?: string;
  ogLocale?: string;
  
  // Twitter Card Tags
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterSite?: string;
  twitterCreator?: string;
  
  // Additional Meta Tags
  viewport?: string;
  themeColor?: string;
  appleMobileWebAppCapable?: string;
  appleMobileWebAppStatusBarStyle?: string;
}

export interface PageSEOConfig extends SEOMetaTags {
  // Page-specific configuration
  path: string;
  priority?: number;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}
