import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Car, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../lib/supabase';
import PaymentForm from '../payment/PaymentForm';

interface ServiceRequest {
  id: string;
  service_type: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'paid';
  location_address: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  created_at: string;
  amount?: number;
  provider_id?: string;
  provider?: {
    full_name: string;
    phone: string;
    business_name: string;
    status: string;
  };
}

export default function ServiceTracking() {
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActiveRequest = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('service_requests')
          .select(`
            *,
            service_providers:provider_id (
              full_name,
              phone,
              business_name,
              status
            )
          `)
          .eq('user_id', user.id)
          .not('status', 'in', ['completed', 'cancelled'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setActiveRequest({
            ...data,
            provider: data.service_providers ? {
              full_name: data.service_providers.full_name,
              phone: data.service_providers.phone,
              business_name: data.service_providers.business_name,
              status: data.service_providers.status
            } : undefined
          });
        }
      } catch (err) {
        console.error('Error fetching active request:', err);
        setError('Failed to fetch service request details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActiveRequest();
  }, [user]);

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    if (activeRequest) {
      setActiveRequest({ ...activeRequest, status: 'paid' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!activeRequest) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Active Service Request</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any active service requests at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Service Request #{activeRequest.id}</h2>
              <p className="text-sm text-gray-500">
                Created {new Date(activeRequest.created_at).toLocaleString()}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeRequest.status)}`}>
              {activeRequest.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                Location Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{activeRequest.location_address}</p>
                {/* Map component will go here */}
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-500">Map Preview</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <Car className="h-4 w-4 mr-2 text-gray-400" />
                Vehicle Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {activeRequest.vehicle_year} {activeRequest.vehicle_make} {activeRequest.vehicle_model}
                </p>
                <p className="text-sm text-gray-600">Color: {activeRequest.vehicle_color}</p>
              </div>
            </div>
          </div>

          {activeRequest.provider && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Service Provider
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activeRequest.provider.full_name}</p>
                    <p className="text-sm text-gray-500">{activeRequest.provider.business_name}</p>
                  </div>
                  <a
                    href={`tel:${activeRequest.provider.phone}`}
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    activeRequest.provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activeRequest.provider.status === 'active' ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeRequest.amount && activeRequest.status !== 'paid' && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                Payment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount Due</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₦{activeRequest.amount.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            <button
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Completed
            </button>
            <button
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Cancel Request
            </button>
          </div>
        </div>
      </motion.div>

      {showPayment && activeRequest.amount && (
        <div className="mt-6">
          <PaymentForm
            requestId={activeRequest.id}
            amount={activeRequest.amount}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
}