/**
 * NotFound Page (404)
 * Displayed when a user navigates to a non-existent route
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface NotFoundProps {
  /**
   * Custom message to display
   */
  message?: string;
  /**
   * Show search button
   * @default false
   */
  showSearch?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({ message, showSearch = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSearch = () => {
    // Navigate to a search page or open search modal
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="p-3 bg-primary/10 rounded-full"
              >
                <FileQuestion className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <CardTitle className="text-3xl font-bold">404</CardTitle>
                <CardDescription className="text-base">Page Not Found</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {message ||
                "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the home page."}
            </p>

            {location.pathname && (
              <div className="p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Requested Path</p>
                <code className="text-sm font-mono text-foreground break-all">
                  {location.pathname}
                </code>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Suggestions:</strong>
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                <li>Check the URL for typos</li>
                <li>Go back to the previous page</li>
                <li>Visit our home page</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button onClick={handleGoBack} variant="outline" className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={handleGoHome} variant="default" className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {showSearch && (
              <Button onClick={handleSearch} variant="ghost" className="w-full text-muted-foreground">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Animated Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
