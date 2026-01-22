'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralRealtimeStats {
  referralCount: number;
  discountPercent: number;
  purchases30d: number;
  lastUpdate?: number;
}

interface UseReferralRealtimeOptions {
  userId?: string;
  enabled?: boolean;
  reconnectInterval?: number;
}

export function useReferralRealtime(options: UseReferralRealtimeOptions = {}) {
  const {
    userId,
    enabled = true,
    reconnectInterval = 5000,
  } = options;

  const [stats, setStats] = useState<ReferralRealtimeStats>({
    referralCount: 0,
    discountPercent: 0,
    purchases30d: 0,
  });
  
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!userId || !enabled) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      // Construct WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws/referral?userId=${userId}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
        console.log('Referral WebSocket connected');
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log('WebSocket connection established');
              break;
              
            case 'stats_update':
              setStats({
                referralCount: data.stats.referralCount || 0,
                discountPercent: data.stats.discountPercent || 0,
                purchases30d: data.stats.purchases30d || 0,
                lastUpdate: Date.now(),
              });
              break;
              
            case 'referral_added':
              setStats((prev) => ({
                ...prev,
                referralCount: prev.referralCount + 1,
                lastUpdate: Date.now(),
              }));
              break;
              
            case 'discount_earned':
              setStats((prev) => ({
                ...prev,
                discountPercent: prev.discountPercent + (data.amount || 2),
                lastUpdate: Date.now(),
              }));
              break;
              
            case 'pong':
              // Keep-alive response
              break;
              
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('WebSocket disconnected');
        
        // Attempt reconnection
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to connect');
    }
  }, [userId, enabled, reconnectInterval]);

  // Ping to keep connection alive
  useEffect(() => {
    if (!connected || !wsRef.current) return;

    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [connected]);

  // Connect on mount and when dependencies change
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Manually request stats update
  const requestUpdate = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'request_stats' }));
    }
  }, []);

  return {
    stats,
    connected,
    error,
    requestUpdate,
    reconnect: connect,
  };
}
