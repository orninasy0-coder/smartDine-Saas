/**
 * useKitchenWebSocket Hook
 * Specialized hook for kitchen dashboard WebSocket connections
 * Handles order events and kitchen notifications
 */

import { useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { WEBSOCKET_EVENTS } from '@/utils/constants';
import type { Order } from '@/utils/types';

interface KitchenWebSocketCallbacks {
  /** Called when a new order is created */
  onOrderCreated?: (order: Order) => void;
  /** Called when an order is updated */
  onOrderUpdated?: (order: Order) => void;
  /** Called when order status changes */
  onOrderStatusChanged?: (data: { orderId: string; status: string; order: Order }) => void;
  /** Called when a kitchen notification is received */
  onKitchenNotification?: (data: any) => void;
}

interface UseKitchenWebSocketOptions {
  /** Restaurant ID to subscribe to */
  restaurantId: string;
  /** Event callbacks */
  callbacks?: KitchenWebSocketCallbacks;
  /** Auto-connect on mount */
  autoConnect?: boolean;
  /** Debug mode */
  debug?: boolean;
}

export function useKitchenWebSocket(options: UseKitchenWebSocketOptions) {
  const { restaurantId, callbacks = {}, autoConnect = true, debug = false } = options;

  const { ws, isConnected, isConnecting, error, connect, disconnect, on } = useWebSocket({
    autoConnect,
    autoReconnect: true,
    debug,
  });

  // Subscribe to order events
  useEffect(() => {
    if (!isConnected || !restaurantId) return;

    // Subscribe to orders channel
    const unsubscribeOrders = ws.subscribeToOrders(restaurantId);

    // Subscribe to kitchen channel
    const unsubscribeKitchen = ws.subscribeToKitchen(restaurantId);

    return () => {
      unsubscribeOrders();
      unsubscribeKitchen();
    };
  }, [isConnected, restaurantId, ws]);

  // Setup event handlers
  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    // Order created event
    if (callbacks.onOrderCreated) {
      const unsub = on(WEBSOCKET_EVENTS.ORDER_CREATED, (data: { order: Order }) => {
        callbacks.onOrderCreated?.(data.order);
      });
      unsubscribers.push(unsub);
    }

    // Order updated event
    if (callbacks.onOrderUpdated) {
      const unsub = on(WEBSOCKET_EVENTS.ORDER_UPDATED, (data: { order: Order }) => {
        callbacks.onOrderUpdated?.(data.order);
      });
      unsubscribers.push(unsub);
    }

    // Order status changed event
    if (callbacks.onOrderStatusChanged) {
      const unsub = on(
        WEBSOCKET_EVENTS.ORDER_STATUS_CHANGED,
        (data: { orderId: string; status: string; order: Order }) => {
          callbacks.onOrderStatusChanged?.(data);
        }
      );
      unsubscribers.push(unsub);
    }

    // Kitchen notification event
    if (callbacks.onKitchenNotification) {
      const unsub = on(WEBSOCKET_EVENTS.KITCHEN_NOTIFICATION, (data: any) => {
        callbacks.onKitchenNotification?.(data);
      });
      unsubscribers.push(unsub);
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [on, callbacks]);

  // Send order status update
  const updateOrderStatus = useCallback(
    (orderId: string, status: string) => {
      if (!isConnected) {
        console.warn('Cannot update order status: not connected');
        return;
      }

      ws.send('order.status.update', {
        orderId,
        status,
        restaurantId,
        timestamp: new Date().toISOString(),
      });
    },
    [isConnected, ws, restaurantId]
  );

  // Send kitchen notification
  const sendKitchenNotification = useCallback(
    (message: string, type: string = 'info') => {
      if (!isConnected) {
        console.warn('Cannot send notification: not connected');
        return;
      }

      ws.send('kitchen.notification', {
        restaurantId,
        message,
        type,
        timestamp: new Date().toISOString(),
      });
    },
    [isConnected, ws, restaurantId]
  );

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    updateOrderStatus,
    sendKitchenNotification,
  };
}
