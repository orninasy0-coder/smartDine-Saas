import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Rocket, HelpCircle, Sparkles, Users, Zap } from 'lucide-react';

/**
 * User Guide Section Component
 * 
 * Promotes the comprehensive user guide on the landing page
 * with floating cards animation
 */
export function UserGuideSection() {
  return (
    <section className="relative py-20 px-4 bg-muted/30 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Comprehensive Guide</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Know
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                In One Place
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              A complete user guide covering all aspects of the platform, from getting started to advanced features.
              With practical examples, tips, and solutions to common issues.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Start</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up your account and launch in minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Advanced Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Master AI, AR, and analytics tools
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Troubleshooting</h3>
                  <p className="text-sm text-muted-foreground">
                    Solutions to common technical issues
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" asChild className="gap-2 text-lg px-8">
              <a href="/guide">
                Explore Complete Guide
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Over 50 topics with practical examples and illustrations
            </p>
          </motion.div>

          {/* Right Visual - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px]">
              {/* Getting Started Card */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 left-0 w-64 p-6 bg-card border border-border rounded-2xl shadow-2xl"
              >
                <Rocket className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step setup guide for new users
                </p>
              </motion.div>

              {/* User Scenarios Card */}
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [2, -2, 2],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-32 right-0 w-64 p-6 bg-card border border-border rounded-2xl shadow-2xl"
              >
                <Users className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-semibold text-lg mb-2">User Scenarios</h3>
                <p className="text-sm text-muted-foreground">
                  Guides for customers, owners, and staff
                </p>
              </motion.div>

              {/* Advanced Tips Card */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-0 left-12 w-64 p-6 bg-card border border-border rounded-2xl shadow-2xl"
              >
                <Zap className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pro Tips</h3>
                <p className="text-sm text-muted-foreground">
                  Expert advice and best practices
                </p>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
