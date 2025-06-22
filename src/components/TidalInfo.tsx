
import React from 'react';
import { Waves, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTidalData } from '@/hooks/useTidalData';

const TidalInfo = () => {
  const { tidalData, loading } = useTidalData('Jakarta Bay');

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Loading tidal data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const nextTides = tidalData.slice(0, 4);
  const currentTide = nextTides[0];

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Waves className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg text-slate-800">Informasi Pasang Surut</CardTitle>
            <CardDescription className="text-slate-600">
              Jakarta Bay - Data Real-time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current/Next Tide */}
        {currentTide && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {currentTide.tide_type === 'high' ? (
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                )}
                <span className="font-semibold text-blue-800 capitalize">
                  {currentTide.tide_type === 'high' ? 'Pasang Tinggi' : 'Pasang Rendah'}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-800">
                {currentTide.tide_height_m.toFixed(1)}m
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {new Date(currentTide.tide_time).toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}

        {/* Upcoming Tides */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">Jadwal Selanjutnya</h4>
          {nextTides.slice(1).map((tide, index) => (
            <div key={tide.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex items-center space-x-2">
                {tide.tide_type === 'high' ? (
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-slate-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-700 capitalize">
                    {tide.tide_type === 'high' ? 'Pasang Tinggi' : 'Pasang Rendah'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(tide.tide_time).toLocaleString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {tide.tide_height_m.toFixed(1)}m
              </span>
            </div>
          ))}
        </div>

        {/* Tidal Chart Visualization */}
        <div className="mt-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Grafik Pasang Surut 24 Jam</span>
            </div>
            <div className="relative h-16 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded overflow-hidden">
              {nextTides.map((tide, index) => (
                <div
                  key={tide.id}
                  className={`absolute w-2 rounded-full ${
                    tide.tide_type === 'high' ? 'bg-blue-600' : 'bg-blue-400'
                  }`}
                  style={{
                    left: `${(index * 25)}%`,
                    height: `${Math.max(20, (tide.tide_height_m / 4) * 100)}%`,
                    bottom: '0',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TidalInfo;
