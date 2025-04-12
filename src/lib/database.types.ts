export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      service_requests: {
        Row: {
          id: string
          user_id: string
          service_type: string
          status: string
          location_address: string
          location_latitude: number
          location_longitude: number
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vehicle_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_type: string
          status?: string
          location_address: string
          location_latitude: number
          location_longitude: number
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vehicle_color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_type?: string
          status?: string
          location_address?: string
          location_latitude?: number
          location_longitude?: number
          vehicle_make?: string
          vehicle_model?: string
          vehicle_year?: string
          vehicle_color?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          year: string
          color: string
          license_plate: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          make: string
          model: string
          year: string
          color: string
          license_plate?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          make?: string
          model?: string
          year?: string
          color?: string
          license_plate?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          request_id: string
          amount: number
          reference: string
          status: string
          payment_method: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          amount: number
          reference: string
          status: string
          payment_method: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          amount?: number
          reference?: string
          status?: string
          payment_method?: string
          created_at?: string
        }
      }
      service_providers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          latitude: number
          longitude: number
          service_types: string[]
          rating: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          latitude: number
          longitude: number
          service_types: string[]
          rating?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          latitude?: number
          longitude?: number
          service_types?: string[]
          rating?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}