/**
 * SEO Demo Page
 * Demonstrates the SEO Meta Automation features:
 * - Dynamic meta tags generation
 * - Open Graph tags
 * - Twitter Card tags
 */

import { useState } from 'react';
import { SEO } from '@/components/common';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header, Footer } from '@/components/layout';

export default function SEODemo() {
  const [title, setTitle] = useState('SEO Demo - SmartDine');
  const [description, setDescription] = useState('Interactive demo showcasing SEO meta automation with dynamic tags, Open Graph, and Twitter Cards.');
  const [ogImage, setOgImage] = useState('/images/demo-og.png');

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={title}
        description={description}
        keywords={['SEO demo', 'meta tags', 'Open Graph', 'Twitter Cards']}
        ogTitle={title}
        ogDescription={description}
        ogImage={ogImage}
        ogType="website"
        twitterCard="summary_large_image"
        twitterTitle={title}
        twitterDescription={description}
        twitterImage={ogImage}
      />

      <Header variant="public" />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">SEO Meta Automation Demo</h1>
          <p className="text-lg text-muted-foreground">
            This page demonstrates the three main features of our SEO system:
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="text-3xl mb-3">🏷️</div>
            <h3 className="text-xl font-semibold mb-2">Dynamic Meta Tags</h3>
            <p className="text-sm text-muted-foreground">
              Automatically generate page-specific meta tags including title, description, and keywords.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-xl font-semibold mb-2">Open Graph Tags</h3>
            <p className="text-sm text-muted-foreground">
              Full Open Graph protocol support for rich social media previews on Facebook, LinkedIn, etc.
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-3xl mb-3">🐦</div>
            <h3 className="text-xl font-semibold mb-2">Twitter Card Tags</h3>
            <p className="text-sm text-muted-foreground">
              Twitter-specific meta tags for beautiful card previews when sharing on Twitter/X.
            </p>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Try It Yourself</h2>
          <p className="text-muted-foreground mb-6">
            Change the values below and view the page source (Ctrl+U) to see the meta tags update in real-time.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter page title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter page description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">OG Image URL</label>
              <Input
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>

            <Button
              onClick={() => {
                setTitle('SEO Demo - SmartDine');
                setDescription('Interactive demo showcasing SEO meta automation with dynamic tags, Open Graph, and Twitter Cards.');
                setOgImage('/images/demo-og.png');
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </Card>

        {/* Current Meta Tags Display */}
        <Card className="p-8 bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">Current Meta Tags</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="p-3 bg-background rounded">
              <span className="text-muted-foreground">Title:</span>{' '}
              <span className="text-foreground">{title}</span>
            </div>
            <div className="p-3 bg-background rounded">
              <span className="text-muted-foreground">Description:</span>{' '}
              <span className="text-foreground">{description}</span>
            </div>
            <div className="p-3 bg-background rounded">
              <span className="text-muted-foreground">OG Image:</span>{' '}
              <span className="text-foreground">{ogImage}</span>
            </div>
            <div className="p-3 bg-background rounded">
              <span className="text-muted-foreground">OG Type:</span>{' '}
              <span className="text-foreground">website</span>
            </div>
            <div className="p-3 bg-background rounded">
              <span className="text-muted-foreground">Twitter Card:</span>{' '}
              <span className="text-foreground">summary_large_image</span>
            </div>
          </div>
        </Card>

        {/* Testing Instructions */}
        <div className="mt-12 p-6 border-2 border-primary/20 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🧪 Testing Instructions</h2>
          <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
            <li>View page source (Ctrl+U or Cmd+U) to see meta tags in the &lt;head&gt; section</li>
            <li>Use browser DevTools (F12) → Elements tab to inspect meta tags</li>
            <li>Test social sharing with:
              <ul className="ml-8 mt-2 space-y-1 list-disc list-inside">
                <li><a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Sharing Debugger</a></li>
                <li><a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twitter Card Validator</a></li>
                <li><a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn Post Inspector</a></li>
              </ul>
            </li>
            <li>Run Lighthouse audit in Chrome DevTools for SEO score</li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
}
