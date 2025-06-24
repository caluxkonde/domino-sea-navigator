
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

interface ContractResponse {
  success: boolean;
  error?: string;
  contract?: any;
}

export const useAdminContracts = () => {
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPendingContracts = async () => {
    try {
      console.log('Fetching pending contracts...');
      
      // First, let's try a simpler query to get contracts with user info
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        throw contractsError;
      }

      console.log('Contracts data:', contractsData);

      // Then get profiles for each user
      const contractsWithProfiles = await Promise.all(
        (contractsData || []).map(async (contract) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', contract.user_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile for user:', contract.user_id, profileError);
          }

          return {
            ...contract,
            profiles: profileData || undefined
          } as AdminContract;
        })
      );

      console.log('Contracts with profiles:', contractsWithProfiles);
      setContracts(contractsWithProfiles);
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
      console.log('Accepting contract:', contractId, 'with notes:', adminNotes);
      
      const { data, error } = await supabase.rpc('accept_contract', {
        contract_id_param: contractId,
        admin_id_param: user.id,
        admin_notes_param: adminNotes
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      console.log('Accept contract response:', data);

      // Handle the response - it could be a JSON object or string
      let response: ContractResponse;
      
      if (typeof data === 'string') {
        try {
          response = JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse response:', data);
          throw new Error('Invalid response format');
        }
      } else if (typeof data === 'object' && data !== null) {
        response = data as ContractResponse;
      } else {
        throw new Error('Unexpected response format');
      }

      if (response.success) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah disetujui",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(response.error || 'Unknown error occurred');
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
      console.log('Rejecting contract:', contractId, 'with notes:', adminNotes);
      
      const { data, error } = await supabase.rpc('reject_contract', {
        contract_id_param: contractId,
        admin_id_param: user.id,
        admin_notes_param: adminNotes
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      console.log('Reject contract response:', data);

      // Handle the response - it could be a JSON object or string
      let response: ContractResponse;
      
      if (typeof data === 'string') {
        try {
          response = JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse response:', data);
          throw new Error('Invalid response format');
        }
      } else if (typeof data === 'object' && data !== null) {
        response = data as ContractResponse;
      } else {
        throw new Error('Unexpected response format');
      }

      if (response.success) {
        toast({
          title: "Berhasil",
          description: "Kontrak telah ditolak",
        });
        await fetchPendingContracts();
        return true;
      } else {
        throw new Error(response.error || 'Unknown error occurred');
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
