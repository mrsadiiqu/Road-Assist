import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  service_types: string[];
  rating: number;
  status: 'active' | 'inactive' | 'busy';
  vehicles: {
    type: string;
    capacity: string;
  }[];
}

export default function ServiceProviders() {
  const { isLoading, error } = useAppStore();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Update the useEffect to fetch real data
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('*');
        
        if (error) throw error;
        setProviders(data || []);
      } catch (error) {
        console.error('Error fetching service providers:', error);
      }
    };
    
    fetchProviders();
  }, []);
  
  // Update the handleAddProvider function
  const handleAddProvider = async (provider: Omit<ServiceProvider, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .insert({
          name: provider.name,
          email: provider.email,
          phone: provider.phone,
          address: provider.location.address,
          latitude: provider.location.latitude,
          longitude: provider.location.longitude,
          service_types: provider.service_types,
          status: provider.status,
          rating: 0 // Default rating for new providers
        })
        .select()
        .single();
      
      if (error) throw error;
      setProviders([data, ...providers]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding service provider:', error);
    }
  };
  
  // Update the handleUpdateStatus function
  const handleUpdateStatus = async (id: string, status: ServiceProvider['status']) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setProviders(providers.map(provider => 
        provider.id === id ? { ...provider, status } : provider
      ));
    } catch (error) {
      console.error('Error updating provider status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Provider
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    provider.status === 'active' ? 'bg-green-100 text-green-800' :
                    provider.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {provider.status}
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
                  {provider.location.address}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-2 text-yellow-400" />
                  {provider.rating} Rating
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Service Types</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.service_types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Vehicles</h4>
                <div className="space-y-2">
                  {provider.vehicles.map((vehicle, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-2 text-gray-400" />
                      {vehicle.type} ({vehicle.capacity})
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => handleUpdateStatus(provider.id, 'active')}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Activate
                </button>
                <button
                  onClick={() => handleUpdateStatus(provider.id, 'inactive')}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Service Provider</h2>
            {/* Add provider form will go here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Add Provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}