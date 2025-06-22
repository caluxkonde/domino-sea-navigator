
import React, { useState } from 'react';
import { Waves, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTidalData } from '@/hooks/useTidalData';

const TidalInfo = () => {
  const [selectedLocation, setSelectedLocation] = useState('Jakarta Bay');
  const { tidalData, loading } = useTidalData(selectedLocation);

  // Data lokasi berdasarkan negara dan kota
  const locations = {
    Indonesia: [
      { name: 'Jakarta Bay', label: 'Jakarta Bay' },
      { name: 'Surabaya Port', label: 'Pelabuhan Surabaya' },
      { name: 'Medan Port', label: 'Pelabuhan Medan' },
      { name: 'Makassar Port', label: 'Pelabuhan Makassar' },
      { name: 'Batam Port', label: 'Pelabuhan Batam' }
    ],
    Malaysia: [
      { name: 'Port Klang', label: 'Port Klang' },
      { name: 'Penang Port', label: 'Pelabuhan Penang' },
      { name: 'Johor Port', label: 'Pelabuhan Johor' }
    ],
    Singapore: [
      { name: 'Singapore Port', label: 'Pelabuhan Singapore' }
    ],
    Thailand: [
      { name: 'Bangkok Port', label: 'Pelabuhan Bangkok' },
      { name: 'Phuket Port', label: 'Pelabuhan Phuket' }
    ]
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <CardTitle className="text-lg">Memuat data pasang surut...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const nextTides = tidalData.slice(0, 4);
  const currentTide = nextTides[0];

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Waves className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-800">Informasi Pasang Surut</CardTitle>
            <CardDescription className="text-slate-600">
              Data Real-time
            </CardDescription>
          </div>
        </div>
        
        {/* Location Selector */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>Lokasi:</span>
          </div>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Pilih lokasi" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50 max-h-60">
              {Object.entries(locations).map(([country, cities]) => (
                <div key={country}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 sticky top-0">
                    {country}
                  </div>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name} className="hover:bg-slate-100">
                      <span className="text-sm">{city.label}</span>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current/Next Tide */}
        {currentTide ? (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {currentTide.tide_type === 'high' ? (
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                )}
                <span className="font-semibold text-blue-800 text-sm sm:text-base">
                  {currentTide.tide_type === 'high' ? 'Pasang Tinggi' : 'Pasang Rendah'}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-800">
                {currentTide.tide_height_m.toFixed(1)}m
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-700">
              {new Date(currentTide.tide_time).toLocaleString('id-ID', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600 text-sm">Tidak ada data untuk lokasi ini</p>
          </div>
        )}

        {/* Upcoming Tides */}
        {nextTides.length > 1 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700">Jadwal Selanjutnya</h4>
            <div className="space-y-2">
              {nextTides.slice(1).map((tide, index) => (
                <div key={tide.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {tide.tide_type === 'high' ? (
                      <TrendingUp className="h-4 w-4 text-slate-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-slate-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {tide.tide_type === 'high' ? 'Pasang' : 'Surut'}
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
          </div>
        )}

        {/* Tidal Chart Visualization */}
        {nextTides.length > 0 && (
          <div className="mt-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600">Grafik 24 Jam</span>
              </div>
              <div className="relative h-12 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded overflow-hidden">
                {nextTides.map((tide, index) => (
                  <div
                    key={tide.id}
                    className={`absolute w-1.5 rounded-full ${
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
        )}
      </CardContent>
    </Card>
  );
};

export default TidalInfo;
