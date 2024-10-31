import { useState, useEffect } from 'react';
import { getUserStats } from '../utils/api';

interface Stats {
    totalParaphrases: number;
    languageBreakdown: { [key: string]: number };
    styleBreakdown: { [key: string]: number };
    dailyUsage: { date: string; count: number }[];
}

export function useStats(refreshInterval = 60000) { // Default 1 minute
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const data = await getUserStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { stats, error, isLoading, refetch: fetchStats };
}
