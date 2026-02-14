import { OrbitControls } from '@react-three/drei';
import { useRef, useImperativeHandle, forwardRef } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export interface ARControlsRef {
  /**
   * Reset camera to initial position
   */
  reset: () => void;
  /**
   * Zoom in by a specific amount
   */
  zoomIn: (amount?: number) => void;
  /**
   * Zoom out by a specific amount
   */
  zoomOut: (amount?: number) => void;
  /**
   * Get current zoom level (distance from target)
   */
  getZoomLevel: () => number;
  /**
   * Set zoom level (distance from target)
   */
  setZoomLevel: (distance: number) => void;
}

interface ARControlsProps {
  /**
   * Enable panning (moving the camera position)
   * @default true
   */
  enablePan?: boolean;

  /**
   * Enable zooming
   * @default true
   */
  enableZoom?: boolean;

  /**
   * Enable rotation
   * @default true
   */
  enableRotate?: boolean;

  /**
   * Minimum zoom distance
   * @default 2
   */
  minDistance?: number;

  /**
   * Maximum zoom distance
   * @default 10
   */
  maxDistance?: number;

  /**
   * Maximum polar angle (prevents camera from going below ground)
   * @default Math.PI / 2 (90 degrees)
   */
  maxPolarAngle?: number;

  /**
   * Minimum polar angle
   * @default 0
   */
  minPolarAngle?: number;

  /**
   * Enable smooth camera movement (damping)
   * @default true
   */
  enableDamping?: boolean;

  /**
   * Damping factor (lower = smoother but slower)
   * @default 0.05
   */
  dampingFactor?: number;

  /**
   * Rotation speed
   * @default 0.5
   */
  rotateSpeed?: number;

  /**
   * Zoom speed
   * @default 0.8
   */
  zoomSpeed?: number;

  /**
   * Pan speed
   * @default 1
   */
  panSpeed?: number;

  /**
   * Auto-rotate the camera
   * @default false
   */
  autoRotate?: boolean;

  /**
   * Auto-rotate speed (negative for reverse)
   * @default 2
   */
  autoRotateSpeed?: number;

  /**
   * Callback when controls change
   */
  onChange?: () => void;

  /**
   * Callback when controls start changing
   */
  onStart?: () => void;

  /**
   * Callback when controls stop changing
   */
  onEnd?: () => void;
}

/**
 * ARControls - Enhanced camera controls for AR viewer
 * Provides configurable OrbitControls with smooth interactions and programmatic control
 */
export const ARControls = forwardRef<ARControlsRef, ARControlsProps>(
  (
    {
      enablePan = true,
      enableZoom = true,
      enableRotate = true,
      minDistance = 2,
      maxDistance = 10,
      maxPolarAngle = Math.PI / 2,
      minPolarAngle = 0,
      enableDamping = true,
      dampingFactor = 0.05,
      rotateSpeed = 0.5,
      zoomSpeed = 0.8,
      panSpeed = 1,
      autoRotate = false,
      autoRotateSpeed = 2,
      onChange,
      onStart,
      onEnd,
    }: ARControlsProps,
    ref
  ) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // Expose control methods via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
      },
      zoomIn: (amount = 1) => {
        if (controlsRef.current) {
          const currentDistance = controlsRef.current.getDistance();
          const newDistance = Math.max(
            minDistance,
            currentDistance - amount
          );
          controlsRef.current.dollyIn(currentDistance / newDistance);
          controlsRef.current.update();
        }
      },
      zoomOut: (amount = 1) => {
        if (controlsRef.current) {
          const currentDistance = controlsRef.current.getDistance();
          const newDistance = Math.min(
            maxDistance,
            currentDistance + amount
          );
          controlsRef.current.dollyOut(newDistance / currentDistance);
          controlsRef.current.update();
        }
      },
      getZoomLevel: () => {
        return controlsRef.current?.getDistance() ?? minDistance;
      },
      setZoomLevel: (distance: number) => {
        if (controlsRef.current) {
          const clampedDistance = Math.max(
            minDistance,
            Math.min(maxDistance, distance)
          );
          const currentDistance = controlsRef.current.getDistance();
          const ratio = clampedDistance / currentDistance;
          
          if (ratio > 1) {
            controlsRef.current.dollyOut(ratio);
          } else {
            controlsRef.current.dollyIn(1 / ratio);
          }
          controlsRef.current.update();
        }
      },
    }));

    return (
      <OrbitControls
        ref={controlsRef}
        enablePan={enablePan}
        enableZoom={enableZoom}
        enableRotate={enableRotate}
        minDistance={minDistance}
        maxDistance={maxDistance}
        maxPolarAngle={maxPolarAngle}
        minPolarAngle={minPolarAngle}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        rotateSpeed={rotateSpeed}
        zoomSpeed={zoomSpeed}
        panSpeed={panSpeed}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        onChange={onChange}
        onStart={onStart}
        onEnd={onEnd}
        makeDefault
      />
    );
  }
);

ARControls.displayName = 'ARControls';
