import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PaymentForm from '../payment/PaymentForm';

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
  user_id: string;
  user_full_name: string;
  user_email: string;
  provider_id?: string;
  provider_name?: string;
  provider_status?: string;
  amount: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service_types: string[];
  rating: number;
  status: string;
}

export default function ServiceRequests() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [availableProviders, setAvailableProviders] = useState<ServiceProvider[]>([]);
  const [assigningProvider, setAssigningProvider] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [sortField, sortDirection, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          service_providers:provider_id (
            name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to fetch service requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAssignProvider = async (request: ServiceRequest) => {
    setSelectedRequest(request);
    setAssigningProvider(true);
    try {
      const { data, error } = await supabase
        .rpc('get_available_providers', { service_type: request.service_type });
      
      if (error) throw error;
      setAvailableProviders(data || []);
    } catch (error) {
      console.error('Error fetching available providers:', error);
      setError('Failed to fetch available providers');
    } finally {
      setAssigningProvider(false);
    }
  };

  const assignProvider = async (providerId: string) => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          provider_id: providerId,
          status: 'assigned'
        })
        .eq('id', selectedRequest.id);
      
      if (error) throw error;
      
      // Refresh the requests list
      await fetchRequests();
      setSelectedRequest(null);
      setAvailableProviders([]);
    } catch (error) {
      console.error('Error assigning provider:', error);
      setError('Failed to assign provider');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePaymentSuccess = async () => {
    try {
      if (!selectedRequest) {
        setError('Invalid request');
        return;
      }

      await fetchRequests();
      setShowPayment(false);
    } catch (error) {
      console.error('Error handling payment:', error);
      setError('Failed to handle payment');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Service Requests</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('user_full_name')}
                >
                  User
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('service_type')}
                >
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{request.user_full_name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{request.user_email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.service_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.vehicle_make} {request.vehicle_model} ({request.vehicle_year})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.location_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.provider_id ? (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {request.provider_name}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.provider_status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.provider_status}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAssignProvider(request)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Assign Provider
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Provider Assignment Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assign Provider</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select a provider for the service request:
            </p>
            
            {assigningProvider ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : availableProviders.length === 0 ? (
              <p className="text-sm text-gray-600">No available providers found for this service type.</p>
            ) : (
              <div className="space-y-4">
                {availableProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => assignProvider(provider.id)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-600">{provider.email}</p>
                      <p className="text-sm text-gray-600">{provider.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Rating: {provider.rating}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {provider.service_types.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayment && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PaymentForm
              amount={selectedRequest.amount}
              requestId={selectedRequest.id}
              onSuccess={handlePaymentSuccess}
              onClose={() => {
                setShowPayment(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}