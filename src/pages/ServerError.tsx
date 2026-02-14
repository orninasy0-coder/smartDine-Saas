/**
 * ServerError Page (500)
 * Displayed when an internal server error occurs
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerCrash, Home, RefreshCw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ServerErrorProps {
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Error code or reference ID
   */
  errorCode?: string;
  /**
   * Show contact support button
   * @default true
   */
  showContactSupport?: boolean;
}

const ServerError: React.FC<ServerErrorProps> = ({
  message,
  errorCode,
  showContactSupport = true,
}) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-3 bg-destructive/10 rounded-full"
              >
                <ServerCrash className="w-8 h-8 text-destructive" />
              </motion.div>
              <div>
                <CardTitle className="text-3xl font-bold">500</CardTitle>
                <CardDescription className="text-base">Internal Server Error</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {message ||
                "Oops! Something went wrong on our end. We're working to fix the issue. Please try again in a few moments."}
            </p>

            {errorCode && (
              <div className="p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Error Reference</p>
                <code className="text-sm font-mono text-foreground">{errorCode}</code>
              </div>
            )}

            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>What you can do:</strong>
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1 list-disc list-inside">
                <li>Refresh the page</li>
                <li>Try again in a few minutes</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button onClick={handleRefresh} variant="default" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {showContactSupport && (
              <Button
                onClick={handleContactSupport}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Additional Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            If this issue continues, please include the error reference when contacting support.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServerError;
