/**
 * Friction Detection Demo Page
 * Demonstrates UX friction detection features
 */

import { useState } from 'react';
import { useFrictionDetection } from '@/hooks/useFrictionDetection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MousePointerClick, XCircle, FileX } from 'lucide-react';

export default function FrictionDetectionDemo() {
  const { frictionEvents, summary, getHighSeverityEvents, clearEvents } = useFrictionDetection({
    enabled: true,
    autoInitialize: true,
    formAbandonment: {
      enabled: true,
      minInteractionTime: 3000, // 3 seconds for demo
      trackPartialFills: true,
    },
    rageClick: {
      enabled: true,
      threshold: 3,
      timeWindow: 1000,
    },
    deadClick: {
      enabled: true,
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'form_abandonment':
        return <FileX className="h-4 w-4" />;
      case 'rage_click':
        return <MousePointerClick className="h-4 w-4" />;
      case 'dead_click':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">UX Friction Detection Demo</h1>
          <p className="text-muted-foreground">
            This page demonstrates automatic detection of user experience friction points
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Form Abandonments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.byType.form_abandonment || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rage Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.byType.rage_click || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dead Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.byType.dead_click || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Form Abandonment</CardTitle>
                <CardDescription>
                  Start filling this form and then stop interacting for 30 seconds to trigger abandonment detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Enter your message"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Form
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Rage Click</CardTitle>
                <CardDescription>
                  Click this button rapidly 3+ times within 1 second to trigger rage click detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Intentionally slow response
                    setTimeout(() => {
                      console.log('Button clicked');
                    }, 2000);
                  }}
                >
                  Slow Response Button (Click Rapidly!)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Dead Click</CardTitle>
                <CardDescription>
                  Click on the styled div below that looks clickable but has no handler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="clickable p-4 border-2 border-dashed border-primary rounded-lg text-center cursor-pointer hover:bg-accent transition-colors"
                >
                  This looks clickable but does nothing!
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Log */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Friction Events Log</CardTitle>
                    <CardDescription>Real-time detection of UX friction points</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearEvents}>
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {frictionEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No friction events detected yet. Try the demos on the left!
                    </div>
                  ) : (
                    frictionEvents.map((event, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(event.type)}
                            <span className="font-medium capitalize">
                              {event.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <Badge variant={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>

                        {event.element && (
                          <div className="text-sm text-muted-foreground">
                            Element: <code className="text-xs bg-muted px-1 py-0.5 rounded">{event.element}</code>
                          </div>
                        )}

                        {event.metadata && (
                          <div className="text-xs space-y-1">
                            {Object.entries(event.metadata).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="font-mono">{JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* High Severity Alerts */}
            {getHighSeverityEvents().length > 0 && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    High Severity Issues
                  </CardTitle>
                  <CardDescription>
                    These friction points require immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getHighSeverityEvents().map((event, index) => (
                      <div key={index} className="p-3 bg-destructive/10 rounded-lg">
                        <div className="font-medium capitalize">
                          {event.type.replace(/_/g, ' ')}
                        </div>
                        {event.element && (
                          <div className="text-sm text-muted-foreground">
                            {event.element}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Form Abandonment Detection</h3>
              <p className="text-sm text-muted-foreground">
                Tracks when users start filling a form but abandon it before submission. Monitors field interactions,
                completion rate, and time spent. Triggers after 30 seconds of inactivity if the user has interacted
                with at least one field.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Rage Click Detection</h3>
              <p className="text-sm text-muted-foreground">
                Detects when users rapidly click the same element multiple times (3+ clicks within 1 second),
                indicating frustration with unresponsive UI elements or unclear interactions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dead Click Detection</h3>
              <p className="text-sm text-muted-foreground">
                Identifies elements that appear clickable (cursor: pointer, clickable class) but have no actual
                click handlers, leading to user confusion and frustration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
