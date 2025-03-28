import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall, Car, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import { useAppStore } from '../lib/store';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const { user } = useAuth();
  const { createServiceRequest, isLoading, error } = useAppStore();
  const [location, setLocation] = useState({ address: '', latitude: 0, longitude: 0 });
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    color: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createServiceRequest({
        user_id: user.id,
        service_type: 'emergency',
        status: 'pending',
        location_address: location.address,
        location_latitude: location.latitude,
        location_longitude: location.longitude,
        vehicle_make: vehicle.make,
        vehicle_model: vehicle.model,
        vehicle_year: vehicle.year,
        vehicle_color: vehicle.color
      });
      onClose();
    } catch (err) {
      console.error('Error creating emergency service request:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-8 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg w-full bg-white rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <PhoneCall className="h-6 w-6 text-red-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Emergency Service Request</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your current location"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Car className="h-4 w-4 mr-1 text-gray-500" />
                    Vehicle Details
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Make"
                      value={vehicle.make}
                      onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={vehicle.model}
                      onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={vehicle.year}
                      onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={vehicle.color}
                      onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Request Emergency Service'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 