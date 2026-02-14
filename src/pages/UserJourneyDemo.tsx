/**
 * User Journey Mapping Demo Page
 * Demonstrates user journey tracking and visualization
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserFlowVisualization } from '@/components/analytics/UserFlowVisualization';
import { useUserJourney } from '@/hooks/useUserJourney';
import {
  userJourneyTracker,
  PathAnalyzer,
  JourneySegmentation,
  type JourneyPath,
  type JourneyAnalytics,
} from '@/utils/analytics/userJourney';
import {
  cohortAnalyzer,
  CohortBuilders,
  type Cohort,
  type CohortMetrics,
} from '@/utils/analytics/cohortAnalysis';
import { Route, Play, StopCircle, BarChart3, Users, TrendingUp } from 'lucide-react';

export default function UserJourneyDemo() {
  const [journeys, setJourneys] = useState<JourneyPath[]>([]);
  const [analytics, setAnalytics] = useState<JourneyAnalytics | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [cohortMetrics, setCohortMetrics] = useState<CohortMetrics | null>(null);

  const { trackStep, endJourney, startNewJourney, getCurrentJourney, analyzeJourneys } =
    useUserJourney({
      enabled: true,
      trackPageViews: false,
    });

  // Load initial data
  useEffect(() => {
    loadJourneys();
    loadCohorts();
  }, []);

  const loadJourneys = () => {
    const history = userJourneyTracker.getJourneyHistory();
    setJourneys(history);

    const analyticsData = userJourneyTracker.analyzeJourneys();
    setAnalytics(analyticsData);
  };

  const loadCohorts = () => {
    const allCohorts = cohortAnalyzer.getCohorts();
    setCohorts(allCohorts);
  };

  const simulateJourney = () => {
    startNewJourney();

    const paths = [
      '/landing',
      '/features',
      '/pricing',
      '/signup',
      '/dashboard',
      '/menu',
      '/cart',
      '/checkout',
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < paths.length) {
        trackStep(paths[currentIndex], {
          simulated: true,
          timestamp: Date.now(),
        });
        currentIndex++;
      } else {
        clearInterval(interval);
        endJourney(Math.random() > 0.3, paths[paths.length - 1]);
        loadJourneys();
      }
    }, 500);
  };

  const createSampleCohorts = () => {
    // Create cohorts
    const newUsersCohort = CohortBuilders.bySignupDate(
      cohortAnalyzer,
      'New Users',
      Date.now() - 7 * 24 * 60 * 60 * 1000,
      Date.now()
    );

    const powerUsersCohort = CohortBuilders.byBehavior(
      cohortAnalyzer,
      'Power Users',
      'page_view',
      10
    );

    const premiumCohort = CohortBuilders.byUserProperty(
      cohortAnalyzer,
      'Premium Users',
      'plan',
      'premium'
    );

    // Simulate user assignment
    const userMetadata = new Map<string, Record<string, unknown>>();
    for (let i = 0; i < 50; i++) {
      const userId = `user_${i}`;
      userMetadata.set(userId, {
        signupDate: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        plan: Math.random() > 0.7 ? 'premium' : 'basic',
      });

      // Simulate journeys for cohort analysis
      const numJourneys = Math.floor(Math.random() * 20);
      for (let j = 0; j < numJourneys; j++) {
        const journey: JourneyPath = {
          sessionId: `session_${i}_${j}`,
          userId,
          steps: [
            { path: '/landing', timestamp: Date.now() - 1000 },
            { path: '/features', timestamp: Date.now() - 800, duration: 200 },
            { path: '/pricing', timestamp: Date.now() - 500, duration: 300 },
          ],
          startTime: Date.now() - 1000,
          endTime: Date.now(),
          totalDuration: 1000,
          completed: Math.random() > 0.4,
        };
        cohortAnalyzer.trackUserJourney(userId, journey);
      }
    }

    cohortAnalyzer.autoAssignUsers(userMetadata);
    loadCohorts();
  };

  const viewCohortMetrics = (cohortId: string) => {
    setSelectedCohort(cohortId);
    const metrics = cohortAnalyzer.calculateCohortMetrics(cohortId);
    setCohortMetrics(metrics);
  };

  const clearAllData = () => {
    userJourneyTracker.clearData();
    setJourneys([]);
    setAnalytics(null);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Journey Mapping</h1>
          <p className="text-muted-foreground">
            Track and analyze user paths through your application
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={simulateJourney} variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Simulate Journey
          </Button>
          <Button onClick={createSampleCohorts} variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Create Cohorts
          </Button>
          <Button onClick={clearAllData} variant="destructive">
            <StopCircle className="mr-2 h-4 w-4" />
            Clear Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="flows">
            <Route className="mr-2 h-4 w-4" />
            User Flows
          </TabsTrigger>
          <TabsTrigger value="cohorts">
            <Users className="mr-2 h-4 w-4" />
            Cohorts
          </TabsTrigger>
          <TabsTrigger value="insights">
            <TrendingUp className="mr-2 h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {analytics && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Journeys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalJourneys}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.completedJourneys}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.totalJourneys > 0
                      ? ((analytics.completedJourneys / analytics.totalJourneys) * 100).toFixed(1)
                      : 0}
                    % completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(analytics.averageDuration / 1000).toFixed(1)}s
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Entry Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.entryPoints.size}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Current Journey</CardTitle>
              <CardDescription>Track your current navigation path</CardDescription>
            </CardHeader>
            <CardContent>
              {getCurrentJourney() ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Steps: {getCurrentJourney()!.steps.length}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getCurrentJourney()!.steps.map((step, index) => (
                      <div
                        key={index}
                        className="rounded bg-primary/10 px-3 py-1 text-sm text-primary"
                      >
                        {step.path}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active journey</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          {journeys.length > 0 ? (
            <UserFlowVisualization journeys={journeys} />
          ) : (
            <Card>
              <CardContent className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">
                  No journey data available. Simulate some journeys to see visualizations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Cohorts</CardTitle>
                <CardDescription>User segments for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {cohorts.length > 0 ? (
                  <div className="space-y-2">
                    {cohorts.map((cohort) => (
                      <div
                        key={cohort.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <div className="font-medium">{cohort.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {cohort.users.size} users
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewCohortMetrics(cohort.id)}
                        >
                          View Metrics
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No cohorts created. Click "Create Cohorts" to generate sample cohorts.
                  </p>
                )}
              </CardContent>
            </Card>

            {cohortMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Cohort Metrics</CardTitle>
                  <CardDescription>
                    {cohorts.find((c) => c.id === selectedCohort)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                      <div className="text-2xl font-bold">{cohortMetrics.totalUsers}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                      <div className="text-2xl font-bold">{cohortMetrics.activeUsers}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Retention Rate</div>
                      <div className="text-2xl font-bold">
                        {(cohortMetrics.retentionRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                      <div className="text-2xl font-bold">
                        {(cohortMetrics.completionRate * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium">Common Paths</div>
                    <div className="space-y-1">
                      {cohortMetrics.commonPaths.slice(0, 3).map((path, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {index + 1}. {path}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journey Insights</CardTitle>
              <CardDescription>Analyze user behavior patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics && analytics.dropOffPoints.size > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Top Drop-off Points</h3>
                  <div className="space-y-2">
                    {Array.from(analytics.dropOffPoints.entries())
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([point, count], index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{point}</span>
                          <span className="text-sm text-muted-foreground">{count} users</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {journeys.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Bottlenecks</h3>
                  <div className="space-y-2">
                    {Array.from(PathAnalyzer.identifyBottlenecks(journeys).entries())
                      .slice(0, 5)
                      .map(([path, duration], index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{path}</span>
                          <span className="text-sm text-muted-foreground">
                            {(duration / 1000).toFixed(1)}s avg
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
