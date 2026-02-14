/**
 * Structured Data Schema Generators
 * Generate JSON-LD structured data for SEO (Schema.org)
 * Supports Restaurant, Menu, and Review schemas
 */

// Restaurant Schema Types
export interface RestaurantSchemaData {
  name: string;
  description?: string;
  image?: string | string[];
  url?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[]; // e.g., ["Mo-Fr 09:00-17:00", "Sa 10:00-15:00"]
  priceRange?: string; // e.g., "$$", "$$$"
  servesCuisine?: string | string[];
  acceptsReservations?: boolean;
  menu?: string; // URL to menu
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}

// Menu Schema Types
export interface MenuItemSchemaData {
  name: string;
  description?: string;
  image?: string | string[];
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    url?: string;
  };
  nutrition?: {
    calories?: string;
    fatContent?: string;
    proteinContent?: string;
    carbohydrateContent?: string;
  };
  suitableForDiet?: string[]; // e.g., ["VeganDiet", "GlutenFreeDiet"]
  allergens?: string[];
}

export interface MenuSectionSchemaData {
  name: string;
  description?: string;
  hasMenuItem: MenuItemSchemaData[];
}

export interface MenuSchemaData {
  name: string;
  description?: string;
  inLanguage?: string;
  hasMenuSection?: MenuSectionSchemaData[];
  hasMenuItem?: MenuItemSchemaData[];
}

// Review Schema Types
export interface ReviewSchemaData {
  itemReviewed: {
    type: 'Restaurant' | 'MenuItem';
    name: string;
    image?: string;
    url?: string;
  };
  author: {
    name: string;
    url?: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviewBody?: string;
  datePublished?: string; // ISO 8601 format
  publisher?: {
    name: string;
    url?: string;
  };
}

/**
 * Generate Restaurant Schema (Schema.org/Restaurant)
 */
export const generateRestaurantSchema = (data: RestaurantSchemaData): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: data.name,
  };

  if (data.description) schema.description = data.description;
  if (data.image) schema.image = data.image;
  if (data.url) schema.url = data.url;
  if (data.telephone) schema.telephone = data.telephone;
  if (data.email) schema.email = data.email;
  if (data.priceRange) schema.priceRange = data.priceRange;
  if (data.servesCuisine) schema.servesCuisine = data.servesCuisine;
  if (data.menu) schema.menu = data.menu;

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    };
  }

  if (data.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    };
  }

  if (data.openingHours && data.openingHours.length > 0) {
    schema.openingHoursSpecification = data.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1]?.split('-')[0],
      closes: hours.split(' ')[1]?.split('-')[1],
    }));
  }

  if (data.acceptsReservations !== undefined) {
    schema.acceptsReservations = data.acceptsReservations;
  }

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
      bestRating: data.aggregateRating.bestRating || 5,
      worstRating: data.aggregateRating.worstRating || 1,
    };
  }

  return JSON.stringify(schema);
};

/**
 * Generate Menu Schema (Schema.org/Menu)
 */
export const generateMenuSchema = (data: MenuSchemaData): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: data.name,
  };

  if (data.description) schema.description = data.description;
  if (data.inLanguage) schema.inLanguage = data.inLanguage;

  // Add menu sections
  if (data.hasMenuSection && data.hasMenuSection.length > 0) {
    schema.hasMenuSection = data.hasMenuSection.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      description: section.description,
      hasMenuItem: section.hasMenuItem.map((item) => generateMenuItemObject(item)),
    }));
  }

  // Add direct menu items (if no sections)
  if (data.hasMenuItem && data.hasMenuItem.length > 0) {
    schema.hasMenuItem = data.hasMenuItem.map((item) => generateMenuItemObject(item));
  }

  return JSON.stringify(schema);
};

/**
 * Generate MenuItem object for Menu Schema
 */
const generateMenuItemObject = (item: MenuItemSchemaData): any => {
  const menuItem: any = {
    '@type': 'MenuItem',
    name: item.name,
  };

  if (item.description) menuItem.description = item.description;
  if (item.image) menuItem.image = item.image;

  if (item.offers) {
    menuItem.offers = {
      '@type': 'Offer',
      price: item.offers.price,
      priceCurrency: item.offers.priceCurrency,
    };

    if (item.offers.availability) {
      menuItem.offers.availability = `https://schema.org/${item.offers.availability}`;
    }
    if (item.offers.url) {
      menuItem.offers.url = item.offers.url;
    }
  }

  if (item.nutrition) {
    menuItem.nutrition = {
      '@type': 'NutritionInformation',
      ...item.nutrition,
    };
  }

  if (item.suitableForDiet && item.suitableForDiet.length > 0) {
    menuItem.suitableForDiet = item.suitableForDiet.map(
      (diet) => `https://schema.org/${diet}`
    );
  }

  if (item.allergens && item.allergens.length > 0) {
    menuItem.allergens = item.allergens;
  }

  return menuItem;
};

/**
 * Generate Review Schema (Schema.org/Review)
 */
export const generateReviewSchema = (data: ReviewSchemaData): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': data.itemReviewed.type,
      name: data.itemReviewed.name,
    },
    author: {
      '@type': 'Person',
      name: data.author.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.reviewRating.ratingValue,
      bestRating: data.reviewRating.bestRating || 5,
      worstRating: data.reviewRating.worstRating || 1,
    },
  };

  if (data.itemReviewed.image) schema.itemReviewed.image = data.itemReviewed.image;
  if (data.itemReviewed.url) schema.itemReviewed.url = data.itemReviewed.url;
  if (data.author.url) schema.author.url = data.author.url;
  if (data.reviewBody) schema.reviewBody = data.reviewBody;
  if (data.datePublished) schema.datePublished = data.datePublished;

  if (data.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: data.publisher.name,
      url: data.publisher.url,
    };
  }

  return JSON.stringify(schema);
};

/**
 * Generate Organization Schema (for SmartDine platform)
 */
export const generateOrganizationSchema = (data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[]; // Social media URLs
}): string => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
  };

  if (data.logo) schema.logo = data.logo;
  if (data.description) schema.description = data.description;

  if (data.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      email: data.contactPoint.email,
    };
  }

  if (data.sameAs && data.sameAs.length > 0) {
    schema.sameAs = data.sameAs;
  }

  return JSON.stringify(schema);
};

/**
 * Generate BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return JSON.stringify(schema);
};
