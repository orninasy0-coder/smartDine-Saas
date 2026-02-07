# SmartDine Design System

## Overview

The SmartDine Design System is a comprehensive collection of reusable components, design tokens, and guidelines that ensure consistency across the entire platform.

## Structure

```
src/design-system/
├── tokens.ts                    # Design tokens (colors, spacing, typography)
├── ComponentShowcase.tsx        # Interactive component documentation
├── index.ts                     # Main exports
├── README.md                    # This file
├── DESIGN_SYSTEM_GUIDE.md      # Comprehensive design system guide
└── COMPONENT_USAGE.md          # Component usage examples
```

## Quick Start

### Viewing the Design System

Navigate to `/design-system` in your browser to view the interactive component showcase.

```bash
npm run dev
# Then visit: http://localhost:5173/design-system
```

### Using Design Tokens

```tsx
import { designTokens, colorTokens } from '@/design-system';

// Use spacing tokens
<div style={{ padding: designTokens.spacing.md }}>
  Content
</div>

// Use color tokens
<div style={{ backgroundColor: colorTokens.primary[500] }}>
  Primary content
</div>
```

### Using Components

All UI components are available in `src/components/ui/`:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Documentation

### 1. Design System Guide
See [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) for:
- Design token reference
- Component guidelines
- Accessibility standards
- Responsive design patterns
- Dark mode support
- RTL support

### 2. Component Usage
See [COMPONENT_USAGE.md](./COMPONENT_USAGE.md) for:
- Code examples for each component
- Common patterns
- Best practices
- Real-world usage scenarios

### 3. Interactive Showcase
Visit `/design-system` route to:
- Browse all components visually
- See design tokens in action
- View color palettes
- Read usage guidelines

## Key Features

### 🎨 Design Tokens
- Consistent spacing scale (4px grid)
- Comprehensive color system
- Typography scale
- Border radius values
- Shadow system
- Z-index scale

### 🧩 Components
- Built with Radix UI primitives
- Fully accessible (WCAG AA)
- Dark mode support
- RTL support
- TypeScript types
- Customizable with Tailwind

### 📱 Responsive
- Mobile-first approach
- Consistent breakpoints
- Flexible layouts
- Touch-friendly targets

### ♿ Accessible
- Keyboard navigation
- Screen reader support
- ARIA labels
- Color contrast compliance

### 🌙 Dark Mode
- Automatic theme switching
- Semantic color tokens
- Consistent across all components

### 🌍 Internationalization
- RTL layout support
- Arabic and English
- Logical CSS properties

## Design Principles

### 1. Consistency
Use design tokens and components to maintain visual consistency across the platform.

### 2. Accessibility
All components meet WCAG AA standards and support keyboard navigation and screen readers.

### 3. Performance
Components are optimized for performance with lazy loading and efficient rendering.

### 4. Flexibility
Components are composable and customizable while maintaining consistency.

### 5. Developer Experience
Clear documentation, TypeScript support, and intuitive APIs.

## Contributing

When adding new components or tokens:

1. **Follow existing patterns** - Maintain consistency with current components
2. **Use design tokens** - Never hardcode values
3. **Document thoroughly** - Add examples to ComponentShowcase and COMPONENT_USAGE.md
4. **Test accessibility** - Ensure keyboard navigation and screen reader support
5. **Support dark mode** - Test in both light and dark themes
6. **Test RTL** - Verify layout works in Arabic (RTL)
7. **Add TypeScript types** - Ensure type safety

## Resources

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For questions or issues with the design system:
1. Check the documentation files
2. View the interactive showcase at `/design-system`
3. Review component usage examples
4. Consult the team design lead

## Version

Current Version: 1.0.0

Last Updated: February 2026
