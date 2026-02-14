/**
 * Structured Data Demo Page
 * Demonstrates all Schema.org structured data implementations
 */

import { useState } from 'react';
import { SEO, StructuredData } from '@/components/common';
import { Container } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Code } from 'lucide-react';
import type {
  RestaurantSchemaData,
  MenuSchemaData,
  ReviewSchemaData,
} from '@/utils/seo';

export default function StructuredDataDemo() {
  const [activeSchema, setActiveSchema] = useState<string>('restaurant');

  // Sample Restaurant Data
  const restaurantData: RestaurantSchemaData = {
    name: 'The Gourmet Kitchen',
    description: 'Fine dining restaurant specializing in Mediterranean cuisine with fresh, locally-sourced ingredients',
    image: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    ],
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

  // Sample Menu Data
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
            description: 'Toasted bread with fresh tomatoes, garlic, and basil',
            image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800',
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
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
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
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
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
          {
            name: 'Margherita Pizza',
            description: 'Classic Italian pizza with fresh mozzarella and basil',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
            offers: {
              price: 18.99,
              priceCurrency: 'USD',
              availability: 'InStock',
            },
            suitableForDiet: ['VegetarianDiet'],
            allergens: ['Gluten', 'Dairy'],
          },
        ],
      },
    ],
  };

  // Sample Review Data
  const reviewData: ReviewSchemaData = {
    itemReviewed: {
      type: 'Restaurant',
      name: 'The Gourmet Kitchen',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
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
    reviewBody: 'Amazing food and excellent service! The salmon was perfectly cooked and the atmosphere was wonderful. Highly recommend for special occasions.',
    datePublished: '2024-01-15T19:30:00Z',
    publisher: {
      name: 'SmartDine',
      url: 'https://smartdine.app',
    },
  };

  // Organization Data
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

  // Breadcrumb Data
  const breadcrumbData = [
    { name: 'Home', url: 'https://smartdine.app' },
    { name: 'Restaurants', url: 'https://smartdine.app/restaurants' },
    { name: 'The Gourmet Kitchen', url: 'https://smartdine.app/restaurant/gourmet-kitchen' },
  ];

  const schemaExamples = {
    restaurant: JSON.stringify(restaurantData, null, 2),
    menu: JSON.stringify(menuData, null, 2),
    review: JSON.stringify(reviewData, null, 2),
    organization: JSON.stringify(organizationData, null, 2),
    breadcrumb: JSON.stringify(breadcrumbData, null, 2),
  };

  return (
    <>
      <SEO
        title="Structured Data Demo - SmartDine"
        description="Explore Schema.org structured data implementations for Restaurant, Menu, Review, Organization, and Breadcrumb schemas"
        keywords={['structured data', 'schema.org', 'JSON-LD', 'SEO', 'rich snippets']}
      />

      {/* Inject all structured data schemas */}
      <StructuredData type="restaurant" data={restaurantData} />
      <StructuredData type="menu" data={menuData} />
      <StructuredData type="review" data={reviewData} />
      <StructuredData type="organization" data={organizationData} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />

      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              SEO Enhancement
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Structured Data Demo</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore Schema.org structured data implementations for rich search results.
              All schemas are injected into this page's HTML.
            </p>
          </div>

          {/* Benefits Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Benefits of Structured Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">🎯 Rich Snippets</h3>
                  <p className="text-sm text-muted-foreground">
                    Enhanced search results with ratings, prices, and images
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">📈 Better SEO</h3>
                  <p className="text-sm text-muted-foreground">
                    Improved search engine understanding and ranking
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🔍 Knowledge Panels</h3>
                  <p className="text-sm text-muted-foreground">
                    Appear in Google Knowledge Graph and featured snippets
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">📱 Mobile Enhancement</h3>
                  <p className="text-sm text-muted-foreground">
                    Better mobile search experience with rich cards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schema Tabs */}
          <Tabs value={activeSchema} onValueChange={setActiveSchema} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="breadcrumb">Breadcrumb</TabsTrigger>
            </TabsList>

            {/* Restaurant Schema */}
            <TabsContent value="restaurant">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Schema</CardTitle>
                  <CardDescription>
                    Provides rich information about restaurants including location, hours, ratings, and cuisine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Business information (name, address, phone)</li>
                      <li>Geographic coordinates for maps</li>
                      <li>Opening hours and price range</li>
                      <li>Aggregate ratings and review count</li>
                      <li>Cuisine types and reservation info</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sample Data:</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{schemaExamples.restaurant}</code>
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://schema.org/Restaurant"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Schema.org Docs
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Menu Schema */}
            <TabsContent value="menu">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Schema</CardTitle>
                  <CardDescription>
                    Structured menu data with sections, items, prices, and dietary information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Menu sections and categories</li>
                      <li>Item names, descriptions, and images</li>
                      <li>Pricing and availability status</li>
                      <li>Dietary information (vegan, gluten-free, etc.)</li>
                      <li>Allergen information</li>
                      <li>Nutritional data (optional)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sample Data:</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                      <code>{schemaExamples.menu}</code>
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://schema.org/Menu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Schema.org Docs
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review Schema */}
            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle>Review Schema</CardTitle>
                  <CardDescription>
                    Customer reviews with ratings, author info, and review content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Review rating (1-5 stars)</li>
                      <li>Author information and profile</li>
                      <li>Review text content</li>
                      <li>Publication date</li>
                      <li>Item being reviewed (restaurant or dish)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sample Data:</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{schemaExamples.review}</code>
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://schema.org/Review"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Schema.org Docs
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Schema */}
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Schema</CardTitle>
                  <CardDescription>
                    Company/platform information for knowledge panels and brand recognition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Organization name and logo</li>
                      <li>Contact information</li>
                      <li>Social media profiles</li>
                      <li>Company description</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sample Data:</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{schemaExamples.organization}</code>
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://schema.org/Organization"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Schema.org Docs
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Breadcrumb Schema */}
            <TabsContent value="breadcrumb">
              <Card>
                <CardHeader>
                  <CardTitle>Breadcrumb Schema</CardTitle>
                  <CardDescription>
                    Navigation breadcrumbs for better search result display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Hierarchical navigation path</li>
                      <li>Position-based ordering</li>
                      <li>Page names and URLs</li>
                      <li>Breadcrumb trail in search results</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sample Data:</h3>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{schemaExamples.breadcrumb}</code>
                    </pre>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://schema.org/BreadcrumbList"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Schema.org Docs
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Testing Tools */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Testing & Validation Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" asChild>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Rich Results Test
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://validator.schema.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Schema.org Validator
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Search Console
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              For complete implementation details, see the documentation
            </p>
            <Button variant="default" asChild>
              <a href="/src/utils/seo/STRUCTURED_DATA.md" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                View Full Documentation
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
