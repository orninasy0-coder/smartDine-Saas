# FloatingShapes Component

## Overview

The `FloatingShapes` component creates an animated background with floating geometric shapes that add visual interest and depth to your pages. It uses Framer Motion for smooth, performant animations.

## Features

- ✨ **Smooth Animations**: Floating, scaling, and rotating animations using Framer Motion
- 🎨 **Multiple Shape Types**: Circles, squares, and triangles with random distribution
- 🌈 **Theme-Aware**: Automatically adapts colors for light and dark modes
- ⚡ **Performance Optimized**: Uses `useMemo` to prevent unnecessary recalculations
- 🎯 **Customizable**: Adjustable shape count and styling
- ♿ **Accessible**: Marked with `aria-hidden` and `pointer-events-none`

## Installation

The component is already included in the common components. Import it from:

```tsx
import { FloatingShapes } from '@/components/common';
```

## Usage

### Basic Usage

```tsx
import { FloatingShapes } from '@/components/common';

function MyPage() {
  return (
    <div className="relative min-h-screen">
      <FloatingShapes />
      
      {/* Your content here */}
      <div className="relative z-10">
        <h1>My Content</h1>
      </div>
    </div>
  );
}
```

### Custom Shape Count

```tsx
<FloatingShapes count={12} />
```

### With Custom Styling

```tsx
<FloatingShapes 
  count={10} 
  className="opacity-50" 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `8` | Number of floating shapes to render |
| `className` | `string` | `''` | Additional CSS classes for the container |

## Shape Properties

Each shape is randomly generated with the following properties:

- **Size**: 50-200px
- **Position**: Random X and Y coordinates (0-100%)
- **Duration**: 15-25 seconds per animation cycle
- **Delay**: 0-5 seconds initial delay
- **Type**: Circle, square, or triangle
- **Color**: Theme-aware primary or secondary colors with transparency

## Animation Details

The shapes animate with:
- **Vertical movement**: -30px to 0px
- **Horizontal movement**: -15px to 15px
- **Scale**: 0.9x to 1.1x
- **Rotation**: Varies by shape type
- **Easing**: `easeInOut` for smooth transitions
- **Loop**: Infinite repeat

## Styling

The component uses:
- `fixed` positioning to cover the entire viewport
- `pointer-events-none` to allow interaction with content below
- `blur-2xl` for a soft, diffused appearance
- Theme-aware colors from Tailwind CSS

## Best Practices

1. **Z-Index Management**: Ensure your content has `relative z-10` or higher to appear above the shapes
2. **Performance**: Keep the count reasonable (8-15 shapes) for optimal performance
3. **Contrast**: The shapes use low opacity to avoid overwhelming content
4. **Accessibility**: The component is marked as decorative with `aria-hidden="true"`

## Example with Content

```tsx
function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background shapes */}
      <FloatingShapes count={10} />
      
      {/* Content with proper z-index */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p>Your content here...</p>
      </div>
    </div>
  );
}
```

## Theme Integration

The component automatically adapts to your theme:

- **Light Mode**: Uses lighter, more transparent colors
- **Dark Mode**: Uses slightly more vibrant colors with adjusted opacity

Colors used:
- Primary: Blue tones
- Secondary: Purple tones

## Performance Considerations

- Shapes are generated once on mount and when count changes using `useEffect`
- Framer Motion optimizes animations using GPU acceleration
- The component uses CSS transforms for better performance
- Recommended maximum: 15-20 shapes for smooth performance on all devices
- Shape properties are stable after initial generation to prevent unnecessary re-renders

## Browser Support

Works in all modern browsers that support:
- CSS transforms
- CSS blur filters
- Framer Motion (React 16.8+)

## Related Components

- `ThemeProvider`: Provides theme context for color adaptation
- `Container`: For content layout above the shapes
- `Section`: For structured content sections
