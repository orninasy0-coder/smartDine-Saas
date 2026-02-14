/**
 * useWebSocket Hook
 * React hook for managing WebSocket connections
 * Handles connection lifecycle and event subscriptions
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketService, WebSocketService } from './WebSocketService';
import type { WebSocketEventHandler } from './WebSocketService';

interface UseWebSocketOptions {
  /** Auto-connect on mount */
  autoConnect?: boolean;
  /** Auto-reconnect on disconnect */
  autoReconnect?: boolean;
  /** Debug mode */
  debug?: boolean;
}

interface UseWebSocketReturn {
  /** WebSocket service instance */
  ws: WebSocketService;
  /** Connection status */
  isConnected: boolean;
  /** Connecting status */
  isConnecting: boolean;
  /** Error state */
  error: Error | null;
  /** Connect to WebSocket */
  connect: () => Promise<void>;
  /** Disconnect from WebSocket */
  disconnect: () => void;
  /** Subscribe to an event */
  on: (event: string, handler: WebSocketEventHandler) => () => void;
  /** Send a message */
  send: (event: string, data: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { autoConnect = true, autoReconnect = true, debug = false } = options;

  const wsRef = useRef<WebSocketService>(getWebSocketService({ debug }));
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Connect function
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      await wsRef.current.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
    wsRef.current.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Subscribe to event
  const on = useCallback((event: string, handler: WebSocketEventHandler) => {
    return wsRef.current.on(event, handler);
  }, []);

  // Send message
  const send = useCallback((event: string, data: any) => {
    wsRef.current.send(event, data);
  }, []);

  // Setup connection status listeners
  useEffect(() => {
    const ws = wsRef.current;

    const handleConnected = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    const handleError = (data: { error: any }) => {
      setError(data.error instanceof Error ? data.error : new Error('WebSocket error'));
    };

    const handleReconnectFailed = () => {
      setError(new Error('Failed to reconnect after maximum attempts'));
      setIsConnected(false);
      setIsConnecting(false);
    };

    const unsubConnected = ws.on('connected', handleConnected);
    const unsubDisconnected = ws.on('disconnected', handleDisconnected);
    const unsubError = ws.on('error', handleError);
    const unsubReconnectFailed = ws.on('reconnect_failed', handleReconnectFailed);

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubError();
      unsubReconnectFailed();
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnecting) {
      connect();
    }

    return () => {
      if (!autoReconnect) {
        disconnect();
      }
    };
  }, [autoConnect, autoReconnect, isConnected, isConnecting, connect, disconnect]);

  return {
    ws: wsRef.current,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    on,
    send,
  };
}
