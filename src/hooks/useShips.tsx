
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Ship {
  id: string;
  user_id: string;
  name: string;
  type?: string;
  imo_number?: string;
  call_sign?: string;
  flag?: string;
  length_m?: number;
  width_m?: number;
  draft_m?: number;
  gross_tonnage?: number;
  status: string;
  current_lat?: number;
  current_lng?: number;
  current_speed: number;
  current_heading: number;
  created_at: string;
  updated_at: string;
}

export const useShips = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchShips = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShips(data || []);
    } catch (error) {
      console.error('Error fetching ships:', error);
    } finally {
      setLoading(false);
    }
  };

  const addShip = async (shipData: Partial<Ship>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ships')
        .insert([{ ...shipData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setShips(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding ship:', error);
      return null;
    }
  };

  const updateShip = async (id: string, shipData: Partial<Ship>) => {
    try {
      const { data, error } = await supabase
        .from('ships')
        .update(shipData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setShips(prev => prev.map(ship => ship.id === id ? data : ship));
      return data;
    } catch (error) {
      console.error('Error updating ship:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchShips();
  }, [user]);

  return { ships, loading, addShip, updateShip, refetch: fetchShips };
};
