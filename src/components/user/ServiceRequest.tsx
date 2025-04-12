import React, { useState } from 'react';
import { MapPin, Car, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ServiceRequest() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState({
    serviceType: '',
    location: {
      latitude: 0,
      longitude: 0,
      description: ''
    },
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      color: ''
    },
    estimatedCost: 0
  });

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setRequest(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
      });
    }
  };

  const calculateCost = async () => {
    try {
      const { data: settings } = await supabase
        .from('app_settings')
        .select('*')
        .single();

      const cost = settings.basePrice + (settings.perKmPrice * 5); // Assuming 5km distance
      setRequest(prev => ({ ...prev, estimatedCost: cost }));
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          user_id: supabase.auth.user().id,
          service_type: request.serviceType,
          location: request.location,
          vehicle_details: request.vehicleDetails,
          estimated_cost: request.estimatedCost,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create payment record
      await supabase
        .from('payments')
        .insert({
          request_id: data.id,
          amount: request.estimatedCost,
          status: 'pending'
        });

      setStep(4); // Success step
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Request Service</h1>
        <p className="text-gray-600 mt-2">Get help on the road in minutes</p>
      </div>

      {/* Service Type Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">What service do you need?</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Towing', 'Tire Change', 'Jump Start', 'Fuel Delivery'].map(service => (
              <button
                key={service}
                onClick={() => {
                  setRequest(prev => ({ ...prev, serviceType: service }));
                  setStep(2);
                }}
                className="p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50"
              >
                <Car className="h-8 w-8 mb-2 text-primary-600" />
                <span>{service}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Where are you?</h2>
          <button
            onClick={handleLocationSelect}
            className="w-full p-4 border rounded-lg flex items-center justify-center space-x-2"
          >
            <MapPin className="h-5 w-5" />
            <span>Use my current location</span>
          </button>
          <textarea
            placeholder="Additional location details..."
            value={request.location.description}
            onChange={(e) => setRequest(prev => ({
              ...prev,
              location: { ...prev.location, description: e.target.value }
            }))}
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
          <button
            onClick={() => {
              calculateCost();
              setStep(3);
            }}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Continue
          </button>
        </div>
      )}

      {/* Payment */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirm and Pay</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-medium">Estimated Cost: ₦{request.estimatedCost}</p>
            <p className="text-sm text-gray-600">Final cost may vary based on actual service</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              'Confirm Request'
            )}
          </button>
        </div>
      )}

      {/* Success */}
      {step === 4 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Request Submitted!</h2>
          <p className="text-gray-600">We're looking for a service provider near you.</p>
        </div>
      )}
    </div>
  );
}