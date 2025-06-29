
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CVPurchase {
  id: string;
  user_id: string;
  cv_type: 'silver' | 'gold' | 'platinum';
  price: number;
  payment_method?: 'transfer' | 'dana';
  payment_status: 'pending' | 'verified' | 'failed';
  payment_proof_url?: string;
  whatsapp_number?: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useCVPurchases = () => {
  const [cvPurchases, setCVPurchases] = useState<CVPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCVPurchases = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cv_purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCVPurchases(data || []);
    } catch (error) {
      console.error('Error fetching CV purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCVPurchase = async (purchaseData: {
    cv_type: 'silver' | 'gold' | 'platinum';
    payment_method: 'transfer' | 'dana';
    whatsapp_number: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('cv_purchases')
        .insert({
          user_id: user.id,
          ...purchaseData,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      setCVPurchases(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating CV purchase:', error);
      return null;
    }
  };

  const updatePaymentProof = async (purchaseId: string, proofUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('cv_purchases')
        .update({ 
          payment_proof_url: proofUrl,
          payment_status: 'pending'
        })
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) throw error;
      
      setCVPurchases(prev => prev.map(purchase => 
        purchase.id === purchaseId ? data : purchase
      ));
      return data;
    } catch (error) {
      console.error('Error updating payment proof:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCVPurchases();
  }, [user]);

  return { 
    cvPurchases, 
    loading, 
    createCVPurchase, 
    updatePaymentProof, 
    refetch: fetchCVPurchases 
  };
};
