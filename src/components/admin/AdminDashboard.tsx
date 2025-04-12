import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Car, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProviders: 0,
    activeRequests: 0,
    completedRequests: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch providers count
        const { count: providersCount } = await supabase
          .from('service_providers')
          .select('*', { count: 'exact' });

        // Fetch active requests
        const { count: activeCount } = await supabase
          .from('service_requests')
          .select('*', { count: 'exact' })
          .in('status', ['pending', 'accepted', 'in_progress']);

        // Fetch completed requests
        const { count: completedCount } = await supabase
          .from('service_requests')
          .select('*', { count: 'exact' })
          .eq('status', 'completed');

        // Fetch total revenue
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'success');

        const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

        setStats({
          totalProviders: providersCount || 0,
          activeRequests: activeCount || 0,
          completedRequests: completedCount || 0,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Providers"
          value={stats.totalProviders}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Active Requests"
          value={stats.activeRequests}
          icon={Car}
          color="text-green-600"
        />
        <StatCard
          title="Completed Requests"
          value={stats.completedRequests}
          icon={CheckCircle}
          color="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          color="text-yellow-600"
        />
      </div>

      {/* Add charts and other dashboard components here */}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );
}