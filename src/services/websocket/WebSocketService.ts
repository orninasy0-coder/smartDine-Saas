/**
 * WebSocket Service
 * Manages real-time WebSocket connections for order updates
 * Handles connection lifecycle, reconnection, and event subscriptions
 */

import { env } from '@/utils/env';
import { WEBSOCKET_EVENTS } from '@/utils/constants';
import type { Order } from '@/utils/types';

export type WebSocketEventType = keyof typeof WEBSOCKET_EVENTS;
export type WebSocketEventHandler = (data: any) => void;

interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  debug?: boolean;
}

interface WebSocketMessage {
  event: string;
  data: any;
  timestamp: string;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private currentReconnectAttempt = 0;
  private isConnecting = false;
  private isIntentionallyClosed = false;

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      url: config?.url || env.WS_URL,
      reconnectAttempts: config?.reconnectAttempts ?? env.WS_RECONNECT_ATTEMPTS,
      reconnectDelay: config?.reconnectDelay ?? env.WS_RECONNECT_DELAY,
      debug: config?.debug ?? env.DEBUG_MODE,
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.log('Already connected');
        resolve();
        return;
      }

      if (this.isConnecting) {
        this.log('Connection already in progress');
        resolve();
        return;
      }

      this.isConnecting = true;
      this.isIntentionallyClosed = false;

      try {
        this.log(`Connecting to ${this.config.url}`);
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.log('Connected successfully');
          this.isConnecting = false;
          this.currentReconnectAttempt = 0;
          this.emit('connected', {});
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onerror = (error) => {
          this.log('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', { error });
        };

        this.ws.onclose = (event) => {
          this.log('Connection closed', event.code, event.reason);
          this.isConnecting = false;
          this.emit('disconnected', { code: event.code, reason: event.reason });

          // Attempt reconnection if not intentionally closed
          if (!this.isIntentionallyClosed) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        this.log('Failed to create WebSocket:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.log('Disconnecting...');
    this.isIntentionallyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.currentReconnectAttempt = 0;
  }

  /**
   * Subscribe to an event
   */
  on(event: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }

    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  /**
   * Send a message to the server
   */
  send(event: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message: not connected');
      return;
    }

    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.ws.send(JSON.stringify(message));
    this.log('Sent message:', event, data);
  }

  /**
   * Subscribe to order events for a specific restaurant
   */
  subscribeToOrders(restaurantId: string): () => void {
    this.send('subscribe', { channel: `orders:${restaurantId}` });

    // Return unsubscribe function
    return () => {
      this.send('unsubscribe', { channel: `orders:${restaurantId}` });
    };
  }

  /**
   * Subscribe to kitchen notifications
   */
  subscribeToKitchen(restaurantId: string): () => void {
    this.send('subscribe', { channel: `kitchen:${restaurantId}` });

    return () => {
      this.send('unsubscribe', { channel: `kitchen:${restaurantId}` });
    };
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   */
  getReadyState(): number | null {
    return this.ws?.readyState ?? null;
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.log('Received message:', message.event, message.data);
      this.emit(message.event, message.data);
    } catch (error) {
      this.log('Failed to parse message:', error);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          this.log('Error in event handler:', error);
        }
      });
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.currentReconnectAttempt >= this.config.reconnectAttempts) {
      this.log('Max reconnection attempts reached');
      this.emit('reconnect_failed', {
        attempts: this.currentReconnectAttempt,
      });
      return;
    }

    this.currentReconnectAttempt++;
    const delay = this.config.reconnectDelay * this.currentReconnectAttempt;

    this.log(`Reconnecting in ${delay}ms (attempt ${this.currentReconnectAttempt})`);

    this.reconnectTimer = setTimeout(() => {
      this.log(`Reconnection attempt ${this.currentReconnectAttempt}`);
      this.connect().catch((error) => {
        this.log('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Log debug messages
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }
}

// Singleton instance
let wsInstance: WebSocketService | null = null;

/**
 * Get or create WebSocket service instance
 */
export function getWebSocketService(config?: Partial<WebSocketConfig>): WebSocketService {
  if (!wsInstance) {
    wsInstance = new WebSocketService(config);
  }
  return wsInstance;
}

/**
 * Reset WebSocket service instance (useful for testing)
 */
export function resetWebSocketService(): void {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
}
