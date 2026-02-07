import { Header } from '@/components/layout';

/**
 * Public Header Demo Page
 * Demonstrates the public header/navbar with all features
 */
export default function PublicHeaderDemo() {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="public" />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h1 className="text-4xl font-bold mb-4">Public Header Demo</h1>
            <p className="text-lg text-muted-foreground">
              This page demonstrates the public header/navbar with all implemented features.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Features Implemented</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">✅ Logo & Navigation Links</h3>
                <p className="text-sm text-muted-foreground">
                  SmartDine logo with gradient styling and navigation links (Home, Features,
                  Pricing, Demo, Contact)
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">✅ Theme Toggle</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between Light, Dark, and System themes using the theme toggle button
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">✅ Language Selector</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between English (EN) and Arabic (AR) languages
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">✅ Login/Register Buttons</h3>
                <p className="text-sm text-muted-foreground">
                  Login and Register buttons for user authentication
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">✅ Mobile Responsive Menu</h3>
                <p className="text-sm text-muted-foreground">
                  Hamburger menu for mobile devices with slide-down animation
                </p>
              </div>

              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">✅ Sticky Header on Scroll</h3>
                <p className="text-sm text-muted-foreground">
                  Header stays at the top with backdrop blur effect when scrolling
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Test Scrolling</h2>
            <p className="text-muted-foreground">
              Scroll down to see the sticky header behavior with backdrop blur effect.
            </p>
            <div className="space-y-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Content Block {i + 1}</h3>
                  <p className="text-muted-foreground">
                    This is sample content to demonstrate the sticky header behavior. As you scroll
                    down, notice how the header remains fixed at the top with a blur effect.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
