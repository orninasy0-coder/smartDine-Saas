import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { designTokens, colorTokens } from './tokens';

/**
 * Component Showcase
 * 
 * Interactive documentation page for all design system components.
 * Displays components with live examples and code snippets.
 */
export function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">SmartDine Design System</h1>
          <p className="text-lg text-muted-foreground">
            مكتبة المكونات والتوثيق الشامل لنظام التصميم
          </p>
        </header>

        <Tabs defaultValue="components" className="space-y-8">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Primary interactive elements for user actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>

            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>
                  Text input components for forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md space-y-4">
                  <Input 
                    placeholder="Default input" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input placeholder="Disabled input" disabled />
                  <Input type="email" placeholder="Email input" />
                  <Input type="password" placeholder="Password input" />
                </div>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>
                  Container components for grouping content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description goes here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Card content with some text.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Another Card</CardTitle>
                      <CardDescription>With different content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">More card content here.</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens" className="space-y-8">
            {/* Spacing */}
            <Card>
              <CardHeader>
                <CardTitle>Spacing Scale</CardTitle>
                <CardDescription>
                  Consistent spacing values based on 4px grid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(designTokens.spacing).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-mono">{key}</div>
                      <div className="w-24 text-sm text-muted-foreground">{value}</div>
                      <div 
                        className="h-8 bg-primary rounded"
                        style={{ width: value }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Border Radius */}
            <Card>
              <CardHeader>
                <CardTitle>Border Radius</CardTitle>
                <CardDescription>
                  Standard border radius values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(designTokens.radius).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-20 h-20 bg-primary mb-2"
                        style={{ borderRadius: value }}
                      />
                      <div className="text-sm font-mono">{key}</div>
                      <div className="text-xs text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
                <CardDescription>
                  Font sizes and weights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(designTokens.fontSize).map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-4">
                    <div className="w-20 text-sm font-mono">{key}</div>
                    <div className="w-24 text-sm text-muted-foreground">{value}</div>
                    <div style={{ fontSize: value }}>
                      The quick brown fox jumps over the lazy dog
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8">
            {/* Primary Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Colors</CardTitle>
                <CardDescription>
                  Main brand colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(colorTokens.primary).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="h-20 rounded-lg mb-2"
                        style={{ backgroundColor: value }}
                      />
                      <div className="text-xs font-mono">{key}</div>
                      <div className="text-xs text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Secondary Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Secondary Colors</CardTitle>
                <CardDescription>
                  Accent colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(colorTokens.secondary).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="h-20 rounded-lg mb-2"
                        style={{ backgroundColor: value }}
                      />
                      <div className="text-xs font-mono">{key}</div>
                      <div className="text-xs text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Semantic Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Semantic Colors</CardTitle>
                <CardDescription>
                  Status and feedback colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(colorTokens).filter(([key]) => 
                    ['success', 'warning', 'error', 'info'].includes(key)
                  ).map(([category, colors]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-2 capitalize">{category}</h4>
                      <div className="space-y-2">
                        {Object.entries(colors).map(([shade, value]) => (
                          <div key={shade} className="flex items-center gap-2">
                            <div 
                              className="w-12 h-12 rounded"
                              style={{ backgroundColor: value }}
                            />
                            <div>
                              <div className="text-xs font-mono">{shade}</div>
                              <div className="text-xs text-muted-foreground">{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Usage Guidelines</CardTitle>
                <CardDescription>
                  Best practices for using the design system
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <h3>Component Usage</h3>
                <ul>
                  <li>Always use design tokens instead of hardcoded values</li>
                  <li>Follow the spacing scale for consistent layouts</li>
                  <li>Use semantic color names for better maintainability</li>
                  <li>Prefer composition over creating new variants</li>
                </ul>

                <h3>Accessibility</h3>
                <ul>
                  <li>Ensure sufficient color contrast (WCAG AA minimum)</li>
                  <li>Provide keyboard navigation for all interactive elements</li>
                  <li>Include proper ARIA labels and roles</li>
                  <li>Test with screen readers</li>
                </ul>

                <h3>Responsive Design</h3>
                <ul>
                  <li>Mobile-first approach</li>
                  <li>Use breakpoint tokens for consistency</li>
                  <li>Test on multiple screen sizes</li>
                  <li>Ensure touch targets are at least 44x44px</li>
                </ul>

                <h3>Performance</h3>
                <ul>
                  <li>Lazy load components when possible</li>
                  <li>Optimize images and assets</li>
                  <li>Minimize animation complexity</li>
                  <li>Use CSS transforms for animations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
