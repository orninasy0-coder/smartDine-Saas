/**
 * StructuredData Component
 * Injects JSON-LD structured data into the page head for SEO
 * Supports Restaurant, Menu, Review, Organization, and Breadcrumb schemas
 */

import { Helmet } from 'react-helmet-async';
import {
  generateRestaurantSchema,
  generateMenuSchema,
  generateReviewSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  type RestaurantSchemaData,
  type MenuSchemaData,
  type ReviewSchemaData,
} from '../../utils/seo/structuredData';

interface StructuredDataProps {
  type: 'restaurant' | 'menu' | 'review' | 'organization' | 'breadcrumb';
  data: any; // Type depends on the schema type
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  let schemaJson: string;

  switch (type) {
    case 'restaurant':
      schemaJson = generateRestaurantSchema(data as RestaurantSchemaData);
      break;
    case 'menu':
      schemaJson = generateMenuSchema(data as MenuSchemaData);
      break;
    case 'review':
      schemaJson = generateReviewSchema(data as ReviewSchemaData);
      break;
    case 'organization':
      schemaJson = generateOrganizationSchema(data);
      break;
    case 'breadcrumb':
      schemaJson = generateBreadcrumbSchema(data);
      break;
    default:
      return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">{schemaJson}</script>
    </Helmet>
  );
};

export default StructuredData;
