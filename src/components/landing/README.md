# Landing Page Components

This directory contains all components for the SmartDine SaaS platform landing page.

## Components

### HeroSection
The main hero section with animated elements, CTA buttons, and floating feature cards.

**Features:**
- Animated heading with gradient text
- Primary and secondary CTA buttons
- Statistics display (restaurants, orders, rating)
- Floating feature cards (QR Menu, AI Assistant, AR Viewer)
- Responsive design with mobile-first approach

### FeaturesGrid
A comprehensive grid showcasing all platform features with icons and descriptions.

**Features:**
- 12 feature cards with icons
- Hover animations and transitions
- Staggered animation on scroll
- Responsive grid layout (1/2/3 columns)

**Included Features:**
- Smart QR Menus
- AI Ordering Assistant
- AR 3D Visualization
- Advanced Analytics
- Kitchen Dashboard
- Delivery Management
- Customer Feedback
- Security & Compliance
- Performance
- Multi-Language Support
- Real-Time Updates
- Subscription Plans

### TestimonialsSection
Customer testimonials from restaurant owners with ratings and reviews.

**Features:**
- 6 testimonial cards with 5-star ratings
- Customer name, role, and restaurant
- Quote icon background
- Trust indicators (rating, restaurant count, orders)
- Responsive grid layout

### CTASection
Final call-to-action section to convert visitors into customers.

**Features:**
- Large heading with gradient text
- Benefits list with checkmarks
- Primary and secondary CTA buttons
- Trust badge with security information
- Animated background elements

## Usage

```tsx
import { HeroSection, FeaturesGrid, TestimonialsSection, CTASection } from '@/components/landing';

function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
```

## Styling

All components use:
- Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui components (Button, Card)
- Lucide icons
- Dark/Light mode support

## Animations

- **Scroll-triggered animations**: Components animate when they enter the viewport
- **Staggered children**: Grid items animate in sequence
- **Floating elements**: Continuous subtle animations for visual interest
- **Hover effects**: Interactive feedback on cards and buttons

## Responsive Design

All components are fully responsive with breakpoints:
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance (WCAG 2.1 AA)
