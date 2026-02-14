# ARButton Component

## Overview

The `ARButton` component is a reusable button that triggers the AR (Augmented Reality) viewer for dishes with 3D models. It intelligently renders only when a 3D model URL is available, making it perfect for conditional AR features.

## Features

✅ **Conditional Rendering** - Only displays when `modelUrl` is provided
✅ **Event Handling** - Stops propagation to prevent parent click handlers
✅ **Flexible Styling** - Supports all shadcn/ui button variants and sizes
✅ **Icon-Only Mode** - Compact display option for space-constrained layouts
✅ **Customizable** - Custom text, styling, and behavior
✅ **Accessible** - Proper ARIA labels and keyboard navigation
✅ **Type Safe** - Full TypeScript support with comprehensive prop types
✅ **Well Tested** - 10 unit tests covering all functionality

## Installation

The component is already integrated into the AR feature module:

```tsx
import { ARButton } from '@/features/ar';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelUrl` | `string \| undefined` | - | URL of the 3D model (GLB/glTF). Button won't render if not provided. |
| `onARClick` | `() => void` | - | Callback function when button is clicked |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size variant |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'outline'` | Button style variant |
| `className` | `string` | - | Additional CSS classes |
| `showText` | `boolean` | `true` | Whether to show button text |
| `text` | `string` | `'View in AR'` | Custom button text |
| `disabled` | `boolean` | `false` | Whether the button is disabled |

## Usage Examples

### Basic Usage

```tsx
import { ARButton } from '@/features/ar';

function DishCard({ dish }) {
  const handleARClick = () => {
    // Open AR viewer
    console.log('Opening AR viewer for', dish.name);
  };

  return (
    <div>
      <h3>{dish.name}</h3>
      <ARButton
        modelUrl={dish.modelUrl}
        onARClick={handleARClick}
      />
    </div>
  );
}
```

### Icon-Only Button (Compact)

```tsx
<ARButton
  modelUrl={dish.modelUrl}
  onARClick={handleARClick}
  size="icon"
  showText={false}
/>
```

### Custom Styling

```tsx
<ARButton
  modelUrl={dish.modelUrl}
  onARClick={handleARClick}
  variant="secondary"
  size="sm"
  text="3D View"
  className="my-custom-class"
/>
```

### In a Dish Card

```tsx
import { ARButton } from '@/features/ar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

function DishCard({ dish }) {
  const [isAROpen, setIsAROpen] = useState(false);

  return (
    <Card>
      <img src={dish.imageUrl} alt={dish.name} />
      <CardContent>
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>${dish.price}</span>
        <div className="flex gap-2">
          <ARButton
            modelUrl={dish.modelUrl}
            onARClick={() => setIsAROpen(true)}
            size="sm"
            showText={false}
          />
          <Button size="sm">
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
```

### With AR Viewer Dialog

```tsx
import { ARButton, ARCanvas, ARScene, ARLoading } from '@/features/ar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Suspense } from 'react';

function DishWithAR({ dish }) {
  const [isAROpen, setIsAROpen] = useState(false);

  return (
    <>
      <ARButton
        modelUrl={dish.modelUrl}
        onARClick={() => setIsAROpen(true)}
      />

      <Dialog open={isAROpen} onOpenChange={setIsAROpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <ARCanvas className="h-full w-full">
            <ARScene>
              <Suspense fallback={<ARLoading />}>
                {/* Your 3D model component here */}
              </Suspense>
            </ARScene>
          </ARCanvas>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Behavior

### Conditional Rendering

The button automatically hides when no `modelUrl` is provided:

```tsx
// This won't render anything
<ARButton onARClick={handleClick} />

// This will render the button
<ARButton modelUrl="https://example.com/model.glb" onARClick={handleClick} />
```

### Event Propagation

The button stops event propagation to prevent triggering parent click handlers:

```tsx
<div onClick={handleCardClick}>
  <ARButton
    modelUrl={dish.modelUrl}
    onARClick={handleARClick}
  />
  {/* Clicking the AR button won't trigger handleCardClick */}
</div>
```

## Styling

The component uses shadcn/ui's Button component, so it inherits all the styling capabilities:

- **Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Sizes**: `default`, `sm`, `lg`, `icon`
- **Dark Mode**: Automatically adapts to theme
- **Custom Classes**: Add your own via `className` prop

## Accessibility

The component is fully accessible:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Disabled state handling

## Testing

The component has comprehensive test coverage:

```bash
npm test -- ARButton.test.tsx --run
```

**Test Coverage:**
- ✅ Renders with modelUrl
- ✅ Doesn't render without modelUrl
- ✅ Calls onClick handler
- ✅ Stops event propagation
- ✅ Custom text rendering
- ✅ Icon-only mode
- ✅ Disabled state
- ✅ Custom className
- ✅ Size variants
- ✅ Style variants

## Integration

The ARButton is designed to work seamlessly with:

- **DishCard** - Add AR viewing to dish cards
- **ARCanvas** - Display 3D models in AR viewer
- **ARScene** - Provide lighting and controls
- **Dialog** - Show AR viewer in modal
- **Menu Components** - Integrate with menu browsing

## Best Practices

1. **Always provide modelUrl conditionally** - Check if the dish has a 3D model before passing the URL
2. **Use icon-only mode in compact layouts** - Set `showText={false}` and `size="icon"` for tight spaces
3. **Stop propagation is automatic** - No need to manually prevent parent clicks
4. **Combine with Dialog** - Show AR viewer in a modal for better UX
5. **Handle loading states** - Use Suspense with ARLoading for smooth model loading

## Files

- `ARButton.tsx` - Main component
- `ARButton.test.tsx` - Unit tests
- `ARButton.example.tsx` - Usage examples
- `ARButton.integration.example.tsx` - Full integration demo
- `ARButton.README.md` - This documentation

## Related Components

- `ARCanvas` - 3D canvas wrapper
- `ARScene` - Scene with lighting and controls
- `ARLoading` - Loading indicator
- `DishCard` - Dish display component

## Next Steps

After implementing ARButton, the next tasks are:

- **Task 7.3**: Enhanced ThreeJS Canvas Component
- **Task 7.4**: AR Controls Component
- **Task 7.5**: 3D Model Loading (GLB/glTF)
- **Task 7.6**: Performance Optimizations
- **Task 7.7**: Fallback Gallery Component
- **Task 7.8**: Device Capability Detection

## Support

For issues or questions about the ARButton component, refer to:
- Main AR README: `src/features/ar/README.md`
- Setup Summary: `src/features/ar/SETUP_SUMMARY.md`
- Example files in `src/features/ar/components/`
