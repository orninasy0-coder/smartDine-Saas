# Icon System Guide

## Overview

SmartDine uses [Lucide Icons](https://lucide.dev/) as the primary icon library. This guide explains how to use icons consistently throughout the application.

## Installation

Lucide React is already installed in the project:

```bash
npm install lucide-react
```

## Usage

### Method 1: Using the Icon Component (Recommended)

The `Icon` component provides a consistent interface with predefined size variants:

```tsx
import { Icon } from '@/components/common';
import { Home } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <Icon icon={Home} size="md" />
      <Icon icon={Home} size="lg" className="text-primary" />
    </div>
  );
}
```

**Size Variants:**

- `xs` - 12px (h-3 w-3)
- `sm` - 16px (h-4 w-4)
- `md` - 20px (h-5 w-5) - Default
- `lg` - 24px (h-6 w-6)
- `xl` - 32px (h-8 w-8)

### Method 2: Using Centralized Icon Exports

Import commonly used icons from the centralized exports:

```tsx
import { HomeIcon, UserIcon, SettingsIcon } from '@/components/common/icons';

function MyComponent() {
  return (
    <div>
      <HomeIcon className="h-5 w-5" />
      <UserIcon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
```

### Method 3: Direct Import from Lucide React

For icons not in the centralized exports:

```tsx
import { Sparkles } from 'lucide-react';

function MyComponent() {
  return <Sparkles className="h-5 w-5" />;
}
```

## Icon Categories

### Navigation & UI

- `Home`, `Menu`, `X`, `ChevronLeft`, `ChevronRight`, `ChevronDown`, `ChevronUp`
- `ArrowLeft`, `ArrowRight`, `Search`, `Filter`

### User & Authentication

- `User`, `Users`, `UserPlus`, `LogIn`, `LogOut`
- `Lock`, `Unlock`, `Key`, `Shield`

### Theme & Settings

- `Sun`, `Moon`, `Monitor`, `Settings`, `Palette`

### Communication

- `Bell`, `Mail`, `MessageSquare`, `Send`, `Phone`

### Restaurant & Food

- `UtensilsCrossed`, `ChefHat`, `Coffee`, `Pizza`, `Soup`
- `Wine`, `Beer`, `Cake`, `IceCream`

### Order & Delivery

- `ShoppingCart`, `Package`, `Truck`, `MapPin`, `Clock`
- `CheckCircle`, `XCircle`, `AlertCircle`

### Business & Analytics

- `BarChart`, `LineChart`, `PieChart`, `TrendingUp`
- `DollarSign`, `CreditCard`, `Receipt`

### Media & Content

- `Image`, `Upload`, `Download`, `Camera`, `Video`

### Actions & Status

- `Plus`, `Minus`, `Edit`, `Trash`, `Save`, `Copy`
- `Check`, `RefreshCw`, `Loader`

### Social Media

- `Facebook`, `Twitter`, `Instagram`, `Linkedin`, `Youtube`

### QR & Technology

- `QrCode`, `Scan`, `Smartphone`, `Wifi`, `Bluetooth`

### AR & 3D

- `Box`, `Cube`, `Layers`, `ZoomIn`, `ZoomOut`, `Rotate`

## Best Practices

### 1. Consistent Sizing

Use Tailwind classes for consistent sizing:

```tsx
// Small icons (16px)
<Icon icon={User} size="sm" />

// Medium icons (20px) - Default
<Icon icon={User} size="md" />

// Large icons (24px)
<Icon icon={User} size="lg" />
```

### 2. Color Consistency

Use Tailwind color utilities:

```tsx
// Primary color
<Icon icon={Home} className="text-primary" />

// Muted foreground
<Icon icon={Settings} className="text-muted-foreground" />

// Destructive (red)
<Icon icon={Trash} className="text-destructive" />
```

### 3. Accessibility

Always provide accessible labels:

```tsx
// With button
<Button size="icon" aria-label="Settings">
  <Icon icon={Settings} />
</Button>

// With screen reader text
<Icon icon={User} />
<span className="sr-only">User profile</span>
```

### 4. Icon with Text

Maintain consistent spacing:

```tsx
<Button>
  <Icon icon={Plus} size="sm" className="mr-2" />
  Add Item
</Button>

<div className="flex items-center gap-2">
  <Icon icon={CheckCircle} size="sm" className="text-success" />
  <span>Completed</span>
</div>
```

### 5. Loading States

Use animated icons for loading:

```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="h-4 w-4 animate-spin" />;
```

## Common Patterns

### Icon Button

```tsx
<Button variant="ghost" size="icon">
  <Icon icon={Settings} />
</Button>
```

### Icon with Badge

```tsx
<div className="relative">
  <Icon icon={Bell} />
  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs">3</span>
</div>
```

### Dropdown Menu Item

```tsx
<DropdownMenuItem>
  <Icon icon={User} size="sm" className="mr-2" />
  <span>Profile</span>
</DropdownMenuItem>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
  <Icon icon={CheckCircle} size="sm" className="text-green-500" />
  <span>Active</span>
</div>
```

## RTL Support

Icons automatically work with RTL layouts. For directional icons, consider using logical properties:

```tsx
// Use ChevronLeft/Right based on direction
const ChevronIcon = isRTL ? ChevronRight : ChevronLeft;
<Icon icon={ChevronIcon} />;
```

## Performance Tips

1. **Tree Shaking**: Lucide React supports tree shaking, so only imported icons are bundled
2. **Lazy Loading**: For rarely used icons, consider lazy loading
3. **Icon Sprites**: For repeated icons, consider using the Icon component for consistency

## Adding New Icons

1. Check if the icon exists in [Lucide Icons](https://lucide.dev/icons)
2. If commonly used, add to `src/components/common/icons.ts`
3. Otherwise, import directly from `lucide-react`

## Migration Guide

If you have existing icon usage, migrate to the new system:

### Before

```tsx
import { Home } from 'lucide-react';
<Home className="h-5 w-5" />;
```

### After (Recommended)

```tsx
import { Icon, Home } from '@/components/common';
<Icon icon={Home} size="md" />;
```

## Resources

- [Lucide Icons Documentation](https://lucide.dev/)
- [Lucide Icons Gallery](https://lucide.dev/icons)
- [Lucide React GitHub](https://github.com/lucide-icons/lucide)
