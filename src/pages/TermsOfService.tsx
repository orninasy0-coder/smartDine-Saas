/**
 * Terms of Service Page
 * Displays comprehensive terms of service with version tracking
 */

import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, Scale } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { TermsVersionHistory } from '@/components/common/TermsVersionHistory';
import { useTermsStore } from '@/store/termsStore';

export const TermsOfService: React.FC = () => {
  const { currentVersion } = useTermsStore();

  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read SmartDine's Terms of Service to understand your rights and responsibilities when using our platform."
        robots="index, follow"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b bg-background/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <p className="text-muted-foreground">
                  Version {currentVersion} • Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Introduction</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Welcome to SmartDine. These Terms of Service ("Terms") govern your
                    access to and use of the SmartDine platform, including our website,
                    mobile applications, and related services (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using our Service, you agree to be bound by these Terms.
                    If you do not agree to these Terms, please do not use our Service.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Acceptance of Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    By creating an account or using SmartDine, you acknowledge that you have
                    read, understood, and agree to be bound by these Terms and our Privacy
                    Policy.
                  </p>
                  <p>
                    We may update these Terms from time to time. When we do, we will notify
                    you and require your acceptance of the updated Terms before you can
                    continue using the Service.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Service Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">2. Service Description</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    SmartDine is a SaaS platform that provides restaurants with digital menu
                    solutions, including:
                  </p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>QR code-based digital menus</li>
                    <li>AI-powered customer assistance</li>
                    <li>Augmented Reality (AR) dish visualization</li>
                    <li>Order management and tracking</li>
                    <li>Analytics and reporting tools</li>
                    <li>Multi-language support</li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* User Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">3. User Accounts</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="font-semibold text-foreground">3.1 Account Creation</h3>
                  <p>
                    To use certain features of the Service, you must create an account. You
                    agree to provide accurate, current, and complete information during
                    registration and to update such information to keep it accurate.
                  </p>
                  <h3 className="font-semibold text-foreground">3.2 Account Security</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account
                    credentials and for all activities that occur under your account. You
                    must notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Subscription and Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">
                  4. Subscription and Payment
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="font-semibold text-foreground">4.1 Subscription Plans</h3>
                  <p>
                    SmartDine offers various subscription plans (Basic, Pro, Enterprise).
                    Features and pricing are detailed on our{' '}
                    <Link to="/pricing" className="text-primary hover:underline">
                      Pricing Page
                    </Link>
                    .
                  </p>
                  <h3 className="font-semibold text-foreground">4.2 Payment Terms</h3>
                  <p>
                    Subscriptions are billed in advance on a monthly or annual basis. All
                    fees are non-refundable except as required by law or as explicitly
                    stated in these Terms.
                  </p>
                  <h3 className="font-semibold text-foreground">4.3 Cancellation</h3>
                  <p>
                    You may cancel your subscription at any time. Cancellation will take
                    effect at the end of your current billing period.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Acceptable Use */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">5. Acceptable Use</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You agree not to:</p>
                  <ul className="list-inside list-disc space-y-2 pl-4">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Upload malicious code or viruses</li>
                    <li>Attempt to gain unauthorized access to the Service</li>
                    <li>Use the Service for fraudulent purposes</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Scrape or collect data without permission</li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Service and its original content, features, and functionality are
                    owned by SmartDine and are protected by international copyright,
                    trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    You retain ownership of content you upload to the Service. By uploading
                    content, you grant SmartDine a worldwide, non-exclusive license to use,
                    reproduce, and display such content as necessary to provide the Service.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    To the maximum extent permitted by law, SmartDine shall not be liable
                    for any indirect, incidental, special, consequential, or punitive
                    damages, or any loss of profits or revenues, whether incurred directly
                    or indirectly.
                  </p>
                  <p>
                    Our total liability for any claims arising from or related to the
                    Service shall not exceed the amount you paid to SmartDine in the 12
                    months preceding the claim.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Termination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">8. Termination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may terminate or suspend your account and access to the Service
                    immediately, without prior notice, for any reason, including if you
                    breach these Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will immediately cease.
                    All provisions of these Terms that by their nature should survive
                    termination shall survive.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Version History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <TermsVersionHistory showAcceptanceStatus={true} />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about these Terms of Service, please contact
                    us:
                  </p>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-2">
                      <strong>Email:</strong> legal@smartdine.com
                    </p>
                    <p className="mb-2">
                      <strong>Address:</strong> SmartDine SaaS Platform, 123 Tech Street,
                      San Francisco, CA 94105
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to="/contact">Contact Support</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/">Back to Home</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
