/**
 * FallbackGallery Examples
 * Demonstrates various configurations of the fallback image gallery
 */

import { FallbackGallery } from './FallbackGallery';

// Sample dish images
const sampleImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
];

/**
 * Basic gallery with multiple images
 */
export function BasicGalleryExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={sampleImages}
        dishName="Delicious Pizza"
        description="A mouth-watering pizza with fresh ingredients and perfect crust"
      />
    </div>
  );
}

/**
 * Gallery with single image
 */
export function SingleImageExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={[sampleImages[0]]}
        dishName="Gourmet Burger"
        description="Premium beef burger with artisan bun and fresh toppings"
      />
    </div>
  );
}

/**
 * Gallery without navigation controls
 */
export function NoNavigationExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={sampleImages}
        dishName="Pasta Carbonara"
        showNavigation={false}
      />
    </div>
  );
}

/**
 * Gallery without zoom controls
 */
export function NoZoomExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={sampleImages}
        dishName="Sushi Platter"
        showZoomControls={false}
      />
    </div>
  );
}

/**
 * Minimal gallery (no controls)
 */
export function MinimalGalleryExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={sampleImages}
        dishName="Caesar Salad"
        showNavigation={false}
        showZoomControls={false}
        showCounter={false}
        showInfo={false}
      />
    </div>
  );
}

/**
 * Gallery with close handler
 */
export function WithCloseHandlerExample() {
  const handleClose = () => {
    console.log('Gallery closed');
    alert('Gallery closed!');
  };

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={sampleImages}
        dishName="Grilled Salmon"
        description="Fresh Atlantic salmon with herbs and lemon"
        onClose={handleClose}
      />
    </div>
  );
}

/**
 * Gallery starting at specific image
 */
export function CustomInitialIndexExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <FallbackGallery
        images={sampleImages}
        dishName="Chocolate Cake"
        initialIndex={2}
        description="Rich chocolate cake with ganache frosting"
      />
    </div>
  );
}

/**
 * Full-screen gallery demo
 */
export function FullScreenExample() {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <FallbackGallery
        images={sampleImages}
        dishName="Steak Dinner"
        description="Premium ribeye steak cooked to perfection"
        onClose={() => console.log('Close full screen')}
      />
    </div>
  );
}

/**
 * Showcase all examples
 */
export function FallbackGalleryShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Fallback Gallery Examples</h2>
        <p className="text-muted-foreground mb-8">
          Image gallery for devices that don't support 3D rendering
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">Basic Gallery</h3>
          <BasicGalleryExample />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Single Image</h3>
          <SingleImageExample />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">With Close Handler</h3>
          <WithCloseHandlerExample />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Custom Initial Index</h3>
          <CustomInitialIndexExample />
        </section>
      </div>
    </div>
  );
}
