# Theme System Documentation

## Overview

The SmartDine platform includes a comprehensive theme system that supports Light Mode, Dark Mode, and System preference detection. The theme system is built on top of Tailwind CSS with CSS variables and integrates seamlessly with shadcn/ui components.

## Features

- ✅ Light Mode
- ✅ Dark Mode
- ✅ System Preference Detection
- ✅ Persistent Theme Selection (localStorage)
- ✅ Smooth Theme Transitions
- ✅ Automatic System Theme Change Detection
- ✅ Full shadcn/ui Integration
- ✅ RTL Support Ready

## Architecture

### Components

1. **ThemeProvider** (`src/components/common/ThemeProvider.tsx`)
   - Wraps the application
   - Manages theme initialization
   - Applies theme class to document root

2. **ThemeToggle** (`src/components/common/ThemeToggle.tsx`)
   - UI component for theme switching
   - Dropdown menu with Light/Dark/System options
   - Shows current theme with icons

3. **useTheme Hook** (`src/hooks/useTheme.ts`)
   - Custom hook for theme management
   - Provides theme state and setter
   - Handles system preference detection
   - Manages localStorage persistence

### State Management

Theme state is managed through Zustand store (`src/store/uiStore.ts`):

```typescript
interface UIState {
  theme: 'light' | 'dark' | 'system';
  // ... other UI state
}
```

## Usage

### Basic Setup

The theme system is already integrated into the application. The `ThemeProvider` wraps the entire app in `src/App.tsx`:

```tsx
import { ThemeProvider } from './components/common';

function App() {
  return <ThemeProvider>{/* Your app content */}</ThemeProvider>;
}
```

### Using the Theme Toggle

Add the `ThemeToggle` component anywhere in your UI:

```tsx
import { ThemeToggle } from '@/components/common';

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Using the useTheme Hook

Access theme state and controls in any component:

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme setting: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

## CSS Variables

The theme system uses CSS variables defined in `src/index.css`. These variables automatically update when the theme changes:

### Light Mode Variables

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.6 0.15 230);
  /* ... more variables */
}
```

### Dark Mode Variables

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.65 0.18 230);
  /* ... more variables */
}
```

## Styling Components

### Using Tailwind Classes

Tailwind's dark mode variant works automatically:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content adapts to theme
</div>
```

### Using CSS Variables

Access theme colors through Tailwind utilities:

```tsx
<div className="bg-background text-foreground">Uses theme variables</div>
```

## Theme Persistence

The theme preference is automatically saved to localStorage using the key defined in `LOCAL_STORAGE_KEYS.THEME`. The theme is restored on page load.

## System Preference Detection

When theme is set to 'system':

- The hook detects the OS/browser color scheme preference
- Automatically applies light or dark theme
- Listens for system preference changes
- Updates theme in real-time when system preference changes

## Integration with shadcn/ui

All shadcn/ui components automatically support the theme system through CSS variables. No additional configuration needed.

## Custom Colors

The platform includes custom primary (blue) and secondary (purple) color palettes defined in both `tailwind.config.js` and `src/index.css`:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... full palette
    950: '#082f49',
  },
  secondary: {
    50: '#fdf4ff',
    // ... full palette
    950: '#4a044e',
  },
}
```

## RTL Support

The theme system is ready for RTL (Right-to-Left) support for Arabic language:

```css
[dir='rtl'] {
  direction: rtl;
}
```

## Best Practices

1. **Always use Tailwind's dark: variant** for theme-aware styling
2. **Use CSS variables** for colors that need to adapt to theme
3. **Test both themes** when creating new components
4. **Use semantic color names** (background, foreground, primary) instead of specific colors
5. **Avoid hardcoded colors** that don't adapt to theme

## Troubleshooting

### Theme not applying

- Check that `ThemeProvider` wraps your app
- Verify `darkMode: 'class'` is set in `tailwind.config.js`
- Ensure CSS variables are defined in `src/index.css`

### Theme not persisting

- Check localStorage is available
- Verify `LOCAL_STORAGE_KEYS.THEME` is correctly defined
- Check browser console for errors

### System preference not working

- Verify browser supports `prefers-color-scheme` media query
- Check that theme is set to 'system'
- Test in different browsers

## Future Enhancements

- [ ] Theme customization per restaurant (tenant-specific themes)
- [ ] Custom color scheme builder
- [ ] Theme preview before applying
- [ ] Scheduled theme switching (e.g., auto dark mode at night)
- [ ] High contrast mode for accessibility
- [ ] Custom theme presets (Ocean, Forest, Sunset, etc.)

## Related Files

- `src/hooks/useTheme.ts` - Theme hook
- `src/components/common/ThemeProvider.tsx` - Theme provider
- `src/components/common/ThemeToggle.tsx` - Theme toggle UI
- `src/store/uiStore.ts` - UI state management
- `src/index.css` - CSS variables and theme definitions
- `tailwind.config.js` - Tailwind configuration
- `src/utils/constants/index.ts` - Theme constants

## API Reference

### useTheme()

Returns an object with:

- `theme: 'light' | 'dark' | 'system'` - Current theme setting
- `resolvedTheme: 'light' | 'dark'` - Actual theme being displayed (resolves 'system')
- `setTheme: (theme: Theme) => void` - Function to change theme

### ThemeProvider

Props:

- `children: React.ReactNode` - App content to wrap

### ThemeToggle

No props required. Renders a dropdown button with theme options.
