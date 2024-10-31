type ErrorSeverity = 'low' | 'medium' | 'high';

interface ErrorLog {
    message: string;
    severity: ErrorSeverity;
    timestamp: Date;
    context?: Record<string, any>;
}

class ErrorTracker {
    private static instance: ErrorTracker;
    private errors: ErrorLog[] = [];

    private constructor() {}

    static getInstance(): ErrorTracker {
        if (!ErrorTracker.instance) {
            ErrorTracker.instance = new ErrorTracker();
        }
        return ErrorTracker.instance;
    }

    logError(message: string, severity: ErrorSeverity = 'medium', context?: Record<string, any>) {
        const errorLog: ErrorLog = {
            message,
            severity,
            timestamp: new Date(),
            context
        };

        this.errors.push(errorLog);
        console.error('Error logged:', errorLog);

        // Send to backend
        this.sendErrorToServer(errorLog).catch(console.error);
    }

    private async sendErrorToServer(errorLog: ErrorLog) {
        try {
            await fetch('http://localhost:8080/api/errors/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(errorLog)
            });
        } catch (error) {
            console.error('Failed to send error to server:', error);
        }
    }

    getRecentErrors(minutes: number = 5): ErrorLog[] {
        const cutoff = new Date(Date.now() - minutes * 60000);
        return this.errors.filter(error => error.timestamp > cutoff);
    }
}

export const errorTracker = ErrorTracker.getInstance();
