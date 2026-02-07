import { FloatingShapes } from '@/components/common';
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
