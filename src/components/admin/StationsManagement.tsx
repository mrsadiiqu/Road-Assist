import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, Phone, Clock, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import StationFormModal from './StationFormModal';

interface Station {
  id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  coverage_area: string;
  phone: string;
  operating_hours: string;
  staff_count: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}



export default function StationsManagement() {
  const [stations, setStations] = useState<Station[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
    const subscription = supabase
      .channel('stations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stations' }, payload => {
        fetchStations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchStations = async () => {
    try {
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStations(data || []);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (newStation: Omit<Station, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('stations')
        .insert([newStation])
        .select()
        .single();

      if (error) throw error;
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const handleEditStation = async (updatedStation: Station) => {
    try {
      const { error } = await supabase
        .from('stations')
        .update(updatedStation)
        .eq('id', updatedStation.id);

      if (error) throw error;
      setSelectedStation(null);
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const handleDeleteStation = async (stationId: string) => {
    try {
      const { error } = await supabase
        .from('stations')
        .delete()
        .eq('id', stationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
          <p className="text-gray-600 mt-1">Manage TowVO stations across Abuja</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add New Station
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage Area</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stations.map((station) => (
              <motion.tr
                key={station.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{station.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {station.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{station.address}</div>
                  <div className="text-sm text-gray-500">
                    {station.location?.coordinates ? `${station.location.coordinates[1]}, ${station.location.coordinates[0]}` : 'Location not set'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{station.coverage_area}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {station.staff_count} Staff
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {station.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedStation(station)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStation(station.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <StationFormModal
        isOpen={isAddModalOpen || selectedStation !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedStation(null);
        }}
        onSubmit={selectedStation ? handleEditStation : handleAddStation}
        station={selectedStation}
      />
    </div>
  );
}