/**
 * Terms Acceptance Demo Page
 * Demonstrates the terms acceptance dialog and version history
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, History, RefreshCw, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';
import { TermsAcceptanceDialog } from '@/components/common/TermsAcceptanceDialog';
import { TermsVersionHistory } from '@/components/common/TermsVersionHistory';
import { useTermsStore } from '@/store/termsStore';
import { Link } from 'react-router-dom';

export const TermsAcceptanceDemo: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { 
    currentVersion, 
    hasAcceptedCurrent, 
    needsAcceptance,
    resetAcceptance,
    getLatestAcceptance 
  } = useTermsStore();

  const latestAcceptance = getLatestAcceptance();

  const handleAccept = () => {
    setShowDialog(false);
  };

  const handleDecline = () => {
    setShowDialog(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all terms acceptance? This will clear your acceptance history.')) {
      resetAcceptance();
    }
  };

  return (
    <>
      <SEO
        title="Terms Acceptance Demo"
        description="Demonstration of the Terms of Service acceptance dialog and version tracking system."
        robots="noindex, nofollow"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b bg-background/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Terms Acceptance Demo</h1>
                  <p className="text-muted-foreground">
                    Test the terms acceptance dialog and version tracking
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Current Status</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="mb-1 text-sm text-muted-foreground">Current Version</p>
                    <p className="text-2xl font-bold">{currentVersion}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="mb-1 text-sm text-muted-foreground">Acceptance Status</p>
                    <p className={`text-2xl font-bold ${hasAcceptedCurrent ? 'text-green-600' : 'text-amber-600'}`}>
                      {hasAcceptedCurrent ? 'Accepted' : 'Pending'}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="mb-1 text-sm text-muted-foreground">Needs Action</p>
                    <p className={`text-2xl font-bold ${needsAcceptance() ? 'text-red-600' : 'text-green-600'}`}>
                      {needsAcceptance() ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {latestAcceptance && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-medium">Latest Acceptance:</p>
                    <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <p>
                        <strong>Version:</strong> {latestAcceptance.version}
                      </p>
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(latestAcceptance.acceptedAt).toLocaleString()}
                      </p>
                      {latestAcceptance.userAgent && (
                        <p className="md:col-span-2">
                          <strong>User Agent:</strong> {latestAcceptance.userAgent}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Test Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowDialog(true)}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Show Acceptance Dialog
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reset Acceptance
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="gap-2"
                  >
                    <Link to="/terms">
                      <FileText className="h-4 w-4" />
                      View Terms Page
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Version History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TermsVersionHistory showAcceptanceStatus={true} />
            </motion.div>

            {/* Compact Version History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <History className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Compact Version History</h2>
                </div>
                <TermsVersionHistory showAcceptanceStatus={true} compact={true} />
              </Card>
            </motion.div>

            {/* Implementation Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Implementation Notes</h2>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Features:</h3>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Version tracking with acceptance history</li>
                      <li>Persistent storage using Zustand with localStorage</li>
                      <li>User agent and timestamp tracking</li>
                      <li>Acceptance dialog with checkbox confirmation</li>
                      <li>Version history display (full and compact modes)</li>
                      <li>Multi-language support (English/Arabic)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Usage:</h3>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Update CURRENT_TERMS_VERSION in termsStore.ts when terms change</li>
                      <li>Add new version to TERMS_VERSION_HISTORY array</li>
                      <li>Dialog will automatically show for users who haven't accepted</li>
                      <li>Use needsAcceptance() to check if user needs to accept</li>
                      <li>Integrate with authentication flow for mandatory acceptance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Files Created:</h3>
                    <ul className="list-inside list-disc space-y-1">
                      <li>src/store/termsStore.ts - State management</li>
                      <li>src/components/common/TermsAcceptanceDialog.tsx - Acceptance UI</li>
                      <li>src/components/common/TermsVersionHistory.tsx - History display</li>
                      <li>src/pages/TermsOfService.tsx - Full terms page</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Terms Acceptance Dialog */}
      <TermsAcceptanceDialog
        open={showDialog}
        onAccept={handleAccept}
        onDecline={handleDecline}
        requireAcceptance={false}
      />
    </>
  );
};

export default TermsAcceptanceDemo;
