import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import UsageStats from '../components/dashboard/UsageStats';
import ParaphraseHistory from '../components/ParaphraseHistory';
import { getParaphraseHistory, getUserStats } from '../utils/api';

interface HistoryEntry {
    id: number;
    original_text: string;
    paraphrased_text: string;
    language: string;
    style: string;
    created_at: string;
}

interface Stats {
    totalParaphrases: number;
    languageBreakdown: { [key: string]: number };
    styleBreakdown: { [key: string]: number };
    dailyUsage: { date: string; count: number }[];
}

interface DashboardState {
    history: HistoryEntry[];
    stats: Stats | null;
    isLoadingData: boolean;
    error: string | null;
    activeTab: 'history' | 'stats';  // Removed 'settings'
}

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [state, setState] = useState<DashboardState>({
        history: [],
        stats: null,
        isLoadingData: true,
        error: null,
        activeTab: 'stats'
    });
    const [copiedText, setCopiedText] = useState<'original' | 'paraphrased' | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            
            setState(prevState => ({
                ...prevState,
                isLoadingData: true
            }));
            try {
                const [historyData, statsData] = await Promise.all([
                    getParaphraseHistory(),
                    getUserStats()
                ]);
                setState(prevState => ({
                    ...prevState,
                    history: historyData,
                    stats: statsData,
                    isLoadingData: false
                }));
            } catch (error: any) {
                console.error('Failed to load dashboard data:', error);
                setState(prevState => ({
                    ...prevState,
                    error: error.message,
                    isLoadingData: false
                }));
            }
        };

        loadData();
    }, [user]);

    const handleCopy = async (text: string, type: 'original' | 'paraphrased') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(type);
            setTimeout(() => setCopiedText(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setState(prevState => ({
                                ...prevState,
                                activeTab: 'stats'
                            }))}
                            className={`px-4 py-2 rounded-lg ${
                                state.activeTab === 'stats'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Statistics
                        </button>
                        <button
                            onClick={() => setState(prevState => ({
                                ...prevState,
                                activeTab: 'history'
                            }))}
                            className={`px-4 py-2 rounded-lg ${
                                state.activeTab === 'history'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {state.isLoadingData ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="large" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {state.activeTab === 'stats' && state.stats && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Statistics</h2>
                                <UsageStats stats={state.stats} />
                            </div>
                        )}

                        {state.activeTab === 'history' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Paraphrase History</h2>
                                <ParaphraseHistory 
                                    history={state.history}
                                    onCopy={handleCopy}
                                    copiedText={copiedText}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
