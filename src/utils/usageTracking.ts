interface UsageEvent {
    action: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}

class UsageTracker {
    private static instance: UsageTracker;
    private events: UsageEvent[] = [];
    private batchSize = 10;
    private flushInterval = 5000; // 5 seconds

    private constructor() {
        setInterval(() => this.flush(), this.flushInterval);
    }

    static getInstance(): UsageTracker {
        if (!UsageTracker.instance) {
            UsageTracker.instance = new UsageTracker();
        }
        return UsageTracker.instance;
    }

    trackEvent(action: string, metadata?: Record<string, any>) {
        const event: UsageEvent = {
            action,
            metadata,
            timestamp: new Date()
        };

        this.events.push(event);

        if (this.events.length >= this.batchSize) {
            this.flush();
        }
    }

    private async flush() {
        if (this.events.length === 0) return;

        const eventsToSend = [...this.events];
        this.events = [];

        try {
            await fetch('http://localhost:8080/api/track/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ events: eventsToSend })
            });
        } catch (error) {
            console.error('Failed to send usage events:', error);
            // Add back failed events
            this.events = [...eventsToSend, ...this.events];
        }
    }
}

export const usageTracker = UsageTracker.getInstance();
