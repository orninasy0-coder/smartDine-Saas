/**
 * User Flow Visualization Component
 * Visualize user journey paths and flows
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { JourneyPath, PathPattern } from '@/utils/analytics/userJourney';

interface UserFlowVisualizationProps {
  journeys: JourneyPath[];
  title?: string;
  description?: string;
  maxPaths?: number;
}

interface FlowNode {
  id: string;
  label: string;
  count: number;
  percentage: number;
}

interface FlowEdge {
  from: string;
  to: string;
  count: number;
  percentage: number;
}

export function UserFlowVisualization({
  journeys,
  title = 'User Flow',
  description = 'Visualize how users navigate through your application',
  maxPaths = 10,
}: UserFlowVisualizationProps) {
  const flowData = useMemo(() => {
    const nodes = new Map<string, FlowNode>();
    const edges = new Map<string, FlowEdge>();
    const totalJourneys = journeys.length;

    // Build nodes and edges from journeys
    journeys.forEach((journey) => {
      journey.steps.forEach((step, index) => {
        // Add node
        if (!nodes.has(step.path)) {
          nodes.set(step.path, {
            id: step.path,
            label: step.path,
            count: 0,
            percentage: 0,
          });
        }
        const node = nodes.get(step.path)!;
        node.count++;

        // Add edge to next step
        if (index < journey.steps.length - 1) {
          const nextStep = journey.steps[index + 1];
          const edgeKey = `${step.path}→${nextStep.path}`;

          if (!edges.has(edgeKey)) {
            edges.set(edgeKey, {
              from: step.path,
              to: nextStep.path,
              count: 0,
              percentage: 0,
            });
          }
          const edge = edges.get(edgeKey)!;
          edge.count++;
        }
      });
    });

    // Calculate percentages
    nodes.forEach((node) => {
      node.percentage = (node.count / totalJourneys) * 100;
    });

    edges.forEach((edge) => {
      const fromNode = nodes.get(edge.from);
      if (fromNode) {
        edge.percentage = (edge.count / fromNode.count) * 100;
      }
    });

    return {
      nodes: Array.from(nodes.values()).sort((a, b) => b.count - a.count),
      edges: Array.from(edges.values()).sort((a, b) => b.count - a.count),
    };
  }, [journeys]);

  const topPaths = useMemo(() => {
    const pathMap = new Map<string, PathPattern>();

    journeys.forEach((journey) => {
      const pathKey = journey.steps.map((s) => s.path).join(' → ');

      if (!pathMap.has(pathKey)) {
        pathMap.set(pathKey, {
          pattern: journey.steps.map((s) => s.path),
          count: 0,
          avgDuration: 0,
          completionRate: 0,
          dropOffPoints: new Map(),
        });
      }

      const pattern = pathMap.get(pathKey)!;
      pattern.count++;
      pattern.avgDuration =
        (pattern.avgDuration * (pattern.count - 1) + (journey.totalDuration || 0)) /
        pattern.count;
      pattern.completionRate =
        (pattern.completionRate * (pattern.count - 1) + (journey.completed ? 1 : 0)) /
        pattern.count;
    });

    return Array.from(pathMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, maxPaths);
  }, [journeys, maxPaths]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Flow Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{journeys.length}</div>
            <div className="text-sm text-muted-foreground">Total Journeys</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{flowData.nodes.length}</div>
            <div className="text-sm text-muted-foreground">Unique Pages</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{flowData.edges.length}</div>
            <div className="text-sm text-muted-foreground">Transitions</div>
          </div>
        </div>

        {/* Top Paths */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Top User Paths</h3>
          <div className="space-y-3">
            {topPaths.map((path, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Path #{index + 1}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {path.count} users ({((path.count / journeys.length) * 100).toFixed(1)}%)
                    </span>
                    <span className="text-muted-foreground">
                      Avg: {(path.avgDuration / 1000).toFixed(1)}s
                    </span>
                    <span
                      className={
                        path.completionRate > 0.7
                          ? 'text-green-600'
                          : path.completionRate > 0.4
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }
                    >
                      {(path.completionRate * 100).toFixed(0)}% completion
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto text-sm">
                  {path.pattern.map((step, stepIndex) => (
                    <React.Fragment key={stepIndex}>
                      <span className="whitespace-nowrap rounded bg-primary/10 px-2 py-1 text-primary">
                        {step}
                      </span>
                      {stepIndex < path.pattern.length - 1 && (
                        <span className="text-muted-foreground">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Entry Points */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Top Entry Points</h3>
          <div className="space-y-2">
            {flowData.nodes.slice(0, 5).map((node, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium">{node.label}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {node.count} visits ({node.percentage.toFixed(1)}%)
                  </span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(node.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Transitions */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Top Transitions</h3>
          <div className="space-y-2">
            {flowData.edges.slice(0, 5).map((edge, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{edge.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{edge.to}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {edge.count} transitions ({edge.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(edge.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
