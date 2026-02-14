/**
 * ARSupportIndicator Example
 * 
 * Demonstrates how to use the ARSupportIndicator component
 * to show device AR/3D support status
 */

import { ARSupportIndicator } from './ARSupportIndicator';
import { Card } from '@/components/ui/card';

export function ARSupportIndicatorExample() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">AR Support Indicator Examples</h2>
        <p className="text-muted-foreground mb-6">
          These components show device AR/3D rendering capabilities
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Indicator</h3>
          <ARSupportIndicator />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Detailed Indicator</h3>
          <ARSupportIndicator showDetails />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Usage in Context</h3>
          <Card className="p-6">
            <h4 className="text-xl font-bold mb-4">View Our Dishes in 3D</h4>
            <p className="text-muted-foreground mb-4">
              Experience our menu items like never before with interactive 3D models.
            </p>
            <ARSupportIndicator showDetails className="mb-4" />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                View Menu
              </button>
              <button className="px-4 py-2 border border-border rounded-md hover:bg-accent">
                Learn More
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ARSupportIndicatorExample;
