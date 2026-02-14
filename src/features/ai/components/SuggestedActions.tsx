/**
 * SuggestedActions Component
 * Quick action buttons for common AI assistant queries
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Flame, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SuggestedAction {
  id: string;
  label: string;
  query: string;
  icon?: React.ReactNode;
}

interface SuggestedActionsProps {
  onActionClick: (query: string) => void;
  isLoading?: boolean;
  customActions?: SuggestedAction[];
}

const defaultActions: SuggestedAction[] = [
  {
    id: 'recommendations',
    label: 'الأطباق المقترحة',
    query: 'ما هي الأطباق المقترحة اليوم؟',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'vegetarian',
    label: 'أطباق نباتية',
    query: 'ما هي الأطباق النباتية المتوفرة؟',
    icon: <Leaf className="w-4 h-4" />,
  },
  {
    id: 'spicy',
    label: 'أطباق حارة',
    query: 'أريد طبقاً حاراً',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: 'popular',
    label: 'الأكثر طلباً',
    query: 'ما هي الأطباق الأكثر طلباً؟',
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: 'quick',
    label: 'وجبات سريعة',
    query: 'أريد وجبة سريعة التحضير',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: 'budget',
    label: 'خيارات اقتصادية',
    query: 'ما هي الخيارات الاقتصادية المتوفرة؟',
    icon: <DollarSign className="w-4 h-4" />,
  },
];

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({
  onActionClick,
  isLoading = false,
  customActions,
}) => {
  const actions = customActions || defaultActions;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-2"
    >
      {actions.map((action) => (
        <motion.div key={action.id} variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
            onClick={() => onActionClick(action.query)}
            disabled={isLoading}
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};
