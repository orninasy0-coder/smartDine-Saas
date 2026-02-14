/**
 * Performance Monitoring Demo Page
 * Demonstrates performance monitoring features
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceMonitoring, analytics } from '@/utils/analytics';
import type { WebVitalsMetric, PerformanceMetrics } from '@/utils/analytics';
import {
  Activity,
  Gauge,
  Clock,
  Zap,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export default function PerformanceMonitoringDemo() {
  // Automatically track page load metrics
  usePerformanceMonitoring();

  const [webVitals, setWebVitals] = useState<Record<string, WebVitalsMetric>>({});
  const [pageLoadMetrics, setPageLoadMetrics] = useState<PerformanceMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get initial metrics
    refreshMetrics();

    // Update metrics every 2 seconds
    const interval = setInterval(refreshMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = () => {
    const summary = analytics.getPerformanceSummary();
    setWebVitals(summary.webVitals);
    setPageLoadMetrics(summary.pageLoad);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshMetrics();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'needs-improvement':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatValue = (value: number, unit: string = 'ms') => {
    if (unit === 'ms' && value > 1000) {
      return `${(value / 1000).toFixed(2)}s`;
    }
    return `${Math.round(value)}${unit}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Performance Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time Core Web Vitals and page load performance metrics
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="web-vitals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="web-vitals">
            <Activity className="h-4 w-4 mr-2" />
            Core Web Vitals
          </TabsTrigger>
          <TabsTrigger value="page-load">
            <Clock className="h-4 w-4 mr-2" />
            Page Load
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <TrendingUp className="h-4 w-4 mr-2" />
            Navigation Timing
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Zap className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Core Web Vitals Tab */}
        <TabsContent value="web-vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* LCP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>LCP</span>
                  {webVitals.LCP && getRatingIcon(webVitals.LCP.rating)}
                </CardTitle>
                <CardDescription>Largest Contentful Paint</CardDescription>
              </CardHeader>
              <CardContent>
                {webVitals.LCP ? (
                  <>
                    <div className="text-3xl font-bold mb-2">
                      {formatValue(webVitals.LCP.value)}
                    </div>
                    <Badge className={getRatingColor(webVitals.LCP.rating)}>
                      {webVitals.LCP.rating}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Good: ≤ 2.5s | Poor: &gt; 4.0s
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Measuring...</p>
                )}
              </CardContent>
            </Card>

            {/* FID */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>FID</span>
                  {webVitals.FID && getRatingIcon(webVitals.FID.rating)}
                </CardTitle>
                <CardDescription>First Input Delay</CardDescription>
              </CardHeader>
              <CardContent>
                {webVitals.FID ? (
                  <>
                    <div className="text-3xl font-bold mb-2">
                      {formatValue(webVitals.FID.value)}
                    </div>
                    <Badge className={getRatingColor(webVitals.FID.rating)}>
                      {webVitals.FID.rating}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Good: ≤ 100ms | Poor: &gt; 300ms
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Waiting for interaction...</p>
                )}
              </CardContent>
            </Card>

            {/* CLS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>CLS</span>
                  {webVitals.CLS && getRatingIcon(webVitals.CLS.rating)}
                </CardTitle>
                <CardDescription>Cumulative Layout Shift</CardDescription>
              </CardHeader>
              <CardContent>
                {webVitals.CLS ? (
                  <>
                    <div className="text-3xl font-bold mb-2">
                      {webVitals.CLS.value.toFixed(3)}
                    </div>
                    <Badge className={getRatingColor(webVitals.CLS.rating)}>
                      {webVitals.CLS.rating}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Good: ≤ 0.1 | Poor: &gt; 0.25
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Measuring...</p>
                )}
              </CardContent>
            </Card>

            {/* FCP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>FCP</span>
                  {webVitals.FCP && getRatingIcon(webVitals.FCP.rating)}
                </CardTitle>
                <CardDescription>First Contentful Paint</CardDescription>
              </CardHeader>
              <CardContent>
                {webVitals.FCP ? (
                  <>
                    <div className="text-3xl font-bold mb-2">
                      {formatValue(webVitals.FCP.value)}
                    </div>
                    <Badge className={getRatingColor(webVitals.FCP.rating)}>
                      {webVitals.FCP.rating}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Good: ≤ 1.8s | Poor: &gt; 3.0s
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Measuring...</p>
                )}
              </CardContent>
            </Card>

            {/* TTFB */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>TTFB</span>
                  {webVitals.TTFB && getRatingIcon(webVitals.TTFB.rating)}
                </CardTitle>
                <CardDescription>Time to First Byte</CardDescription>
              </CardHeader>
              <CardContent>
                {webVitals.TTFB ? (
                  <>
                    <div className="text-3xl font-bold mb-2">
                      {formatValue(webVitals.TTFB.value)}
                    </div>
                    <Badge className={getRatingColor(webVitals.TTFB.rating)}>
                      {webVitals.TTFB.rating}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Good: ≤ 800ms | Poor: &gt; 1.8s
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Measuring...</p>
                )}
              </CardContent>
            </Card>

            {/* INP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>INP</span>
                  {webVitals.INP && getRatingIcon(webVitals.INP.rating)}
                </CardTitle>
                <CardDescription>Interaction to Next Paint</CardDescription>
              </CardHeader>
              <CardContent>
                {webVitals.INP ? (
                  <>
                    <div className="text-3xl font-bold mb-2">
                      {formatValue(webVitals.INP.value)}
                    </div>
                    <Badge className={getRatingColor(webVitals.INP.rating)}>
                      {webVitals.INP.rating}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Good: ≤ 200ms | Poor: &gt; 500ms
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Waiting for interaction...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Page Load Tab */}
        <TabsContent value="page-load" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Load Metrics</CardTitle>
              <CardDescription>Overall page loading performance</CardDescription>
            </CardHeader>
            <CardContent>
              {pageLoadMetrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DOM Content Loaded:</span>
                      <span className="font-semibold">
                        {formatValue(pageLoadMetrics.domContentLoaded || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Load Complete:</span>
                      <span className="font-semibold">
                        {formatValue(pageLoadMetrics.loadComplete || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Paint:</span>
                      <span className="font-semibold">
                        {formatValue(pageLoadMetrics.firstPaint || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connection Type:</span>
                      <span className="font-semibold">
                        {pageLoadMetrics.connectionType || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Device Memory:</span>
                      <span className="font-semibold">
                        {pageLoadMetrics.deviceMemory
                          ? `${pageLoadMetrics.deviceMemory} GB`
                          : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading metrics...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Timing Tab */}
        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Timing Breakdown</CardTitle>
              <CardDescription>Detailed timing of page navigation phases</CardDescription>
            </CardHeader>
            <CardContent>
              {pageLoadMetrics ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Redirect Time:</span>
                    <span className="font-semibold">
                      {formatValue(pageLoadMetrics.redirectTime || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">DNS Lookup:</span>
                    <span className="font-semibold">
                      {formatValue(pageLoadMetrics.dnsTime || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">TCP Connection:</span>
                    <span className="font-semibold">
                      {formatValue(pageLoadMetrics.tcpTime || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Request Time:</span>
                    <span className="font-semibold">
                      {formatValue(pageLoadMetrics.requestTime || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="font-semibold">
                      {formatValue(pageLoadMetrics.responseTime || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">DOM Processing:</span>
                    <span className="font-semibold">
                      {formatValue(pageLoadMetrics.domProcessingTime || 0)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading metrics...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Loading</CardTitle>
              <CardDescription>Information about loaded resources</CardDescription>
            </CardHeader>
            <CardContent>
              {pageLoadMetrics ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Resources:</span>
                    <span className="text-2xl font-bold">
                      {pageLoadMetrics.resourceCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Size:</span>
                    <span className="text-2xl font-bold">
                      {formatBytes(pageLoadMetrics.totalResourceSize || 0)}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page URL: {pageLoadMetrics.pageUrl}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading metrics...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Performance Monitoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This page demonstrates the automatic performance monitoring system that tracks Core Web
            Vitals and page load metrics. All metrics are automatically sent to your configured
            analytics provider (Google Analytics or PostHog).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Automatic Tracking
              </h4>
              <p className="text-sm text-muted-foreground">
                Metrics are collected automatically using browser Performance APIs
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Real-time Updates
              </h4>
              <p className="text-sm text-muted-foreground">
                Metrics update in real-time as user interactions occur
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics Integration
              </h4>
              <p className="text-sm text-muted-foreground">
                All metrics are sent to your analytics platform for analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
