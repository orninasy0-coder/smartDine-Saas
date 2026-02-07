import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface GuideProgressProps {
  totalSections: number;
  completedSections: string[];
  currentSection: string;
  className?: string;
}

export function GuideProgress({
  totalSections,
  completedSections,
  currentSection,
  className,
}: GuideProgressProps) {
  const progress = (completedSections.length / totalSections) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Reading Progress</span>
          <span className="text-muted-foreground">
            {completedSections.length} of {totalSections}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>

      {/* Completion Badge */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
        >
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            You've completed reading all sections!
          </span>
        </motion.div>
      )}

      {/* Current Section Indicator */}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="text-xs text-muted-foreground mb-1">Current Section</div>
        <div className="text-sm font-medium text-primary">{currentSection}</div>
      </div>
    </div>
  );
}
