
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'user';

export const useUserRoles = () => {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRole = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
      }
      
      setUserRole(data?.role || 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIsAdmin = () => userRole === 'admin';

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return { userRole, loading, checkIsAdmin, refetchRole: fetchUserRole };
};
