
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TidalData {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  tide_type: string;
  tide_height_m: number;
  tide_time: string;
  created_at: string;
}

export const useTidalData = () => {
  const [tidalData, setTidalData] = useState<TidalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTidalData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tidal_data')
        .select('*')
        .order('tide_time', { ascending: true });

      if (error) throw error;
      
      setTidalData(data || []);
    } catch (error) {
      console.error('Error fetching tidal data:', error);
      setError('Gagal mengambil data pasang surut');
    } finally {
      setLoading(false);
    }
  };

  const addTidalData = async (newData: Omit<TidalData, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tidal_data')
        .insert(newData)
        .select()
        .single();

      if (error) throw error;
      
      setTidalData(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding tidal data:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTidalData();
  }, []);

  return {
    tidalData,
    loading,
    error,
    refetch: fetchTidalData,
    addTidalData,
  };
};
