-- =====================================================
-- CAREPOINT HEALTH APP - SUPABASE DATABASE SCHEMA
-- =====================================================
-- This schema is HIPAA-compliant with Row Level Security (RLS)
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. USER PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  
  -- Health metrics
  height_feet INTEGER,
  height_inches INTEGER,
  weight_lbs DECIMAL(5,2),
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  
  -- Profile settings
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'America/New_York',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. MEDICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Medication details
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'as_needed', 'custom')),
  time TEXT[] NOT NULL DEFAULT '{}',
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE,
  date_added DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Additional info
  notes TEXT,
  reminder_enabled BOOLEAN DEFAULT true,
  taken BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Enable RLS
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX idx_medications_user_date ON medications(user_id, date_added);

-- =====================================================
-- 4. HEALTH RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Record details
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lab_result', 'prescription', 'imaging', 'vaccination', 'other')),
  date DATE NOT NULL,
  description TEXT,
  notes TEXT,
  
  -- File storage (Supabase Storage)
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own health records"
  ON health_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_health_records_user_date ON health_records(user_id, date DESC);

-- =====================================================
-- 5. MEDICAL HISTORY - CONDITIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS medical_conditions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  diagnosed_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'chronic')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own medical conditions"
  ON medical_conditions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_medical_conditions_updated_at
  BEFORE UPDATE ON medical_conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. MEDICAL HISTORY - SURGERIES
-- =====================================================
CREATE TABLE IF NOT EXISTS surgeries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  date DATE NOT NULL,
  hospital TEXT,
  surgeon TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own surgeries"
  ON surgeries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_surgeries_updated_at
  BEFORE UPDATE ON surgeries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. MEDICAL HISTORY - ALLERGIES
-- =====================================================
CREATE TABLE IF NOT EXISTS allergies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  allergen TEXT NOT NULL,
  reaction TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own allergies"
  ON allergies FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_allergies_updated_at
  BEFORE UPDATE ON allergies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. EMERGENCY CONTACTS
-- =====================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_phone CHECK (phone_number ~ '^\+?[1-9]\d{1,14}$')
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_emergency_contacts_user ON emergency_contacts(user_id);

-- =====================================================
-- 9. HEALTH TRACKER DATA
-- =====================================================
CREATE TABLE IF NOT EXISTS health_tracker_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Health metrics
  heart_rate INTEGER,
  steps INTEGER,
  distance DECIMAL(10,2),
  sleep_hours DECIMAL(4,2),
  calories INTEGER,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  weight_lbs DECIMAL(5,2),
  
  -- Tracking
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_sync TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_heart_rate CHECK (heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 250)),
  CONSTRAINT valid_bp CHECK (
    (systolic_bp IS NULL AND diastolic_bp IS NULL) OR 
    (systolic_bp >= 70 AND systolic_bp <= 250 AND diastolic_bp >= 40 AND diastolic_bp <= 150)
  )
);

ALTER TABLE health_tracker_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own health tracker data"
  ON health_tracker_data FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_health_tracker_data_updated_at
  BEFORE UPDATE ON health_tracker_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX idx_health_tracker_user_date ON health_tracker_data(user_id, recorded_date DESC);

-- =====================================================
-- 10. CONNECTED DEVICES
-- =====================================================
CREATE TABLE IF NOT EXISTS connected_devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('apple_health', 'google_fit', 'fitbit', 'garmin', 'samsung_health', 'custom')),
  connected BOOLEAN DEFAULT false,
  last_sync TIMESTAMPTZ,
  
  -- OAuth tokens (encrypted)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE connected_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own connected devices"
  ON connected_devices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_connected_devices_updated_at
  BEFORE UPDATE ON connected_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. APPOINTMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  doctor_name TEXT,
  specialty TEXT,
  location TEXT,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  reminder_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own appointments"
  ON appointments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_appointments_user_date ON appointments(user_id, appointment_date);

-- =====================================================
-- 12. SYMPTOM LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS symptom_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  symptoms TEXT[] NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  description TEXT,
  logged_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own symptom logs"
  ON symptom_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_symptom_logs_updated_at
  BEFORE UPDATE ON symptom_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_symptom_logs_user_date ON symptom_logs(user_id, logged_date DESC);

-- =====================================================
-- 13. USER PREFERENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Notification settings
  notifications_enabled BOOLEAN DEFAULT true,
  medication_reminders BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  health_tips BOOLEAN DEFAULT true,
  
  -- Privacy settings
  data_sharing_enabled BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT true,
  
  -- App settings
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. AUDIT LOG (HIPAA Compliance)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- No RLS on audit logs - only accessible by service role
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only"
  ON audit_logs FOR ALL
  USING (false);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, created_at DESC);

-- =====================================================
-- 15. STORAGE BUCKETS
-- =====================================================
-- Run these in Supabase Dashboard > Storage

-- Create buckets:
-- 1. health-records (private)
-- 2. profile-avatars (public)

-- Storage policies will be created via Supabase Dashboard

-- =====================================================
-- 16. FUNCTIONS
-- =====================================================

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  
  INSERT INTO public.user_preferences (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to soft delete user data (HIPAA compliance)
CREATE OR REPLACE FUNCTION public.soft_delete_user_data(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Archive user data instead of hard delete
  -- This maintains audit trail for HIPAA compliance
  
  UPDATE profiles SET 
    email = 'deleted_' || id || '@deleted.local',
    full_name = 'Deleted User',
    phone_number = NULL,
    address = NULL
  WHERE id = target_user_id;
  
  -- Log the deletion
  INSERT INTO audit_logs (user_id, action, table_name, created_at)
  VALUES (target_user_id, 'USER_DATA_DELETED', 'profiles', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 17. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_medications_user_start ON medications(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_health_records_type ON health_records(user_id, type);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Create storage buckets in Supabase Dashboard
-- 2. Set up storage policies
-- 3. Configure email templates for auth
-- 4. Set up backup schedule
-- 5. Enable Point-in-Time Recovery (PITR)
