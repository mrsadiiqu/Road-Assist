import { create } from 'zustand';
import { supabase } from './supabase';
import type { Database } from './database.types';

type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserVehicle = Database['public']['Tables']['user_vehicles']['Row'];

interface AppState {
  // Service Requests
  activeRequest: ServiceRequest | null;
  serviceHistory: ServiceRequest[];
  isLoading: boolean;
  error: string | null;

  // User Profile
  userProfile: UserProfile | null;
  userVehicles: UserVehicle[];

  // Actions
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<ServiceRequest>;
  fetchServiceHistory: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchUserVehicles: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addUserVehicle: (vehicle: Omit<UserVehicle, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteUserVehicle: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

// Add these types and functions to your store
interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: string;
  color: string;
}

interface ServiceRequest {
  user_id: string;
  service_type: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  location_address: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_color: string;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  activeRequest: null,
  serviceHistory: [],
  isLoading: false,
  error: null,
  userProfile: null,
  userVehicles: [],

  // Error handling
  setError: (error) => set({ error }),

  // Service Request Actions
  createServiceRequest: async (requestData) => {
    set({ isLoading: true, error: null });
    try {
      // Create the service request
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          user_id: requestData.user_id,
          service_type: requestData.service_type,
          status: 'pending',
          location_address: requestData.location_address,
          vehicle_make: requestData.vehicle_make,
          vehicle_model: requestData.vehicle_model,
          vehicle_year: requestData.vehicle_year,
          vehicle_color: requestData.vehicle_color
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update the store state
      set((state) => ({
        activeRequest: data,
        serviceHistory: [data, ...state.serviceHistory],
        error: null
      }));

      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create service request';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  // Vehicle Management Actions
  addUserVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_vehicles')
        .insert(vehicle)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        userVehicles: [...state.userVehicles, data]
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUserVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        userVehicles: state.userVehicles.filter(v => v.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchServiceHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ 
        serviceHistory: data,
        activeRequest: data.find(req => req.status !== 'completed') || null
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // User Profile Actions
  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .single();

      if (profileError) throw profileError;
      set({ userProfile: profile });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (profile) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      set({ userProfile: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Vehicle Management Actions
  fetchUserVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ userVehicles: vehicles });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));