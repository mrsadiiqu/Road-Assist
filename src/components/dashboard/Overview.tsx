import React from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { format } from 'date-fns';

const stats = [
  { name: 'Total Requests', value: '24', icon: Car, color: 'bg-blue-500' },
  { name: 'Active Requests', value: '2', icon: Clock, color: 'bg-yellow-500' },
  { name: 'Completed', value: '21', icon: CheckCircle, color: 'bg-green-500' },
  { name: 'Cancelled', value: '1', icon: AlertCircle, color: 'bg-red-500' }
];

export default function Overview() {
  const { activeRequest, serviceHistory } = useAppStore();

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
              <p className="text-base font-medium text-gray-900">{activeRequest.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-base font-medium text-gray-900 capitalize">{activeRequest.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="text-base font-medium text-gray-900">
                {format(new Date(activeRequest.createdAt), 'MMM dd, yyyy HH:mm')}
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
              {serviceHistory.slice(0, 5).map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.serviceType}
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
                    {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.location.address}
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