import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getUserStats, getParaphraseHistory } from '../utils/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParaphraseHistory from '@/components/ParaphraseHistory';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Stats {
    totalParaphrases: number;
    languageBreakdown: { [key: string]: number };
    styleBreakdown: { [key: string]: number };
    dailyUsage: { date: string; count: number }[];
}

type ViewType = 'statistics' | 'history';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<ViewType>('statistics');
    const [copiedText, setCopiedText] = useState<'original' | 'paraphrased' | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [statsData, historyData] = await Promise.all([
                    getUserStats(),
                    getParaphraseHistory()
                ]);
                setStats(statsData);
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to load data:", error);
                setError("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadData();
        }
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

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container py-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                        {error}
                    </div>
                </div>
            </Layout>
        );
    }

    if (!stats) {
        return (
            <Layout>
                <div className="container py-8">
                    <div className="text-center text-gray-500">No data available</div>
                </div>
            </Layout>
        );
    }

    const dailyUsageData = {
        labels: stats.dailyUsage.map(d => d.date),
        datasets: [
            {
                label: "Paraphrases",
                data: stats.dailyUsage.map(d => d.count),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                tension: 0.1,
            },
        ],
    };

    const languageData = {
        labels: Object.keys(stats.languageBreakdown),
        datasets: [
            {
                data: Object.values(stats.languageBreakdown),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
            },
        ],
    };

    const styleData = {
        labels: Object.keys(stats.styleBreakdown),
        datasets: [
            {
                label: "Usage by Style",
                data: Object.values(stats.styleBreakdown),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };

    return (
        <Layout>
            <div className="container py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex -space-x-px">
                        <Button
                            variant={activeView === 'statistics' ? 'default' : 'ghost'}
                            onClick={() => setActiveView('statistics')}
                            className="rounded-r-none"
                        >
                            Statistics
                        </Button>
                        <Button
                            variant={activeView === 'history' ? 'default' : 'ghost'}
                            onClick={() => setActiveView('history')}
                            className="rounded-l-none"
                        >
                            History
                        </Button>
                    </div>
                </div>

                {activeView === 'statistics' ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-3 mb-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Paraphrases</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">{stats.totalParaphrases}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Daily Usage</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <Line 
                                        data={dailyUsageData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Language Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <Pie 
                                        data={languageData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Style Usage</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <Bar 
                                        data={styleData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : (
                    <ParaphraseHistory 
                        history={history}
                        onCopy={handleCopy}
                        copiedText={copiedText}
                    />
                )}
            </div>
        </Layout>
    );
}
