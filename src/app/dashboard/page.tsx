'use client';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, trend }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-gray-600' : trend === 'down' ? 'text-gray-600' : 'text-gray-600';
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-black">{value}</p>
        {change && (
          <p className={`ml-2 text-sm font-medium ${trendColor}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

import DashboardLayout from '@/components/DashboardLayout';
import { useDashboardStats } from '@/hooks/useLeads';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: stats, isLoading: loading, error } = useDashboardStats();

  const dashboardCards = [
    { title: 'Total Leads', value: stats?.totalLeads?.toString() || '0', change: '', trend: 'neutral' as const },
    { title: 'New Leads', value: stats?.newLeads?.toString() || '0', change: '', trend: 'neutral' as const },
    { title: 'Total Calls', value: stats?.totalCalls?.toString() || '0', change: '', trend: 'neutral' as const },
    { title: "Today's Calls", value: stats?.todaysCalls?.toString() || '0', change: '', trend: 'neutral' as const },
  ];

  const recentActivity = [
    { id: 1, action: 'Call completed', lead: 'John Doe', outcome: 'Booked', time: '5 minutes ago' },
    { id: 2, action: 'New lead added', lead: 'Jane Smith', outcome: 'Pending', time: '12 minutes ago' },
    { id: 3, action: 'Call failed', lead: 'Mike Johnson', outcome: 'No answer', time: '18 minutes ago' },
    { id: 4, action: 'Call completed', lead: 'Sarah Wilson', outcome: 'Callback', time: '25 minutes ago' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <div>
                <h3 className="text-sm font-medium">Error loading dashboard</h3>
                <div className="mt-2 text-sm">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your leads.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-black mb-4">Quick Actions</h2>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-black mb-4">Call Outcomes</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-black">45%</div>
                  <div className="text-sm text-gray-600">Booked</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-black">25%</div>
                  <div className="text-sm text-gray-600">Callback</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-black">20%</div>
                  <div className="text-sm text-gray-600">No Answer</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-black">10%</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
              <p className="text-sm text-gray-500">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.lead}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    {activity.outcome}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}