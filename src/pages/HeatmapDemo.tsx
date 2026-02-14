/**
 * Heatmap Demo Page
 * Demonstrates click heatmaps, scroll depth tracking, and attention heatmaps
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  clickHeatmapTracker,
  scrollDepthTracker,
  attentionHeatmapTracker,
  initializeHeatmaps,
  stopHeatmaps,
  clearHeatmapData,
  exportAllHeatmapData,
} from '@/utils/analytics/heatmaps';
import { Activity, MousePointer, Eye, Download, Trash2, Play, Square } from 'lucide-react';

export default function HeatmapDemo() {
  const [isTracking, setIsTracking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [attentionCount, setAttentionCount] = useState(0);

  useEffect(() => {
    // Update stats every second
    const interval = setInterval(() => {
      if (isTracking) {
        setClickCount(clickHeatmapTracker.getClickData().length);
        setScrollDepth(scrollDepthTracker.getMaxScrollDepth());
        setAttentionCount(attentionHeatmapTracker.getAttentionData().length);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const handleStartTracking = () => {
    initializeHeatmaps();
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    stopHeatmaps();
    setIsTracking(false);
  };

  const handleClearData = () => {
    clearHeatmapData();
    setClickCount(0);
    setScrollDepth(0);
    setAttentionCount(0);
  };

  const handleExportData = () => {
    const data = exportAllHeatmapData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Heatmap Analytics Demo</h1>
        <p className="text-muted-foreground">
          Track user interactions with click heatmaps, scroll depth, and attention tracking
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tracking Status
          </CardTitle>
          <CardDescription>Control heatmap tracking and view statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={isTracking ? 'default' : 'secondary'}>
              {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
            </Badge>
            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={handleStartTracking} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Tracking
                </Button>
              ) : (
                <Button onClick={handleStopTracking} variant="destructive" size="sm">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Tracking
                </Button>
              )}
              <Button onClick={handleClearData} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
              <Button onClick={handleExportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Click Events</span>
              </div>
              <p className="text-2xl font-bold">{clickCount}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Max Scroll Depth</span>
              </div>
              <p className="text-2xl font-bold">{scrollDepth}%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Attention Events</span>
              </div>
              <p className="text-2xl font-bold">{attentionCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Click Heatmap Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            Click Heatmap
          </CardTitle>
          <CardDescription>
            Click anywhere on this card to generate heatmap data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20">
              Button 1
            </Button>
            <Button variant="outline" className="h-20">
              Button 2
            </Button>
            <Button variant="outline" className="h-20">
              Button 3
            </Button>
            <Button variant="outline" className="h-20">
              Button 4
            </Button>
          </div>
          <div className="p-8 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">Click anywhere in this area</p>
          </div>
        </CardContent>
      </Card>

      {/* Scroll Depth Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Scroll Depth Tracking
          </CardTitle>
          <CardDescription>
            Scroll down this page to track scroll depth milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Scroll Depth</span>
              <span className="font-medium">{scrollDepth}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${scrollDepth}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className={scrollDepth >= 25 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              25%
            </div>
            <div className={scrollDepth >= 50 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              50%
            </div>
            <div className={scrollDepth >= 75 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              75%
            </div>
            <div className={scrollDepth >= 100 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              100%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attention Heatmap Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Attention Heatmap
          </CardTitle>
          <CardDescription>
            Hover over elements to track attention duration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2">Feature 1</h3>
              <p className="text-sm text-muted-foreground">
                Hover over this card to track attention time
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2">Feature 2</h3>
              <p className="text-sm text-muted-foreground">
                Attention tracking measures time spent viewing elements
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:border-primary transition-colors">
              <h3 className="font-semibold mb-2">Feature 3</h3>
              <p className="text-sm text-muted-foreground">
                This helps identify which content engages users most
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Heatmap Features</CardTitle>
          <CardDescription>What's included in the heatmap tracking system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Click Heatmaps
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                <li>Track all click positions with coordinates</li>
                <li>Record element information (tag, id, class)</li>
                <li>Store viewport and page context</li>
                <li>Export data for visualization tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Scroll Depth Tracking
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                <li>Track scroll position over time</li>
                <li>Record milestone achievements (25%, 50%, 75%, 100%)</li>
                <li>Throttled tracking for performance</li>
                <li>Per-page scroll depth analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Attention Heatmaps
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                <li>Track time spent viewing elements</li>
                <li>Minimum duration threshold (1 second)</li>
                <li>Aggregated attention by element</li>
                <li>Identify high-engagement content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacer for scroll depth testing */}
      <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Scroll down to test scroll depth tracking</p>
      </div>

      <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Keep scrolling...</p>
      </div>

      <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Almost there...</p>
      </div>

      <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">You've reached the bottom! 🎉</p>
      </div>
    </div>
  );
}
