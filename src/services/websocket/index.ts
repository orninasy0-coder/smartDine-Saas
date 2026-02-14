/**
 * WebSocket Services
 * Real-time communication services for order updates and notifications
 */

export { WebSocketService, getWebSocketService, resetWebSocketService } from './WebSocketService';
export type { WebSocketEventType, WebSocketEventHandler } from './WebSocketService';

export { useWebSocket } from './useWebSocket';
export { useKitchenWebSocket } from './useKitchenWebSocket';
