import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wrench, CreditCard, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { roleManager } from '../../lib/utils/roleManager';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProviders: 0,
    pendingVerifications: 0,
    totalRequests: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Replace the checkAdminAndFetchStats function
    const checkAdminAndFetchStats = async () => {
      try {
        const role = await roleManager.getCurrentRole();
        if (role !== 'admin') {
          navigate('/admin/login');
          return;
        }

        fetchDashboardStats();
      } catch (err: any) {
        console.error('Admin verification error:', err);
        setError(err.message);
        navigate('/admin/login');
      }
    };

    checkAdminAndFetchStats();
  }, [navigate]);

  async function fetchDashboardStats() {
    try {
      // Fetch total users
      const { count: usersCount, error: usersError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Fetch active providers
      const { count: providersCount, error: providersError } = await supabase
        .from('service_providers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (providersError) throw providersError;

      // Fetch pending verifications
      const { count: pendingCount, error: pendingError } = await supabase
        .from('service_providers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_verification');

      if (pendingError) throw pendingError;

      // Fetch total requests
      const { count: requestsCount, error: requestsError } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true });

      if (requestsError) throw requestsError;

      setStats({
        totalUsers: usersCount || 0,
        activeProviders: providersCount || 0,
        pendingVerifications: pendingCount || 0,
        totalRequests: requestsCount || 0
      });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.message);
    }
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Providers</p>
              <p className="text-2xl font-bold">{stats.activeProviders}</p>
            </div>
            <Wrench className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold">{stats.pendingVerifications}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold">{stats.totalRequests}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-4">Recent Verifications</h2>
          {/* Add verification list here */}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-4">Recent Service Requests</h2>
          {/* Add service requests list here */}
        </div>
      </div>
    </div>
  );
}