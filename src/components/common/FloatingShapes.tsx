import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
}

interface FloatingShapesProps {
  count?: number;
  className?: string;
}

/**
 * Generate random shapes with deterministic properties
 */
function generateShapes(count: number): Shape[] {
  const colors = [
    'bg-primary-200/20 dark:bg-primary-500/10',
    'bg-secondary-200/20 dark:bg-secondary-500/10',
    'bg-primary-300/15 dark:bg-primary-400/10',
    'bg-secondary-300/15 dark:bg-secondary-400/10',
  ];

  const shapeTypes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 150 + 50, // 50-200px
    x: Math.random() * 100, // 0-100%
    y: Math.random() * 100, // 0-100%
    duration: Math.random() * 10 + 15, // 15-25s
    delay: Math.random() * 5, // 0-5s
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
  }));
}

/**
 * FloatingShapes Component
 *
 * Renders animated floating shapes in the background for visual appeal.
 * Shapes float with smooth animations using Framer Motion.
 *
 * @param count - Number of shapes to render (default: 8)
 * @param className - Additional CSS classes for the container
 */
export function FloatingShapes({ count = 8, className = '' }: FloatingShapesProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    setShapes(generateShapes(count));
  }, [count]);

  const getShapeClasses = (shape: Shape) => {
    const baseClasses = `absolute ${shape.color} blur-2xl`;

    switch (shape.shape) {
      case 'circle':
        return `${baseClasses} rounded-full`;
      case 'square':
        return `${baseClasses} rounded-lg rotate-45`;
      case 'triangle':
        return `${baseClasses} rounded-lg`;
      default:
        return `${baseClasses} rounded-full`;
    }
  };

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={getShapeClasses(shape)}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            scale: [1, 1.1, 0.9, 1],
            rotate: shape.shape === 'square' ? [45, 65, 25, 45] : [0, 10, -10, 0],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
