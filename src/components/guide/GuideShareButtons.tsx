import { Share2, Printer, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface GuideShareButtonsProps {
  sectionTitle: string;
  className?: string;
}

export function GuideShareButtons({ sectionTitle, className }: GuideShareButtonsProps) {
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SmartDine Guide - ${sectionTitle}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        <LinkIcon className="w-4 h-4" />
        Copy Link
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-2"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
    </div>
  );
}
