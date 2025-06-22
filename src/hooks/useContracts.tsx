
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type ContractRow = Database['public']['Tables']['contracts']['Row'];
type ContractInsert = Database['public']['Tables']['contracts']['Insert'];

export interface Contract {
  id: string;
  user_id: string;
  contract_type: '3_months' | '6_months' | '1_year';
  price: number;
  duration_months: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  payment_method?: 'transfer' | 'dana';
  payment_status: 'pending' | 'verified' | 'failed';
  payment_proof_url?: string;
  whatsapp_number?: string;
  notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to convert database row to Contract interface
const mapContractRow = (row: ContractRow): Contract => ({
  id: row.id,
  user_id: row.user_id,
  contract_type: row.contract_type as '3_months' | '6_months' | '1_year',
  price: Number(row.price),
  duration_months: row.duration_months,
  start_date: row.start_date,
  end_date: row.end_date,
  status: row.status as 'active' | 'expired' | 'cancelled',
  payment_method: row.payment_method as 'transfer' | 'dana' | undefined,
  payment_status: row.payment_status as 'pending' | 'verified' | 'failed',
  payment_proof_url: row.payment_proof_url || undefined,
  whatsapp_number: row.whatsapp_number || undefined,
  notification_sent: row.notification_sent || false,
  created_at: row.created_at || '',
  updated_at: row.updated_at || ''
});

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchContracts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedContracts = (data || []).map(mapContractRow);
      setContracts(mappedContracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContract = async (contractData: {
    contract_type: '3_months' | '6_months' | '1_year';
    payment_method: 'transfer' | 'dana';
    whatsapp_number: string;
  }) => {
    if (!user) return null;

    try {
      // These fields will be set by the database trigger, so we provide dummy values
      // that will be overwritten by the trigger function
      const insertData = {
        user_id: user.id,
        contract_type: contractData.contract_type,
        payment_method: contractData.payment_method,
        whatsapp_number: contractData.whatsapp_number,
        payment_status: 'pending' as const,
        // These will be set by the trigger, but TypeScript requires them
        duration_months: 0,
        end_date: new Date().toISOString(),
        price: 0
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      const mappedContract = mapContractRow(data);
      setContracts(prev => [mappedContract, ...prev]);
      return mappedContract;
    } catch (error) {
      console.error('Error creating contract:', error);
      return null;
    }
  };

  const updatePaymentProof = async (contractId: string, proofUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({ 
          payment_proof_url: proofUrl,
          payment_status: 'pending' // Reset to pending for review
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;
      
      const mappedContract = mapContractRow(data);
      setContracts(prev => prev.map(contract => 
        contract.id === contractId ? mappedContract : contract
      ));
      return mappedContract;
    } catch (error) {
      console.error('Error updating payment proof:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  return { 
    contracts, 
    loading, 
    createContract, 
    updatePaymentProof, 
    refetch: fetchContracts 
  };
};
