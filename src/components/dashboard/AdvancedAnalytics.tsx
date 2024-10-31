import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
    BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { format } from 'date-fns';

interface AdvancedAnalyticsProps {
    activities: any[];
    stats: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdvancedAnalytics({ activities, stats }: AdvancedAnalyticsProps) {
    // Process activities for various visualizations
    const activityMetrics = activities.reduce((acc: any, activity: any) => {
        // Time of day analysis
        const hour = new Date(activity.created_at).getHours();
        acc.hourly[hour] = (acc.hourly[hour] || 0) + 1;

        // Success rate analysis
        if (activity.action.includes('error')) {
            acc.errors++;
        } else {
            acc.successes++;
        }

        // Text length analysis
        if (activity.metadata?.textLength) {
            acc.totalLength += activity.metadata.textLength;
            acc.count++;
        }

        return acc;
    }, { hourly: {}, errors: 0, successes: 0, totalLength: 0, count: 0 });

    const hourlyData = Object.entries(activityMetrics.hourly).map(([hour, count]) => ({
        hour: `${hour}:00`,
        count
    }));

    const successRate = {
        success: activityMetrics.successes,
        error: activityMetrics.errors
    };

    const averageLength = activityMetrics.count > 0 
        ? Math.round(activityMetrics.totalLength / activityMetrics.count)
        : 0;

    return (
        <div className="space-y-8">
            {/* Usage Patterns */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Usage by Time of Day</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Success Rate</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Success', value: successRate.success },
                                        { name: 'Error', value: successRate.error }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name: string; percent: number }) => 
                                        `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    <Cell fill="#4CAF50" />
                                    <Cell fill="#f44336" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{activities.length}</p>
                        <p className="text-sm text-gray-500">Total Activities</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">
                            {((successRate.success / (successRate.success + successRate.error)) * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{averageLength}</p>
                        <p className="text-sm text-gray-500">Avg. Text Length</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-500">
                                    {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                            {activity.metadata?.textLength && (
                                <span className="text-sm text-gray-500">
                                    {activity.metadata.textLength} characters
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
