# RTL Quick Reference Card

Quick reference for working with RTL (Right-to-Left) support in SmartDine.

## 🚀 Quick Start

```tsx
import { useTranslation } from '@/i18n';
import { RTLIcon } from '@/components/common/RTLIcon';
import { ChevronRight } from 'lucide-react';

function MyComponent() {
  const { isRTL } = useTranslation();
  
  return (
    <div className="ms-4 text-start">
      <RTLIcon icon={ChevronRight} />
    </div>
  );
}
```

## 📋 Cheat Sheet

### Spacing (Margin & Padding)

| ❌ Physical | ✅ Logical | Description |
|------------|-----------|-------------|
| `ml-4` | `ms-4` | Margin start (left in LTR, right in RTL) |
| `mr-4` | `me-4` | Margin end (right in LTR, left in RTL) |
| `pl-4` | `ps-4` | Padding start |
| `pr-4` | `pe-4` | Padding end |

### Text Alignment

| ❌ Physical | ✅ Logical | Description |
|------------|-----------|-------------|
| `text-left` | `text-start` | Align to start |
| `text-right` | `text-end` | Align to end |

### Borders

| ❌ Physical | ✅ Logical | Description |
|------------|-----------|-------------|
| `border-l` | `border-s` | Border start |
| `border-r` | `border-e` | Border end |

### Positioning

| ❌ Physical | ✅ Logical | Description |
|------------|-----------|-------------|
| `left-0` | `start-0` | Position start |
| `right-0` | `end-0` | Position end |

### Rounded Corners

| ❌ Physical | ✅ Logical | Description |
|------------|-----------|-------------|
| `rounded-l` | `rounded-s` | Round start corners |
| `rounded-r` | `rounded-e` | Round end corners |

### Float

| ❌ Physical | ✅ Logical | Description |
|------------|-----------|-------------|
| `float-left` | `float-start` | Float start |
| `float-right` | `float-end` | Float end |

## 🎨 Icons

### Using RTLIcon Component

```tsx
import { RTLIcon } from '@/components/common/RTLIcon';
import { ChevronRight, Search } from 'lucide-react';

// Automatically mirrors in RTL
<RTLIcon icon={ChevronRight} />

// Doesn't mirror (not directional)
<RTLIcon icon={Search} />

// Force mirror
<RTLIcon icon={Search} mirror={true} />
```

### Icons That Auto-Mirror

- ChevronLeft, ChevronRight
- ArrowLeft, ArrowRight
- ChevronsLeft, ChevronsRight
- CornerDownLeft, CornerDownRight
- MoveLeft, MoveRight

## 🛠️ Utility Functions

```tsx
import { 
  isRTL, 
  getDirectionalClass,
  formatNumber,
  getFontClass 
} from '@/utils/rtl';

// Check direction
if (isRTL()) { /* RTL logic */ }

// Get class based on direction
const cls = getDirectionalClass('ml-4', 'mr-4');

// Format numbers
const num = formatNumber(1234); // "1,234"

// Get font class
const font = getFontClass('ar'); // "font-arabic"
```

## 📝 Common Patterns

### Navigation Item

```tsx
<a href="#" className="flex items-center gap-2">
  <span>{label}</span>
  <RTLIcon icon={ChevronRight} className="w-4 h-4" />
</a>
```

### Breadcrumbs

```tsx
<nav className="flex items-center gap-2">
  <a href="#">Home</a>
  <RTLIcon icon={ChevronRight} className="w-4 h-4" />
  <a href="#">Products</a>
</nav>
```

### Sidebar Layout

```tsx
<div className="flex">
  <aside className="w-64 border-e pe-4">Sidebar</aside>
  <main className="flex-1 ps-4">Content</main>
</div>
```

### Form Input with Icon

```tsx
<div className="relative">
  <Input className="ps-10" />
  <div className="absolute start-3 top-1/2 -translate-y-1/2">
    <Search className="w-4 h-4" />
  </div>
</div>
```

### Card with Action

```tsx
<Card className="p-4">
  <h3 className="text-start">{title}</h3>
  <p className="text-start">{description}</p>
  <Button className="mt-4">
    <span>Learn More</span>
    <RTLIcon icon={ArrowRight} className="ms-2" />
  </Button>
</Card>
```

## ✅ Do's

- ✅ Use logical properties (start/end)
- ✅ Use RTLIcon for directional icons
- ✅ Use text-start/text-end
- ✅ Test in both LTR and RTL
- ✅ Use the utility functions

## ❌ Don'ts

- ❌ Don't use physical properties (left/right)
- ❌ Don't hardcode text-left/text-right
- ❌ Don't forget to test RTL
- ❌ Don't use raw Lucide icons for directional elements
- ❌ Don't assume LTR layout

## 🧪 Testing

### Switch Language

```tsx
import { useTranslation } from '@/i18n';

const { changeLanguage } = useTranslation();

// Switch to Arabic
await changeLanguage('ar');

// Switch to English
await changeLanguage('en');
```

### Check Direction

```tsx
// In browser console
console.log(document.documentElement.dir); // "rtl" or "ltr"
console.log(document.documentElement.lang); // "ar" or "en"
```

### Run Tests

```bash
# Run RTL tests
npm run test:run src/utils/rtl.test.ts

# Run RTLIcon tests
npm run test:run src/components/common/RTLIcon.test.tsx
```

## 📚 Resources

- [RTL_GUIDE.md](./RTL_GUIDE.md) - Complete guide
- [RTL_IMPLEMENTATION_SUMMARY.md](./RTL_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [RTLExample.tsx](./examples/RTLExample.tsx) - Live examples

## 🆘 Troubleshooting

### Text not aligning?
Use `text-start` instead of `text-left`

### Icons not mirroring?
Use `<RTLIcon icon={YourIcon} />` instead of `<YourIcon />`

### Margins not reversing?
Use `ms-4` instead of `ml-4`

### Form inputs not aligning?
Check that `dir="rtl"` is set on document

## 💡 Pro Tips

1. **Always use logical properties** - They work in both directions
2. **Use RTLIcon wrapper** - Automatic mirroring for directional icons
3. **Test early, test often** - Switch languages frequently during development
4. **Check the examples** - RTLExample.tsx has comprehensive patterns
5. **Use the utilities** - Don't reinvent the wheel, use `@/utils/rtl`

## 🎯 Remember

> When in doubt, use logical properties (start/end) instead of physical (left/right)

This ensures your UI works perfectly in both LTR and RTL modes!
