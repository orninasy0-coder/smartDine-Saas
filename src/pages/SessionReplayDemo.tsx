/**
 * Session Replay Demo Page
 * Demonstrates session replay features and integration
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sessionReplay } from '@/utils/analytics/sessionReplay';
import { interactionTracker } from '@/utils/analytics/interactionTracking';
import { errorTracker } from '@/utils/analytics/errorTracking';
import { ErrorBoundaryWithReplay } from '@/components/common/ErrorBoundaryWithReplay';

function DemoContent() {
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<ReturnType<typeof errorTracker.getErrorStats>>();
  const [isRecording, setIsRecording] = useState(false);

  const handleGetSessionUrl = () => {
    const url = sessionReplay.getSessionURL();
    setSessionUrl(url);
  };

  const handleTrackInteraction = () => {
    sessionReplay.trackInteraction('demo_button_click', {
      timestamp: new Date().toISOString(),
      page: 'demo',
    });
    alert('Interaction tracked! Check your session replay dashboard.');
  };

  const handleTagSession = () => {
    sessionReplay.tagRecording(['demo', 'test-session', 'feature-exploration']);
    alert('Session tagged! You can now filter by these tags in your dashboard.');
  };

  const handleTrackError = () => {
    const error = new Error('Demo error for testing');
    errorTracker.captureErrorWithAction(error, 'demo_error_button', {
      intentional: true,
      timestamp: new Date().toISOString(),
    });
    alert('Error tracked! Check your session replay for error context.');
  };

  const handleThrowError = () => {
    throw new Error('Intentional error to test Error Boundary');
  };

  const handleGetErrorStats = () => {
    const stats = errorTracker.getErrorStats();
    setErrorStats(stats);
  };

  const handleStartRecording = () => {
    sessionReplay.startRecording();
    setIsRecording(true);
    alert('Recording started!');
  };

  const handleStopRecording = () => {
    sessionReplay.stopRecording();
    setIsRecording(false);
    alert('Recording stopped!');
  };

  const handleIdentifyUser = () => {
    sessionReplay.identify('demo-user-123', {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'tester',
      plan: 'pro',
    });
    alert('User identified! This session is now linked to demo-user-123.');
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Session Replay Demo</h1>
        <p className="text-muted-foreground">
          Test and explore session replay features including interaction tracking, error capture, and
          session management.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Session Replay Status</CardTitle>
            <CardDescription>Current session replay configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active:</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    sessionReplay.isActive()
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  {sessionReplay.isActive() ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Provider:</span>
                <span className="text-sm text-muted-foreground">
                  {sessionReplay.getProvider() || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recording:</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    isRecording
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                  }`}
                >
                  {isRecording ? 'Recording' : 'Paused'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground">
                  {sessionReplay.getCurrentUserId() || 'Anonymous'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleStartRecording} size="sm" disabled={isRecording}>
                Start Recording
              </Button>
              <Button
                onClick={handleStopRecording}
                size="sm"
                variant="outline"
                disabled={!isRecording}
              >
                Stop Recording
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Error Statistics</CardTitle>
            <CardDescription>Current session error tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorStats ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Errors:</span>
                  <span className="text-sm text-muted-foreground">{errorStats.totalErrors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Recent Errors:</span>
                  <span className="text-sm text-muted-foreground">{errorStats.recentErrors}</span>
                </div>
                {errorStats.lastError && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Last Error:</span>
                    <p className="text-xs text-muted-foreground">{errorStats.lastError.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(errorStats.lastError.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Click "Get Error Stats" to view statistics</p>
            )}

            <Button onClick={handleGetErrorStats} size="sm" variant="outline" className="w-full">
              Get Error Stats
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interaction Tracking</CardTitle>
              <CardDescription>
                Test automatic and manual interaction tracking. All interactions are automatically
                tracked including clicks, scrolls, and form interactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={handleTrackInteraction} className="w-full">
                  Track Custom Interaction
                </Button>
                <p className="text-xs text-muted-foreground">
                  Manually track a custom interaction event
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleTagSession} variant="outline" className="w-full">
                  Tag This Session
                </Button>
                <p className="text-xs text-muted-foreground">
                  Add tags to this session for easier filtering
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Automatic Tracking:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>✓ All button clicks</li>
                  <li>✓ Link clicks</li>
                  <li>✓ Form submissions</li>
                  <li>✓ Scroll depth (25%, 50%, 75%, 100%)</li>
                  <li>✓ Rage clicks (frustration detection)</li>
                  <li>✓ Dead clicks (UX issues)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Tracking</CardTitle>
              <CardDescription>
                Test error capture and session replay integration. Errors are automatically captured
                with full context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={handleTrackError} variant="destructive" className="w-full">
                  Track Test Error
                </Button>
                <p className="text-xs text-muted-foreground">
                  Manually track an error with context
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleThrowError} variant="destructive" className="w-full">
                  Throw Error (Test Error Boundary)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Trigger an error to test the Error Boundary
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Automatic Error Capture:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>✓ Unhandled JavaScript errors</li>
                  <li>✓ Unhandled promise rejections</li>
                  <li>✓ Console errors</li>
                  <li>✓ Network errors (failed requests)</li>
                  <li>✓ React Error Boundary errors</li>
                  <li>✓ Error storm detection</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Manage session recording and user identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={handleIdentifyUser} className="w-full">
                  Identify User
                </Button>
                <p className="text-xs text-muted-foreground">
                  Link this session to a user ID with properties
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleGetSessionUrl} variant="outline" className="w-full">
                  Get Session URL
                </Button>
                <p className="text-xs text-muted-foreground">
                  Get the replay URL for this session (FullStory only)
                </p>
              </div>

              {sessionUrl && (
                <div className="rounded-lg border border-border bg-muted p-4">
                  <h4 className="mb-2 text-sm font-medium">Session URL:</h4>
                  <a
                    href={sessionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-xs text-primary hover:underline"
                  >
                    {sessionUrl}
                  </a>
                </div>
              )}

              <div className="rounded-lg border border-border bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Session Features:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>✓ User identification</li>
                  <li>✓ Session tagging</li>
                  <li>✓ Session URL (FullStory)</li>
                  <li>✓ Start/stop recording</li>
                  <li>✓ User anonymization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Interaction Tracking</CardTitle>
              <CardDescription>
                Test form interaction tracking. All form interactions are automatically tracked.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Form submitted! Check session replay for form interaction tracking.');
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                  <p className="text-xs text-muted-foreground">
                    Focus and blur events are tracked
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                  <p className="text-xs text-muted-foreground">Input values are masked by default</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter your message"
                  />
                  <p className="text-xs text-muted-foreground">
                    Field interactions are tracked without capturing content
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Submit Form
                </Button>
              </form>

              <div className="rounded-lg border border-border bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Form Tracking:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>✓ Form field focus events</li>
                  <li>✓ Form field blur events</li>
                  <li>✓ Form submission events</li>
                  <li>✓ Field value presence (not content)</li>
                  <li>✓ Form validation errors</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>How to enable session replay in your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">1. Add Environment Variables</h4>
            <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
              {`# For Hotjar
VITE_HOTJAR_SITE_ID=your_site_id

# For FullStory
VITE_FULLSTORY_ORG_ID=your_org_id`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">2. Initialize in Your App</h4>
            <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
              {`import { initializeAnalytics, interactionTracker, errorTracker } from '@/utils/analytics';

initializeAnalytics({
  sessionReplay: {
    enabled: true,
    provider: 'hotjar',
    hotjar: {
      siteId: parseInt(import.meta.env.VITE_HOTJAR_SITE_ID),
      version: 6,
    },
  },
});

interactionTracker.initialize();
errorTracker.initialize();`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">3. View Documentation</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/SESSION_REPLAY_QUICK_START.md" target="_blank">
                  Quick Start
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/SESSION_REPLAY_IMPLEMENTATION.md" target="_blank">
                  Full Documentation
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SessionReplayDemo() {
  return (
    <ErrorBoundaryWithReplay showSessionUrl={true}>
      <DemoContent />
    </ErrorBoundaryWithReplay>
  );
}
