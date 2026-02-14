/**
 * Error Pages Demo
 * Demonstrates all error page components
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common';
import { AlertTriangle, FileQuestion, ServerCrash, ShieldAlert } from 'lucide-react';

const ErrorPagesDemo = () => {
  const navigate = useNavigate();
  const [selectedError, setSelectedError] = useState<string | null>(null);

  const errorTypes = [
    {
      code: '404',
      title: 'Not Found',
      description: 'Page does not exist',
      icon: FileQuestion,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      route: '/non-existent-page',
    },
    {
      code: '500',
      title: 'Server Error',
      description: 'Internal server error',
      icon: ServerCrash,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/10',
      route: '/server-error',
    },
    {
      code: '403',
      title: 'Unauthorized',
      description: 'Access denied',
      icon: ShieldAlert,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/10',
      route: '/unauthorized',
    },
  ];

  const handleNavigateToError = (route: string, code: string) => {
    setSelectedError(code);
    setTimeout(() => {
      navigate(route);
    }, 300);
  };

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Error Pages Demo</h1>
          <p className="text-muted-foreground text-lg">
            Click on any error type below to see the corresponding error page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {errorTypes.map((error) => {
            const Icon = error.icon;
            return (
              <Card
                key={error.code}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedError === error.code ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleNavigateToError(error.route, error.code)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${error.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${error.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{error.code}</CardTitle>
                  <CardDescription className="text-base">{error.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{error.description}</p>
                  <Button variant="outline" className="w-full">
                    View Error Page
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Implementation Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">404 - Not Found</h3>
              <p className="text-sm text-muted-foreground">
                Automatically shown for any non-existent routes. Includes the requested path and
                suggestions for the user.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">500 - Server Error</h3>
              <p className="text-sm text-muted-foreground">
                Can be navigated to programmatically when API errors occur. Supports error codes
                for support reference.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">403 - Unauthorized</h3>
              <p className="text-sm text-muted-foreground">
                Shown when users try to access protected routes without proper permissions.
              </p>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Responsive design with gradient backgrounds</li>
                <li>Smooth animations with Framer Motion</li>
                <li>Dark mode support</li>
                <li>Accessible with keyboard navigation</li>
                <li>Clear action buttons for user guidance</li>
                <li>Customizable messages and error codes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ErrorPagesDemo;
