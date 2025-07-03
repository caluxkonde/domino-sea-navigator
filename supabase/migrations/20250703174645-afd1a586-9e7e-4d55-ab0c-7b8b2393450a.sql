-- Update app_role enum to include 'Premium' role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'Premium';