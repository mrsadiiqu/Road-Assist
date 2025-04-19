import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ArrowRight, Loader2, Plus } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../payment/PaymentForm';

const serviceTypes = [
  { id: 'towing', name: 'Towing Service', icon: Car, basePrice: 15000 },
  { id: 'battery', name: 'Battery Jump Start', icon: Wrench, basePrice: 5000 },
  { id: 'tire', name: 'Tire Change', icon: Wrench, basePrice: 3000 },
  { id: 'fuel', name: 'Fuel Delivery', icon: Wrench, basePrice: 2000 },
  { id: 'lockout', name: 'Lockout Service', icon: Wrench, basePrice: 4000 }
];

interface Location {
  address: string;
}

interface Vehicle {
  make: string;
  model: string;
  year: string;
  color: string;
}

interface ServiceRequestInput {
  user_id: string;
  service_type: string;
  status: string;
  location_address: string;
  location_latitude: number;
  location_longitude: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
  amount: number;
}

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createServiceRequest, userVehicles, fetchUserVehicles, error: storeError } = useAppStore();
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setErrorState] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [location, setLocation] = useState<Location>({ address: '' });
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [newVehicle, setNewVehicle] = useState<Vehicle>({ make: '', model: '', year: '', color: '' });

  useEffect(() => {
    if (user) {
      fetchUserVehicles();
    }
  }, [user, fetchUserVehicles]);

  useEffect(() => {
    if (storeError) {
      setErrorState(storeError);
    }
  }, [storeError]);

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!selectedService;
      case 2:
        return !!location.address;
      case 3:
        if (selectedVehicle === 'new') {
          return !!newVehicle.make && !!newVehicle.model && !!newVehicle.year && !!newVehicle.color;
        }
        return !!selectedVehicle;
      case 4:
        return !!selectedService && !!location.address && !!selectedVehicle;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      setErrorState(`Please complete all required fields in step ${step}`);
      return;
    }
    setErrorState('');
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorState('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const calculateAmount = () => {
    const service = serviceTypes.find(s => s.id === selectedService);
    return service ? service.basePrice : 0;
  };

  const handlePaymentSuccess = async () => {
    try {
      const requestData: ServiceRequestInput = {
        user_id: user?.id || '',
        service_type: selectedService,
        status: 'pending',
        location_address: location.address,
        location_latitude: 0,
        location_longitude: 0,
        vehicle_make: selectedVehicle === 'new' ? newVehicle.make : userVehicles.find(v => v.id === selectedVehicle)?.make || '',
        vehicle_model: selectedVehicle === 'new' ? newVehicle.model : userVehicles.find(v => v.id === selectedVehicle)?.model || '',
        vehicle_year: selectedVehicle === 'new' ? newVehicle.year : userVehicles.find(v => v.id === selectedVehicle)?.year || '',
        vehicle_color: selectedVehicle === 'new' ? newVehicle.color : userVehicles.find(v => v.id === selectedVehicle)?.color || '',
        amount: calculateAmount()
      };

      const createdRequest = await createServiceRequest(requestData);
      
      if (createdRequest) {
        setSuccessMessage('Service request created successfully!');
        setTimeout(() => {
          navigate('/dashboard/tracking');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating service request:', err);
      setErrorState('Failed to create service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorState('Please sign in to create a service request');
      return;
    }

    if (!validateStep(step)) {
      setErrorState('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setErrorState('');
    setSuccessMessage('');

    try {
      const requestData: ServiceRequestInput = {
        user_id: user.id,
        service_type: selectedService,
        status: 'pending_payment',
        location_address: location.address,
        location_latitude: 0,
        location_longitude: 0,
        vehicle_make: selectedVehicle === 'new' ? newVehicle.make : userVehicles.find(v => v.id === selectedVehicle)?.make || '',
        vehicle_model: selectedVehicle === 'new' ? newVehicle.model : userVehicles.find(v => v.id === selectedVehicle)?.model || '',
        vehicle_year: selectedVehicle === 'new' ? newVehicle.year : userVehicles.find(v => v.id === selectedVehicle)?.year || '',
        vehicle_color: selectedVehicle === 'new' ? newVehicle.color : userVehicles.find(v => v.id === selectedVehicle)?.color || '',
        amount: calculateAmount()
      };

      const tempRequest = await createServiceRequest(requestData);

      if (tempRequest) {
        setRequestId(tempRequest.id);
        setShowPayment(true);
      }
    } catch (err) {
      console.error('Error creating temporary request:', err);
      setErrorState('Failed to create service request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Request Service</h1>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-8 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2" />
          {[1, 2, 3, 4].map((number) => (
            <motion.div
              key={number}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
                step >= number ? 'bg-primary-600' : 'bg-gray-200'
              } text-white font-medium`}
              animate={{
                scale: step === number ? 1.1 : 1,
                backgroundColor: step >= number ? '#0284c7' : '#e5e7eb'
              }}
            >
              {number}
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Service Type</span>
          <span className="text-sm text-gray-600">Location</span>
          <span className="text-sm text-gray-600">Vehicle Details</span>
          <span className="text-sm text-gray-600">Payment</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceTypes.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedService === service.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <Icon className={`h-8 w-8 ${
                    selectedService === service.id ? 'text-primary-600' : 'text-gray-500'
                  }`} />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{service.name}</h3>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="Enter your location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
              />
            </div>
            <div className="h-64 bg-gray-100 rounded-lg">
              {/* Map Component will go here */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Map Preview
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {userVehicles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
                <div className="grid grid-cols-1 gap-4">
                  {userVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`p-4 rounded-lg border-2 text-left ${
                        selectedVehicle === vehicle.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <Car className="h-6 w-6 text-gray-500" />
                        <div className="ml-3">
                          <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.color}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <button
                onClick={() => setSelectedVehicle('new')}
                className={`w-full p-4 rounded-lg border-2 text-left ${
                  selectedVehicle === 'new'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <Plus className="h-6 w-6 text-gray-500" />
                  <span className="ml-3 font-medium">Add New Vehicle</span>
                </div>
              </button>

              {selectedVehicle === 'new' && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make</label>
                    <input
                      type="text"
                      value={newVehicle.make}
                      onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="text"
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type</span>
                  <span className="font-medium">
                    {serviceTypes.find(s => s.id === selectedService)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">₦{calculateAmount().toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">₦{calculateAmount().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={step === 4 ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className={`ml-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {step === 4 ? 'Proceed to Payment' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      {showPayment && requestId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PaymentForm
              amount={calculateAmount()}
              requestId={requestId}
              onSuccess={handlePaymentSuccess}
              onClose={() => {
                setShowPayment(false);
                setIsSubmitting(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}