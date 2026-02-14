/**
 * Cookie Policy Page
 * Displays comprehensive information about cookie usage
 */

import { motion } from 'framer-motion';
import { Cookie, Shield, Info, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { CookieSettings } from '@/components/common/CookieSettings';

export const CookiePolicy: React.FC = () => {

  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Learn about how SmartDine uses cookies to enhance your experience and protect your privacy."
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
                <Cookie className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cookie Policy</h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
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
                  <Info className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">What Are Cookies?</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Cookies are small text files that are placed on your device when you
                    visit our website. They help us provide you with a better experience
                    by remembering your preferences and understanding how you use our
                    service.
                  </p>
                  <p>
                    We use different types of cookies for various purposes, and you have
                    control over which cookies you accept.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Types of Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">Types of Cookies We Use</h2>
                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      1. Necessary Cookies (Always Active)
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      These cookies are essential for the website to function properly.
                      They enable core functionality such as security, network management,
                      and accessibility.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">Examples:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Authentication tokens</li>
                        <li>Session identifiers</li>
                        <li>Security tokens (CSRF protection)</li>
                        <li>Cookie consent preferences</li>
                      </ul>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      2. Analytics Cookies (Optional)
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      These cookies help us understand how visitors interact with our
                      website by collecting and reporting information anonymously. This
                      helps us improve our service.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">Examples:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Google Analytics (_ga, _gid, _gat)</li>
                        <li>PostHog analytics (posthog, ph_*)</li>
                        <li>Page view tracking</li>
                        <li>User behavior analysis</li>
                      </ul>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      3. Marketing Cookies (Optional)
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      These cookies are used to track visitors across websites to display
                      relevant advertisements and measure the effectiveness of marketing
                      campaigns.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">Examples:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Facebook Pixel (_fbp)</li>
                        <li>Google Ads (_gcl_au)</li>
                        <li>Retargeting cookies</li>
                        <li>Conversion tracking</li>
                      </ul>
                    </div>
                  </div>

                  {/* Preference Cookies */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      4. Preference Cookies (Optional)
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      These cookies enable the website to remember your choices (such as
                      language or region) to provide a more personalized experience.
                    </p>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">Examples:</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Language preference</li>
                        <li>Theme selection (dark/light mode)</li>
                        <li>UI preferences</li>
                        <li>Regional settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* How to Manage Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">How to Manage Cookies</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    You have full control over which cookies you accept. You can manage
                    your cookie preferences at any time using the settings below or
                    through your browser settings.
                  </p>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-2 font-medium text-foreground">
                      Browser Cookie Settings:
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>
                        <strong>Chrome:</strong> Settings → Privacy and security → Cookies
                        and other site data
                      </li>
                      <li>
                        <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
                        and Site Data
                      </li>
                      <li>
                        <strong>Safari:</strong> Preferences → Privacy → Manage Website
                        Data
                      </li>
                      <li>
                        <strong>Edge:</strong> Settings → Cookies and site permissions →
                        Cookies and site data
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm">
                    Note: Blocking all cookies may affect your ability to use certain
                    features of our website.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Cookie Settings Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CookieSettings />
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Your Rights</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>Under data protection laws, you have the right to:</p>
                  <ul className="list-inside list-disc space-y-2">
                    <li>Know what cookies are being used and why</li>
                    <li>Accept or reject non-essential cookies</li>
                    <li>Change your cookie preferences at any time</li>
                    <li>Request deletion of your data</li>
                    <li>Access information about how your data is processed</li>
                  </ul>
                  <p>
                    For more information about your privacy rights, please see our{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about our use of cookies or this Cookie
                    Policy, please contact us:
                  </p>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-2">
                      <strong>Email:</strong> privacy@smartdine.com
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

export default CookiePolicy;
