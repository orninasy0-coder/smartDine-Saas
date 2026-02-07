import { FloatingShapes } from '@/components/common';
import { Header, Footer } from '@/components/layout';
import { PricingCards, FeatureComparisonTable } from '@/components/landing';
import { motion } from 'framer-motion';

/**
 * Pricing Page Component
 * 
 * Displays subscription plans and feature comparison for SmartDine platform.
 * Features:
 * - Three pricing tiers: Basic, Pro, Enterprise
 * - Feature comparison table
 * - Clear call-to-action buttons
 * - Animated elements for visual appeal
 */
export default function Pricing() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating Shapes Background */}
      <FloatingShapes count={4} />

      {/* Header */}
      <Header variant="public" />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Simple, Transparent
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Pricing
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan for your restaurant. Start with a free trial, 
                upgrade anytime, and scale as you grow.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <PricingCards />
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Compare Plans
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what's included in each plan and find the right fit for your business.
              </p>
            </motion.div>

            {/* Feature Comparison Table */}
            <FeatureComparisonTable />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Can I switch plans later?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect 
                  immediately, while downgrades apply at the end of your billing cycle.
                </p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes, all plans come with a 14-day free trial. No credit card required to start.
                </p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and local payment methods depending 
                  on your region.
                </p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Absolutely. You can cancel your subscription at any time with no penalties. 
                  You'll retain access until the end of your billing period.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
