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

// Add color generation function
function generateColors(count: number): string[] {
  const baseColors = [
    { r: 255, g: 99, b: 132 },    // Pink/Red
    { r: 54, g: 162, b: 235 },    // Blue
    { r: 255, g: 206, b: 86 },    // Yellow
    { r: 75, g: 192, b: 192 },    // Teal
    { r: 153, g: 102, b: 255 },   // Purple
    { r: 255, g: 159, b: 64 }     // Orange
  ];

  const colors: string[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i < baseColors.length) {
      // Use base colors first
      const { r, g, b } = baseColors[i];
      colors.push(`rgb(${r}, ${g}, ${b})`);
    } else {
      // Generate new colors by rotating hue
      const hue = (i * 137.508) % 360; // Golden angle approximation
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
  }

  return colors;
}

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
        backgroundColor: generateColors(Object.keys(stats.languageBreakdown).length),
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
      <div className="container px-4 py-8 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex -space-x-px w-full md:w-auto">
            <Button
              variant={activeView === 'statistics' ? 'default' : 'ghost'}
              onClick={() => setActiveView('statistics')}
              className="rounded-r-none flex-1 md:flex-none"
            >
              Statistics
            </Button>
            <Button
              variant={activeView === 'history' ? 'default' : 'ghost'}
              onClick={() => setActiveView('history')}
              className="rounded-l-none flex-1 md:flex-none"
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

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Daily Usage</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] p-2 md:p-6">
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

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[500px] md:h-[300px] p-2 md:p-6">
                  {Object.keys(stats.languageBreakdown).length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4 h-full">
                      <div className="relative h-[200px] md:h-full flex items-center justify-center">
                        <div className="w-full h-full max-h-[200px] md:max-h-full">
                          <Pie 
                            data={languageData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="h-[200px] md:h-full overflow-y-auto">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {Object.entries(stats.languageBreakdown).map(([language, count], index) => (
                            <div key={language} className="flex items-center gap-2 py-0.5">
                              <div 
                                className="w-3 h-3 rounded-sm flex-shrink-0" 
                                style={{ backgroundColor: languageData.datasets[0].backgroundColor[index] }}
                              />
                              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {language}: {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p>No language data available</p>
                        <p className="text-sm mt-1">Start paraphrasing to see your language distribution</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="w-full md:col-span-2">
                <CardHeader>
                  <CardTitle>Style Usage</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] p-2 md:p-6">
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
