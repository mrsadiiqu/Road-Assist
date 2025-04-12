import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, BarChart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function EarningsDashboard() {
  const [earnings, setEarnings] = useState({
    total: 0,
    weekly: 0,
    monthly: 0,
    completedJobs: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  async function fetchEarningsData() {
    try {
      const providerId = supabase.auth.user().id;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: payments } = await supabase
        .from('payments')
        .select(`
          amount,
          completed_at,
          service_requests (
            service_type,
            user_profiles (
              full_name
            )
          )
        `)
        .eq('provider_id', providerId)
        .eq('status', 'completed')
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (payments) {
        const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const weekly = payments
          .filter(payment => {
            const paymentDate = new Date(payment.completed_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return paymentDate >= weekAgo;
          })
          .reduce((sum, payment) => sum + payment.amount, 0);

        setEarnings({
          total,
          weekly,
          monthly: total,
          completedJobs: payments.length
        });
        setRecentPayments(payments.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold">₦{earnings.total}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Earnings</p>
              <p className="text-2xl font-bold">₦{earnings.weekly}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Earnings</p>
              <p className="text-2xl font-bold">₦{earnings.monthly}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-bold">{earnings.completedJobs}</p>
            </div>
            <BarChart className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Payments</h2>
        </div>
        <div className="divide-y">
          {recentPayments.map((payment, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {payment.service_requests.user_profiles.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {payment.service_requests.service_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦{payment.amount}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(payment.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}