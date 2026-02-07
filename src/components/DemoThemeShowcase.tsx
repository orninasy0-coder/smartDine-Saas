import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

/**
 * Demo component showcasing the theme system
 * Displays current theme state and demonstrates theme-aware styling
 */
export function DemoThemeShowcase() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Theme System Demo</CardTitle>
        <CardDescription>
          Demonstrating Light Mode, Dark Mode, and System preference detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Status */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Theme Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Theme Setting</p>
              <p className="text-xl font-bold capitalize">{theme}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Resolved Theme</p>
              <p className="text-xl font-bold capitalize">{resolvedTheme}</p>
            </div>
          </div>
        </div>

        {/* Color Palette Demo */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-background border-2 border-border" />
              <p className="text-xs text-center">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-primary" />
              <p className="text-xs text-center">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-secondary" />
              <p className="text-xs text-center">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-muted" />
              <p className="text-xs text-center">Muted</p>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Component Examples</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </div>

        {/* Text Examples */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Text Styles</h3>
          <div className="space-y-1">
            <p className="text-foreground">Foreground text (primary)</p>
            <p className="text-muted-foreground">Muted foreground text (secondary)</p>
            <p className="text-primary">Primary colored text</p>
            <p className="text-secondary">Secondary colored text</p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Theme System Features</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Light and Dark mode support</li>
            <li>System preference detection</li>
            <li>Persistent theme selection (localStorage)</li>
            <li>Smooth transitions between themes</li>
            <li>Automatic system theme change detection</li>
            <li>Full shadcn/ui integration</li>
            <li>Custom primary and secondary colors</li>
            <li>RTL support ready</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
