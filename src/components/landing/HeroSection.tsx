import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, QrCode, Brain } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Restaurant Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Transform Your
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Restaurant Experience
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            >
              Elevate your restaurant with smart QR menus, AI-powered ordering assistance, 
              AR 3D visualization, and comprehensive management dashboards. All in one platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="text-lg px-8 group">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-8 border-t border-border"
            >
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Orders Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Floating Cards */}
            <div className="relative w-full h-[600px]">
              {/* QR Menu Card */}
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
                <QrCode className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">QR Menu</h3>
                <p className="text-sm text-muted-foreground">
                  Contactless ordering with instant menu access
                </p>
              </motion.div>

              {/* AI Assistant Card */}
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
                <Brain className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Smart recommendations powered by AI
                </p>
              </motion.div>

              {/* AR Viewer Card */}
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
                <Sparkles className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">AR 3D Menu</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize dishes in augmented reality
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
