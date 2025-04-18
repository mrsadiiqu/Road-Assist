import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface ServiceRequest {
  id: string;
  service_type: string;
  status: string;
  location_address: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  created_at: string;
}

export default function Overview() {
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch all requests for metrics
        const { data: allRequests } = await supabase
          .from('service_requests')
          .select('*')
          .eq('user_id', user.id);

        if (allRequests) {
          const total = allRequests.length;
          const active = allRequests.filter(r => !['completed', 'cancelled'].includes(r.status)).length;
          const completed = allRequests.filter(r => r.status === 'completed').length;
          const cancelled = allRequests.filter(r => r.status === 'cancelled').length;

          setMetrics({
            totalRequests: total,
            activeRequests: active,
            completedRequests: completed,
            cancelledRequests: cancelled
          });
        }

        // Fetch active request
        const { data: activeData } = await supabase
          .from('service_requests')
          .select('*')
          .eq('user_id', user.id)
          .not('status', 'in', ['completed', 'cancelled'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (activeData) {
          setActiveRequest(activeData);
        }

        // Fetch service history
        const { data: historyData } = await supabase
          .from('service_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (historyData) {
          setServiceHistory(historyData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = [
    { 
      name: 'Total Requests', 
      value: metrics.totalRequests.toString(), 
      icon: Car, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Active Requests', 
      value: metrics.activeRequests.toString(), 
      icon: Clock, 
      color: 'bg-yellow-500' 
    },
    { 
      name: 'Completed', 
      value: metrics.completedRequests.toString(), 
      icon: CheckCircle, 
      color: 'bg-green-500' 
    },
    { 
      name: 'Cancelled', 
      value: metrics.cancelledRequests.toString(), 
      icon: AlertCircle, 
      color: 'bg-red-500' 
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300">
          New Request
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Request */}
      {activeRequest && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Request</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="text-base font-medium text-gray-900">{activeRequest.service_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-base font-medium text-gray-900 capitalize">{activeRequest.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="text-base font-medium text-gray-900">
                {format(new Date(activeRequest.created_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent History */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Service History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceHistory.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.service_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(request.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.location_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}