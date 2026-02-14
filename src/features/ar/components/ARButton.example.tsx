/**
 * ARButton Component - Usage Examples
 *
 * This file demonstrates various ways to use the ARButton component.
 */

import { ARButton } from './ARButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const ARButtonExamples = () => {
  const handleARClick = () => {
    console.log('AR button clicked - opening AR viewer');
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">ARButton Examples</h2>
        <p className="text-muted-foreground">
          Various configurations of the AR button component
        </p>
      </div>

      {/* Example 1: Default Button */}
      <Card>
        <CardHeader>
          <CardTitle>Default AR Button</CardTitle>
        </CardHeader>
        <CardContent>
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
          />
        </CardContent>
      </Card>

      {/* Example 2: Different Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Different Sizes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            size="sm"
            text="Small"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            size="default"
            text="Default"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            size="lg"
            text="Large"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            size="icon"
            showText={false}
          />
        </CardContent>
      </Card>

      {/* Example 3: Different Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Different Variants</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            variant="default"
            text="Default"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            variant="outline"
            text="Outline"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            variant="secondary"
            text="Secondary"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            variant="ghost"
            text="Ghost"
          />
        </CardContent>
      </Card>

      {/* Example 4: Icon Only */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Only Button</CardTitle>
        </CardHeader>
        <CardContent>
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            showText={false}
            size="icon"
          />
        </CardContent>
      </Card>

      {/* Example 5: Custom Text */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Text</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            text="3D View"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            text="See in 3D"
          />
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            text="Preview"
          />
        </CardContent>
      </Card>

      {/* Example 6: Disabled State */}
      <Card>
        <CardHeader>
          <CardTitle>Disabled State</CardTitle>
        </CardHeader>
        <CardContent>
          <ARButton
            modelUrl="https://example.com/models/dish.glb"
            onARClick={handleARClick}
            disabled
          />
        </CardContent>
      </Card>

      {/* Example 7: No Model URL (Won't Render) */}
      <Card>
        <CardHeader>
          <CardTitle>No Model URL (Button Hidden)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            When no modelUrl is provided, the button doesn't render:
          </p>
          <ARButton onARClick={handleARClick} />
          <p className="text-sm text-muted-foreground mt-2">
            (No button should appear above)
          </p>
        </CardContent>
      </Card>

      {/* Example 8: In a Dish Card Context */}
      <Card>
        <CardHeader>
          <CardTitle>In Dish Card Context</CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="max-w-sm">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                alt="Salad"
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">Mediterranean Salad</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fresh vegetables with feta cheese and olive oil
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <span className="text-xl font-bold">$12.99</span>
              <div className="flex gap-2">
                <ARButton
                  modelUrl="https://example.com/models/salad.glb"
                  onARClick={handleARClick}
                  size="sm"
                  showText={false}
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Add to Cart
                </button>
              </div>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARButtonExamples;
