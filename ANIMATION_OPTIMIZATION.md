# Animation Performance Optimization Guide

This document describes the animation performance optimizations implemented in the SmartDine SaaS platform.

## Overview

Animation performance is critical for providing a smooth user experience. This implementation includes:

- **GPU-accelerated transforms** for 60fps animations
- **Reduced motion support** for accessibility
- **Performance monitoring** utilities
- **Optimized animation variants** for common patterns
- **Custom hooks** for easy integration

## Key Features

### 1. GPU Acceleration

All animations use GPU-accelerated CSS properties:

```typescript
// ✅ Good - GPU accelerated
transform: translateY(20px) translateZ(0);
opacity: 0.5;

// ❌ Bad - CPU intensive
top: 20px;
left: 10px;
```

The `translateZ(0)` hack forces GPU acceleration by creating a new composite layer.

### 2. Reduced Motion Support

Respects user's motion preferences:

```typescript
import { prefersReducedMotion } from '@/utils/animationOptimization';

if (prefersReducedMotion()) {
  // Use simple fade instead of complex animation
}
```

All animations automatically simplify when `prefers-reduced-motion: reduce` is detected.

### 3. Optimized Variants

Pre-built animation variants optimized for performance:

```typescript
import { animationVariants } from '@/utils/animationOptimization';

// Available variants:
// - fadeIn
// - slideUp, slideDown, slideLeft, slideRight
// - scaleIn, scaleUp
// - staggerContainer, staggerItem
```

### 4. Performance Monitoring

Track animation performance in real-time:

```typescript
import { AnimationPerformanceMonitor } from '@/utils/animationOptimization';

const monitor = new AnimationPerformanceMonitor();
const fps = monitor.measure();
const isGood = monitor.isPerformanceGood(); // true if >= 55fps
```

## Usage

### Using Custom Hooks

#### Basic Animation

```tsx
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { motion } from 'framer-motion';

function MyComponent() {
  const { variants, transition } = useOptimizedAnimation('slideUp');

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      transition={transition}
    >
      Content
    </motion.div>
  );
}
```

#### Intersection Observer Animation

Only animate when element is visible:

```tsx
import { useInViewAnimation } from '@/hooks/useOptimizedAnimation';
import { motion } from 'framer-motion';

function MyComponent() {
  const { ref, variants, animate, transition } = useInViewAnimation('fadeIn');

  return (
    <motion.div
      ref={ref}
      variants={variants}
      animate={animate}
      transition={transition}
    >
      Content animates when scrolled into view
    </motion.div>
  );
}
```

#### Scroll-Based Animation

```tsx
import { useScrollAnimation } from '@/hooks/useOptimizedAnimation';

function MyComponent() {
  const { scrollProgress } = useScrollAnimation();

  return (
    <div style={{ opacity: scrollProgress }}>
      Fades in as you scroll
    </div>
  );
}
```

### Using CSS Animations

For simple animations, use CSS classes:

```tsx
// GPU-accelerated CSS animations
<div className="animate-slide-up">Slides up</div>
<div className="animate-fade-in">Fades in</div>
<div className="animate-scale-in">Scales in</div>

// Performance hints
<div className="gpu-accelerated">GPU accelerated</div>
<div className="will-change-transform">Optimized for transform</div>
```

### Using Utility Functions

```typescript
import {
  gpuAcceleratedTransform,
  optimizedTransition,
  throttleAnimationFrame,
  debounce,
} from '@/utils/animationOptimization';

// Generate GPU-accelerated transforms
const transform = gpuAcceleratedTransform.translateY(100);

// Use optimized transitions
const transition = optimizedTransition.medium;

// Throttle high-frequency updates
const handleScroll = throttleAnimationFrame(() => {
  // Update animation
});

// Debounce resize events
const handleResize = debounce(() => {
  // Recalculate layout
}, 200);
```

## Performance Best Practices

### 1. Use GPU-Accelerated Properties

✅ **Good:**
- `transform: translate()`, `scale()`, `rotate()`
- `opacity`
- `filter` (use sparingly)

❌ **Avoid:**
- `top`, `left`, `right`, `bottom`
- `width`, `height`
- `margin`, `padding`

### 2. Limit will-change Usage

```css
/* ✅ Good - Apply only during animation */
.animating {
  will-change: transform;
}

/* ❌ Bad - Always applied */
.element {
  will-change: transform, opacity, filter;
}
```

### 3. Use Appropriate Transition Types

```typescript
// Fast UI feedback (buttons, hovers)
optimizedTransition.fast // 150ms

// Standard animations (modals, slides)
optimizedTransition.medium // 300ms

// Dramatic effects (page transitions)
optimizedTransition.slow // 500ms

// Bouncy effects (use sparingly)
optimizedTransition.spring
```

### 4. Reduce Animation Complexity

```typescript
// ✅ Good - Simple, performant
animate={{ opacity: 1, y: 0 }}

// ⚠️ Caution - More complex
animate={{ 
  opacity: 1, 
  y: 0, 
  scale: 1, 
  rotate: 0 
}}

// ❌ Avoid - Too complex
animate={{ 
  opacity: 1, 
  y: 0, 
  scale: 1, 
  rotate: 0,
  filter: 'blur(0px)',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)'
}}
```

### 5. Stagger Children Carefully

```typescript
// ✅ Good - Reasonable stagger
staggerChildren: 0.1 // 100ms between items

// ❌ Bad - Too many items or too fast
staggerChildren: 0.01 // 10ms - too fast
// with 100 children = performance issues
```

## Accessibility

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who prefer reduced motion will see:
- Simple fades instead of slides
- No scale or rotation animations
- Instant transitions instead of smooth ones

### Testing Reduced Motion

**Chrome DevTools:**
1. Open DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "reduce"

**Firefox:**
1. Type `about:config` in address bar
2. Search for `ui.prefersReducedMotion`
3. Set to `1`

## Performance Monitoring

### Using the Performance Hook

```tsx
import { useAnimationPerformance } from '@/hooks/useOptimizedAnimation';

function PerformanceIndicator() {
  const { fps, isGood } = useAnimationPerformance();

  return (
    <div>
      FPS: {fps} {isGood ? '✅' : '⚠️'}
    </div>
  );
}
```

### Performance Targets

- **Excellent:** 60 FPS
- **Good:** 55-60 FPS
- **Acceptable:** 45-55 FPS
- **Poor:** < 45 FPS

If FPS drops below 55, consider:
1. Reducing number of animated elements
2. Simplifying animation complexity
3. Using CSS animations instead of JS
4. Implementing virtualization for lists

## Migration Guide

### From Old Animations

```tsx
// ❌ Before - Not optimized
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// ✅ After - Optimized
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

function MyComponent() {
  const { variants, transition } = useOptimizedAnimation('slideUp');
  
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      transition={transition}
    >
      Content
    </motion.div>
  );
}
```

### From CSS to Framer Motion

```tsx
// ❌ Before - CSS only
<div className="animate-slide-up">Content</div>

// ✅ After - Framer Motion with reduced motion support
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

function MyComponent() {
  const { variants, transition, shouldReduceMotion } = useOptimizedAnimation('slideUp');
  
  if (shouldReduceMotion) {
    return <div>Content</div>;
  }
  
  return (
    <motion.div variants={variants} initial="initial" animate="animate" transition={transition}>
      Content
    </motion.div>
  );
}
```

## Common Patterns

### Modal/Dialog Animation

```tsx
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

function Modal({ isOpen, children }) {
  const { variants, transition } = useOptimizedAnimation('scaleIn');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### List Item Stagger

```tsx
import { animationVariants } from '@/utils/animationOptimization';

function List({ items }) {
  return (
    <motion.ul variants={animationVariants.staggerContainer} initial="initial" animate="animate">
      {items.map((item) => (
        <motion.li key={item.id} variants={animationVariants.staggerItem}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Page Transition

```tsx
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

function PageTransition({ children }) {
  const { variants, transition } = useOptimizedAnimation('fadeIn');

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
```

## Troubleshooting

### Animations Feel Janky

1. Check FPS using `useAnimationPerformance()`
2. Reduce number of animated elements
3. Simplify animation properties
4. Use CSS animations for simple effects
5. Check for layout thrashing (reading/writing DOM in loops)

### Animations Not Working

1. Verify Framer Motion is installed
2. Check for conflicting CSS
3. Ensure `initial` and `animate` props are set
4. Check browser console for errors

### Reduced Motion Not Working

1. Test in browser with reduced motion enabled
2. Verify `prefersReducedMotion()` returns correct value
3. Check CSS media query is applied
4. Ensure components use `useOptimizedAnimation` hook

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations Performance](https://web.dev/animations/)
- [CSS Triggers](https://csstriggers.com/)
- [Reduced Motion Guide](https://web.dev/prefers-reduced-motion/)

## Summary

This animation optimization system provides:

✅ **60fps animations** using GPU acceleration  
✅ **Accessibility support** with reduced motion  
✅ **Performance monitoring** for debugging  
✅ **Easy-to-use hooks** for common patterns  
✅ **Optimized variants** for best practices  
✅ **CSS fallbacks** for simple animations  

Use these tools to create smooth, performant, and accessible animations throughout the application.
