/**
 * Cookie Settings Component
 * Allows users to manage their cookie preferences from settings page
 */

import { useState } from 'react';
import { Cookie, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCookieConsentStore } from '@/store/cookieConsentStore';
import { useTranslation } from '@/i18n/useTranslation';
import { toast } from 'sonner';

export const CookieSettings: React.FC = () => {
  const { t } = useTranslation();
  const { consent, setConsent, consentDate } = useCookieConsentStore();
  const [preferences, setPreferences] = useState(consent);

  const handleTogglePreference = (category: keyof typeof preferences) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    setConsent(preferences);
    toast.success(t('success.settingsSaved'));
  };

  const handleReset = () => {
    setPreferences(consent);
  };

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(consent);

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Cookie className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">{t('cookies.settings.title')}</h2>
          {consentDate && (
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(consentDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {t('cookies.settings.description')}
      </p>

      <div className="space-y-4">
        {/* Necessary Cookies */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Label className="text-base font-medium">
                  {t('cookies.categories.necessary.title')}
                </Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
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
        </div>

        {/* Analytics Cookies */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Label
                  htmlFor="analytics-setting"
                  className="cursor-pointer text-base font-medium"
                >
                  {t('cookies.categories.analytics.title')}
                </Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('cookies.categories.analytics.description')}
              </p>
            </div>
            <Switch
              id="analytics-setting"
              checked={preferences.analytics}
              onCheckedChange={() => handleTogglePreference('analytics')}
            />
          </div>
        </div>

        {/* Marketing Cookies */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Label
                  htmlFor="marketing-setting"
                  className="cursor-pointer text-base font-medium"
                >
                  {t('cookies.categories.marketing.title')}
                </Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('cookies.categories.marketing.description')}
              </p>
            </div>
            <Switch
              id="marketing-setting"
              checked={preferences.marketing}
              onCheckedChange={() => handleTogglePreference('marketing')}
            />
          </div>
        </div>

        {/* Preferences Cookies */}
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Label
                  htmlFor="preferences-setting"
                  className="cursor-pointer text-base font-medium"
                >
                  {t('cookies.categories.preferences.title')}
                </Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('cookies.categories.preferences.description')}
              </p>
            </div>
            <Switch
              id="preferences-setting"
              checked={preferences.preferences}
              onCheckedChange={() => handleTogglePreference('preferences')}
            />
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            {t('common.reset')}
          </Button>
          <Button onClick={handleSave}>{t('common.save')}</Button>
        </div>
      )}
    </Card>
  );
};

export default CookieSettings;
