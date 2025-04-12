import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ProviderVerification() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  async function fetchPendingProviders() {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('status', 'pending_verification')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleVerification = async (providerId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({
          status: approved ? 'active' : 'rejected',
          verified_at: new Date().toISOString()
        })
        .eq('id', providerId);

      if (error) throw error;

      // Send notification to provider
      await supabase.from('notifications').insert({
        user_id: providerId,
        type: 'verification_result',
        message: approved 
          ? 'Your application has been approved! You can now start accepting service requests.'
          : 'Your application has been rejected. Please contact support for more information.'
      });

      // Refresh the list
      fetchPendingProviders();
    } catch (error) {
      console.error('Error updating provider status:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Provider Verification</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Providers List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Pending Verifications</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="divide-y">
              {providers.map(provider => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className="p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{provider.business_name}</h3>
                      <p className="text-sm text-gray-600">{provider.full_name}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(provider.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Provider Details */}
        {selectedProvider && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{selectedProvider.business_name}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Contact Information</h3>
                <p className="mt-1">{selectedProvider.email}</p>
                <p>{selectedProvider.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Services</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedProvider.service_types.map(service => (
                    <span
                      key={service}
                      className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Vehicle Information</h3>
                <p className="mt-1">Type: {selectedProvider.vehicle_type}</p>
                <p>Plate: {selectedProvider.vehicle_plate}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700">Documents</h3>
                <div className="mt-2 space-y-2">
                  {Object.entries(selectedProvider.documents).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View {key.replace('_', ' ')}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleVerification(selectedProvider.id, true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleVerification(selectedProvider.id, false)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}