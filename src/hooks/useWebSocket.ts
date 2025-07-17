import { useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (url: string) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(url);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
      };
      
      wsRef.current.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message:', message);
        
        // Handle different message types - could trigger custom events or callbacks
        switch (message.type) {
          case 'new_lead':
            // Dispatch custom event or trigger callback
            window.dispatchEvent(new CustomEvent('leadsUpdated'));
            break;
          case 'lead_updated':
            window.dispatchEvent(new CustomEvent('leadsUpdated'));
            break;
          case 'campaign_updated':
            window.dispatchEvent(new CustomEvent('campaignsUpdated'));
            break;
          case 'call_status':
            window.dispatchEvent(new CustomEvent('callLogsUpdated'));
            break;
          case 'campaign_started':
          case 'campaign_paused':
          case 'campaign_resumed':
            window.dispatchEvent(new CustomEvent('campaignsUpdated'));
            break;
          default:
            console.log('Unknown WebSocket message type:', message.type);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return wsRef;
};