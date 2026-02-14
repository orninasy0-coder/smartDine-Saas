/**
 * SEO Configuration
 * Default SEO settings and page-specific configurations
 */

import type { SEOMetaTags, PageSEOConfig } from './types';

// Default SEO configuration
export const defaultSEO: SEOMetaTags = {
  title: 'SmartDine - Digital QR Menu Platform',
  description: 'Transform your restaurant with SmartDine - AI-powered digital QR menus, AR dish visualization, and seamless ordering experience.',
  keywords: ['digital menu', 'QR menu', 'restaurant technology', 'AI assistant', 'AR menu', 'smart dining'],
  author: 'SmartDine',
  robots: 'index, follow',
  
  // Open Graph defaults
  ogSiteName: 'SmartDine',
  ogType: 'website',
  ogLocale: 'en_US',
  
  // Twitter defaults
  twitterCard: 'summary_large_image',
  twitterSite: '@smartdine',
  
  // Additional defaults
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#3b82f6',
};

// Page-specific SEO configurations
export const pageSEOConfigs: Record<string, PageSEOConfig> = {
  '/': {
    path: '/',
    title: 'SmartDine - AI-Powered Digital QR Menu Platform',
    description: 'Transform your restaurant with SmartDine. Create stunning digital QR menus with AI recommendations, AR dish visualization, and seamless ordering.',
    keywords: ['digital menu', 'QR menu', 'restaurant SaaS', 'AI dining', 'AR menu', 'smart restaurant'],
    ogTitle: 'SmartDine - AI-Powered Digital QR Menu Platform',
    ogDescription: 'Transform your restaurant with SmartDine. Create stunning digital QR menus with AI recommendations and AR visualization.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    priority: 1.0,
    changeFrequency: 'weekly',
  },
  
  '/pricing': {
    path: '/pricing',
    title: 'Pricing Plans - SmartDine',
    description: 'Choose the perfect plan for your restaurant. Flexible pricing with AI assistant, AR viewer, and analytics included.',
    keywords: ['pricing', 'restaurant plans', 'subscription', 'digital menu pricing'],
    ogTitle: 'SmartDine Pricing - Choose Your Plan',
    ogDescription: 'Flexible pricing plans for restaurants of all sizes. Start with our free trial today.',
    ogType: 'website',
    twitterCard: 'summary',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  
  '/demo': {
    path: '/demo',
    title: 'Live Demo - SmartDine',
    description: 'Experience SmartDine in action. Try our interactive demo with AI assistant, AR dish viewer, and digital menu features.',
    keywords: ['demo', 'live demo', 'restaurant demo', 'digital menu demo'],
    ogTitle: 'Try SmartDine Demo - Interactive Experience',
    ogDescription: 'Experience the future of restaurant dining with our interactive demo.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  
  '/contact': {
    path: '/contact',
    title: 'Contact Us - SmartDine',
    description: 'Get in touch with SmartDine. We\'re here to help transform your restaurant with our digital menu platform.',
    keywords: ['contact', 'support', 'help', 'get in touch'],
    ogTitle: 'Contact SmartDine - We\'re Here to Help',
    ogDescription: 'Have questions? Contact our team for support and information.',
    ogType: 'website',
    twitterCard: 'summary',
    priority: 0.6,
    changeFrequency: 'yearly',
  },
  
  '/guide': {
    path: '/guide',
    title: 'User Guide - SmartDine',
    description: 'Complete guide to using SmartDine. Learn how to set up your digital menu, manage orders, and leverage AI features.',
    keywords: ['user guide', 'documentation', 'how to', 'tutorial', 'help'],
    ogTitle: 'SmartDine User Guide - Complete Documentation',
    ogDescription: 'Learn everything about SmartDine with our comprehensive user guide.',
    ogType: 'article',
    twitterCard: 'summary',
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  
  '/login': {
    path: '/login',
    title: 'Login - SmartDine',
    description: 'Sign in to your SmartDine account to manage your restaurant\'s digital menu.',
    robots: 'noindex, nofollow',
    ogTitle: 'Login to SmartDine',
    ogType: 'website',
    twitterCard: 'summary',
    priority: 0.3,
    changeFrequency: 'yearly',
  },
  
  '/register': {
    path: '/register',
    title: 'Sign Up - SmartDine',
    description: 'Create your SmartDine account and start transforming your restaurant with digital QR menus.',
    keywords: ['sign up', 'register', 'create account', 'get started'],
    ogTitle: 'Sign Up for SmartDine',
    ogDescription: 'Join thousands of restaurants using SmartDine. Start your free trial today.',
    ogType: 'website',
    twitterCard: 'summary',
    priority: 0.8,
    changeFrequency: 'yearly',
  },
};

// Helper function to get SEO config for a specific path
export const getSEOConfig = (path: string): PageSEOConfig => {
  return pageSEOConfigs[path] || {
    path,
    ...defaultSEO,
    priority: 0.5,
    changeFrequency: 'monthly',
  };
};

// Helper function to merge default SEO with page-specific config
export const mergeSEOConfig = (pageConfig: Partial<SEOMetaTags>): SEOMetaTags => {
  return {
    ...defaultSEO,
    ...pageConfig,
  };
};
