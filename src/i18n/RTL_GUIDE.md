# RTL (Right-to-Left) Support Guide

This guide explains how RTL support is implemented in SmartDine and best practices for working with Arabic and other RTL languages.

## Overview

The SmartDine platform provides comprehensive RTL support for Arabic language, including:

- ✅ Automatic document direction switching
- ✅ RTL-aware CSS utilities
- ✅ Icon mirroring for directional elements
- ✅ Logical CSS properties (start/end instead of left/right)
- ✅ Arabic font support (Cairo font family)
- ✅ RTL-aware form inputs and controls
- ✅ Proper text alignment and layout

## How It Works

### Automatic Direction Switching

When the user changes language to Arabic, the system automatically:

1. Sets `document.documentElement.dir = 'rtl'`
2. Sets `document.documentElement.lang = 'ar'`
3. Applies Arabic font family
4. Persists preference to localStorage

This is handled by the `useTranslation` hook:

```tsx
import { useTranslation } from '@/i18n';

function MyComponent() {
  const { language, isRTL, changeLanguage } = useTranslation();
  
  // isRTL is true when language is 'ar'
  // changeLanguage automatically updates document direction
}
```

### CSS RTL Support

The CSS automatically handles RTL through several mechanisms:

#### 1. Base RTL Styles

```css
[dir='rtl'] {
  direction: rtl;
}

[dir='rtl'] body {
  font-family: var(--font-arabic);
}
```

#### 2. Form Elements

```css
[dir='rtl'] input,
[dir='rtl'] textarea {
  direction: rtl;
  text-align: right;
}
```

#### 3. Lists and Blockquotes

```css
[dir='rtl'] ul,
[dir='rtl'] ol {
  padding-right: 1.5rem;
  padding-left: 0;
}

[dir='rtl'] blockquote {
  border-right-width: 4px;
  border-left-width: 0;
}
```

## Using RTL Utilities

### Logical Properties (Recommended)

Use logical properties that automatically adapt to text direction:

```tsx
// ✅ Good - uses logical properties
<div className="ms-4 pe-2 text-start">
  Content
</div>

// ❌ Avoid - uses physical properties
<div className="ml-4 pr-2 text-left">
  Content
</div>
```

Available logical utilities:

- `ms-{size}` - margin-inline-start (left in LTR, right in RTL)
- `me-{size}` - margin-inline-end (right in LTR, left in RTL)
- `ps-{size}` - padding-inline-start
- `pe-{size}` - padding-inline-end
- `text-start` - text-align: start
- `text-end` - text-align: end
- `float-start` - float: inline-start
- `float-end` - float: inline-end
- `border-s` - border-inline-start
- `border-e` - border-inline-end
- `rounded-s` - border-start-start-radius + border-end-start-radius
- `rounded-e` - border-start-end-radius + border-end-end-radius

### RTL Mirror Utilities

For elements that should flip in RTL (like directional icons):

```tsx
// Icon that mirrors in RTL
<ChevronRight className="rtl-mirror" />

// Icon that mirrors in LTR
<ChevronLeft className="ltr-mirror" />
```

### RTL Helper Functions

Use the RTL utility functions from `@/utils/rtl`:

```tsx
import { 
  isRTL, 
  getDirectionalClass, 
  getMirrorTransform,
  formatNumber,
  getFontClass 
} from '@/utils/rtl';

// Check if RTL
if (isRTL()) {
  // Do something RTL-specific
}

// Get directional class
const className = getDirectionalClass('ml-4', 'mr-4');

// Format numbers
const formatted = formatNumber(1234); // "1,234" in LTR, "١٬٢٣٤" in RTL (optional)

// Get font class
const fontClass = getFontClass('ar'); // "font-arabic"
```

## RTL-Aware Components

### RTLIcon Component

Use the `RTLIcon` component for automatic icon mirroring:

```tsx
import { ChevronRight, Search } from 'lucide-react';
import { RTLIcon } from '@/components/common/RTLIcon';

function Navigation() {
  return (
    <div>
      {/* Automatically mirrors in RTL */}
      <RTLIcon icon={ChevronRight} className="w-5 h-5" />
      
      {/* Doesn't mirror (not a directional icon) */}
      <RTLIcon icon={Search} className="w-5 h-5" />
      
      {/* Force mirroring */}
      <RTLIcon icon={Search} mirror={true} className="w-5 h-5" />
    </div>
  );
}
```

Icons that automatically mirror:
- ChevronLeft, ChevronRight
- ArrowLeft, ArrowRight
- ChevronsLeft, ChevronsRight
- CornerDownLeft, CornerDownRight
- And other directional icons

### Form Components

Form components automatically adapt to RTL:

```tsx
import { Input, Textarea, Select } from '@/components/ui';

function MyForm() {
  return (
    <form>
      {/* Input automatically aligns right in RTL */}
      <Input placeholder="Enter text" />
      
      {/* Textarea automatically aligns right in RTL */}
      <Textarea placeholder="Enter description" />
      
      {/* Select dropdown automatically positions correctly */}
      <Select>
        <option>Option 1</option>
      </Select>
    </form>
  );
}
```

## Best Practices

### 1. Always Use Logical Properties

```tsx
// ✅ Good
<div className="ps-4 pe-2 ms-auto">Content</div>

// ❌ Bad
<div className="pl-4 pr-2 ml-auto">Content</div>
```

### 2. Use text-start/text-end Instead of text-left/text-right

```tsx
// ✅ Good
<h1 className="text-start">Title</h1>

// ❌ Bad
<h1 className="text-left">Title</h1>
```

### 3. Use RTLIcon for Directional Icons

```tsx
// ✅ Good
import { RTLIcon } from '@/components/common/RTLIcon';
<RTLIcon icon={ChevronRight} />

// ❌ Bad
<ChevronRight /> // Won't mirror in RTL
```

### 4. Test in Both Directions

Always test your UI in both LTR and RTL modes:

```tsx
import { useTranslation } from '@/i18n';

function TestComponent() {
  const { changeLanguage } = useTranslation();
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
}
```

### 5. Handle Flexbox and Grid

Flexbox and Grid automatically reverse in RTL, but be aware:

```tsx
// Flexbox automatically reverses
<div className="flex">
  <div>First</div>  {/* Right in RTL */}
  <div>Second</div> {/* Left in RTL */}
</div>

// Use flex-row-reverse to force reverse in LTR
<div className="flex flex-row-reverse">
  <div>First</div>
  <div>Second</div>
</div>
```

### 6. Images and Media

Images don't automatically flip. Use rtl-mirror if needed:

```tsx
// Image that should flip in RTL
<img src="arrow.png" className="rtl-mirror" />

// Image that should NOT flip
<img src="logo.png" />
```

### 7. Absolute Positioning

When using absolute positioning, use logical properties:

```tsx
// ✅ Good - uses logical properties
<div className="absolute start-0 end-auto">Content</div>

// ❌ Bad - uses physical properties
<div className="absolute left-0 right-auto">Content</div>
```

## Common Patterns

### Navigation Menu

```tsx
import { RTLIcon } from '@/components/common/RTLIcon';
import { ChevronRight } from 'lucide-react';

function NavItem({ label, href }) {
  return (
    <a href={href} className="flex items-center gap-2">
      <span>{label}</span>
      <RTLIcon icon={ChevronRight} className="w-4 h-4" />
    </a>
  );
}
```

### Breadcrumbs

```tsx
import { RTLIcon } from '@/components/common/RTLIcon';
import { ChevronRight } from 'lucide-react';

function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <a href={item.href}>{item.label}</a>
          {index < items.length - 1 && (
            <RTLIcon icon={ChevronRight} className="w-4 h-4" />
          )}
        </div>
      ))}
    </nav>
  );
}
```

### Sidebar Layout

```tsx
function Layout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar automatically goes to right in RTL */}
      <aside className="w-64 border-e">
        Sidebar
      </aside>
      
      {/* Main content */}
      <main className="flex-1 ps-4">
        {children}
      </main>
    </div>
  );
}
```

### Card with Icon

```tsx
import { RTLIcon } from '@/components/common/RTLIcon';
import { ArrowRight } from 'lucide-react';

function Card({ title, description }) {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-start font-bold">{title}</h3>
      <p className="text-start text-muted-foreground">{description}</p>
      <button className="mt-4 flex items-center gap-2">
        <span>Learn More</span>
        <RTLIcon icon={ArrowRight} className="w-4 h-4" />
      </button>
    </div>
  );
}
```

## Troubleshooting

### Issue: Text not aligning correctly

**Solution**: Use `text-start` instead of `text-left`:

```tsx
// ✅ Fix
<p className="text-start">Text</p>

// ❌ Problem
<p className="text-left">Text</p>
```

### Issue: Icons not mirroring

**Solution**: Use `RTLIcon` component or add `rtl-mirror` class:

```tsx
// ✅ Fix
<RTLIcon icon={ChevronRight} />
// or
<ChevronRight className="rtl-mirror" />

// ❌ Problem
<ChevronRight />
```

### Issue: Margins/padding not reversing

**Solution**: Use logical properties:

```tsx
// ✅ Fix
<div className="ms-4 pe-2">Content</div>

// ❌ Problem
<div className="ml-4 pr-2">Content</div>
```

### Issue: Form inputs not aligning right in RTL

**Solution**: The CSS should handle this automatically. If not, check that `dir="rtl"` is set on the document:

```tsx
// Check in browser console
console.log(document.documentElement.dir); // Should be "rtl"
```

### Issue: Flexbox not reversing

**Solution**: Flexbox should reverse automatically. If not, ensure `dir="rtl"` is set. You can also use `flex-row-reverse` to force reversal:

```tsx
<div className="flex flex-row-reverse">
  {/* Items will be reversed */}
</div>
```

## Testing RTL

### Manual Testing

1. Switch language to Arabic using the LanguageSelector
2. Verify all text aligns to the right
3. Check that directional icons (arrows, chevrons) are mirrored
4. Test form inputs and controls
5. Verify navigation and menus work correctly
6. Check that layouts don't break

### Automated Testing

```tsx
import { render, screen } from '@testing-library/react';
import { useTranslation } from '@/i18n';

test('component works in RTL', async () => {
  const { changeLanguage } = useTranslation();
  
  // Switch to Arabic
  await changeLanguage('ar');
  
  // Verify RTL
  expect(document.documentElement.dir).toBe('rtl');
  
  // Test your component
  render(<MyComponent />);
  // Add assertions
});
```

## Resources

- [MDN: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [W3C: Structural markup and right-to-left text in HTML](https://www.w3.org/International/questions/qa-html-dir)
- [Material Design: Bidirectionality](https://material.io/design/usability/bidirectionality.html)
- [RTL Styling 101](https://rtlstyling.com/)

## Future Enhancements

- [ ] Add RTL support for more languages (Hebrew, Persian, Urdu)
- [ ] Implement automatic RTL detection based on content
- [ ] Add RTL-specific animations
- [ ] Create RTL testing utilities
- [ ] Add visual regression tests for RTL layouts
