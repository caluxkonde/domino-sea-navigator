
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
      setContracts(data || []);
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
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          contract_type: contractData.contract_type,
          payment_method: contractData.payment_method,
          whatsapp_number: contractData.whatsapp_number,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      setContracts(prev => [data, ...prev]);
      return data;
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
      setContracts(prev => prev.map(contract => 
        contract.id === contractId ? data : contract
      ));
      return data;
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
