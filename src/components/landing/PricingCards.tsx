import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: typeof Sparkles;
  iconColor: string;
  popular?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Basic',
    price: '$29',
    period: '/month',
    description: 'Perfect for small restaurants getting started with digital ordering',
    icon: Zap,
    iconColor: 'text-blue-500',
    features: [
      'Smart QR Menu System',
      'Digital Ordering',
      'Basic Order Management',
      'Kitchen Dashboard',
      'Up to 50 menu items',
      'Email Support',
      'Mobile Responsive',
      'Basic Analytics',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'Advanced features for growing restaurants with AI assistance',
    icon: Sparkles,
    iconColor: 'text-purple-500',
    popular: true,
    features: [
      'Everything in Basic',
      'AI Ordering Assistant',
      'Advanced Analytics Dashboard',
      'Customer Feedback System',
      'Delivery Management',
      'Unlimited Menu Items',
      'Priority Email Support',
      'Custom Branding',
      'Multi-language Support',
      'Real-time Notifications',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'Complete solution with AR visualization and premium support',
    icon: Crown,
    iconColor: 'text-amber-500',
    features: [
      'Everything in Pro',
      'AR 3D Menu Visualization',
      'Dedicated Account Manager',
      '24/7 Priority Support',
      'Custom Integrations',
      'Advanced Security Features',
      'White-label Options',
      'API Access',
      'Staff Training Sessions',
      'Custom Analytics Reports',
      'Multi-location Support',
    ],
    cta: 'Contact Sales',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export function PricingCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
    >
      {plans.map((plan) => {
        const Icon = plan.icon;
        return (
          <motion.div
            key={plan.name}
            variants={cardVariants}
            className={`relative ${plan.popular ? 'lg:-mt-4' : ''}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              </div>
            )}

            <Card
              className={`h-full flex flex-col ${
                plan.popular
                  ? 'border-primary shadow-xl scale-105'
                  : 'hover:shadow-lg transition-shadow duration-300'
              }`}
            >
              <CardHeader className="text-center pb-8">
                {/* Icon */}
                <div className="mx-auto mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className={`w-8 h-8 ${plan.iconColor}`} />
                  </div>
                </div>

                {/* Plan Name */}
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-lg">{plan.period}</span>
                </div>

                {/* Description */}
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
