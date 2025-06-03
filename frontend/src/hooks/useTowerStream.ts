import { useEffect } from 'react';

export const useTowerStream = (
  onMessage: (event: TowerEvent) => void
) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/tower-stream');

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const json: TowerEvent = JSON.parse(event.data);
        onMessage(json);
      } catch (err) {
        console.error('❌ Failed to parse message:', err);
      }
    };

    socket.onclose = () => {
      console.log('🛑 WebSocket disconnected');
    };

    return () => socket.close();
  }, [onMessage]);
};

// Add this above or in a shared types file:
export type TowerEvent = {
  towerId: string;
  device: string;
  os: string;
  app: string;
  action: string;
  meta: {
    ip: string;
    lastSeen: string;
  };
};
