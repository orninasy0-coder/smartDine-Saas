import { Html } from '@react-three/drei';

/**
 * ARLoading - Loading indicator for 3D models
 * Displays while 3D assets are being loaded
 */
export function ARLoading() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </Html>
  );
}
