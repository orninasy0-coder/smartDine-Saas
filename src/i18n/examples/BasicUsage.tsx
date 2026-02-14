/**
 * i18n Basic Usage Examples
 * 
 * This file demonstrates common patterns for using internationalization
 * in the SmartDine platform.
 */

import { useTranslation, useLanguage } from '../index';
import { LanguageSelector } from '../../components/common';

/**
 * Example 1: Basic Translation
 */
export function BasicTranslationExample() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('menu.title')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
}

/**
 * Example 2: Translation with Interpolation
 */
export function InterpolationExample() {
  const { t } = useTranslation();
  const userName = 'Ahmed';

  return (
    <div>
      <h1>{t('dashboard.welcome', { name: userName })}</h1>
      <p>{t('order.orderNumber', { number: '12345' })}</p>
    </div>
  );
}

/**
 * Example 3: Pluralization
 */
export function PluralizationExample() {
  const { t } = useTranslation();
  const itemCount = 5;

  return (
    <div>
      <p>{t('cart.itemsInCart', { count: 1 })}</p>
      {/* Output: "1 item in cart" */}
      
      <p>{t('cart.itemsInCart', { count: itemCount })}</p>
      {/* Output: "5 items in cart" */}
    </div>
  );
}

/**
 * Example 4: RTL Support
 */
export function RTLExample() {
  const { isRTL } = useTranslation();

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={isRTL ? 'text-right' : 'text-left'}
    >
      <p>This content adapts to language direction</p>
    </div>
  );
}

/**
 * Example 5: Language Switching
 */
export function LanguageSwitchingExample() {
  const { language, changeLanguage } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    await changeLanguage(newLang);
  };

  return (
    <div>
      <p>Current language: {language}</p>
      <button onClick={toggleLanguage}>
        Switch to {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
}

/**
 * Example 6: Using LanguageSelector Component
 */
export function LanguageSelectorExample() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>SmartDine</h1>
      <nav className="flex items-center gap-4">
        <a href="/menu">Menu</a>
        <a href="/orders">Orders</a>
        <LanguageSelector />
      </nav>
    </header>
  );
}

/**
 * Example 7: Conditional Content Based on Language
 */
export function ConditionalContentExample() {
  const { language } = useTranslation();

  return (
    <div>
      {language === 'ar' ? (
        <p>محتوى خاص باللغة العربية</p>
      ) : (
        <p>English-specific content</p>
      )}
    </div>
  );
}

/**
 * Example 8: Using Language Without Translation
 */
export function LanguageOnlyExample() {
  const { language, isRTL } = useLanguage();

  return (
    <div className={`container ${isRTL ? 'rtl' : 'ltr'}`}>
      <p>Current language code: {language}</p>
      <p>Is RTL: {isRTL ? 'Yes' : 'No'}</p>
    </div>
  );
}

/**
 * Example 9: Form with Translated Labels and Errors
 */
export function TranslatedFormExample() {
  const { t } = useTranslation();

  return (
    <form>
      <div>
        <label>{t('auth.email')}</label>
        <input type="email" placeholder={t('auth.email')} />
        <span className="error">{t('errors.invalidEmail')}</span>
      </div>
      
      <div>
        <label>{t('auth.password')}</label>
        <input type="password" placeholder={t('auth.password')} />
        <span className="error">{t('errors.weakPassword')}</span>
      </div>
      
      <button type="submit">{t('auth.signIn')}</button>
    </form>
  );
}

/**
 * Example 10: Menu with Translations
 */
export function TranslatedMenuExample() {
  const { t } = useTranslation();

  const dishes = [
    { id: 1, nameKey: 'Grilled Chicken', price: 25 },
    { id: 2, nameKey: 'Caesar Salad', price: 15 },
  ];

  return (
    <div>
      <h2>{t('menu.title')}</h2>
      <input 
        type="search" 
        placeholder={t('menu.searchDishes')} 
      />
      
      <div className="dishes">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <h3>{dish.nameKey}</h3>
            <p>{t('common.price')}: ${dish.price}</p>
            <button>{t('menu.addToCart')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
