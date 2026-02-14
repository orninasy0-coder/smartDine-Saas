/**
 * DeliveryTimer Component Examples
 * Demonstrates different usage scenarios and configurations
 */

import React from 'react';
import { DeliveryTimer } from './DeliveryTimer';

export const DeliveryTimerExamples: React.FC = () => {
  // Example timestamps
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000);
  const thirtyFiveMinutesAgo = new Date(now.getTime() - 35 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  return (
    <div className="p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-3xl font-bold mb-2">DeliveryTimer Component</h1>
        <p className="text-muted-foreground">
          Real-time delivery timer with urgency indicators
        </p>
      </div>

      {/* Example 1: Normal Status (5 minutes elapsed) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Normal Status</h2>
          <p className="text-sm text-muted-foreground">
            Order ready 5 minutes ago - well within estimated time
          </p>
        </div>
        <DeliveryTimer
          readyAt={fiveMinutesAgo}
          estimatedDeliveryMinutes={30}
        />
      </section>

      {/* Example 2: Warning Status (20 minutes elapsed) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Warning Status</h2>
          <p className="text-sm text-muted-foreground">
            Order ready 20 minutes ago - approaching estimated time (75%+)
          </p>
        </div>
        <DeliveryTimer
          readyAt={twentyMinutesAgo}
          estimatedDeliveryMinutes={25}
        />
      </section>

      {/* Example 3: Critical Status (35 minutes elapsed) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Critical Status</h2>
          <p className="text-sm text-muted-foreground">
            Order ready 35 minutes ago - exceeded estimated time
          </p>
        </div>
        <DeliveryTimer
          readyAt={thirtyFiveMinutesAgo}
          estimatedDeliveryMinutes={30}
        />
      </section>

      {/* Example 4: Long Delay (1 hour elapsed) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Long Delay</h2>
          <p className="text-sm text-muted-foreground">
            Order ready 1 hour ago - significantly delayed
          </p>
        </div>
        <DeliveryTimer
          readyAt={oneHourAgo}
          estimatedDeliveryMinutes={30}
        />
      </section>

      {/* Example 5: Compact Version */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Compact Version</h2>
          <p className="text-sm text-muted-foreground">
            Minimal display for inline usage
          </p>
        </div>
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Normal (5 min):</span>
            <DeliveryTimer
              readyAt={fiveMinutesAgo}
              estimatedDeliveryMinutes={30}
              compact
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Warning (20 min):</span>
            <DeliveryTimer
              readyAt={twentyMinutesAgo}
              estimatedDeliveryMinutes={25}
              compact
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Critical (35 min):</span>
            <DeliveryTimer
              readyAt={thirtyFiveMinutesAgo}
              estimatedDeliveryMinutes={30}
              compact
            />
          </div>
        </div>
      </section>

      {/* Example 6: Custom Estimated Time */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Custom Estimated Time</h2>
          <p className="text-sm text-muted-foreground">
            Different estimated delivery times (15, 45, 60 minutes)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DeliveryTimer
            readyAt={fiveMinutesAgo}
            estimatedDeliveryMinutes={15}
          />
          <DeliveryTimer
            readyAt={twentyMinutesAgo}
            estimatedDeliveryMinutes={45}
          />
          <DeliveryTimer
            readyAt={thirtyFiveMinutesAgo}
            estimatedDeliveryMinutes={60}
          />
        </div>
      </section>

      {/* Example 7: In Card Context */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">In Card Context</h2>
          <p className="text-sm text-muted-foreground">
            How it looks integrated with delivery cards
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">طلب #ORD-001</h3>
                <p className="text-sm text-muted-foreground">طاولة 5</p>
              </div>
            </div>
            <DeliveryTimer
              readyAt={fiveMinutesAgo}
              estimatedDeliveryMinutes={30}
              className="mb-4"
            />
            <div className="text-sm text-muted-foreground">
              <p>3 أصناف • 125.50 ر.س</p>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">طلب #ORD-002</h3>
                <p className="text-sm text-muted-foreground">طاولة 12</p>
              </div>
            </div>
            <DeliveryTimer
              readyAt={thirtyFiveMinutesAgo}
              estimatedDeliveryMinutes={30}
              className="mb-4"
            />
            <div className="text-sm text-muted-foreground">
              <p>5 أصناف • 287.00 ر.س</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="p-6 bg-muted/50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-3">Usage Notes</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Timer updates automatically every second</li>
          <li>• Urgency levels: Normal (0-74%), Warning (75-99%), Critical (100%+)</li>
          <li>• Compact mode for inline display without labels</li>
          <li>• Progress bar shows elapsed time vs estimated time</li>
          <li>• Visual indicators (colors, icons, animations) for urgency</li>
          <li>• Supports both ISO string and Date object for readyAt prop</li>
          <li>• Default estimated delivery time is 30 minutes</li>
        </ul>
      </section>
    </div>
  );
};

export default DeliveryTimerExamples;
