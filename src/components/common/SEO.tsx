/**
 * SEO Component
 * Dynamic meta tags management using react-helmet-async
 * Supports Open Graph and Twitter Card tags
 */

import { Helmet } from 'react-helmet-async';
import type { SEOMetaTags } from '../../utils/seo/types';
import { defaultSEO } from '../../utils/seo/config';
import {
  generatePageTitle,
  truncateDescription,
  generateCanonicalUrl,
  generateOGImageUrl,
  formatKeywords,
  getCurrentPath,
  getCurrentUrl,
} from '../../utils/seo/helpers';

interface SEOProps extends Partial<SEOMetaTags> {
  // Allow overriding any SEO meta tag
}

export const SEO: React.FC<SEOProps> = (props) => {
  // Merge props with defaults
  const config: SEOMetaTags = {
    ...defaultSEO,
    ...props,
  };

  // Generate computed values
  const fullTitle = generatePageTitle(config.title);
  const description = config.description 
    ? truncateDescription(config.description) 
    : defaultSEO.description;
  const canonical = config.canonical || generateCanonicalUrl(getCurrentPath());
  const currentUrl = getCurrentUrl();
  
  // Open Graph values with fallbacks
  const ogTitle = config.ogTitle || fullTitle;
  const ogDescription = config.ogDescription || description;
  const ogImage = generateOGImageUrl(config.ogImage);
  const ogUrl = config.ogUrl || currentUrl;
  
  // Twitter Card values with fallbacks
  const twitterTitle = config.twitterTitle || ogTitle;
  const twitterDescription = config.twitterDescription || ogDescription;
  const twitterImage = config.twitterImage || ogImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {config.keywords && config.keywords.length > 0 && (
        <meta name="keywords" content={formatKeywords(config.keywords)} />
      )}
      {config.author && <meta name="author" content={config.author} />}
      {config.robots && <meta name="robots" content={config.robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Viewport and Theme */}
      {config.viewport && <meta name="viewport" content={config.viewport} />}
      {config.themeColor && <meta name="theme-color" content={config.themeColor} />}
      
      {/* Apple Mobile Web App */}
      {config.appleMobileWebAppCapable && (
        <meta name="apple-mobile-web-app-capable" content={config.appleMobileWebAppCapable} />
      )}
      {config.appleMobileWebAppStatusBarStyle && (
        <meta name="apple-mobile-web-app-status-bar-style" content={config.appleMobileWebAppStatusBarStyle} />
      )}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      {config.ogImageAlt && <meta property="og:image:alt" content={config.ogImageAlt} />}
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={config.ogType || 'website'} />
      {config.ogSiteName && <meta property="og:site_name" content={config.ogSiteName} />}
      {config.ogLocale && <meta property="og:locale" content={config.ogLocale} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={config.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      {config.twitterImageAlt && <meta name="twitter:image:alt" content={config.twitterImageAlt} />}
      {config.twitterSite && <meta name="twitter:site" content={config.twitterSite} />}
      {config.twitterCreator && <meta name="twitter:creator" content={config.twitterCreator} />}
    </Helmet>
  );
};

export default SEO;
