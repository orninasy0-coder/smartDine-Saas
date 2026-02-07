import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { guideSections } from './GuideSidebar';

interface GuideTableOfContentsProps {
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

export function GuideTableOfContents({ onSectionClick, className }: GuideTableOfContentsProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h2 className="text-3xl font-bold mb-2">Table of Contents</h2>
        <p className="text-muted-foreground">
          Comprehensive guide to using the SmartDine platform with all its features
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {guideSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSectionClick(section.id)}
              className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  {section.subsections && (
                    <p className="text-sm text-muted-foreground">
                      {section.subsections.length} topics
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
