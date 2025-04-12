import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServiceRequests();
  }, [filter]);

  async function fetchServiceRequests() {
    try {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          user_profiles (
            full_name,
            phone
          ),
          service_providers (
            business_name,
            phone
          ),
          payments (
            amount,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border-gray-300"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="divide-y">
            {requests.map(request => (
              <div key={request.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{request.service_type}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{request.user_profiles?.full_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{request.user_profiles?.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{request.location?.description}</span>
                    </div>
                  </div>

                  {request.service_providers && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Provider</h4>
                      <p>{request.service_providers.business_name}</p>
                      <p className="text-sm text-gray-600">
                        {request.service_providers.phone}
                      </p>
                    </div>
                  )}
                </div>

                {request.payments?.[0] && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${
                        request.payments[0].status === 'completed' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        ₦{request.payments[0].amount} • {request.payments[0].status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}