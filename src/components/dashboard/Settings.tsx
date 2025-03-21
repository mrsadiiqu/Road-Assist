import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, User, Phone, Heart, Plus, Trash2, Save } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { useAuth } from '../auth/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const { 
    userProfile,
    userVehicles,
    fetchUserProfile,
    fetchUserVehicles,
    updateUserProfile,
    addUserVehicle,
    deleteUserVehicle,
    isLoading,
    error 
  } = useAppStore();

  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: ''
  });

  const [showAddVehicle, setShowAddVehicle] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserVehicles();
  }, [fetchUserProfile, fetchUserVehicles]);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        emergency_contact_name: userProfile.emergency_contact_name || '',
        emergency_contact_phone: userProfile.emergency_contact_phone || ''
      });
    }
  }, [userProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile({
        id: user.id,
        ...profile
      });
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addUserVehicle({
        user_id: user.id,
        ...newVehicle
      });
      setNewVehicle({ make: '', model: '', year: '', color: '', license_plate: '' });
      setShowAddVehicle(false);
    } catch (err) {
      console.error('Error adding vehicle:', err);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteUserVehicle(id);
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <User className="h-5 w-5 mr-2 text-primary-600" />
          Profile Information
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  value={profile.emergency_contact_name}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="tel"
                  value={profile.emergency_contact_phone}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </motion.section>

      {/* Vehicles Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Car className="h-5 w-5 mr-2 text-primary-600" />
            My Vehicles
          </h2>
          <button
            onClick={() => setShowAddVehicle(!showAddVehicle)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>

        {showAddVehicle && (
          <form onSubmit={handleAddVehicle} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Make"
                value={newVehicle.make}
                onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Model"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Year"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Color"
                value={newVehicle.color}
                onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="License Plate (Optional)"
                value={newVehicle.license_plate}
                onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {userVehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors duration-200"
            >
              <div className="flex items-center">
                <Car className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    {vehicle.year} • {vehicle.color}
                    {vehicle.license_plate && ` • ${vehicle.license_plate}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}