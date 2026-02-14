import { FloatingShapes, SEO } from '@/components/common';
import { Header, Footer } from '@/components/layout';
import { HeroSection, FeaturesGrid, TestimonialsSection, UserGuideSection, CTASection } from '@/components/landing';

/**
 * Landing Page Component
 * 
 * Main public landing page for SmartDine SaaS platform.
 * Features:
 * - Hero section with animated elements
 * - Features grid showcasing platform capabilities
 * - Testimonials from restaurant owners
 * - User guide section
 * - Call-to-action section for conversions
 * - Floating background shapes for visual appeal
 */
export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <SEO
        title="SmartDine - AI-Powered Digital QR Menu Platform"
        description="Transform your restaurant with SmartDine. Create stunning digital QR menus with AI recommendations, AR dish visualization, and seamless ordering."
        keywords={['digital menu', 'QR menu', 'restaurant SaaS', 'AI dining', 'AR menu', 'smart restaurant']}
        ogImage="/images/landing-hero.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      
      {/* Floating Shapes Background */}
      <FloatingShapes count={6} />

      {/* Header */}
      <Header variant="public" />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <FeaturesGrid />
        <TestimonialsSection />
        <UserGuideSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
