import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Wrench, ArrowRight, Loader2, Plus, Navigation } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from '../payment/PaymentForm';
import { getPricingBreakdown } from '../../lib/utils/pricing';
import { geocodeAddress, getDistanceFromAbuja, Location } from '../../lib/utils/location';


const serviceTypes = [
  { id: 'towing', name: 'Towing Service', icon: Car, basePrice: 15000 },
  { id: 'battery', name: 'Battery Jump Start', icon: Wrench, basePrice: 5000 },
  { id: 'tire', name: 'Tire Change', icon: Wrench, basePrice: 3000 },
  { id: 'fuel', name: 'Fuel Delivery', icon: Wrench, basePrice: 2000 },
  { id: 'lockout', name: 'Lockout Service', icon: Wrench, basePrice: 4000 }
];

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
  const [location, setLocation] = useState<Location>({ address: '', lat: 0, lng: 0 });
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [newVehicle, setNewVehicle] = useState<Vehicle>({ make: '', model: '', year: '', color: '' });
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distance, setDistance] = useState<number>(0);
  const [pricingBreakdown, setPricingBreakdown] = useState<{
    baseFee: number;
    distanceFee: number;
    serviceFee: number;
    total: number;
  } | null>(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

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

  useEffect(() => {
    if (selectedService && distance > 0) {
      const breakdown = getPricingBreakdown(selectedService, distance);
      setPricingBreakdown(breakdown);
    }
  }, [selectedService, distance]);

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

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get address');
          }

          const data = await response.json();
          
          const newLocation: Location = {
            address: data.display_name,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          setLocation(newLocation);
          
          const calculatedDistance = await getDistanceFromAbuja(newLocation);
          setDistance(calculatedDistance);

          if (selectedService) {
            const breakdown = getPricingBreakdown(selectedService, calculatedDistance);
            setPricingBreakdown(breakdown);
          }
        } catch {
          setLocationError('Failed to get your address. Please enter it manually.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setLocationError(
          error.code === 1
            ? 'Please allow location access to automatically detect your location.'
            : 'Failed to get your location. Please try again or enter manually.'
        );
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleLocationSubmit = async () => {
    if (!location.address) {
      setErrorState('Please enter a location');
      return;
    }

    setIsCalculatingDistance(true);
    setErrorState('');

    try {
      const geocodedLocation = await geocodeAddress(location.address);
      setLocation(geocodedLocation);

      const calculatedDistance = await getDistanceFromAbuja(geocodedLocation);
      setDistance(calculatedDistance);

      const breakdown = getPricingBreakdown(selectedService, calculatedDistance);
      setPricingBreakdown(breakdown);

      handleNext();
    } catch {
      setErrorState('Failed to calculate distance. Please try again.');
    } finally {
      setIsCalculatingDistance(false);
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
        location_latitude: location.lat,
        location_longitude: location.lng,
        vehicle_make: selectedVehicle === 'new' ? newVehicle.make : userVehicles.find(v => v.id === selectedVehicle)?.make || '',
        vehicle_model: selectedVehicle === 'new' ? newVehicle.model : userVehicles.find(v => v.id === selectedVehicle)?.model || '',
        vehicle_year: selectedVehicle === 'new' ? newVehicle.year : userVehicles.find(v => v.id === selectedVehicle)?.year || '',
        vehicle_color: selectedVehicle === 'new' ? newVehicle.color : userVehicles.find(v => v.id === selectedVehicle)?.color || '',
        amount: pricingBreakdown?.total || 0
      };

      const tempRequest = await createServiceRequest(requestData);

      if (tempRequest) {
        setRequestId(tempRequest.id);
        setShowPayment(true);
      }
    } catch {
      setErrorState('Failed to create service request');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!requestId) return;

      const requestData: ServiceRequestInput = {
        user_id: user?.id || '',
        service_type: selectedService,
        status: 'pending',
        location_address: location.address,
        location_latitude: location.lat,
        location_longitude: location.lng,
        vehicle_make: selectedVehicle === 'new' ? newVehicle.make : userVehicles.find(v => v.id === selectedVehicle)?.make || '',
        vehicle_model: selectedVehicle === 'new' ? newVehicle.model : userVehicles.find(v => v.id === selectedVehicle)?.model || '',
        vehicle_year: selectedVehicle === 'new' ? newVehicle.year : userVehicles.find(v => v.id === selectedVehicle)?.year || '',
        vehicle_color: selectedVehicle === 'new' ? newVehicle.color : userVehicles.find(v => v.id === selectedVehicle)?.color || '',
        amount: pricingBreakdown?.total || 0
      };

      await createServiceRequest(requestData);
      setSuccessMessage('Service request created successfully!');
      setTimeout(() => {
        navigate('/dashboard/tracking');
      }, 2000);
    } catch {
      setErrorState('Failed to create service request');
    } finally {
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
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={location.address}
                      onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      className="block w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your location"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        <Navigation className="h-5 w-5 mr-2" />
                        Current Location
                      </>
                    )}
                  </button>
                </div>
              </div>
              {locationError && (
                <p className="mt-2 text-sm text-red-600">{locationError}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleLocationSubmit}
                disabled={!location.address || isCalculatingDistance}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isCalculatingDistance ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Calculate Distance'
                )}
              </button>
            </div>

            {distance > 0 && pricingBreakdown && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Distance from Abuja: {distance.toFixed(1)} km
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">Base Fee: ₦{pricingBreakdown.baseFee?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-gray-600">Service Fee: ₦{pricingBreakdown.serviceFee?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-gray-600">Distance Fee: ₦{pricingBreakdown.distanceFee?.toLocaleString() || '0'}</p>
                  <p className="text-sm font-medium text-gray-900">Total: ₦{pricingBreakdown.total?.toLocaleString() || '0'}</p>
                </div>
              </div>
            )}
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
                  <span className="text-gray-600">Distance from Abuja</span>
                  <span className="font-medium">{distance.toFixed(1)} km</span>
                </div>
                {pricingBreakdown && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Fee</span>
                          <span className="font-medium">₦{pricingBreakdown.baseFee?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance Fee</span>
                          <span className="font-medium">₦{pricingBreakdown.distanceFee?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Fee</span>
                          <span className="font-medium">₦{pricingBreakdown.serviceFee?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total Amount</span>
                        <span className="text-lg font-semibold text-primary-600">₦{pricingBreakdown.total?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </>
                )}
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
              amount={pricingBreakdown?.total || 0}
              requestId={requestId}
              onSuccess={handlePaymentSuccess}
              onClose={() => {
                setShowPayment(false);
                setIsSubmitting(false);
              }}
              breakdown={pricingBreakdown || undefined}
              serviceType={serviceTypes.find(s => s.id === selectedService)?.name}
              distance={distance}
            />
          </div>
        </div>
      )}
    </div>
  );
}