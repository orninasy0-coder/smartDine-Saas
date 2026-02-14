/**
 * Conversion Funnel Analysis Demo Page
 * Demonstrates funnel visualization, drop-off analysis, and A/B testing
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  FunnelVisualization,
  type FunnelData,
} from '@/components/analytics/FunnelVisualization';
import {
  analyzeFunnel,
  compareFunnels,
  type FunnelStageData,
  type DropOffPoint,
} from '@/utils/analytics/funnelAnalysis';
import {
  assignVariant,
  trackABTestImpression,
  trackABTestConversion,
  compareVariants,
  calculateMinimumSampleSize,
  type ABTest,
  type ABTestResult,
  type ABTestComparison,
} from '@/utils/analytics/abTesting';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Target,
} from 'lucide-react';

export default function ConversionFunnelDemo() {
  const [selectedFunnel, setSelectedFunnel] = useState<'order' | 'signup' | 'ai'>('order');

  // Sample funnel data
  const orderFunnelData: FunnelStageData[] = [
    { name: 'qr_scan', label: 'QR Scan', count: 10000 },
    { name: 'menu_view', label: 'Menu View', count: 8500 },
    { name: 'dish_view', label: 'Dish View', count: 6800 },
    { name: 'add_to_cart', label: 'Add to Cart', count: 4200 },
    { name: 'cart_view', label: 'Cart View', count: 3800 },
    { name: 'order_confirm', label: 'Order Confirm', count: 2500 },
    { name: 'order_complete', label: 'Order Complete', count: 2100 },
  ];

  const signupFunnelData: FunnelStageData[] = [
    { name: 'landing_view', label: 'Landing Page', count: 5000 },
    { name: 'pricing_view', label: 'Pricing Page', count: 3200 },
    { name: 'signup_start', label: 'Signup Started', count: 1800 },
    { name: 'signup_complete', label: 'Signup Complete', count: 1200 },
    { name: 'onboarding_start', label: 'Onboarding Started', count: 1100 },
    { name: 'onboarding_complete', label: 'Onboarding Complete', count: 950 },
  ];

  const aiFunnelData: FunnelStageData[] = [
    { name: 'widget_view', label: 'Widget Viewed', count: 7500 },
    { name: 'chat_start', label: 'Chat Started', count: 3200 },
    { name: 'recommendation_view', label: 'Recommendations Shown', count: 2800 },
    { name: 'recommendation_accept', label: 'Recommendation Accepted', count: 1600 },
    { name: 'add_to_cart', label: 'Added to Cart', count: 1400 },
  ];

  // Analyze funnels
  const orderAnalysis = useMemo(() => analyzeFunnel(orderFunnelData), []);
  const signupAnalysis = useMemo(() => analyzeFunnel(signupFunnelData), []);
  const aiAnalysis = useMemo(() => analyzeFunnel(aiFunnelData), []);

  // Sample A/B test data
  const abTest: ABTest = {
    id: 'checkout_button_test',
    name: 'Checkout Button Color Test',
    description: 'Testing different button colors for checkout conversion',
    variants: [
      { id: 'control', name: 'Blue Button (Control)', weight: 50 },
      { id: 'variant_a', name: 'Green Button', weight: 50 },
    ],
    startDate: new Date('2024-01-01'),
    status: 'running',
    targetMetric: 'checkout_completion',
  };

  const abTestResults: ABTestResult[] = [
    {
      testId: 'checkout_button_test',
      variantId: 'control',
      variantName: 'Blue Button (Control)',
      impressions: 5000,
      conversions: 850,
      conversionRate: 17.0,
    },
    {
      testId: 'checkout_button_test',
      variantId: 'variant_a',
      variantName: 'Green Button',
      impressions: 5000,
      conversions: 1050,
      conversionRate: 21.0,
    },
  ];

  const abComparison = useMemo(
    () => compareVariants(abTestResults[0], [abTestResults[1]], 0.95),
    []
  );

  // Calculate minimum sample size
  const minSampleSize = calculateMinimumSampleSize(17.0, 20, 0.95, 0.8);

  // Get current funnel data
  const getCurrentFunnelData = (): FunnelData => {
    let analysis;
    let name;

    switch (selectedFunnel) {
      case 'order':
        analysis = orderAnalysis;
        name = 'Order Placement Funnel';
        break;
      case 'signup':
        analysis = signupAnalysis;
        name = 'Restaurant Signup Funnel';
        break;
      case 'ai':
        analysis = aiAnalysis;
        name = 'AI Assistant Funnel';
        break;
    }

    return {
      name,
      stages: analysis.stages,
      totalUsers: analysis.totalUsers,
      conversionRate: analysis.overallConversionRate,
    };
  };

  const getCurrentAnalysis = () => {
    switch (selectedFunnel) {
      case 'order':
        return orderAnalysis;
      case 'signup':
        return signupAnalysis;
      case 'ai':
        return aiAnalysis;
    }
  };

  const renderDropOffPoint = (dropOff: DropOffPoint) => {
    const severityColors = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };

    return (
      <Card key={`${dropOff.fromStage}_${dropOff.toStage}`} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {dropOff.fromStageLabel} → {dropOff.toStageLabel}
            </CardTitle>
            <Badge className={severityColors[dropOff.severity]}>
              {dropOff.severity.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            {dropOff.dropOffCount.toLocaleString()} users dropped off (
            {dropOff.dropOffRate.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Suggestions:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {dropOff.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Conversion Funnel Analysis</h1>
        <p className="text-muted-foreground">
          Visualize user journeys, identify drop-off points, and track A/B test results
        </p>
      </div>

      <Tabs defaultValue="funnels" className="space-y-6">
        <TabsList>
          <TabsTrigger value="funnels">Funnel Visualization</TabsTrigger>
          <TabsTrigger value="dropoffs">Drop-off Analysis</TabsTrigger>
          <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
        </TabsList>

        {/* Funnel Visualization Tab */}
        <TabsContent value="funnels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Funnel</CardTitle>
              <CardDescription>Choose a funnel to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={selectedFunnel === 'order' ? 'default' : 'outline'}
                  onClick={() => setSelectedFunnel('order')}
                >
                  Order Placement
                </Button>
                <Button
                  variant={selectedFunnel === 'signup' ? 'default' : 'outline'}
                  onClick={() => setSelectedFunnel('signup')}
                >
                  Restaurant Signup
                </Button>
                <Button
                  variant={selectedFunnel === 'ai' ? 'default' : 'outline'}
                  onClick={() => setSelectedFunnel('ai')}
                >
                  AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>

          <FunnelVisualization data={getCurrentFunnelData()} />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {getCurrentAnalysis().totalUsers.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {getCurrentAnalysis().overallConversionRate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Critical Drop-offs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {getCurrentAnalysis().criticalDropOffs.length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drop-off Analysis Tab */}
        <TabsContent value="dropoffs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Drop-off Points Analysis
              </CardTitle>
              <CardDescription>
                Identified {getCurrentAnalysis().dropOffPoints.length} drop-off points in the{' '}
                {selectedFunnel} funnel
              </CardDescription>
            </CardHeader>
          </Card>

          {getCurrentAnalysis().criticalDropOffs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Critical Drop-offs (Requires Immediate Attention)
              </h3>
              {getCurrentAnalysis().criticalDropOffs.map(renderDropOffPoint)}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">All Drop-off Points</h3>
            {getCurrentAnalysis().dropOffPoints.map(renderDropOffPoint)}
          </div>
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="abtesting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{abTest.name}</CardTitle>
              <CardDescription>{abTest.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Test Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {abTestResults.map((result) => (
                    <Card
                      key={result.variantId}
                      className={result.isWinner ? 'border-green-500 border-2' : ''}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          {result.variantName}
                          {result.isWinner && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Impressions</p>
                          <p className="text-2xl font-bold">
                            {result.impressions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Conversions</p>
                          <p className="text-2xl font-bold">
                            {result.conversions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Conversion Rate</p>
                          <p className="text-2xl font-bold flex items-center gap-2">
                            {result.conversionRate.toFixed(1)}%
                            {result.variantId !== 'control' && (
                              <span
                                className={`text-sm ${
                                  result.conversionRate > abTestResults[0].conversionRate
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {result.conversionRate > abTestResults[0].conversionRate ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                        {result.confidence !== undefined && (
                          <div>
                            <p className="text-sm text-muted-foreground">Confidence</p>
                            <p className="text-lg font-semibold">
                              {(result.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Statistical Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistical Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Statistical Significance:</span>
                      <Badge
                        className={
                          abComparison.statisticalSignificance
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }
                      >
                        {abComparison.statisticalSignificance ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Confidence Level:</span>
                      <span className="font-semibold">
                        {(abComparison.confidenceLevel * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Minimum Sample Size:</span>
                      <span className="font-semibold">{minSampleSize.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Recommendation:</p>
                      <p className="text-sm text-muted-foreground">
                        {abComparison.recommendation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
