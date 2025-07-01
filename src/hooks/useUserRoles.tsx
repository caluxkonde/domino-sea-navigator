
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'user';

export const useUserRoles = () => {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRole = async () => {
    console.log('fetchUserRole called for user:', user?.email);
    
    if (!user) {
      console.log('No user, setting role to user');
      setUserRole('user');
      setLoading(false);
      return;
    }

    // Check if user is the specific admin email
    if (user.email === 'nindaimeraikage@gmail.com') {
      console.log('User is nindaimeraikage@gmail.com, setting as admin');
      setUserRole('admin');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching user role from database for user:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
      }
      
      console.log('User role response:', data);
      const role = data?.role || 'user';
      console.log('Setting user role to:', role);
      setUserRole(role);
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const checkIsAdmin = () => userRole === 'admin';
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    console.log('useUserRoles useEffect called for user:', user?.email);
    fetchUserRole();
  }, [user]);

  console.log('useUserRoles returning:', { userRole, loading, isAdmin });

  return { 
    userRole, 
    loading, 
    isAdmin, 
    checkIsAdmin, 
    refetch: fetchUserRole 
  };
};
