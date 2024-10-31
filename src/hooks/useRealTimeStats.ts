import { useState, useEffect } from 'react';
import { wsClient } from '../utils/websocket';
import { getUserStats } from '../utils/api';

export function useRealTimeStats() {
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialStats = async () => {
            try {
                const data = await getUserStats();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch stats');
            } finally {
                setIsLoading(false);
            }
        };

        const handleStatsUpdate = (data: any) => {
            setStats((prevStats: any) => ({  // Add type annotation
                ...prevStats,
                ...data
            }));
        };

        loadInitialStats();
        wsClient.subscribe('stats_update', handleStatsUpdate);

        return () => {
            wsClient.unsubscribe('stats_update', handleStatsUpdate);
        };
    }, []);

    return { stats, error, isLoading };
}
