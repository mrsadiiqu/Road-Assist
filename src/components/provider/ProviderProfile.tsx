import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, Car, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  service_types: string[];
  bio: string;
}

export default function ProviderProfile() {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProviderProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !editedProfile) return;

      const { error } = await supabase
        .from('providers')
        .update({
          name: editedProfile.name,
          phone: editedProfile.phone,
          location: editedProfile.location,
          service_types: editedProfile.service_types,
          bio: editedProfile.bio
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-primary-600 hover:text-primary-900"
          >
            <Edit2 className="h-5 w-5 mr-1" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center text-green-600 hover:text-green-900"
            >
              <Save className="h-5 w-5 mr-1" />
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedProfile(profile);
              }}
              className="flex items-center text-red-600 hover:text-red-900"
            >
              <X className="h-5 w-5 mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-blue-100">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.name || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile?.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-purple-100">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{profile?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-green-100">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile?.phone || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile?.phone}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-yellow-100">
                <MapPin className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.location || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile?.location}</p>
                )}
              </div>
            </div>

            {/* Service Types */}
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-red-100">
                <Car className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500">Service Types</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.service_types.join(', ') || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, service_types: e.target.value.split(',').map(s => s.trim()) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter services separated by commas"
                  />
                ) : (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {profile?.service_types.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-indigo-100">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4 flex-1">
                <label className="block text-sm font-medium text-gray-500">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, bio: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile?.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 