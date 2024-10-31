import React from 'react';
import { useStats } from '../../hooks/useStats';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import LoadingSpinner from '../LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Analytics() {
    const { stats, error, isLoading } = useStats(30000); // Update every 30 seconds

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Usage Over Time */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Usage Trends</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.dailyUsage || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Additional analytics components */}
        </div>
    );
}
