import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, MapPin, Wrench, ArrowRight, Loader2, Plus } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useAuth } from '../auth/AuthContext';

const serviceTypes = [
  { id: 'towing', name: 'Towing Service', icon: Car },
  { id: 'battery', name: 'Battery Jump Start', icon: Wrench },
  { id: 'tire', name: 'Tire Change', icon: Wrench },
  { id: 'fuel', name: 'Fuel Delivery', icon: Wrench },
  { id: 'lockout', name: 'Lockout Service', icon: Wrench }
];

export default function ServiceRequest() {
  const { user } = useAuth();
  const { createServiceRequest, userVehicles, fetchUserVehicles, isLoading, error } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [location, setLocation] = useState({ address: '', latitude: 0, longitude: 0 });
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '', color: '' });

  useEffect(() => {
    fetchUserVehicles();
  }, [fetchUserVehicles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const vehicle = selectedVehicle === 'new' ? newVehicle : 
      userVehicles.find(v => v.id === selectedVehicle);

    if (!vehicle) return;

    try {
      await createServiceRequest({
        user_id: user.id,
        service_type: selectedService,
        status: 'pending',
        location_address: location.address,
        location_latitude: location.latitude,
        location_longitude: location.longitude,
        vehicle_make: vehicle.make,
        vehicle_model: vehicle.model,
        vehicle_year: vehicle.year,
        vehicle_color: vehicle.color
      });

      // Reset form and show success message
      setStep(1);
      setSelectedService('');
      setLocation({ address: '', latitude: 0, longitude: 0 });
      setSelectedVehicle('');
      setNewVehicle({ make: '', model: '', year: '', color: '' });
    } catch (err) {
      console.error('Error creating service request:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Request Service</h1>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2" />
          {[1, 2, 3].map((number) => (
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="text"
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit}
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !location.address) ||
              (step === 3 && !selectedVehicle)
            }
            className="ml-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Submit Request' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}