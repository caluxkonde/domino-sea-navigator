
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
    if (!user) {
      setPremiumStatus({ is_premium: false });
      setLoading(false);
      return;
    }

    // If user is admin, automatically grant premium access
    if (isAdmin) {
      setPremiumStatus({ 
        is_premium: true,
        subscription_type: 'admin',
        contract_type: 'admin_access'
      });
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('get_user_premium_status', {
        _user_id: user.id
      });

      if (error) throw error;
      
      // Handle the JSON response from the RPC function
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setPremiumStatus(data as unknown as PremiumStatus);
      } else {
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
