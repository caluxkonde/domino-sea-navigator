
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserRoles } from './useUserRoles';

export interface PremiumStatus {
  is_premium: boolean;
  subscription_type?: string;
  end_date?: string;
  contract_type?: string;
}

export const usePremiumStatus = () => {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ is_premium: false });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRoles();

  const fetchPremiumStatus = async () => {
    console.log('fetchPremiumStatus called:', { user: user?.email, isAdmin, roleLoading });
    
    if (!user) {
      console.log('No user, setting premium to false');
      setPremiumStatus({ is_premium: false });
      setLoading(false);
      return;
    }

    // Special handling for nindaimeraikage@gmail.com - always admin with premium
    if (user.email === 'nindaimeraikage@gmail.com') {
      console.log('User is nindaimeraikage@gmail.com, granting admin premium access');
      setPremiumStatus({ 
        is_premium: true,
        subscription_type: 'admin',
        contract_type: 'admin_access'
      });
      setLoading(false);
      return;
    }

    // If user is admin, automatically grant premium access
    if (isAdmin) {
      console.log('User is admin, granting premium access');
      setPremiumStatus({ 
        is_premium: true,
        subscription_type: 'admin',
        contract_type: 'admin_access'
      });
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching premium status from database for user:', user.id);
      const { data, error } = await supabase.rpc('get_user_premium_status', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error fetching premium status:', error);
        throw error;
      }
      
      console.log('Premium status response:', data);
      
      // Handle the JSON response from the RPC function
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const status = data as unknown as PremiumStatus;
        console.log('Setting premium status:', status);
        setPremiumStatus(status);
      } else {
        console.log('No premium data found, setting to false');
        setPremiumStatus({ is_premium: false });
      }
    } catch (error) {
      console.error('Error fetching premium status:', error);
      setPremiumStatus({ is_premium: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('usePremiumStatus useEffect:', { user: user?.email, isAdmin, roleLoading });
    // Wait for role loading to complete before fetching premium status
    if (!roleLoading) {
      fetchPremiumStatus();
    }
  }, [user, isAdmin, roleLoading]);

  return { 
    premiumStatus, 
    loading: loading || roleLoading, 
    refetch: fetchPremiumStatus 
  };
};
