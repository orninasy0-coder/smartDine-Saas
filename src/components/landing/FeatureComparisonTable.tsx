import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Feature {
  category: string;
  items: {
    name: string;
    basic: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
  }[];
}

const features: Feature[] = [
  {
    category: 'Core Features',
    items: [
      {
        name: 'Smart QR Menu System',
        basic: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Digital Ordering',
        basic: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Kitchen Dashboard',
        basic: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Order Management',
        basic: 'Basic',
        pro: 'Advanced',
        enterprise: 'Advanced',
      },
      {
        name: 'Menu Items',
        basic: 'Up to 50',
        pro: 'Unlimited',
        enterprise: 'Unlimited',
      },
      {
        name: 'Mobile Responsive',
        basic: true,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: 'AI & Advanced Features',
    items: [
      {
        name: 'AI Ordering Assistant',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'AI Recommendations',
        basic: false,
        pro: '1000/day',
        enterprise: 'Unlimited',
      },
      {
        name: 'AR 3D Menu Visualization',
        basic: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Custom AI Training',
        basic: false,
        pro: false,
        enterprise: true,
      },
    ],
  },
  {
    category: 'Analytics & Insights',
    items: [
      {
        name: 'Basic Analytics',
        basic: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Advanced Analytics Dashboard',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'AI-Powered Insights',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Custom Reports',
        basic: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Data Export',
        basic: false,
        pro: 'CSV',
        enterprise: 'CSV, Excel, API',
      },
    ],
  },
  {
    category: 'Customer Experience',
    items: [
      {
        name: 'Customer Feedback System',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Delivery Management',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Real-time Notifications',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Multi-language Support',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Custom Branding',
        basic: false,
        pro: true,
        enterprise: true,
      },
      {
        name: 'White-label Options',
        basic: false,
        pro: false,
        enterprise: true,
      },
    ],
  },
  {
    category: 'Support & Integration',
    items: [
      {
        name: 'Email Support',
        basic: 'Standard',
        pro: 'Priority',
        enterprise: '24/7 Priority',
      },
      {
        name: 'Dedicated Account Manager',
        basic: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Staff Training',
        basic: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'API Access',
        basic: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Custom Integrations',
        basic: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Multi-location Support',
        basic: false,
        pro: false,
        enterprise: true,
      },
    ],
  },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-primary mx-auto" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
}

export function FeatureComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-x-auto"
    >
      <div className="min-w-[800px] bg-card border border-border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-muted/50 border-b border-border">
          <div className="font-semibold text-lg">Features</div>
          <div className="text-center">
            <div className="font-semibold text-lg">Basic</div>
            <div className="text-sm text-muted-foreground mt-1">$29/month</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">Pro</div>
            <div className="text-sm text-muted-foreground mt-1">$79/month</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">Enterprise</div>
            <div className="text-sm text-muted-foreground mt-1">$199/month</div>
          </div>
        </div>

        {/* Feature Categories */}
        {features.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            {/* Category Header */}
            <div className="px-6 py-4 bg-muted/30 border-b border-border">
              <h3 className="font-semibold text-base">{category.category}</h3>
            </div>

            {/* Category Items */}
            {category.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="grid grid-cols-4 gap-4 p-6 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-center flex items-center justify-center">
                  <FeatureCell value={item.basic} />
                </div>
                <div className="text-center flex items-center justify-center">
                  <FeatureCell value={item.pro} />
                </div>
                <div className="text-center flex items-center justify-center">
                  <FeatureCell value={item.enterprise} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Note */}
      <p className="text-sm text-muted-foreground text-center mt-4">
        Scroll horizontally to see all features on mobile devices
      </p>
    </motion.div>
  );
}
