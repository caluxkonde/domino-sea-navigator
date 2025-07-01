
-- Insert admin role for the specified email
-- First, we need to find the user ID for this email and then assign admin role
-- Note: This assumes the user has already signed up. If not, they need to sign up first.

-- Insert admin role for the user with email nindaimeraikage@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'nindaimeraikage@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
