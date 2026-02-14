# Structured Data Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Import the Component

```tsx
import { StructuredData } from '@/components/common';
```

### Step 2: Add to Your Page

```tsx
function RestaurantPage({ restaurant }) {
  return (
    <>
      <StructuredData 
        type="restaurant" 
        data={{
          name: restaurant.name,
          description: restaurant.description,
          address: {
            streetAddress: restaurant.address.street,
            addressLocality: restaurant.address.city,
            addressRegion: restaurant.address.state,
            postalCode: restaurant.address.zip,
            addressCountry: 'US',
          },
          telephone: restaurant.phone,
          priceRange: restaurant.priceRange,
          aggregateRating: {
            ratingValue: restaurant.rating,
            reviewCount: restaurant.reviewCount,
          },
        }} 
      />
      {/* Your page content */}
    </>
  );
}
```

### Step 3: Test Your Implementation

1. Visit your page
2. View page source (Ctrl+U or Cmd+U)
3. Look for `<script type="application/ld+json">` in the `<head>`
4. Copy the JSON-LD content
5. Paste into [Google Rich Results Test](https://search.google.com/test/rich-results)

## 📋 Common Use Cases

### Restaurant Profile
```tsx
<StructuredData type="restaurant" data={restaurantData} />
```

### Menu Page
```tsx
<StructuredData type="menu" data={menuData} />
```

### Review/Feedback
```tsx
<StructuredData type="review" data={reviewData} />
```

### Landing Page
```tsx
<StructuredData type="organization" data={organizationData} />
```

### Any Page with Breadcrumbs
```tsx
<StructuredData type="breadcrumb" data={breadcrumbData} />
```

## 🎯 Quick Tips

1. **Multiple Schemas**: You can use multiple `<StructuredData>` components on the same page
2. **Type Safety**: All data is fully typed - your IDE will help you
3. **Optional Fields**: Only include fields you have data for
4. **Images**: Use absolute URLs for images
5. **Testing**: Always test with Google Rich Results Test

## 📚 Full Documentation

- **Complete Guide**: `src/utils/seo/STRUCTURED_DATA.md`
- **Demo Page**: Visit `/structured-data-demo` in your browser
- **Implementation Summary**: `STRUCTURED_DATA_IMPLEMENTATION.md`

## 🔗 Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)

## ❓ Need Help?

Check the demo page at `/structured-data-demo` for live examples and code snippets!
