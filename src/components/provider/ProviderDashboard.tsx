import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Clock, User, Phone, Car } from 'lucide-react';

export default function ProviderDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [status, setStatus] = useState('available');

  useEffect(() => {
    fetchActiveRequests();
    subscribeToNewRequests();
  }, []);

  async function fetchActiveRequests() {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        user_profiles (full_name, phone)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
  }

  function subscribeToNewRequests() {
    supabase
      .channel('service_requests')
      .on('INSERT', payload => {
        setRequests(current => [payload.new, ...current]);
      })
      .subscribe();
  }

  async function handleRequestAccept(requestId) {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({
          provider_id: supabase.auth.user().id,
          status: 'accepted'
        })
        .eq('id', requestId);

      if (error) throw error;
      setActiveRequest(requests.find(r => r.id === requestId));
      setStatus('busy');
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  }

  async function handleRequestComplete(requestId) {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
      setActiveRequest(null);
      setStatus('available');
    } catch (error) {
      console.error('Error completing request:', error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status === 'available' ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      {activeRequest ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Active Request</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{activeRequest.user_profiles.full_name}</p>
                <p className="text-sm text-gray-600">{activeRequest.user_profiles.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-gray-400" />
              <p>{activeRequest.location_description}</p>
            </div>
            <div className="flex items-start space-x-4">
              <Car className="h-5 w-5 text-gray-400" />
              <p>{activeRequest.service_type}</p>
            </div>
            <button
              onClick={() => handleRequestComplete(activeRequest.id)}
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Complete Service
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(request => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{request.service_type}</h3>
                  <p className="text-sm text-gray-600">{request.location_description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {new Date(request.created_at).toLocaleTimeString()}
                </span>
              </div>
              <button
                onClick={() => handleRequestAccept(request.id)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Accept Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}