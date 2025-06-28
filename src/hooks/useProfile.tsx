
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ProfileData {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  bio: string | null;
  current_position: string | null;
  company: string | null;
  maritime_experience_years: number | null;
  emergency_contact: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const targetUserId = userId || user?.id;

  const fetchProfile = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('Gagal memuat profil');
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!targetUserId) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Gagal memperbarui profil');
        return false;
      }

      setProfile(data);
      toast.success('Profil berhasil diperbarui');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const createProfile = async (profileData: Partial<ProfileData>) => {
    if (!targetUserId) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: targetUserId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        toast.error('Gagal membuat profil');
        return false;
      }

      setProfile(data);
      toast.success('Profil berhasil dibuat');
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Gagal membuat profil');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [targetUserId]);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    createProfile,
    refetch: fetchProfile
  };
};
