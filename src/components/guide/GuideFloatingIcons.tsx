import { motion } from 'framer-motion';
import {
  BookOpen,
  Rocket,
  ShoppingCart,
  Store,
  ChefHat,
  Truck,
  Shield,
  Sparkles,
  QrCode,
  Brain,
  Smartphone,
} from 'lucide-react';

/**
 * Floating Icons Component for User Guide
 * 
 * Displays animated floating icons in the background
 * based on the current section being viewed
 */

interface GuideFloatingIconsProps {
  sectionId: string;
}

export function GuideFloatingIcons({ sectionId }: GuideFloatingIconsProps) {
  // Determine which icons to show based on section
  const getIconsForSection = () => {
    if (sectionId.includes('getting-started')) {
      return [
        { Icon: Rocket, color: 'text-primary', delay: 0 },
        { Icon: BookOpen, color: 'text-secondary', delay: 2 },
        { Icon: Sparkles, color: 'text-primary', delay: 4 },
      ];
    } else if (sectionId.includes('customer-journey')) {
      return [
        { Icon: ShoppingCart, color: 'text-primary', delay: 0 },
        { Icon: QrCode, color: 'text-secondary', delay: 2 },
        { Icon: Smartphone, color: 'text-primary', delay: 4 },
        { Icon: Brain, color: 'text-secondary', delay: 6 },
      ];
    } else if (sectionId.includes('restaurant-owner')) {
      return [
        { Icon: Store, color: 'text-primary', delay: 0 },
        { Icon: Sparkles, color: 'text-secondary', delay: 2 },
        { Icon: BookOpen, color: 'text-primary', delay: 4 },
      ];
    } else if (sectionId.includes('kitchen-staff')) {
      return [
        { Icon: ChefHat, color: 'text-primary', delay: 0 },
        { Icon: Sparkles, color: 'text-secondary', delay: 2 },
      ];
    } else if (sectionId.includes('delivery-personnel')) {
      return [
        { Icon: Truck, color: 'text-primary', delay: 0 },
        { Icon: Sparkles, color: 'text-secondary', delay: 2 },
      ];
    } else if (sectionId.includes('platform-admin')) {
      return [
        { Icon: Shield, color: 'text-primary', delay: 0 },
        { Icon: Sparkles, color: 'text-secondary', delay: 2 },
      ];
    } else {
      return [
        { Icon: BookOpen, color: 'text-primary', delay: 0 },
        { Icon: Sparkles, color: 'text-secondary', delay: 2 },
      ];
    }
  };

  const icons = getIconsForSection();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map((item, index) => {
        const { Icon, color, delay } = item;
        
        // Random positions
        const positions = [
          { top: '10%', left: '10%' },
          { top: '20%', right: '15%' },
          { bottom: '15%', left: '20%' },
          { bottom: '25%', right: '10%' },
          { top: '50%', left: '5%' },
          { top: '60%', right: '8%' },
        ];

        const position = positions[index % positions.length];

        return (
          <motion.div
            key={`${sectionId}-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              delay: delay,
              ease: 'linear',
            }}
            className="absolute"
            style={position}
          >
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center ${color} opacity-20`}>
              <Icon className="w-12 h-12" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
