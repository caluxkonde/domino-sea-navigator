
-- Create blog posts table for job information and media
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    category TEXT DEFAULT 'general' CHECK (category IN ('job', 'news', 'info', 'general')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create CV templates table
CREATE TABLE IF NOT EXISTS public.cv_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL,
    preview_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user CVs table
CREATE TABLE IF NOT EXISTS public.user_cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.cv_templates(id),
    title TEXT NOT NULL,
    cv_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job postings table
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_range TEXT,
    job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
    experience_level TEXT DEFAULT 'entry' CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    application_deadline DATE,
    contact_info TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    cost DECIMAL(10,2),
    duration_days INTEGER,
    contact_whatsapp TEXT DEFAULT '081991191988',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user locations table for GPS tracking
CREATE TABLE IF NOT EXISTS public.user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(8, 2),
    altitude DECIMAL(8, 2),
    speed DECIMAL(8, 2),
    heading DECIMAL(8, 2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    rank INTEGER,
    category TEXT DEFAULT 'general',
    achievements JSONB DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    whatsapp_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    job_alerts BOOLEAN DEFAULT true,
    contract_updates BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all new tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Everyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cv_templates
CREATE POLICY "Everyone can view active CV templates" ON public.cv_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage CV templates" ON public.cv_templates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_cvs
CREATE POLICY "Users can manage their own CVs" ON public.user_cvs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all CVs" ON public.user_cvs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for job_postings
CREATE POLICY "Everyone can view active job postings" ON public.job_postings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all job postings" ON public.job_postings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for certifications
CREATE POLICY "Everyone can view active certifications" ON public.certifications
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage certifications" ON public.certifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_locations
CREATE POLICY "Users can manage their own locations" ON public.user_locations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all locations" ON public.user_locations
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for leaderboard
CREATE POLICY "Everyone can view leaderboard" ON public.leaderboard
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own leaderboard" ON public.leaderboard
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage leaderboard" ON public.leaderboard
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for password_reset_tokens
CREATE POLICY "Users can view their own reset tokens" ON public.password_reset_tokens
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for notification_preferences
CREATE POLICY "Users can manage their own notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Insert default CV templates
INSERT INTO public.cv_templates (name, description, template_data, preview_image_url) VALUES
('Classic Professional', 'Template CV profesional klasik dengan layout bersih', 
 '{"sections": ["personal_info", "summary", "experience", "education", "skills"], "style": "classic", "color": "blue"}', 
 '/cv-templates/classic-preview.jpg'),
('Modern Creative', 'Template CV modern dengan desain kreatif', 
 '{"sections": ["personal_info", "summary", "experience", "education", "skills", "portfolio"], "style": "modern", "color": "purple"}', 
 '/cv-templates/modern-preview.jpg'),
('Maritime Specialist', 'Template CV khusus untuk profesi maritim', 
 '{"sections": ["personal_info", "summary", "maritime_experience", "certifications", "education", "skills"], "style": "maritime", "color": "navy"}', 
 '/cv-templates/maritime-preview.jpg'),
('Simple Elegant', 'Template CV sederhana dan elegan', 
 '{"sections": ["personal_info", "summary", "experience", "education"], "style": "simple", "color": "gray"}', 
 '/cv-templates/simple-preview.jpg'),
('Executive Premium', 'Template CV premium untuk posisi eksekutif', 
 '{"sections": ["personal_info", "executive_summary", "leadership_experience", "achievements", "education", "skills"], "style": "executive", "color": "gold"}', 
 '/cv-templates/executive-preview.jpg');

-- Insert default certifications
INSERT INTO public.certifications (name, description, requirements, cost, duration_days) VALUES
('Basic Safety Training (BST)', 'Pelatihan keselamatan dasar untuk pelaut', 'Minimal lulusan SMP, sehat jasmani rohani', 2500000, 5),
('Advanced Fire Fighting', 'Pelatihan pemadaman kebakaran lanjutan', 'Memiliki sertifikat BST', 3000000, 3),
('Ship Security Officer (SSO)', 'Pelatihan petugas keamanan kapal', 'Minimal 2 tahun pengalaman di kapal', 4000000, 7),
('Marine Engine Certificate', 'Sertifikat mesin kapal', 'Lulusan teknik mesin atau pengalaman 3 tahun', 5000000, 10),
('Navigation Officer Certificate', 'Sertifikat perwira navigasi', 'Lulusan pelayaran atau pengalaman 5 tahun', 6000000, 14);

-- Function to calculate distance between two GPS coordinates
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
    R DECIMAL := 6371; -- Earth's radius in kilometers
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);
    
    a := sin(dLat/2) * sin(dLat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon/2) * sin(dLon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN R * c;
END;
$$;

-- Function to update leaderboard points
CREATE OR REPLACE FUNCTION public.update_leaderboard_points(
    user_id_param UUID,
    points_to_add INTEGER,
    category_param TEXT DEFAULT 'general'
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.leaderboard (user_id, points, category)
    VALUES (user_id_param, points_to_add, category_param)
    ON CONFLICT (user_id, category) 
    DO UPDATE SET 
        points = leaderboard.points + points_to_add,
        last_updated = NOW();
END;
$$;

-- Update profiles table to include more fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS maritime_experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_position TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;
