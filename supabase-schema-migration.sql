-- TravelSync Schema Migration for Supabase
-- This file contains the complete schema to be executed in Supabase SQL Editor

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users table (links to auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  date_of_birth DATE,
  nationality TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  dietary_restrictions TEXT,
  accessibility_needs TEXT,
  preferred_language TEXT DEFAULT 'en',
  currency_preference TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  profile_picture_url TEXT,
  bio TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  data_processing_consent BOOLEAN DEFAULT TRUE,
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  travel_preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  travel_style TEXT,
  group_size INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'active', 'completed', 'cancelled')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'shared', 'public')),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  cover_image_url TEXT,
  share_token TEXT UNIQUE,
  shared_with TEXT[] DEFAULT '{}',
  weather_data JSONB DEFAULT '{}',
  packing_list JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  category TEXT,
  subcategory TEXT,
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  booking_url TEXT,
  confirmation_number TEXT,
  notes TEXT,
  photos TEXT[] DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- USER TRIGGER FOR AUTO-PROFILE CREATION
-- =============================================================================

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    auth_user_id,
    email,
    name,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Itineraries policies
CREATE POLICY "Users can view own itineraries" ON itineraries
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

CREATE POLICY "Users can insert own itineraries" ON itineraries
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

CREATE POLICY "Users can update own itineraries" ON itineraries
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

CREATE POLICY "Users can delete own itineraries" ON itineraries
  FOR DELETE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Activities policies
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (
    auth.uid() = (
      SELECT u.auth_user_id 
      FROM users u 
      JOIN itineraries i ON u.id = i.user_id 
      WHERE i.id = itinerary_id
    )
  );

CREATE POLICY "Users can insert own activities" ON activities
  FOR INSERT WITH CHECK (
    auth.uid() = (
      SELECT u.auth_user_id 
      FROM users u 
      JOIN itineraries i ON u.id = i.user_id 
      WHERE i.id = itinerary_id
    )
  );

CREATE POLICY "Users can update own activities" ON activities
  FOR UPDATE USING (
    auth.uid() = (
      SELECT u.auth_user_id 
      FROM users u 
      JOIN itineraries i ON u.id = i.user_id 
      WHERE i.id = itinerary_id
    )
  );

CREATE POLICY "Users can delete own activities" ON activities
  FOR DELETE USING (
    auth.uid() = (
      SELECT u.auth_user_id 
      FROM users u 
      JOIN itineraries i ON u.id = i.user_id 
      WHERE i.id = itinerary_id
    )
  );

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_dates ON itineraries(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_activities_itinerary_id ON activities(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_activities_start_time ON activities(start_time);

-- =============================================================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================================================

-- This section can be uncommented to insert sample data
/*
-- Insert a test user (requires manual auth user creation first)
INSERT INTO users (
  id,
  auth_user_id,
  email,
  name,
  username
) VALUES (
  gen_random_uuid(),
  -- Note: Replace with actual auth.users.id after creating test user
  'test-auth-user-id',
  'test@example.com',
  'Test User',
  'testuser'
) ON CONFLICT (email) DO NOTHING;
*/