/**
 * Terms Version History Component
 * Displays the history of terms versions and user acceptance status
 */

import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useTermsStore,
  getAllTermsVersions,
  type TermsVersion,
} from '@/store/termsStore';
import { Link } from 'react-router-dom';

interface TermsVersionHistoryProps {
  showAcceptanceStatus?: boolean;
  compact?: boolean;
}

export const TermsVersionHistory: React.FC<TermsVersionHistoryProps> = ({
  showAcceptanceStatus = true,
  compact = false,
}) => {
  const { currentVersion, acceptedVersions, hasAcceptedVersion } = useTermsStore();
  const versions = getAllTermsVersions();

  const getAcceptanceDate = (version: string): string | null => {
    const acceptance = acceptedVersions.find((a) => a.version === version);
    return acceptance ? acceptance.acceptedAt : null;
  };

  const isCurrentVersion = (version: string): boolean => {
    return version === currentVersion;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {versions.map((version, index) => {
          const accepted = hasAcceptedVersion(version.version);
          const acceptanceDate = getAcceptanceDate(version.version);
          const isCurrent = isCurrentVersion(version.version);

          return (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Version {version.version}</span>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(version.effectiveDate)}
                  </p>
                </div>
              </div>

              {showAcceptanceStatus && (
                <div className="flex items-center gap-2">
                  {accepted ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs">
                        {acceptanceDate && formatDate(acceptanceDate)}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Not Accepted
                    </Badge>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Terms Version History</h2>
            <p className="text-sm text-muted-foreground">
              Track all versions of our Terms of Service
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/terms">View Current Terms</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {versions.map((version, index) => {
          const accepted = hasAcceptedVersion(version.version);
          const acceptanceDate = getAcceptanceDate(version.version);
          const isCurrent = isCurrentVersion(version.version);

          return (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 ${
                  isCurrent
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        Version {version.version}
                      </h3>
                      {isCurrent && (
                        <Badge variant="default">Current Version</Badge>
                      )}
                      {showAcceptanceStatus && accepted && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-green-500 text-green-600 dark:text-green-400"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Accepted
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Effective: {formatDate(version.effectiveDate)}</span>
                      </div>
                      {showAcceptanceStatus && acceptanceDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Accepted: {formatDate(acceptanceDate)}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="mb-2 font-medium">{version.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {version.summary}
                    </p>
                  </div>

                  {showAcceptanceStatus && !accepted && isCurrent && (
                    <Badge variant="destructive" className="flex-shrink-0">
                      Action Required
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {versions.length === 0 && (
        <div className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No version history available</p>
        </div>
      )}
    </Card>
  );
};

export default TermsVersionHistory;
