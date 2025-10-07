// Database types generated from Supabase schema
// These types match the database schema exactly

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          phone_number: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string;
          height_feet: number | null;
          height_inches: number | null;
          weight_lbs: number | null;
          blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
          avatar_url: string | null;
          preferred_language: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          phone_number?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          height_feet?: number | null;
          height_inches?: number | null;
          weight_lbs?: number | null;
          blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
          avatar_url?: string | null;
          preferred_language?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          phone_number?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          height_feet?: number | null;
          height_inches?: number | null;
          weight_lbs?: number | null;
          blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
          avatar_url?: string | null;
          preferred_language?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      medications: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          dosage: string;
          frequency: 'daily' | 'weekly' | 'as_needed' | 'custom';
          time: string[];
          start_date: string;
          end_date: string | null;
          date_added: string;
          notes: string | null;
          reminder_enabled: boolean;
          taken: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          dosage: string;
          frequency: 'daily' | 'weekly' | 'as_needed' | 'custom';
          time?: string[];
          start_date: string;
          end_date?: string | null;
          date_added?: string;
          notes?: string | null;
          reminder_enabled?: boolean;
          taken?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          dosage?: string;
          frequency?: 'daily' | 'weekly' | 'as_needed' | 'custom';
          time?: string[];
          start_date?: string;
          end_date?: string | null;
          date_added?: string;
          notes?: string | null;
          reminder_enabled?: boolean;
          taken?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      health_records: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other';
          date: string;
          description: string | null;
          notes: string | null;
          file_url: string | null;
          file_name: string | null;
          file_size: number | null;
          file_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other';
          date: string;
          description?: string | null;
          notes?: string | null;
          file_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'other';
          date?: string;
          description?: string | null;
          notes?: string | null;
          file_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      medical_conditions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          diagnosed_date: string;
          status: 'active' | 'resolved' | 'chronic';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          diagnosed_date: string;
          status: 'active' | 'resolved' | 'chronic';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          diagnosed_date?: string;
          status?: 'active' | 'resolved' | 'chronic';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      surgeries: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          date: string;
          hospital: string | null;
          surgeon: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          date: string;
          hospital?: string | null;
          surgeon?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          date?: string;
          hospital?: string | null;
          surgeon?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      allergies: {
        Row: {
          id: string;
          user_id: string;
          allergen: string;
          reaction: string;
          severity: 'mild' | 'moderate' | 'severe';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          allergen: string;
          reaction: string;
          severity: 'mild' | 'moderate' | 'severe';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          allergen?: string;
          reaction?: string;
          severity?: 'mild' | 'moderate' | 'severe';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: string;
          phone_number: string;
          email: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship: string;
          phone_number: string;
          email?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          relationship?: string;
          phone_number?: string;
          email?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      health_tracker_data: {
        Row: {
          id: string;
          user_id: string;
          heart_rate: number | null;
          steps: number | null;
          distance: number | null;
          sleep_hours: number | null;
          calories: number | null;
          systolic_bp: number | null;
          diastolic_bp: number | null;
          weight_lbs: number | null;
          recorded_date: string;
          last_sync: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          heart_rate?: number | null;
          steps?: number | null;
          distance?: number | null;
          sleep_hours?: number | null;
          calories?: number | null;
          systolic_bp?: number | null;
          diastolic_bp?: number | null;
          weight_lbs?: number | null;
          recorded_date?: string;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          heart_rate?: number | null;
          steps?: number | null;
          distance?: number | null;
          sleep_hours?: number | null;
          calories?: number | null;
          systolic_bp?: number | null;
          diastolic_bp?: number | null;
          weight_lbs?: number | null;
          recorded_date?: string;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      connected_devices: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'custom';
          connected: boolean;
          last_sync: string | null;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'custom';
          connected?: boolean;
          last_sync?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'custom';
          connected?: boolean;
          last_sync?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          doctor_name: string | null;
          specialty: string | null;
          location: string | null;
          appointment_date: string;
          duration_minutes: number;
          notes: string | null;
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
          reminder_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          doctor_name?: string | null;
          specialty?: string | null;
          location?: string | null;
          appointment_date: string;
          duration_minutes?: number;
          notes?: string | null;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
          reminder_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          doctor_name?: string | null;
          specialty?: string | null;
          location?: string | null;
          appointment_date?: string;
          duration_minutes?: number;
          notes?: string | null;
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
          reminder_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      symptom_logs: {
        Row: {
          id: string;
          user_id: string;
          symptoms: string[];
          severity: number;
          description: string | null;
          logged_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symptoms: string[];
          severity: number;
          description?: string | null;
          logged_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symptoms?: string[];
          severity?: number;
          description?: string | null;
          logged_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          notifications_enabled: boolean;
          medication_reminders: boolean;
          appointment_reminders: boolean;
          health_tips: boolean;
          data_sharing_enabled: boolean;
          analytics_enabled: boolean;
          theme: 'light' | 'dark' | 'system';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          notifications_enabled?: boolean;
          medication_reminders?: boolean;
          appointment_reminders?: boolean;
          health_tips?: boolean;
          data_sharing_enabled?: boolean;
          analytics_enabled?: boolean;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          notifications_enabled?: boolean;
          medication_reminders?: boolean;
          appointment_reminders?: boolean;
          health_tips?: boolean;
          data_sharing_enabled?: boolean;
          analytics_enabled?: boolean;
          theme?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          old_data: Record<string, any> | null;
          new_data: Record<string, any> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
          old_data?: Record<string, any> | null;
          new_data?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string | null;
          old_data?: Record<string, any> | null;
          new_data?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
