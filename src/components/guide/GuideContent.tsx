import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export interface GuideContentSection {
  id: string;
  title: string;
  content: React.ReactNode;
  image?: string;
  steps?: {
    title: string;
    description: string;
    image?: string;
  }[];
}

interface GuideContentProps {
  section: GuideContentSection;
  className?: string;
}

export function GuideContent({ section, className }: GuideContentProps) {
  return (
    <motion.div
      key={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-8', className)}
    >
      {/* Section Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
        {section.image && (
          <div className="mt-6 rounded-lg overflow-hidden border border-border">
            <img
              src={section.image}
              alt={section.title}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {section.content}
      </div>

      {/* Steps (if any) */}
      {section.steps && section.steps.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Steps</h2>
          <div className="space-y-6">
            {section.steps.map((step, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    {step.image && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-border">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
