import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { useUIStore } from '../store/uiStore';
import { useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for translations with Zustand integration
 * 
 * This hook wraps react-i18next's useTranslation and syncs with our UI store
 * to ensure language changes are reflected across the application.
 * Language preferences are persisted to localStorage.
 */
export function useTranslation(namespace?: string) {
  const { t, i18n } = useI18nextTranslation(namespace);
  const { language, setLanguage } = useUIStore();

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as 'en' | 'ar' | null;
    if (savedLanguage && savedLanguage !== language) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []); // Only run on mount

  // Sync i18n language with UI store
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Sync UI store with i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (lng !== language) {
        setLanguage(lng as 'en' | 'ar');
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, language, setLanguage]);

  /**
   * Change the current language and persist to localStorage
   */
  const changeLanguage = async (lng: 'en' | 'ar') => {
    await i18n.changeLanguage(lng);
    setLanguage(lng);
    
    // Persist language preference to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lng);
    
    // Update document direction for RTL support
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return {
    t,
    i18n,
    language: i18n.language as 'en' | 'ar',
    changeLanguage,
    isRTL: i18n.language === 'ar',
  };
}

/**
 * Hook to get the current language without translation function
 */
export function useLanguage() {
  const { language } = useUIStore();
  const isRTL = language === 'ar';

  return {
    language,
    isRTL,
  };
}
