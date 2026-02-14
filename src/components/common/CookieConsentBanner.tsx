/**
 * Cookie Consent Banner Component
 * Displays a banner for cookie consent with customizable options
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCookieConsentStore } from '@/store/cookieConsentStore';
import { useTranslation } from '@/i18n/useTranslation';
import { Link } from 'react-router-dom';

export const CookieConsentBanner: React.FC = () => {
  const { t } = useTranslation();
  const {
    hasConsented,
    bannerDismissed,
    consent,
    acceptAll,
    rejectAll,
    setConsent,
  } = useCookieConsentStore();

  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(consent);

  // Don't show banner if user has already consented or dismissed
  const shouldShow = !hasConsented && !bannerDismissed;

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const handleSavePreferences = () => {
    setConsent(preferences);
    setShowSettings(false);
  };

  const handleTogglePreference = (category: keyof typeof preferences) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <Card className="mx-auto max-w-6xl border-2 bg-background/95 p-6 shadow-2xl backdrop-blur-sm">
            {!showSettings ? (
              // Simple Banner View
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <Cookie className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">
                      {t('cookies.banner.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('cookies.banner.description')}{' '}
                      <Link
                        to="/cookie-policy"
                        className="text-primary underline hover:text-primary/80"
                      >
                        {t('cookies.banner.learnMore')}
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    {t('cookies.banner.customize')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                  >
                    {t('cookies.banner.rejectAll')}
                  </Button>
                  <Button size="sm" onClick={handleAcceptAll}>
                    {t('cookies.banner.acceptAll')}
                  </Button>
                </div>
              </div>
            ) : (
              // Settings View
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cookie className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {t('cookies.settings.title')}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t('cookies.settings.description')}
                </p>

                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <Label className="text-base font-medium">
                        {t('cookies.categories.necessary.title')}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('cookies.categories.necessary.description')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked disabled />
                      <span className="text-xs text-muted-foreground">
                        {t('cookies.alwaysActive')}
                      </span>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="analytics"
                        className="cursor-pointer text-base font-medium"
                      >
                        {t('cookies.categories.analytics.title')}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('cookies.categories.analytics.description')}
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={preferences.analytics}
                      onCheckedChange={() => handleTogglePreference('analytics')}
                    />
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="marketing"
                        className="cursor-pointer text-base font-medium"
                      >
                        {t('cookies.categories.marketing.title')}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('cookies.categories.marketing.description')}
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={preferences.marketing}
                      onCheckedChange={() => handleTogglePreference('marketing')}
                    />
                  </div>

                  {/* Preferences Cookies */}
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="preferences"
                        className="cursor-pointer text-base font-medium"
                      >
                        {t('cookies.categories.preferences.title')}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('cookies.categories.preferences.description')}
                      </p>
                    </div>
                    <Switch
                      id="preferences"
                      checked={preferences.preferences}
                      onCheckedChange={() =>
                        handleTogglePreference('preferences')
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                  >
                    {t('cookies.banner.rejectAll')}
                  </Button>
                  <Button onClick={handleSavePreferences}>
                    {t('cookies.settings.savePreferences')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
