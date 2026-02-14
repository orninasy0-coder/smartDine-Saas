# SEO Meta Automation - Quick Start Guide

## ✅ Task 17.1 Complete

All three subtasks have been successfully implemented:
- ✅ 17.1.1 Dynamic meta tags generation
- ✅ 17.1.2 Open Graph tags  
- ✅ 17.1.3 Twitter Card tags

## 🚀 Quick Start (3 Steps)

### Step 1: Import the SEO Component

```tsx
import { SEO } from '@/components/common';
```

### Step 2: Add to Your Page

```tsx
export default function MyPage() {
  return (
    <div>
      <SEO
        title="My Page Title"
        description="My page description for search engines"
        keywords={['keyword1', 'keyword2', 'keyword3']}
      />
      {/* Your page content */}
    </div>
  );
}
```

### Step 3: Test It

1. Run the dev server: `npm run dev`
2. Open your page in browser
3. View page source (Ctrl+U or Cmd+U)
4. Look for meta tags in the `<head>` section

## 📋 Common Use Cases

### Landing Page with Social Sharing

```tsx
<SEO
  title="SmartDine - AI-Powered Digital QR Menu Platform"
  description="Transform your restaurant with SmartDine. Create stunning digital QR menus with AI recommendations."
  keywords={['digital menu', 'QR menu', 'restaurant SaaS']}
  ogImage="/images/landing-hero.png"
  ogType="website"
  twitterCard="summary_large_image"
/>
```

### Product/Dish Page

```tsx
<SEO
  title={dish.name}
  description={dish.description}
  ogImage={dish.image}
  ogType="product"
  twitterCard="summary_large_image"
/>
```

### Blog/Article Page

```tsx
<SEO
  title="How to Use Digital Menus - SmartDine Blog"
  description="Learn best practices for implementing digital QR menus in your restaurant."
  ogType="article"
  twitterCard="summary"
/>
```

### Using Hooks for Dynamic Pages

```tsx
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
    </div>
  );
}
```

## 🎯 What Gets Generated

When you use the SEO component, it automatically generates:

### Basic Meta Tags
```html
<title>My Page Title | SmartDine</title>
<meta name="description" content="My page description" />
<meta name="keywords" content="keyword1, keyword2, keyword3" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://yourdomain.com/my-page" />
```

### Open Graph Tags (for Facebook, LinkedIn, etc.)
```html
<meta property="og:title" content="My Page Title" />
<meta property="og:description" content="My page description" />
<meta property="og:image" content="https://yourdomain.com/images/preview.png" />
<meta property="og:url" content="https://yourdomain.com/my-page" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="SmartDine" />
```

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="My Page Title" />
<meta name="twitter:description" content="My page description" />
<meta name="twitter:image" content="https://yourdomain.com/images/preview.png" />
<meta name="twitter:site" content="@smartdine" />
```

## 🧪 Testing Your SEO

### 1. View Page Source
- Press `Ctrl+U` (Windows) or `Cmd+U` (Mac)
- Look for meta tags in the `<head>` section
- Verify all tags are present and correct

### 2. Browser DevTools
- Press `F12` to open DevTools
- Go to Elements tab
- Inspect the `<head>` section
- Check meta tags are rendered

### 3. Social Media Debuggers
Test how your pages will appear when shared:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

### 4. SEO Audit
- Open Chrome DevTools (F12)
- Go to Lighthouse tab
- Run audit with "SEO" category selected
- Check for 100/100 score

## 📁 Files Created

```
src/
├── components/common/
│   └── SEO.tsx                    # Main SEO component
├── hooks/
│   └── useSEO.ts                  # SEO hooks (useSEO, useDynamicSEO)
├── utils/seo/
│   ├── types.ts                   # TypeScript types
│   ├── config.ts                  # Default & page configs
│   ├── helpers.ts                 # Helper functions
│   ├── index.ts                   # Main export
│   └── README.md                  # Full documentation
├── pages/
│   ├── Landing.tsx                # ✅ Example implementation
│   ├── Pricing.tsx                # ✅ Example implementation
│   └── SEODemo.tsx                # Interactive demo page
└── main.tsx                       # ✅ HelmetProvider added
```

## 🎨 Available Props

```typescript
<SEO
  // Basic Meta Tags
  title="Page Title"
  description="Page description"
  keywords={['keyword1', 'keyword2']}
  author="SmartDine"
  robots="index, follow"
  canonical="https://yourdomain.com/page"
  
  // Open Graph Tags
  ogTitle="OG Title"
  ogDescription="OG Description"
  ogImage="/images/preview.png"
  ogImageAlt="Image description"
  ogUrl="https://yourdomain.com/page"
  ogType="website" // or "article", "product", "profile"
  ogSiteName="SmartDine"
  ogLocale="en_US"
  
  // Twitter Card Tags
  twitterCard="summary_large_image" // or "summary", "app", "player"
  twitterTitle="Twitter Title"
  twitterDescription="Twitter Description"
  twitterImage="/images/preview.png"
  twitterImageAlt="Image description"
  twitterSite="@smartdine"
  twitterCreator="@author"
/>
```

## 💡 Pro Tips

1. **Always include SEO component** on every page, even if using defaults
2. **Keep descriptions under 160 characters** for optimal display
3. **Use high-quality images** (1200x630px) for Open Graph
4. **Set appropriate og:type** based on content (website, article, product)
5. **Test social sharing** before deploying to production
6. **Use keywords strategically** (3-5 relevant keywords per page)
7. **Set canonical URLs** to prevent duplicate content issues

## 🔧 Configuration

### Update Default SEO

Edit `src/utils/seo/config.ts`:

```typescript
export const defaultSEO: SEOMetaTags = {
  title: 'Your Site Name',
  description: 'Your default description',
  // ... other defaults
};
```

### Add Page-Specific Config

Edit `src/utils/seo/config.ts`:

```typescript
export const pageSEOConfigs: Record<string, PageSEOConfig> = {
  '/my-page': {
    path: '/my-page',
    title: 'My Page - Site Name',
    description: 'My page description',
    keywords: ['keyword1', 'keyword2'],
    ogType: 'website',
    priority: 0.8,
    changeFrequency: 'weekly',
  },
};
```

## 📚 Full Documentation

For complete documentation, see:
- `src/utils/seo/README.md` - Comprehensive guide
- `SEO_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `src/pages/SEODemo.tsx` - Interactive demo

## ✨ What's Next?

The SEO system is ready to use! Simply:

1. Add `<SEO />` component to your pages
2. Customize props as needed
3. Test with social media debuggers
4. Deploy with confidence

For questions or issues, refer to the full documentation in `src/utils/seo/README.md`.
