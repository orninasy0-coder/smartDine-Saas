import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface GuideFeedbackProps {
  sectionId: string;
  className?: string;
}

export function GuideFeedback({ sectionId, className }: GuideFeedbackProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
  };

  const handleSubmit = () => {
    // Here you would send the feedback to your backend
    console.log('Feedback submitted:', { sectionId, feedback, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={cn('p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center', className)}>
        <p className="text-green-600 dark:text-green-400 font-medium">
          Thank you! Your feedback helps us improve the guide.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-muted/50 border border-border rounded-lg space-y-4', className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Was this section helpful?</h3>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={feedback === 'helpful' ? 'default' : 'outline'}
            size="lg"
            onClick={() => handleFeedback('helpful')}
            className="gap-2"
          >
            <ThumbsUp className="w-5 h-5" />
            Yes, helpful
          </Button>
          <Button
            variant={feedback === 'not-helpful' ? 'default' : 'outline'}
            size="lg"
            onClick={() => handleFeedback('not-helpful')}
            className="gap-2"
          >
            <ThumbsDown className="w-5 h-5" />
            No, not helpful
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="space-y-3">
          <Textarea
            placeholder="Tell us how we can improve this section... (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmit} className="w-full">
            Submit Feedback
          </Button>
        </div>
      )}
    </div>
  );
}
