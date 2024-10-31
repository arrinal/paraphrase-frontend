import { useState, useEffect } from 'react';
import { wsClient } from '../utils/websocket';

interface Activity {
    id: number;
    action: string;
    details: string;
    metadata: any;
    created_at: string;
}

export function useActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadActivities = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/activities', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch activities');
                }

                const data = await response.json();
                setActivities(data.activities);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load activities');
            } finally {
                setIsLoading(false);
            }
        };

        const handleActivityUpdate = (activity: Activity) => {
            setActivities(prev => [activity, ...prev]);
        };

        loadActivities();
        wsClient.subscribe('activity_update', handleActivityUpdate);

        return () => {
            wsClient.unsubscribe('activity_update', handleActivityUpdate);
        };
    }, []);

    const trackActivity = async (action: string, details: Record<string, any>) => {
        try {
            await fetch('http://localhost:8080/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ action, details }),
            });
        } catch (error) {
            console.error('Failed to track activity:', error);
        }
    };

    return { activities, isLoading, error, trackActivity };
}
