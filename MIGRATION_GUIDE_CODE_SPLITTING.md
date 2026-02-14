# Migration Guide: Adopting Code Splitting

## Overview

This guide helps you migrate existing components to use the new code splitting infrastructure.

## When to Migrate

Migrate components that:
- ✅ Use heavy libraries (Three.js, Recharts, Leaflet)
- ✅ Are not in the critical render path
- ✅ Are conditionally rendered (modals, tabs, etc.)
- ✅ Are large (> 50 KB)

Don't migrate:
- ❌ Small components (< 50 KB)
- ❌ Components in critical render path
- ❌ Components that are always visible

## Migration Steps

### Step 1: Identify Heavy Components

Check your component's dependencies:

```typescript
// If your component imports these, consider lazy loading:
import { Canvas } from '@react-three/fiber';  // Three.js - ~600 KB
import { LineChart } from 'recharts';         // Recharts - ~200 KB
import { MapContainer } from 'react-leaflet'; // Leaflet - ~150 KB
```

### Step 2: Use Pre-built Lazy Wrappers

#### Before:
```typescript
import { RevenueChart } from '@/features/restaurant-owner/components/RevenueChart';

function Dashboard() {
  return <RevenueChart data={data} />;
}
```

#### After:
```typescript
import { LazyRevenueChart } from '@/components/lazy';

function Dashboard() {
  return <LazyRevenueChart data={data} />;
}
```

### Step 3: Create Custom Lazy Wrappers (if needed)

If you have a custom heavy component:

#### Before:
```typescript
import { HeavyFeature } from './HeavyFeature';

function Page() {
  return <HeavyFeature />;
}
```

#### After:

1. Create a lazy wrapper:
```typescript
// src/components/lazy/LazyHeavyFeature.tsx
import { lazy, Suspense } from 'react';
import { Loading } from '@/components/common';

const HeavyFeature = lazy(() => import('./HeavyFeature'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loading size="lg" text="Loading feature..." />
  </div>
);

export function LazyHeavyFeature(props) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HeavyFeature {...props} />
    </Suspense>
  );
}
```

2. Use it:
```typescript
import { LazyHeavyFeature } from '@/components/lazy/LazyHeavyFeature';

function Page() {
  return <LazyHeavyFeature />;
}
```

### Step 4: Add Preloading (Optional)

For better UX, preload on user intent:

```typescript
import { preloadComponent } from '@/utils/lazyLoad';
import { LazyHeavyFeature } from '@/components/lazy/LazyHeavyFeature';

function Page() {
  return (
    <button
      onMouseEnter={() => preloadComponent(LazyHeavyFeature)}
      onClick={() => setShow(true)}
    >
      Show Feature
    </button>
  );
}
```

## Common Patterns

### Pattern 1: Conditional Rendering

#### Before:
```typescript
function Page() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <RevenueChart data={data} />}
    </>
  );
}
```

#### After:
```typescript
import { LazyRevenueChart } from '@/components/lazy';

function Page() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <LazyRevenueChart data={data} />}
    </>
  );
}
```

### Pattern 2: Tabs/Accordions

#### Before:
```typescript
function Dashboard() {
  return (
    <Tabs>
      <TabsContent value="overview">
        <DashboardStats />
      </TabsContent>
      <TabsContent value="charts">
        <RevenueChart />
        <OrderVolumeChart />
      </TabsContent>
    </Tabs>
  );
}
```

#### After:
```typescript
import { LazyRevenueChart, LazyOrderVolumeChart } from '@/components/lazy';

function Dashboard() {
  return (
    <Tabs>
      <TabsContent value="overview">
        <DashboardStats />
      </TabsContent>
      <TabsContent value="charts">
        <LazyRevenueChart />
        <LazyOrderVolumeChart />
      </TabsContent>
    </Tabs>
  );
}
```

### Pattern 3: Modals/Dialogs

#### Before:
```typescript
function Page() {
  return (
    <Dialog>
      <DialogContent>
        <ARViewer model={model} />
      </DialogContent>
    </Dialog>
  );
}
```

#### After:
```typescript
import { LazyARCanvas, LazyModel3D } from '@/components/lazy';

function Page() {
  return (
    <Dialog>
      <DialogContent>
        <LazyARCanvas>
          <LazyModel3D modelUrl={model} />
        </LazyARCanvas>
      </DialogContent>
    </Dialog>
  );
}
```

## Testing After Migration

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Check chunk sizes:**
   Look for warnings about large chunks (> 1000 KB)

3. **Test in browser:**
   - Open DevTools → Network tab
   - Navigate to pages with lazy components
   - Verify chunks load on-demand

4. **Test error handling:**
   - Throttle network to "Slow 3G"
   - Verify loading states appear
   - Verify retry logic works

## Rollback Plan

If you encounter issues:

1. **Revert to direct imports:**
   ```typescript
   // Change this:
   import { LazyComponent } from '@/components/lazy';
   
   // Back to this:
   import { Component } from './Component';
   ```

2. **Remove Suspense wrapper:**
   ```typescript
   // Change this:
   <Suspense fallback={<Loading />}>
     <Component />
   </Suspense>
   
   // Back to this:
   <Component />
   ```

## Checklist

Before migrating a component:
- [ ] Component uses heavy library (> 50 KB)
- [ ] Component is not in critical render path
- [ ] Component has appropriate loading fallback
- [ ] Component is tested after migration
- [ ] Bundle size verified after build

After migration:
- [ ] Component loads correctly
- [ ] Loading state displays properly
- [ ] Error handling works
- [ ] Bundle size reduced
- [ ] No TypeScript errors

## Need Help?

- See `CODE_SPLITTING.md` for detailed documentation
- See `QUICK_START_CODE_SPLITTING.md` for quick reference
- See `src/examples/CodeSplittingExample.tsx` for working examples

## Performance Monitoring

Track these metrics before and after migration:

- **Initial bundle size** (should decrease)
- **Time to Interactive** (should improve)
- **First Contentful Paint** (should improve)
- **Chunk load time** (new metric to monitor)

Use Lighthouse or WebPageTest to measure these metrics.
