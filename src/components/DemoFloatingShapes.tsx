import { FloatingShapes } from './common';
import { Card } from './ui/card';

/**
 * Demo component showcasing the FloatingShapes component
 */
export function DemoFloatingShapes() {
  return (
    <div className="relative min-h-screen">
      {/* Floating Shapes Background */}
      <FloatingShapes count={10} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Floating Shapes Demo</h1>
            <p className="text-muted-foreground text-lg">
              Animated background shapes that add visual interest to your pages
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 space-y-4 backdrop-blur-sm bg-card/80">
              <h2 className="text-2xl font-semibold">Features</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>✨ Smooth floating animations</li>
                <li>🎨 Multiple shape types (circle, square, triangle)</li>
                <li>🌈 Theme-aware colors</li>
                <li>⚡ Performance optimized with Framer Motion</li>
                <li>🎯 Customizable count and styling</li>
              </ul>
            </Card>

            <Card className="p-6 space-y-4 backdrop-blur-sm bg-card/80">
              <h2 className="text-2xl font-semibold">Usage</h2>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import { FloatingShapes } from '@/components/common';

<FloatingShapes count={8} />`}</code>
              </pre>
            </Card>

            <Card className="p-6 space-y-4 backdrop-blur-sm bg-card/80 md:col-span-2">
              <h2 className="text-2xl font-semibold">Props</h2>
              <div className="space-y-2 text-sm">
                <div className="flex gap-4">
                  <code className="bg-muted px-2 py-1 rounded">count</code>
                  <span className="text-muted-foreground">Number of shapes (default: 8)</span>
                </div>
                <div className="flex gap-4">
                  <code className="bg-muted px-2 py-1 rounded">className</code>
                  <span className="text-muted-foreground">Additional CSS classes</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
