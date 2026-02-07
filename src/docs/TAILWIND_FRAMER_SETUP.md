# Tailwind CSS & Framer Motion Configuration

## ✅ Configuration Complete

This document describes the Tailwind CSS v4 and Framer Motion setup for the SmartDine SaaS Platform.

## 📦 Installed Packages

### Tailwind CSS (v4)

- `tailwindcss` - Core Tailwind CSS framework
- `@tailwindcss/postcss` - PostCSS plugin for Tailwind v4
- `postcss` - CSS transformation tool
- `autoprefixer` - Automatic vendor prefixing

### Framer Motion

- `framer-motion` - Production-ready animation library for React

## 🔧 Configuration Files

### 1. `postcss.config.js`

PostCSS configuration with Tailwind CSS v4 plugin:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### 2. `tailwind.config.js`

Tailwind configuration (v4 uses CSS-based config, but this file is kept for compatibility):

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
};
```

### 3. `src/index.css`

Main CSS file with Tailwind v4 imports and custom theme:

- Uses `@import "tailwindcss"` (v4 syntax)
- Custom color palette (primary, secondary)
- Custom fonts (Inter, Cairo for Arabic)
- Custom animations (float, fade-in, slide-up, slide-down)
- RTL support for Arabic
- Dark mode support

## 🎨 Custom Theme

### Colors

- **Primary**: Blue shades (50-950)
- **Secondary**: Purple/Pink shades (50-950)

### Fonts

- **Sans**: Inter, system-ui, sans-serif
- **Arabic**: Cairo, system-ui, sans-serif

### Animations

- `animate-float`: Floating animation (6s infinite)
- `animate-fade-in`: Fade in animation (0.5s)
- `animate-slide-up`: Slide up animation (0.5s)
- `animate-slide-down`: Slide down animation (0.5s)

## 🚀 Usage Examples

### Tailwind CSS Classes

```tsx
<div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
  <h1 className="text-5xl font-bold text-gray-800 dark:text-white">SmartDine</h1>
</div>
```

### Framer Motion Animations

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  whileHover={{ scale: 1.05 }}
>
  Content
</motion.div>;
```

### Combined Example

See `src/App.tsx` and `src/components/DemoCard.tsx` for complete examples.

## 🌙 Dark Mode

Dark mode is configured using the `class` strategy. Toggle dark mode by adding/removing the `dark` class on the root element:

```typescript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

## 🌍 RTL Support

RTL (Right-to-Left) support for Arabic is configured. Apply RTL by setting the `dir` attribute:

```html
<html dir="rtl"></html>
```

## ✨ Features

- ✅ Tailwind CSS v4 with PostCSS
- ✅ Framer Motion for animations
- ✅ Dark mode support
- ✅ RTL support for Arabic
- ✅ Custom color palette
- ✅ Custom animations
- ✅ TypeScript support
- ✅ Production build optimized

## 🧪 Verification

Build the project to verify the setup:

```bash
npm run build
```

Run the development server:

```bash
npm run dev
```

## 📝 Notes

- Tailwind CSS v4 uses CSS-based configuration via `@theme` directive
- The `tailwind.config.js` file is kept for compatibility but v4 primarily uses CSS configuration
- All custom theme values are defined in `src/index.css` using CSS variables
- Framer Motion is tree-shakeable and only includes used features in production builds
