# SEO Meta Automation

Complete SEO meta tags management system for SmartDine platform with support for dynamic meta tags, Open Graph, and Twitter Cards.

## Features

✅ **Dynamic Meta Tags Generation** - Automatically generate page-specific meta tags
✅ **Open Graph Tags** - Full Open Graph protocol support for social media sharing
✅ **Twitter Card Tags** - Twitter-specific meta tags for rich card previews
✅ **Structured Data (JSON-LD)** - Schema.org markup for rich snippets
✅ **Path-Based Configuration** - Automatic SEO config based on route
✅ **Type-Safe** - Full TypeScript support with comprehensive types
✅ **React Helmet Async** - Server-side rendering compatible
✅ **Hooks API** - Easy-to-use React hooks for SEO management

## Installation

The SEO system is already installed and configured. Dependencies:

```bash
npm install react-helmet-async
```

## Quick Start

### 1. Basic Usage with SEO Component

```tsx
import { SEO } from '@/components/common';

function MyPage() {
  return (
    <div>
      <SEO
        title="My Page Title"
        description="My page description"
        keywords={['keyword1', 'keyword2']}
      />
      {/* Page content */}
    </div>
  );
}
```

### 2. Using Structured Data

```tsx
import { SEO, StructuredData } from '@/components/common';

function RestaurantPage({ restaurant }) {
  return (
    <div>
      <SEO title={restaurant.name} description={restaurant.description} />
      <StructuredData 
        type="restaurant" 
        data={{
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          telephone: restaurant.phone,
          priceRange: restaurant.priceRange,
        }} 
      />
      {/* Page content */}
    </div>
  );
}
```

See [STRUCTURED_DATA.md](./STRUCTURED_DATA.md) for complete structured data documentation.

### 3. Using the useSEO Hook

```tsx
import { SEO } from '@/components/common';
import { useSEO } from '@/hooks';

function MyPage() {
  // Automatically gets SEO config for current path
  const seoConfig = useSEO();
  
  return (
    <div>
      <SEO {...seoConfig} />
      {/* Page content */}
    </div>
  );
}
```

### 4. Dynamic SEO for Data-Driven Pages

```tsx
import { SEO } from '@/components/common';
import { useDynamicSEO } from '@/hooks';

function DishDetailPage({ dish }) {
  const seoConfig = useDynamicSEO(dish, {
    ogType: 'product',
    twitterCard: 'summary_large_image',
  });
  
  return (
    <div>
      <SEO {...seoConfig} />
      {/* Page content */}
    </div>
  );
}
```

## Configuration

### Default SEO Settings

Located in `src/utils/seo/config.ts`:

```typescript
export const defaultSEO: SEOMetaTags = {
  title: 'SmartDine - Digital QR Menu Platform',
  description: 'Transform your restaurant with SmartDine...',
  keywords: ['digital menu', 'QR menu', 'restaurant technology'],
  ogSiteName: 'SmartDine',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '@smartdine',
};
```

### Page-Specific Configurations

Add page-specific SEO in `pageSEOConfigs`:

```typescript
export const pageSEOConfigs: Record<string, PageSEOConfig> = {
  '/my-page': {
    path: '/my-page',
    title: 'My Page - SmartDine',
    description: 'My page description',
    keywords: ['keyword1', 'keyword2'],
    ogType: 'website',
    priority: 0.8,
    changeFrequency: 'weekly',
  },
};
```

## API Reference

### SEO Component Props

```typescript
interface SEOProps extends Partial<SEOMetaTags> {
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
}
```

### useSEO Hook

```typescript
const seoConfig = useSEO({
  override?: Partial<SEOMetaTags>;  // Override default config
  usePathConfig?: boolean;           // Use path-based config (default: true)
});
```

### useDynamicSEO Hook

```typescript
const seoConfig = useDynamicSEO(
  data: {
    title?: string;
    description?: string;
    image?: string;
    [key: string]: any;
  } | null,
  baseConfig?: Partial<SEOMetaTags>
);
```

## Helper Functions

### generatePageTitle

```typescript
import { generatePageTitle } from '@/utils/seo';

const fullTitle = generatePageTitle('My Page'); // "My Page | SmartDine"
```

### truncateDescription

```typescript
import { truncateDescription } from '@/utils/seo';

const desc = truncateDescription(longDescription, 160);
```

### generateCanonicalUrl

```typescript
import { generateCanonicalUrl } from '@/utils/seo';

const canonical = generateCanonicalUrl('/pricing'); 
// "https://yourdomain.com/pricing"
```

### generateOGImageUrl

```typescript
import { generateOGImageUrl } from '@/utils/seo';

const ogImage = generateOGImageUrl('/images/hero.png');
// "https://yourdomain.com/images/hero.png"
```

### generateDynamicSEO

```typescript
import { generateDynamicSEO } from '@/utils/seo';

const seoConfig = generateDynamicSEO('dish', {
  name: 'Margherita Pizza',
  description: 'Classic Italian pizza',
  image: '/images/pizza.jpg',
  price: 12.99,
  rating: 4.5,
});
```

## Examples

### Landing Page with Full SEO

```tsx
import { SEO } from '@/components/common';

export default function Landing() {
  return (
    <div>
      <SEO
        title="SmartDine - AI-Powered Digital QR Menu Platform"
        description="Transform your restaurant with SmartDine. Create stunning digital QR menus with AI recommendations, AR dish visualization, and seamless ordering."
        keywords={['digital menu', 'QR menu', 'restaurant SaaS', 'AI dining']}
        ogImage="/images/landing-hero.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      {/* Page content */}
    </div>
  );
}
```

### Dynamic Dish Detail Page

```tsx
import { SEO } from '@/components/common';
import { useDynamicSEO } from '@/hooks';

export default function DishDetail({ dish }) {
  const seoConfig = useDynamicSEO(dish, {
    ogType: 'product',
    twitterCard: 'summary_large_image',
  });
  
  return (
    <div>
      <SEO {...seoConfig} />
      <h1>{dish.name}</h1>
      <p>{dish.description}</p>
    </div>
  );
}
```

### Restaurant Menu Page

```tsx
import { SEO } from '@/components/common';
import { generateDynamicSEO } from '@/utils/seo';

export default function RestaurantMenu({ restaurant }) {
  const seoConfig = generateDynamicSEO('restaurant', {
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.logo,
  });
  
  return (
    <div>
      <SEO {...seoConfig} />
      {/* Menu content */}
    </div>
  );
}
```

## Best Practices

### 1. Always Include SEO Component

Every page should have an SEO component, even if using defaults:

```tsx
<SEO /> {/* Uses default config */}
```

### 2. Optimize Descriptions

Keep descriptions between 150-160 characters for optimal display:

```tsx
<SEO description="Short, compelling description under 160 chars" />
```

### 3. Use Descriptive Titles

Include page-specific info and brand name:

```tsx
<SEO title="Pricing Plans - SmartDine" />
```

### 4. Provide High-Quality Images

Use high-resolution images (1200x630px) for Open Graph:

```tsx
<SEO ogImage="/images/high-res-og-image.png" />
```

### 5. Set Appropriate OG Types

Use correct Open Graph types:

- `website` - General pages
- `article` - Blog posts, guides
- `product` - Menu items, products
- `profile` - User profiles

### 6. Use Keywords Strategically

Include 3-5 relevant keywords:

```tsx
<SEO keywords={['digital menu', 'QR code', 'restaurant tech']} />
```

### 7. Set Canonical URLs

Prevent duplicate content issues:

```tsx
<SEO canonical="https://yourdomain.com/pricing" />
```

## Testing

### Verify Meta Tags

1. View page source (Ctrl+U)
2. Check `<head>` section for meta tags
3. Use browser DevTools Elements tab

### Test Social Sharing

- **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### SEO Audit Tools

- Google Search Console
- Lighthouse (Chrome DevTools)
- Screaming Frog SEO Spider
- Ahrefs Site Audit

## Troubleshooting

### Meta Tags Not Updating

1. Clear browser cache
2. Check HelmetProvider is wrapping app
3. Verify SEO component is rendered

### Social Media Not Showing Correct Preview

1. Clear social media cache using debugger tools
2. Verify OG image is publicly accessible
3. Check image dimensions (1200x630px recommended)

### Duplicate Meta Tags

1. Remove meta tags from index.html
2. Ensure only one SEO component per page
3. Check for conflicting meta tag libraries

## File Structure

```
src/
├── components/
│   └── common/
│       └── SEO.tsx              # Main SEO component
├── hooks/
│   └── useSEO.ts                # SEO hooks
└── utils/
    └── seo/
        ├── types.ts             # TypeScript types
        ├── config.ts            # Default & page configs
        ├── helpers.ts           # Helper functions
        ├── index.ts             # Main export
        └── README.md            # This file
```

## Migration Guide

### From Static Meta Tags

Before:
```html
<!-- index.html -->
<meta name="description" content="Static description" />
```

After:
```tsx
// Page component
<SEO description="Dynamic description" />
```

### From React Helmet

Before:
```tsx
import { Helmet } from 'react-helmet';

<Helmet>
  <title>My Title</title>
  <meta name="description" content="My description" />
</Helmet>
```

After:
```tsx
import { SEO } from '@/components/common';

<SEO title="My Title" description="My description" />
```

## Future Enhancements

- [x] Structured data (JSON-LD) support
- [ ] Automatic sitemap generation
- [ ] robots.txt management
- [ ] Multi-language SEO support
- [ ] A/B testing for meta tags
- [ ] SEO analytics integration

## Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)

## Support

For issues or questions about SEO implementation:
1. Check this README
2. Review example implementations in pages
3. Consult the team's SEO guidelines
