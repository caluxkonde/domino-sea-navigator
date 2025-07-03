
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithRole {
  id: string;
  full_name: string | null;
  email: string | null;
  position: string | null;
  created_at: string;
  role: 'admin' | 'user';
  premium_status?: {
    is_premium: boolean;
    end_date?: string;
    subscription_type?: string;
  };
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles and premium status for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)
            .single();

          // Get premium status
          const { data: premiumData } = await supabase.rpc('get_user_premium_status', {
            _user_id: profile.id
          });

          const parsedPremiumData = premiumData && typeof premiumData === 'object' && 'is_premium' in premiumData 
            ? premiumData as { is_premium: boolean; end_date?: string; subscription_type?: string; }
            : { is_premium: false };

          return {
            ...profile,
            role: roleData?.role || 'user',
            premium_status: parsedPremiumData
          } as UserWithRole;
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data pengguna',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Berhasil',
        description: `Peran pengguna berhasil diubah menjadi ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah peran pengguna',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    updateUserRole,
    refetch: fetchUsers
  };
};
