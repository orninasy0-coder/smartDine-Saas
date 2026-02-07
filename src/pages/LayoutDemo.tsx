/**
 * Layout Demo Page
 * Demonstrates the Header, Footer, and Sidebar components
 */

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const LayoutDemo: React.FC = () => {
  const [headerVariant, setHeaderVariant] = useState<'public' | 'authenticated'>('public');
  const [sidebarRole, setSidebarRole] = useState<'owner' | 'kitchen' | 'delivery' | 'admin'>(
    'owner'
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Demo */}
      <Header
        variant={headerVariant}
        userName="John Doe"
        notificationCount={5}
        onLogout={() => console.log('Logout clicked')}
      />

      <div className="flex flex-1">
        {/* Sidebar Demo */}
        <Sidebar role={sidebarRole} />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Layout Components Demo</h1>
              <p className="text-muted-foreground">
                Interactive demonstration of Header, Footer, and Sidebar components
              </p>
            </div>

            <Tabs defaultValue="header" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Header Component</CardTitle>
                    <CardDescription>
                      Main navigation header with theme toggle, language selector, and responsive
                      menu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Features:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Logo and navigation links</li>
                        <li>Theme toggle (Dark/Light Mode)</li>
                        <li>Language selector (EN/AR)</li>
                        <li>Login/Register buttons (public mode)</li>
                        <li>User profile dropdown with notifications (authenticated mode)</li>
                        <li>Mobile responsive hamburger menu</li>
                        <li>Sticky header with blur effect</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Try it:</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHeaderVariant('public')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            headerVariant === 'public'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          Public Mode
                        </button>
                        <button
                          onClick={() => setHeaderVariant('authenticated')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            headerVariant === 'authenticated'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          Authenticated Mode
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sidebar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sidebar Component</CardTitle>
                    <CardDescription>
                      Navigation sidebar for dashboards with role-based menu items
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Features:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Collapsible sidebar with toggle button</li>
                        <li>Navigation menu items with icons</li>
                        <li>Active state indication</li>
                        <li>Role-based menu items (Owner, Kitchen, Delivery, Admin)</li>
                        <li>Badge notifications for pending items</li>
                        <li>Help section in footer</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Try different roles:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {(['owner', 'kitchen', 'delivery', 'admin'] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => setSidebarRole(role)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                              sidebarRole === role
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="footer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Footer Component</CardTitle>
                    <CardDescription>
                      Comprehensive footer with links, newsletter, and social media
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Features:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Multi-column responsive layout</li>
                        <li>
                          Footer links organized by category (Product, Company, Legal, Support)
                        </li>
                        <li>Newsletter subscription form</li>
                        <li>Social media links (Facebook, Twitter, Instagram, LinkedIn)</li>
                        <li>Copyright information</li>
                        <li>Brand section with description</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Scroll to the bottom of this page to see the footer in action.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Placeholder content for scrolling */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Usage Example:</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      {`import { Header, Footer, Sidebar } from '@/components/layout';

// Public page
<Header variant="public" />

// Authenticated page with sidebar
<Header 
  variant="authenticated" 
  userName="John Doe"
  notificationCount={5}
  onLogout={handleLogout}
/>
<Sidebar role="owner" />

// Footer (same for all pages)
<Footer />`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Demo */}
      <Footer />
    </div>
  );
};
