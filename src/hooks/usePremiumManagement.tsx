import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserPremiumInfo {
  user_id: string;
  full_name?: string;
  email?: string;
  role: 'admin' | 'Premium' | 'user';
  is_premium: boolean;
  contract_type?: string;
  subscription_type?: string;
  end_date?: string;
  days_remaining?: number;
  status: string;
}

export const usePremiumManagement = () => {
  const [users, setUsers] = useState<UserPremiumInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUsersWithPremiumInfo = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get premium info for each user
      const usersWithPremiumInfo = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)
            .single();

          // Get premium status
          const { data: premiumData } = await supabase.rpc('get_user_premium_status', {
            _user_id: profile.id
          });

          let premiumInfo: any = { is_premium: false };
          if (premiumData && typeof premiumData === 'object') {
            premiumInfo = premiumData as any;
          }

          // Calculate days remaining if premium
          let daysRemaining = 0;
          if (premiumInfo.is_premium && premiumInfo.end_date) {
            const endDate = new Date(premiumInfo.end_date);
            const today = new Date();
            const diffTime = endDate.getTime() - today.getTime();
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          return {
            user_id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            role: roleData?.role || 'user',
            is_premium: premiumInfo.is_premium || false,
            contract_type: premiumInfo.contract_type || undefined,
            subscription_type: premiumInfo.subscription_type || undefined,
            end_date: premiumInfo.end_date || undefined,
            days_remaining: daysRemaining,
            status: premiumInfo.is_premium ? 'active' : 'inactive'
          } as UserPremiumInfo;
        })
      );

      setUsers(usersWithPremiumInfo);
    } catch (error) {
      console.error('Error fetching users with premium info:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pengguna',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const extendPremiumSubscription = async (userId: string, months: number) => {
    try {
      // Get the contract prices and settings
      const contractSettings = {
        1: { type: '1_month', price: 100000, duration: 1 },
        3: { type: '3_months', price: 200000, duration: 3 },
        6: { type: '6_months', price: 300000, duration: 6 },
        12: { type: '1_year', price: 500000, duration: 12 }
      };

      const setting = contractSettings[months as keyof typeof contractSettings] || contractSettings[1];
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + setting.duration);
      
      const { error } = await supabase
        .from('contracts')
        .insert({
          user_id: userId,
          contract_type: setting.type,
          payment_status: 'verified',
          status: 'active',
          price: setting.price,
          duration_months: setting.duration,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: `Premium diperpanjang ${months} bulan oleh admin`
        });

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: `Premium berhasil diperpanjang ${months} bulan`,
      });

      await fetchUsersWithPremiumInfo();
    } catch (error: any) {
      console.error('Error extending premium:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperpanjang premium',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsersWithPremiumInfo();
    }
  }, [user]);

  return {
    users,
    loading,
    extendPremiumSubscription,
    refetch: fetchUsersWithPremiumInfo
  };
};