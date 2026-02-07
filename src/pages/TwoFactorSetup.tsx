import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Copy, Check, ArrowLeft, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema for 2FA code
const twoFactorSchema = z.object({
  code: z
    .string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export default function TwoFactorSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  // Mock data - in production, this would come from the backend
  const [qrCodeUrl] = useState(
    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SmartDine:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SmartDine'
  );
  const [secretKey] = useState('JBSWY3DPEHPK3PXP');

  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const onSubmit = async (data: TwoFactorFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await authService.verify2FA(data.code);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation - in production, validate with backend
      if (data.code === '123456') {
        setSetupComplete(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error('2FA verification failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              2FA Enabled Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your account is now protected with two-factor authentication.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Enable Two-Factor Authentication
            </h1>
            <p className="text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Setup Instructions */}
          <div className="space-y-6">
            {/* Step 1: Download App */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Download an Authenticator App
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Install an authenticator app on your mobile device. We recommend:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm">
                      <Smartphone className="w-3 h-3" />
                      Google Authenticator
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm">
                      <Smartphone className="w-3 h-3" />
                      Microsoft Authenticator
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm">
                      <Smartphone className="w-3 h-3" />
                      Authy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Scan QR Code */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Scan the QR Code
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Open your authenticator app and scan this QR code:
                  </p>
                  
                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-border">
                      <img
                        src={qrCodeUrl}
                        alt="2FA QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  </div>

                  {/* Manual Entry Option */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Can't scan the code? Enter this key manually:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-background px-3 py-2 rounded border border-border text-sm font-mono">
                        {secretKey}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopySecret}
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Verify Code */}
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">
                    Verify Your Setup
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the 6-digit code from your authenticator app:
                  </p>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                className="text-center text-2xl tracking-widest font-mono"
                                disabled={isLoading}
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the 6-digit code from your authenticator app
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                            />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Enable 2FA
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>Important:</strong> Keep your authenticator app secure. You'll need it
              to sign in to your account. If you lose access to your device, contact support
              for account recovery.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
