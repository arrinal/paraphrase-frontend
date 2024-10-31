interface WebSocketMessage {
    type: string;
    data: any;
}

class WebSocketClient {
    private static instance: WebSocketClient;
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private listeners: { [key: string]: ((data: any) => void)[] } = {};

    private constructor() {}

    static getInstance(): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }

    connect(token: string) {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

        this.ws.onmessage = (event) => {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.notifyListeners(message.type, message.data);
        };

        this.ws.onclose = () => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect(token);
                }, 1000 * Math.pow(2, this.reconnectAttempts));
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    subscribe(eventType: string, callback: (data: any) => void) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    unsubscribe(eventType: string, callback: (data: any) => void) {
        if (this.listeners[eventType]) {
            this.listeners[eventType] = this.listeners[eventType].filter(
                (cb) => cb !== callback
            );
        }
    }

    private notifyListeners(eventType: string, data: any) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach((callback) => callback(data));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.listeners = {};
        this.reconnectAttempts = 0;
    }
}

export const wsClient = WebSocketClient.getInstance();
