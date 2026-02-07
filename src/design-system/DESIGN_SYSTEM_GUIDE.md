# SmartDine Design System Guide

## Overview

This design system provides a comprehensive set of components, tokens, and guidelines to ensure consistency across the SmartDine platform.

## Design Tokens

Design tokens are the foundational design decisions that define the visual language of the application. They are defined in `src/design-system/tokens.ts`.

### Spacing Scale

Based on a 4px grid system:

- `xs`: 4px - Minimal spacing
- `sm`: 8px - Small spacing
- `md`: 16px - Default spacing
- `lg`: 24px - Large spacing
- `xl`: 32px - Extra large spacing
- `2xl`: 48px - Section spacing
- `3xl`: 64px - Large section spacing
- `4xl`: 96px - Hero spacing

**Usage:**
```tsx
import { designTokens } from '@/design-system/tokens';

<div style={{ padding: designTokens.spacing.md }}>
  Content
</div>
```

### Colors

#### Primary Colors
Used for main brand elements, primary actions, and key UI elements.

#### Secondary Colors
Used for accents, highlights, and secondary actions.

#### Semantic Colors
- **Success**: Positive actions, confirmations
- **Warning**: Caution, important notices
- **Error**: Errors, destructive actions
- **Info**: Informational messages

**Usage:**
```tsx
import { colorTokens } from '@/design-system/tokens';

<div style={{ backgroundColor: colorTokens.primary[500] }}>
  Primary content
</div>
```

### Typography

Font sizes follow a modular scale:
- `xs`: 12px - Small labels
- `sm`: 14px - Body text (small)
- `base`: 16px - Default body text
- `lg`: 18px - Emphasized text
- `xl`: 20px - Small headings
- `2xl`: 24px - Section headings
- `3xl`: 30px - Page headings
- `4xl`: 36px - Large headings
- `5xl`: 48px - Hero headings

**Font Weights:**
- `normal`: 400 - Body text
- `medium`: 500 - Emphasized text
- `semibold`: 600 - Headings
- `bold`: 700 - Strong emphasis

### Border Radius

- `none`: 0 - Sharp corners
- `sm`: 4px - Subtle rounding
- `md`: 8px - Default rounding
- `lg`: 12px - Prominent rounding
- `xl`: 16px - Large rounding
- `full`: 9999px - Circular

### Shadows

- `sm`: Subtle elevation
- `md`: Default elevation
- `lg`: Prominent elevation
- `xl`: Maximum elevation

## Component Guidelines

### Buttons

**Variants:**
- `default`: Primary actions
- `secondary`: Secondary actions
- `destructive`: Dangerous actions (delete, cancel)
- `outline`: Less prominent actions
- `ghost`: Minimal visual weight
- `link`: Text-only actions

**Sizes:**
- `sm`: Compact spaces
- `default`: Standard size
- `lg`: Prominent actions

**Best Practices:**
- Use primary buttons for main actions (max 1 per section)
- Use destructive variant for irreversible actions
- Provide clear, action-oriented labels
- Ensure sufficient spacing between buttons

### Input Fields

**Types:**
- Text, email, password, number, etc.

**Best Practices:**
- Always include labels
- Provide helpful placeholder text
- Show validation errors clearly
- Use appropriate input types for better mobile experience

### Cards

**Usage:**
- Group related content
- Create visual hierarchy
- Separate distinct sections

**Best Practices:**
- Don't nest cards too deeply
- Use consistent padding
- Include clear headings
- Maintain adequate spacing between cards

## Accessibility Guidelines

### Color Contrast

- Ensure text has at least 4.5:1 contrast ratio (WCAG AA)
- Large text (18px+) needs at least 3:1 contrast
- Don't rely on color alone to convey information

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Provide visible focus indicators
- Maintain logical tab order
- Support common keyboard shortcuts

### Screen Readers

- Use semantic HTML elements
- Provide ARIA labels where needed
- Include alt text for images
- Announce dynamic content changes

### Touch Targets

- Minimum size: 44x44px
- Adequate spacing between targets
- Consider thumb zones on mobile

## Responsive Design

### Breakpoints

- `sm`: 640px - Small tablets
- `md`: 768px - Tablets
- `lg`: 1024px - Small desktops
- `xl`: 1280px - Desktops
- `2xl`: 1536px - Large desktops

### Mobile-First Approach

Start with mobile layout and enhance for larger screens:

```tsx
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

## RTL Support

The design system supports both LTR (English) and RTL (Arabic) layouts:

- Use logical properties (start/end instead of left/right)
- Test all components in both directions
- Use `dir="rtl"` on root element for Arabic

## Performance Best Practices

### Component Loading

- Lazy load heavy components
- Use code splitting for routes
- Implement suspense boundaries

### Animations

- Use CSS transforms for better performance
- Prefer `transform` and `opacity` for animations
- Respect `prefers-reduced-motion`

### Images

- Use appropriate formats (WebP, AVIF)
- Implement lazy loading
- Provide responsive images
- Include proper alt text

## Dark Mode

The design system fully supports dark mode:

- Colors automatically adapt
- Use semantic color tokens
- Test all components in both themes
- Respect user preferences

## Contributing

When adding new components:

1. Follow existing patterns
2. Use design tokens
3. Ensure accessibility
4. Add to ComponentShowcase
5. Document usage
6. Test in both themes
7. Test RTL support

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
