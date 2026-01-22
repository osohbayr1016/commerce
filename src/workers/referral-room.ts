// Durable Object for Referral Realtime Updates
export class ReferralRoomDO {
  state: DurableObjectState;
  sessions: Map<string, WebSocket>;
  env: any;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.sessions = new Map();
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    // Check if this is a WebSocket upgrade request
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    // Create WebSocket pair
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    // Accept the WebSocket connection
    await this.handleSession(server as WebSocket, request);

    return new Response(null, {
      status: 101,
      webSocket: client as WebSocket,
    });
  }

  async handleSession(websocket: WebSocket, request: Request): Promise<void> {
    // Accept the WebSocket
    websocket.accept();

    // Extract user ID from query params or auth token
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      websocket.close(1008, 'User ID required');
      return;
    }

    // Store the session
    this.sessions.set(userId, websocket);

    // Send initial connection message
    websocket.send(JSON.stringify({
      type: 'connected',
      userId,
      timestamp: Date.now(),
    }));

    // Handle incoming messages
    websocket.addEventListener('message', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        this.handleMessage(userId, data);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    });

    // Handle connection close
    websocket.addEventListener('close', () => {
      this.sessions.delete(userId);
    });

    // Handle errors
    websocket.addEventListener('error', (event: Event) => {
      console.error('WebSocket error:', event);
      this.sessions.delete(userId);
    });
  }

  handleMessage(userId: string, data: any): void {
    // Handle different message types
    switch (data.type) {
      case 'ping':
        this.sendToUser(userId, { type: 'pong', timestamp: Date.now() });
        break;
      case 'request_stats':
        // Stats will be pushed from server-side when updated
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Broadcast update to a specific user
  broadcastUpdate(userId: string, data: any): void {
    this.sendToUser(userId, data);
  }

  // Send message to specific user
  sendToUser(userId: string, data: any): void {
    const ws = this.sessions.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // Broadcast to all connected users
  broadcast(data: any): void {
    const message = JSON.stringify(data);
    this.sessions.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  // Get active sessions count
  getActiveSessionsCount(): number {
    return this.sessions.size;
  }
}

// Export for Cloudflare Workers
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    return new Response('Referral Room Durable Object', { status: 200 });
  },
};
