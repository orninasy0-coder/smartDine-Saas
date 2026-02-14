/**
 * Lazy-loaded AR Viewer Components
 * 
 * Code-split heavy Three.js library and AR components to reduce initial bundle size.
 * AR features are only loaded when user interacts with AR functionality.
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loading } from '@/components/common';

// Lazy load AR components
const ARCanvas = lazy(() =>
  import('@/features/ar/components/ARCanvas').then((m) => ({
    default: m.ARCanvas,
  }))
);

const ARScene = lazy(() =>
  import('@/features/ar/components/ARScene').then((m) => ({
    default: m.ARScene,
  }))
);

const ARControls = lazy(() =>
  import('@/features/ar/components/ARControls').then((m) => ({
    default: m.ARControls,
  }))
);

const Model3D = lazy(() =>
  import('@/features/ar/components/Model3D').then((m) => ({
    default: m.Model3D,
  }))
);

const ModelLOD = lazy(() =>
  import('@/features/ar/components/ModelLOD').then((m) => ({
    default: m.ModelLOD,
  }))
);

// AR loading fallback
const ARLoadingFallback = () => (
  <div className="flex items-center justify-center h-96 bg-card rounded-lg border">
    <Loading size="lg" text="Loading 3D viewer..." />
  </div>
);

// Wrapper components with Suspense
export function LazyARCanvas(
  props: ComponentType<typeof ARCanvas> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ARLoadingFallback />}>
      <ARCanvas {...props} />
    </Suspense>
  );
}

export function LazyARScene(
  props: ComponentType<typeof ARScene> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ARLoadingFallback />}>
      <ARScene {...props} />
    </Suspense>
  );
}

export function LazyARControls(
  props: ComponentType<typeof ARControls> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ARLoadingFallback />}>
      <ARControls {...props} />
    </Suspense>
  );
}

export function LazyModel3D(
  props: ComponentType<typeof Model3D> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ARLoadingFallback />}>
      <Model3D {...props} />
    </Suspense>
  );
}

export function LazyModelLOD(
  props: ComponentType<typeof ModelLOD> extends ComponentType<infer P>
    ? P
    : never
) {
  return (
    <Suspense fallback={<ARLoadingFallback />}>
      <ModelLOD {...props} />
    </Suspense>
  );
}
