import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  QrCode,
  Brain,
  Sparkles,
  BarChart3,
  Users,
  Truck,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Clock,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Smart QR Menus',
    description: 'Contactless digital menus accessible via QR code scanning. Update in real-time.',
    color: 'text-blue-500',
  },
  {
    icon: Brain,
    title: 'AI Ordering Assistant',
    description: 'Intelligent recommendations and conversational ordering powered by advanced AI.',
    color: 'text-purple-500',
  },
  {
    icon: Sparkles,
    title: 'AR 3D Visualization',
    description: 'Let customers see dishes in 3D before ordering with augmented reality.',
    color: 'text-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights into sales, trends, and customer behavior.',
    color: 'text-green-500',
  },
  {
    icon: Users,
    title: 'Kitchen Dashboard',
    description: 'Real-time order management for kitchen staff with status tracking.',
    color: 'text-orange-500',
  },
  {
    icon: Truck,
    title: 'Delivery Management',
    description: 'Optimize delivery routes and track orders from kitchen to customer.',
    color: 'text-red-500',
  },
  {
    icon: MessageSquare,
    title: 'Customer Feedback',
    description: 'Collect ratings and reviews to improve service quality continuously.',
    color: 'text-cyan-500',
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with GDPR compliance and data encryption.',
    color: 'text-indigo-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with sub-2-second page loads and instant updates.',
    color: 'text-yellow-500',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Support for English and Arabic with RTL layout for seamless localization.',
    color: 'text-teal-500',
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'WebSocket-powered live updates for orders, kitchen, and delivery dashboards.',
    color: 'text-violet-500',
  },
  {
    icon: TrendingUp,
    title: 'Subscription Plans',
    description: 'Flexible pricing tiers from Basic to Enterprise with feature gating.',
    color: 'text-emerald-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function FeaturesGrid() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Run a Modern Restaurant
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed to streamline operations, enhance customer experience, 
            and boost revenue.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                  <CardHeader>
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
