import { supabase } from '@/integrations/supabase/client';
import { AdminContract } from '@/types/adminContract';

export const contractService = {
  async fetchPendingContracts(): Promise<AdminContract[]> {
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
    return contractsWithProfiles;
  },

  async acceptContract(contractId: string, adminId: string, adminNotes?: string) {
    console.log('Accepting contract:', contractId, 'with notes:', adminNotes);
    
    const { data, error } = await supabase.rpc('accept_contract', {
      contract_id_param: contractId,
      admin_id_param: adminId,
      admin_notes_param: adminNotes || null
    });

    if (error) {
      console.error('RPC error:', error);
      throw error;
    }

    console.log('Accept contract response:', data);
    return data;
  },

  async rejectContract(contractId: string, adminId: string, adminNotes?: string) {
    console.log('Rejecting contract:', contractId, 'with notes:', adminNotes);
    
    const { data, error } = await supabase.rpc('reject_contract', {
      contract_id_param: contractId,
      admin_id_param: adminId,
      admin_notes_param: adminNotes || null
    });

    if (error) {
      console.error('RPC error:', error);
      throw error;
    }

    console.log('Reject contract response:', data);
    return data;
  },

  async cancelContract(contractId: string, adminId: string, cancellationReason?: string) {
    console.log('Cancelling contract:', contractId, 'with reason:', cancellationReason);
    
    const { data, error } = await supabase.rpc('cancel_contract', {
      contract_id_param: contractId,
      admin_id_param: adminId,
      cancellation_reason_param: cancellationReason || null
    });

    if (error) {
      console.error('RPC error:', error);
      throw error;
    }

    console.log('Cancel contract response:', data);
    return data;
  }
};