# PWA Icons

This directory contains icons for the Progressive Web App (PWA).

## Required Icon Sizes

The following icon sizes are required for optimal PWA support:

- **16x16** - Browser favicon
- **32x32** - Browser favicon
- **72x72** - Android Chrome
- **96x96** - Android Chrome
- **128x128** - Android Chrome
- **144x144** - Android Chrome
- **152x152** - iOS Safari
- **192x192** - Android Chrome (minimum required)
- **384x384** - Android Chrome
- **512x512** - Android Chrome (splash screen)

## Icon Requirements

- **Format**: PNG with transparency
- **Purpose**: `any maskable` (supports both regular and maskable icons)
- **Design**: Should work well on both light and dark backgrounds
- **Safe Zone**: For maskable icons, keep important content within 80% of the icon area

## Generating Icons

You can use tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/)

### Using PWA Asset Generator

```bash
npx pwa-asset-generator logo.svg public/icons --icon-only --favicon --type png
```

## Shortcut Icons

Additional icons for app shortcuts:
- **menu-shortcut.png** (96x96) - Menu shortcut icon
- **dashboard-shortcut.png** (96x96) - Dashboard shortcut icon

## Current Status

⚠️ **TODO**: Generate actual icon files from the SmartDine logo.

For now, you can use placeholder icons or generate them from your logo design.
