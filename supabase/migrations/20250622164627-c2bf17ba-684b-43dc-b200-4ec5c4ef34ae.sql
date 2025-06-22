
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  company TEXT,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create ships table
CREATE TABLE public.ships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  imo_number TEXT,
  call_sign TEXT,
  flag TEXT,
  length_m NUMERIC,
  width_m NUMERIC,
  draft_m NUMERIC,
  gross_tonnage NUMERIC,
  status TEXT DEFAULT 'active',
  current_lat NUMERIC,
  current_lng NUMERIC,
  current_speed NUMERIC DEFAULT 0,
  current_heading NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id UUID REFERENCES public.ships NOT NULL,
  name TEXT NOT NULL,
  origin_port TEXT,
  destination_port TEXT,
  waypoints JSONB,
  estimated_duration INTERVAL,
  distance_nm NUMERIC,
  status TEXT DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voyage_logs table
CREATE TABLE public.voyage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ship_id UUID REFERENCES public.ships NOT NULL,
  route_id UUID REFERENCES public.routes,
  log_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  speed_knots NUMERIC,
  heading_degrees NUMERIC,
  weather_condition TEXT,
  sea_state TEXT,
  wind_speed_knots NUMERIC,
  wave_height_m NUMERIC,
  visibility_nm NUMERIC,
  notes TEXT
);

-- Create tidal_data table
CREATE TABLE public.tidal_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  tide_time TIMESTAMP WITH TIME ZONE NOT NULL,
  tide_height_m NUMERIC NOT NULL,
  tide_type TEXT NOT NULL, -- 'high' or 'low'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voyage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tidal_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for ships
CREATE POLICY "Users can view their own ships" ON public.ships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ships" ON public.ships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ships" ON public.ships
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ships" ON public.ships
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for routes
CREATE POLICY "Users can view routes for their ships" ON public.routes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ships WHERE ships.id = routes.ship_id AND ships.user_id = auth.uid())
  );

CREATE POLICY "Users can create routes for their ships" ON public.routes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ships WHERE ships.id = routes.ship_id AND ships.user_id = auth.uid())
  );

CREATE POLICY "Users can update routes for their ships" ON public.routes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.ships WHERE ships.id = routes.ship_id AND ships.user_id = auth.uid())
  );

CREATE POLICY "Users can delete routes for their ships" ON public.routes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.ships WHERE ships.id = routes.ship_id AND ships.user_id = auth.uid())
  );

-- Create RLS policies for voyage_logs
CREATE POLICY "Users can view logs for their ships" ON public.voyage_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ships WHERE ships.id = voyage_logs.ship_id AND ships.user_id = auth.uid())
  );

CREATE POLICY "Users can create logs for their ships" ON public.voyage_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ships WHERE ships.id = voyage_logs.ship_id AND ships.user_id = auth.uid())
  );

-- Create RLS policies for tidal_data (public read access)
CREATE POLICY "Anyone can view tidal data" ON public.tidal_data
  FOR SELECT TO authenticated USING (true);

-- Create trigger function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample tidal data
INSERT INTO public.tidal_data (location_name, latitude, longitude, tide_time, tide_height_m, tide_type) VALUES
('Jakarta Bay', -6.1067, 106.9000, '2025-06-22 06:30:00+07', 3.2, 'high'),
('Jakarta Bay', -6.1067, 106.9000, '2025-06-22 12:45:00+07', 0.8, 'low'),
('Jakarta Bay', -6.1067, 106.9000, '2025-06-22 18:30:00+07', 3.1, 'high'),
('Jakarta Bay', -6.1067, 106.9000, '2025-06-23 00:45:00+07', 0.9, 'low'),
('Surabaya Port', -7.2492, 112.7508, '2025-06-22 07:00:00+07', 2.8, 'high'),
('Surabaya Port', -7.2492, 112.7508, '2025-06-22 13:15:00+07', 0.6, 'low'),
('Surabaya Port', -7.2492, 112.7508, '2025-06-22 19:00:00+07', 2.9, 'high'),
('Surabaya Port', -7.2492, 112.7508, '2025-06-23 01:15:00+07', 0.7, 'low');
