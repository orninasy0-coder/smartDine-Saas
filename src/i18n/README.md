# Internationalization (i18n) Module

This module provides internationalization support for the SmartDine SaaS platform, enabling multi-language functionality for English and Arabic.

## Overview

The i18n system is built using:
- **i18next**: Core internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection

## Features

- ✅ Support for English (en) and Arabic (ar)
- ✅ Automatic language detection from browser/localStorage
- ✅ RTL (Right-to-Left) support for Arabic
- ✅ Integration with Zustand UI store
- ✅ Persistent language preference
- ✅ Type-safe translation keys
- ✅ Namespace support for organized translations

## File Structure

```
src/i18n/
├── config.ts              # i18next configuration
├── useTranslation.ts      # Custom translation hook
├── index.ts               # Module exports
├── locales/
│   ├── en.json           # English translations
│   └── ar.json           # Arabic translations
└── README.md             # This file
```

## Usage

### Basic Translation

```tsx
import { useTranslation } from '@/i18n';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('menu.title')}</p>
    </div>
  );
}
```

### Changing Language

```tsx
import { useTranslation } from '@/i18n';

function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  return (
    <button onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}>
      Switch to {language === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
```

### Using the LanguageSelector Component

```tsx
import { LanguageSelector } from '@/components/common';

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <LanguageSelector />
      </nav>
    </header>
  );
}
```

### Interpolation

```tsx
const { t } = useTranslation();

// Translation: "Welcome back, {{name}}"
<h1>{t('dashboard.welcome', { name: 'John' })}</h1>
// Output: "Welcome back, John"
```

### Pluralization

```tsx
const { t } = useTranslation();

// Translation keys:
// "itemsInCart": "{{count}} item in cart"
// "itemsInCart_plural": "{{count}} items in cart"

<p>{t('cart.itemsInCart', { count: 1 })}</p>
// Output: "1 item in cart"

<p>{t('cart.itemsInCart', { count: 5 })}</p>
// Output: "5 items in cart"
```

### RTL Support

The system automatically handles RTL layout for Arabic:

```tsx
import { useTranslation } from '@/i18n';

function MyComponent() {
  const { isRTL } = useTranslation();

  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      Content adapts to language direction
    </div>
  );
}
```

### Using Language Without Translation

If you only need to check the current language without translation functions:

```tsx
import { useLanguage } from '@/i18n';

function MyComponent() {
  const { language, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      Current language: {language}
    </div>
  );
}
```

## Translation Keys Structure

Translations are organized by feature/domain:

```json
{
  "common": {
    // Common UI elements (buttons, labels, etc.)
  },
  "nav": {
    // Navigation items
  },
  "auth": {
    // Authentication pages
  },
  "menu": {
    // Menu browsing and management
  },
  "cart": {
    // Shopping cart
  },
  "order": {
    // Order management
  },
  "ai": {
    // AI assistant
  },
  "feedback": {
    // Customer feedback
  },
  "dashboard": {
    // Dashboard pages
  },
  "kitchen": {
    // Kitchen dashboard
  },
  "delivery": {
    // Delivery dashboard
  },
  "admin": {
    // Admin dashboard
  },
  "subscription": {
    // Subscription management
  },
  "settings": {
    // Settings pages
  },
  "qr": {
    // QR code features
  },
  "errors": {
    // Error messages
  },
  "success": {
    // Success messages
  },
  "landing": {
    // Landing page content
  }
}
```

## Adding New Translations

1. Add the key to both `en.json` and `ar.json`:

```json
// en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}

// ar.json
{
  "myFeature": {
    "title": "ميزتي",
    "description": "هذه هي ميزتي"
  }
}
```

2. Use in your component:

```tsx
const { t } = useTranslation();
<h1>{t('myFeature.title')}</h1>
```

## Configuration

The i18n configuration is in `src/i18n/config.ts`:

```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ar: { translation: arTranslations },
    },
    fallbackLng: env.DEFAULT_LANGUAGE, // 'en'
    supportedLngs: env.SUPPORTED_LANGUAGES, // ['en', 'ar']
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });
```

## Environment Variables

Configure language settings in `.env`:

```env
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,ar
VITE_FEATURE_MULTI_LANGUAGE=true
```

## Best Practices

1. **Always use translation keys**: Never hardcode text in components
2. **Keep keys organized**: Group related translations together
3. **Use descriptive keys**: Make keys self-documenting
4. **Provide context**: Use interpolation for dynamic content
5. **Test both languages**: Ensure UI works in both LTR and RTL
6. **Handle plurals**: Use proper pluralization for counts
7. **Keep translations in sync**: Update both language files together

## RTL Considerations

When working with Arabic (RTL):

1. **Document direction** is automatically set to `rtl`
2. **Flexbox and Grid** automatically reverse in RTL
3. **Margins and padding** are mirrored automatically
4. **Icons and images** may need manual adjustment
5. **Text alignment** should use logical properties (`text-start` instead of `text-left`)

Example:

```tsx
// Good - uses logical properties
<div className="text-start ps-4">Content</div>

// Avoid - uses physical properties
<div className="text-left pl-4">Content</div>
```

## Testing

Test language switching:

```tsx
import { render, screen } from '@testing-library/react';
import { useTranslation } from '@/i18n';

test('displays translated text', () => {
  const { t } = useTranslation();
  render(<div>{t('common.welcome')}</div>);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
```

## Troubleshooting

### Translations not updating
- Check that i18n is initialized in `main.tsx`
- Verify translation keys exist in both language files
- Clear localStorage and browser cache

### RTL not working
- Ensure `changeLanguage` is called (it sets document direction)
- Check that Tailwind RTL plugin is configured
- Verify CSS doesn't override direction

### Language not persisting
- Check localStorage for `i18nextLng` key
- Verify LanguageDetector is configured correctly
- Ensure localStorage is not being cleared

## RTL Support

The i18n system includes comprehensive RTL (Right-to-Left) support for Arabic. See [RTL_GUIDE.md](./RTL_GUIDE.md) for detailed documentation.

### Quick RTL Tips

1. **Use logical properties**: `ms-4` instead of `ml-4`, `text-start` instead of `text-left`
2. **Use RTLIcon component**: Automatically mirrors directional icons
3. **Test in both directions**: Always verify UI works in both LTR and RTL

```tsx
import { RTLIcon } from '@/components/common/RTLIcon';
import { ChevronRight } from 'lucide-react';

// Icon automatically mirrors in RTL
<RTLIcon icon={ChevronRight} className="w-5 h-5" />

// Use logical properties
<div className="ms-4 ps-2 text-start">Content</div>
```

### RTL Utilities

The `@/utils/rtl` module provides helper functions:

```tsx
import { isRTL, getDirectionalClass, formatNumber } from '@/utils/rtl';

// Check if RTL
if (isRTL()) {
  // RTL-specific logic
}

// Get directional class
const className = getDirectionalClass('ml-4', 'mr-4');

// Format numbers
const formatted = formatNumber(1234);
```

## Future Enhancements

- [ ] Add more languages (French, Spanish, etc.)
- [ ] Implement lazy loading for translation files
- [ ] Add translation management UI for admins
- [ ] Integrate with translation services (Crowdin, Lokalise)
- [ ] Add missing translation detection in development
- [ ] Implement namespace-based code splitting
- [ ] Add RTL support for more languages (Hebrew, Persian, Urdu)
