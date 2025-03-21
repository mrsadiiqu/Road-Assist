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
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  fetchServiceHistory: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchUserVehicles: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  addUserVehicle: (vehicle: Omit<UserVehicle, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteUserVehicle: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  activeRequest: null,
  serviceHistory: [],
  isLoading: false,
  error: null,
  userProfile: null,
  userVehicles: [],

  // Service Request Actions
  createServiceRequest: async (request) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        activeRequest: data,
        serviceHistory: [data, ...state.serviceHistory]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
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
      const { data, error } = await supabase
        .from('user_vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ userVehicles: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

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
        userVehicles: [data, ...state.userVehicles]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
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
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  }
}));