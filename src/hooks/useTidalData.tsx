
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TidalData {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  tide_time: string;
  tide_height_m: number;
  tide_type: 'high' | 'low';
  created_at: string;
}

export const useTidalData = (location?: string) => {
  const [tidalData, setTidalData] = useState<TidalData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTidalData = async () => {
    try {
      let query = supabase
        .from('tidal_data')
        .select('*')
        .gte('tide_time', new Date().toISOString())
        .order('tide_time', { ascending: true });

      if (location) {
        query = query.eq('location_name', location);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      setTidalData(data || []);
    } catch (error) {
      console.error('Error fetching tidal data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTidalData();
  }, [location]);

  return { tidalData, loading, refetch: fetchTidalData };
};
