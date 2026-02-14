# Structured Data Schema Implementation

This document explains how to use structured data (JSON-LD) schemas for SEO in the SmartDine platform.

## Overview

Structured data helps search engines understand your content better, enabling rich snippets in search results. We support the following Schema.org types:

1. **Restaurant Schema** - For restaurant pages
2. **Menu Schema** - For menu and dish listings
3. **Review Schema** - For customer reviews and ratings
4. **Organization Schema** - For the SmartDine platform
5. **Breadcrumb Schema** - For navigation breadcrumbs

## Installation

All structured data utilities are available from the SEO utils:

```typescript
import { StructuredData } from '@/components/common/StructuredData';
import {
  generateRestaurantSchema,
  generateMenuSchema,
  generateReviewSchema,
  type RestaurantSchemaData,
  type MenuSchemaData,
  type ReviewSchemaData,
} from '@/utils/seo';
```

## Usage Examples

### 1. Restaurant Schema

Use this on restaurant profile pages to provide rich information about the restaurant.

```tsx
import { StructuredData } from '@/components/common/StructuredData';
import type { RestaurantSchemaData } from '@/utils/seo';

function RestaurantPage() {
  const restaurantData: RestaurantSchemaData = {
    name: 'The Gourmet Kitchen',
    description: 'Fine dining restaurant specializing in Mediterranean cuisine',
    image: 'https://example.com/restaurant-image.jpg',
    url: 'https://smartdine.app/restaurant/gourmet-kitchen',
    telephone: '+1-555-123-4567',
    email: 'info@gourmetkitchen.com',
    address: {
      streetAddress: '123 Main Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    geo: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    openingHours: [
      'Mo-Fr 11:00-22:00',
      'Sa-Su 10:00-23:00',
    ],
    priceRange: '$$$',
    servesCuisine: ['Mediterranean', 'Italian', 'Seafood'],
    acceptsReservations: true,
    menu: 'https://smartdine.app/restaurant/gourmet-kitchen/menu',
    aggregateRating: {
      ratingValue: 4.5,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <StructuredData type="restaurant" data={restaurantData} />
      {/* Your restaurant page content */}
    </>
  );
}
```

**Benefits:**
- Rich snippets in Google Search with ratings, price range, and hours
- Better local SEO visibility
- Enhanced Google Maps integration

### 2. Menu Schema

Use this on menu pages to help search engines understand your menu structure and items.

```tsx
import { StructuredData } from '@/components/common/StructuredData';
import type { MenuSchemaData } from '@/utils/seo';

function MenuPage() {
  const menuData: MenuSchemaData = {
    name: 'Dinner Menu',
    description: 'Our signature dinner menu featuring Mediterranean specialties',
    inLanguage: 'en',
    hasMenuSection: [
      {
        name: 'Appetizers',
        description: 'Start your meal with our delicious starters',
        hasMenuItem: [
          {
            name: 'Bruschetta',
            description: 'Toasted bread with tomatoes, garlic, and basil',
            image: 'https://example.com/bruschetta.jpg',
            offers: {
              price: 12.99,
              priceCurrency: 'USD',
              availability: 'InStock',
            },
            suitableForDiet: ['VeganDiet', 'VegetarianDiet'],
            allergens: ['Gluten'],
          },
          {
            name: 'Calamari',
            description: 'Crispy fried squid with marinara sauce',
            image: 'https://example.com/calamari.jpg',
            offers: {
              price: 15.99,
              priceCurrency: 'USD',
              availability: 'InStock',
            },
            allergens: ['Seafood', 'Gluten'],
          },
        ],
      },
      {
        name: 'Main Courses',
        description: 'Our signature entrees',
        hasMenuItem: [
          {
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with lemon butter sauce',
            image: 'https://example.com/salmon.jpg',
            offers: {
              price: 28.99,
              priceCurrency: 'USD',
              availability: 'InStock',
            },
            nutrition: {
              calories: '450 calories',
              proteinContent: '35g',
              fatContent: '22g',
            },
            allergens: ['Fish'],
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData type="menu" data={menuData} />
      {/* Your menu page content */}
    </>
  );
}
```

**Benefits:**
- Menu items appear in Google Search with prices
- Better visibility for food-related searches
- Enhanced mobile search experience

### 3. Review Schema

Use this on review pages or individual review components.

```tsx
import { StructuredData } from '@/components/common/StructuredData';
import type { ReviewSchemaData } from '@/utils/seo';

function ReviewComponent({ review }) {
  const reviewData: ReviewSchemaData = {
    itemReviewed: {
      type: 'Restaurant',
      name: 'The Gourmet Kitchen',
      image: 'https://example.com/restaurant-image.jpg',
      url: 'https://smartdine.app/restaurant/gourmet-kitchen',
    },
    author: {
      name: 'John Doe',
      url: 'https://smartdine.app/user/johndoe',
    },
    reviewRating: {
      ratingValue: 5,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: 'Amazing food and excellent service! The salmon was perfectly cooked.',
    datePublished: '2024-01-15T19:30:00Z',
    publisher: {
      name: 'SmartDine',
      url: 'https://smartdine.app',
    },
  };

  return (
    <>
      <StructuredData type="review" data={reviewData} />
      {/* Your review display component */}
    </>
  );
}
```

**Benefits:**
- Review stars appear in search results
- Builds trust with potential customers
- Improves click-through rates

### 4. Organization Schema

Use this on the main landing page for the SmartDine platform.

```tsx
import { StructuredData } from '@/components/common/StructuredData';

function LandingPage() {
  const organizationData = {
    name: 'SmartDine',
    url: 'https://smartdine.app',
    logo: 'https://smartdine.app/logo.png',
    description: 'AI-powered digital QR menu platform for restaurants',
    contactPoint: {
      telephone: '+1-555-SMARTDINE',
      contactType: 'customer service',
      email: 'support@smartdine.app',
    },
    sameAs: [
      'https://twitter.com/smartdine',
      'https://facebook.com/smartdine',
      'https://linkedin.com/company/smartdine',
    ],
  };

  return (
    <>
      <StructuredData type="organization" data={organizationData} />
      {/* Your landing page content */}
    </>
  );
}
```

**Benefits:**
- Knowledge panel in Google Search
- Better brand recognition
- Social media integration

### 5. Breadcrumb Schema

Use this on any page with breadcrumb navigation.

```tsx
import { StructuredData } from '@/components/common/StructuredData';

function DishDetailPage() {
  const breadcrumbData = [
    { name: 'Home', url: 'https://smartdine.app' },
    { name: 'Restaurants', url: 'https://smartdine.app/restaurants' },
    { name: 'The Gourmet Kitchen', url: 'https://smartdine.app/restaurant/gourmet-kitchen' },
    { name: 'Menu', url: 'https://smartdine.app/restaurant/gourmet-kitchen/menu' },
    { name: 'Grilled Salmon', url: 'https://smartdine.app/restaurant/gourmet-kitchen/menu/salmon' },
  ];

  return (
    <>
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      {/* Your page content */}
    </>
  );
}
```

**Benefits:**
- Breadcrumb trail in search results
- Better navigation understanding
- Improved user experience

## Multiple Schemas on One Page

You can use multiple structured data schemas on the same page:

```tsx
function RestaurantMenuPage() {
  return (
    <>
      <StructuredData type="restaurant" data={restaurantData} />
      <StructuredData type="menu" data={menuData} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      {/* Your page content */}
    </>
  );
}
```

## Testing Structured Data

Use these tools to validate your structured data:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **Google Search Console**: Monitor rich results performance

## Best Practices

1. **Be Accurate**: Only include information that's visible on the page
2. **Keep Updated**: Update structured data when content changes
3. **Use Specific Types**: Use the most specific schema type available
4. **Include Images**: Always provide high-quality images when possible
5. **Add Ratings**: Include aggregate ratings when available
6. **Test Regularly**: Validate structured data after changes

## Common Patterns

### Dynamic Restaurant Data

```tsx
function RestaurantPage({ restaurant }) {
  const restaurantData: RestaurantSchemaData = {
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.images,
    url: `https://smartdine.app/restaurant/${restaurant.slug}`,
    telephone: restaurant.phone,
    address: {
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.city,
      addressRegion: restaurant.address.state,
      postalCode: restaurant.address.zip,
      addressCountry: restaurant.address.country,
    },
    priceRange: restaurant.priceRange,
    servesCuisine: restaurant.cuisineTypes,
    aggregateRating: restaurant.rating ? {
      ratingValue: restaurant.rating.average,
      reviewCount: restaurant.rating.count,
    } : undefined,
  };

  return <StructuredData type="restaurant" data={restaurantData} />;
}
```

### Menu with Categories

```tsx
function MenuPage({ menu }) {
  const menuData: MenuSchemaData = {
    name: menu.name,
    description: menu.description,
    inLanguage: menu.language,
    hasMenuSection: menu.categories.map(category => ({
      name: category.name,
      description: category.description,
      hasMenuItem: category.dishes.map(dish => ({
        name: dish.name,
        description: dish.description,
        image: dish.image,
        offers: {
          price: dish.price,
          priceCurrency: 'USD',
          availability: dish.inStock ? 'InStock' : 'OutOfStock',
        },
        suitableForDiet: dish.dietaryTags,
        allergens: dish.allergens,
      })),
    })),
  };

  return <StructuredData type="menu" data={menuData} />;
}
```

## Troubleshooting

### Schema Not Appearing in Search Results

- Wait 2-4 weeks for Google to index changes
- Verify schema is valid using Google's Rich Results Test
- Ensure content matches structured data
- Check Google Search Console for errors

### Invalid Schema Errors

- Validate required fields are present
- Check data types match schema requirements
- Ensure URLs are absolute (not relative)
- Verify date formats are ISO 8601

### Multiple Schemas Conflicting

- Use unique identifiers for each schema
- Ensure schemas don't contradict each other
- Test with Google's Rich Results Test

## References

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Restaurant Schema](https://schema.org/Restaurant)
- [Menu Schema](https://schema.org/Menu)
- [Review Schema](https://schema.org/Review)
