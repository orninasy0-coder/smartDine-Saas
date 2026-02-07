import { useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingShapes } from '@/components/common';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Bot, 
  Box, 
  BarChart3, 
  ChefHat, 
  Truck,
  Star,
  Smartphone,
  Globe,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

/**
 * Demo Page Component
 * 
 * Interactive demonstration of SmartDine platform features.
 * Showcases key capabilities with visual examples and interactive elements.
 */
export default function Demo() {
  const [activeFeature, setActiveFeature] = useState('qr-menu');

  const features = [
    {
      id: 'qr-menu',
      icon: QrCode,
      title: 'Smart QR Menu',
      description: 'Digital menu accessible via QR code scan',
      demo: 'Interactive menu browsing with real-time updates'
    },
    {
      id: 'ai-assistant',
      icon: Bot,
      title: 'AI Assistant',
      description: 'Intelligent ordering recommendations',
      demo: 'Chat-based ordering with personalized suggestions'
    },
    {
      id: 'ar-viewer',
      icon: Box,
      title: '3D AR Viewer',
      description: 'View dishes in augmented reality',
      demo: '360° 3D models of menu items'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time business insights',
      demo: 'Revenue tracking and performance metrics'
    },
    {
      id: 'kitchen',
      icon: ChefHat,
      title: 'Kitchen Dashboard',
      description: 'Streamlined order management',
      demo: 'Real-time order queue and status updates'
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Delivery Tracking',
      description: 'Live delivery monitoring',
      demo: 'Route optimization and ETA tracking'
    }
  ];

  const stats = [
    { label: 'Active Restaurants', value: '500+', icon: Star },
    { label: 'Daily Orders', value: '10K+', icon: TrendingUp },
    { label: 'Customer Satisfaction', value: '4.9/5', icon: Star },
    { label: 'Countries', value: '15+', icon: Globe }
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating Shapes Background */}
      <FloatingShapes count={5} />

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
                Experience
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SmartDine in Action
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our interactive demo to see how SmartDine transforms restaurant operations
                with cutting-edge technology and intuitive design.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
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
                Interactive Feature Demos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Click on any feature below to see it in action
              </p>
            </motion.div>

            <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
                {features.map((feature) => (
                  <TabsTrigger key={feature.id} value={feature.id} className="flex flex-col gap-1 py-3">
                    <feature.icon className="w-5 h-5" />
                    <span className="text-xs hidden md:inline">{feature.title.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {features.map((feature) => (
                <TabsContent key={feature.id} value={feature.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-background rounded-lg">
                            <feature.icon className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{feature.title}</CardTitle>
                            <CardDescription className="text-base">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Demo Preview */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Live Demo</h3>
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-border">
                              <div className="text-center space-y-2">
                                <feature.icon className="w-16 h-16 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{feature.demo}</p>
                              </div>
                            </div>
                            <Button className="w-full" size="lg">
                              Try Interactive Demo
                            </Button>
                          </div>

                          {/* Feature Details */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Key Features</h3>
                            <ul className="space-y-3">
                              {getFeatureDetails(feature.id).map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powered by industry-leading tools and frameworks
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Smartphone className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Mobile-First Design</CardTitle>
                  <CardDescription>
                    Responsive and optimized for all devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Progressive Web App (PWA)</li>
                    <li>• Touch-optimized interface</li>
                    <li>• Offline functionality</li>
                    <li>• Fast loading times</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Enterprise Security</CardTitle>
                  <CardDescription>
                    Bank-level security and compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• End-to-end encryption</li>
                    <li>• GDPR compliant</li>
                    <li>• Two-factor authentication</li>
                    <li>• Regular security audits</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Optimized performance for seamless experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Sub-second page loads</li>
                    <li>• Real-time updates</li>
                    <li>• CDN-powered delivery</li>
                    <li>• Smart caching</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of restaurants already using SmartDine to enhance their operations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Schedule a Demo Call
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Helper function to get feature-specific details
function getFeatureDetails(featureId: string): string[] {
  const details: Record<string, string[]> = {
    'qr-menu': [
      'Instant menu access via QR code scan',
      'Real-time menu updates and availability',
      'Multi-language support (English/Arabic)',
      'High-quality dish images and descriptions',
      'Allergen and dietary information',
      'Category filtering and search'
    ],
    'ai-assistant': [
      'Natural language order processing',
      'Personalized dish recommendations',
      'Dietary preference understanding',
      'Order history-based suggestions',
      'Multi-turn conversation support',
      'Context-aware responses'
    ],
    'ar-viewer': [
      '360° 3D dish visualization',
      'Realistic portion size preview',
      'Interactive model rotation',
      'Zoom and pan controls',
      'Cross-device compatibility',
      'Fallback for unsupported devices'
    ],
    'analytics': [
      'Real-time revenue tracking',
      'Order volume analytics',
      'Popular dishes insights',
      'Peak hours identification',
      'Customer behavior patterns',
      'Exportable reports'
    ],
    'kitchen': [
      'Live order queue management',
      'Order status tracking',
      'Preparation time estimates',
      'Priority order highlighting',
      'Real-time notifications',
      'Order history access'
    ],
    'delivery': [
      'Live delivery tracking',
      'Route optimization',
      'ETA calculations',
      'Driver assignment',
      'Delivery status updates',
      'Customer notifications'
    ]
  };

  return details[featureId] || [];
}
