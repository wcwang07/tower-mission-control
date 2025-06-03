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
      if (!event.data || event.data.trim() === '') {
        console.warn('⚠️ Skipped empty WebSocket message');
        return;
      }

      try {
        console.log('📨 Received message:', event.data);
        const json: TowerEvent = JSON.parse(event.data);
        onMessage(json);
      } catch (err) {
        console.error('❌ Failed to parse message:', err, 'Raw:', event.data);
      }
    };

    socket.onclose = () => {
      console.log('🛑 WebSocket disconnected');
    };

    return () => socket.close();
  }, [onMessage]);
};

// Shared type
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
