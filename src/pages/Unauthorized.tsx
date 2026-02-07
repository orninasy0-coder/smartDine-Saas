/**
 * Unauthorized Page
 * Displayed when a user tries to access a route they don't have permission for
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">403</h1>
          <h2 className="text-3xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Unauthorized;
