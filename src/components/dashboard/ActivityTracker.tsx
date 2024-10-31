import React from 'react';
import { format } from 'date-fns';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Activity {
    timestamp: string;
    action: string;
    details: string;
}

interface ActivityTrackerProps {
    activities: Activity[];
}

export default function ActivityTracker({ activities }: ActivityTrackerProps) {
    // Group activities by date for the chart
    const activityData = activities.reduce((acc: any[], activity) => {
        const date = format(new Date(activity.timestamp), 'MMM dd');
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ date, count: 1 });
        }
        return acc;
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                </div>
                <div className="divide-y">
                    {activities.map((activity, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.details}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
