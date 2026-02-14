/**
 * Terms Acceptance Dialog Component
 * Displays a modal requiring users to accept updated terms
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTermsStore, getTermsVersion } from '@/store/termsStore';
import { Link } from 'react-router-dom';

interface TermsAcceptanceDialogProps {
  open: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  requireAcceptance?: boolean;
}

export const TermsAcceptanceDialog: React.FC<TermsAcceptanceDialogProps> = ({
  open,
  onAccept,
  onDecline,
  requireAcceptance = true,
}) => {
  const { currentVersion, acceptTerms, getLatestAcceptance } = useTermsStore();
  const [hasRead, setHasRead] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const currentTerms = getTermsVersion(currentVersion);
  const latestAcceptance = getLatestAcceptance();

  const handleAccept = async () => {
    setIsAccepting(true);
    
    // Accept the terms
    acceptTerms(currentVersion);
    
    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsAccepting(false);
    onAccept?.();
  };

  const handleDecline = () => {
    if (!requireAcceptance) {
      onDecline?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={requireAcceptance ? undefined : () => onDecline?.()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Updated Terms of Service
              </DialogTitle>
              <DialogDescription>
                Version {currentVersion} • Effective {currentTerms?.effectiveDate}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Update Notice */}
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <div className="flex-1">
                <h4 className="mb-1 font-semibold text-amber-900 dark:text-amber-100">
                  Terms Have Been Updated
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {currentTerms?.summary || 'We have updated our Terms of Service. Please review and accept the new terms to continue using SmartDine.'}
                </p>
                {latestAcceptance && (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                    You previously accepted version {latestAcceptance.version} on{' '}
                    {new Date(latestAcceptance.acceptedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Terms Summary */}
          <ScrollArea className="h-[300px] rounded-lg border p-4">
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="mb-2 font-semibold">Key Changes in Version {currentVersion}:</h3>
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  <li>Updated data processing and privacy policies</li>
                  <li>Clarified user responsibilities and acceptable use</li>
                  <li>Enhanced security and compliance measures</li>
                  <li>Updated payment and subscription terms</li>
                  <li>Improved dispute resolution procedures</li>
                </ul>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">
                  This is a summary of the key changes. Please read the full{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Privacy Policy
                  </Link>{' '}
                  for complete details.
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Acceptance Checkbox */}
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id="terms-acceptance"
              checked={hasRead}
              onCheckedChange={(checked) => setHasRead(checked === true)}
            />
            <Label
              htmlFor="terms-acceptance"
              className="cursor-pointer text-sm leading-relaxed"
            >
              I have read and agree to the updated{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-primary underline hover:text-primary/80"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                target="_blank"
                className="text-primary underline hover:text-primary/80"
              >
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {!requireAcceptance && (
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={isAccepting}
            >
              Decline
            </Button>
          )}
          <Button
            onClick={handleAccept}
            disabled={!hasRead || isAccepting}
            className="gap-2"
          >
            <AnimatePresence mode="wait">
              {isAccepting ? (
                <motion.div
                  key="accepting"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </motion.div>
              ) : (
                <motion.div
                  key="accept"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            {isAccepting ? 'Accepting...' : 'Accept and Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAcceptanceDialog;
