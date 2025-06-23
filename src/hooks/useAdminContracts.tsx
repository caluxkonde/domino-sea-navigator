
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AdminContract {
  id: string;
  user_id: string;
  contract_type: string;
  price: number;
  payment_status: string;
  payment_method?: string;
  whatsapp_number?: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export const useAdminContracts = () => {
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPendingContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kontrak",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptContract = async (contractId: string, adminNotes?: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('accept_contract', {
        contract_id_param: contractId,
        admin_id_param: user.id,
        admin_notes_param: adminNotes
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah disetujui",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error accepting contract:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyetujui kontrak",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectContract = async (contractId: string, adminNotes?: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('reject_contract', {
        contract_id_param: contractId,
        admin_id_param: user.id,
        admin_notes_param: adminNotes
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah ditolak",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error rejecting contract:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menolak kontrak",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPendingContracts();
  }, [user]);

  return {
    contracts,
    loading,
    acceptContract,
    rejectContract,
    refetch: fetchPendingContracts
  };
};
