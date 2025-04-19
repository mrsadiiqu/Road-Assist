import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Star, 
  XCircle, 
  Loader2,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service_types: string[];
  rating: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  user_id: string;
  business_name: string;
  vehicle_type: string;
  vehicle_plate: string;
  service_area: string | null;
  documents: {
    license: string;
    insurance: string;
    vehicle_registration: string;
  };
  full_name: string;
}

export default function ServiceProviders() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'unverify' | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError('Failed to fetch service providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (provider: ServiceProvider, action: 'verify' | 'unverify') => {
    setSelectedProvider(provider);
    setActionType(action);
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedProvider || !actionType) return;

    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ 
          status: actionType === 'verify' ? 'active' : 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProvider.id);
      
      if (error) throw error;
      
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === selectedProvider.id 
            ? { 
                ...provider, 
                status: actionType === 'verify' ? 'active' : 'inactive',
                updated_at: new Date().toISOString()
              }
            : provider
        )
      );

      setSuccessMessage(`Provider ${actionType === 'verify' ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error updating provider status:', error);
      setError('Failed to update provider status');
    } finally {
      setShowConfirmation(false);
      setSelectedProvider(null);
      setActionType(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!loading && (!providers || providers.length === 0) ? (
        <div className="text-center py-8 text-gray-500">
          No service providers found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers && providers.map((provider) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{provider.full_name}</h3>
                    <p className="text-sm text-gray-500">{provider.business_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      provider.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {provider.status === 'active' ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {provider.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {provider.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {provider.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Car className="h-4 w-4 mr-2 text-gray-400" />
                    {provider.vehicle_type} ({provider.vehicle_plate})
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    {provider.rating} Rating
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Service Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.service_types?.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  {provider.status === 'inactive' ? (
                    <button
                      onClick={() => handleVerifyClick(provider, 'verify')}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Provider
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyClick(provider, 'unverify')}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Unverify Provider
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'verify' ? 'Verify Provider' : 'Unverify Provider'}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} {selectedProvider.full_name}?
              {actionType === 'verify' 
                ? ' This will allow them to receive service requests.'
                : ' This will prevent them from receiving new service requests.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedProvider(null);
                  setActionType(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                  actionType === 'verify'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'verify' ? 'Verify' : 'Unverify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}