/**
 * ErrorPage - Generic error page component
 * Can be used for various error types (404, 500, 403, etc.)
 */

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface ErrorPageAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  icon?: LucideIcon;
}

export interface ErrorPageProps {
  /**
   * Error code (e.g., 404, 500, 403)
   */
  code: string | number;
  /**
   * Error title
   */
  title: string;
  /**
   * Error description/message
   */
  description: string;
  /**
   * Icon to display
   */
  icon: LucideIcon;
  /**
   * Icon color class
   */
  iconColor?: string;
  /**
   * Background gradient colors
   */
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  /**
   * Additional details to show
   */
  details?: React.ReactNode;
  /**
   * Actions/buttons to display
   */
  actions?: ErrorPageAction[];
  /**
   * Additional help text
   */
  helpText?: string;
  /**
   * Show animated background
   * @default false
   */
  showAnimatedBackground?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  title,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  gradientFrom = 'from-blue-50',
  gradientVia = 'via-purple-50',
  gradientTo = 'to-pink-50',
  details,
  actions = [],
  helpText,
  showAnimatedBackground = false,
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4 relative`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`p-3 ${iconColor.replace('text-', 'bg-')}/10 rounded-full`}
              >
                <Icon className={`w-8 h-8 ${iconColor}`} />
              </motion.div>
              <div>
                <CardTitle className="text-3xl font-bold">{code}</CardTitle>
                <CardDescription className="text-base">{title}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{description}</p>

            {details && <div className="mt-4">{details}</div>}
          </CardContent>

          {actions.length > 0 && (
            <CardFooter className="flex flex-col gap-2">
              {actions.length <= 2 ? (
                <div className="flex gap-2 w-full">
                  {actions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={index}
                        onClick={action.onClick}
                        variant={action.variant || 'default'}
                        className="flex-1"
                      >
                        {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="flex gap-2 w-full">
                    {actions.slice(0, 2).map((action, index) => {
                      const ActionIcon = action.icon;
                      return (
                        <Button
                          key={index}
                          onClick={action.onClick}
                          variant={action.variant || 'default'}
                          className="flex-1"
                        >
                          {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                  {actions.slice(2).map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={index + 2}
                        onClick={action.onClick}
                        variant={action.variant || 'ghost'}
                        className="w-full"
                      >
                        {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                        {action.label}
                      </Button>
                    );
                  })}
                </>
              )}
            </CardFooter>
          )}
        </Card>

        {helpText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">{helpText}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Animated Background Elements */}
      {showAnimatedBackground && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>
      )}
    </div>
  );
};
