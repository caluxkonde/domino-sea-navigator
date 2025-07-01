
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
      
      // Type assertion to handle the database string types
      const typedData = (data || []).map(item => ({
        ...item,
        cv_type: item.cv_type as 'silver' | 'gold' | 'platinum',
        payment_status: item.payment_status as 'pending' | 'verified' | 'failed',
        payment_method: item.payment_method as 'transfer' | 'dana' | undefined
      }));
      
      setCVPurchases(typedData);
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

    // Calculate price based on CV type
    const priceMap = {
      silver: 20000,
      gold: 50000,
      platinum: 100000
    };

    try {
      const { data, error } = await supabase
        .from('cv_purchases')
        .insert({
          user_id: user.id,
          cv_type: purchaseData.cv_type,
          payment_method: purchaseData.payment_method,
          whatsapp_number: purchaseData.whatsapp_number,
          price: priceMap[purchaseData.cv_type],
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        cv_type: data.cv_type as 'silver' | 'gold' | 'platinum',
        payment_status: data.payment_status as 'pending' | 'verified' | 'failed',
        payment_method: data.payment_method as 'transfer' | 'dana' | undefined
      };
      
      setCVPurchases(prev => [typedData, ...prev]);
      return typedData;
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
      
      // Type assertion for the returned data
      const typedData = {
        ...data,
        cv_type: data.cv_type as 'silver' | 'gold' | 'platinum',
        payment_status: data.payment_status as 'pending' | 'verified' | 'failed',
        payment_method: data.payment_method as 'transfer' | 'dana' | undefined
      };
      
      setCVPurchases(prev => prev.map(purchase => 
        purchase.id === purchaseId ? typedData : purchase
      ));
      return typedData;
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
