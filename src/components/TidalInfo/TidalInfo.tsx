
import React, { useState } from 'react';
import { Waves } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTidalData } from '@/hooks/useTidalData';
import { getTideStatus } from '@/utils/tidalUtils';
import LocationSelector from './LocationSelector';
import CurrentTideStatus from './CurrentTideStatus';
import SunMoonInfo from './SunMoonInfo';
import UpcomingTides from './UpcomingTides';
import TidalChart from './TidalChart';

const TidalInfo = () => {
  const [selectedLocation, setSelectedLocation] = useState('current');
  const { tidalData, loading } = useTidalData();

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

  // Create current data from tidal data
  const currentTide = tidalData[0] || null;
  const nextTide = tidalData[1] || null;
  const tideStatus = getTideStatus(currentTide, nextTide);

  const currentData = {
    currentTide: currentTide ? {
      type: currentTide.tide_type,
      height: currentTide.tide_height_m,
      time: currentTide.tide_time,
      status: tideStatus
    } : null,
    nextTides: tidalData.slice(1, 5).map(tide => ({
      type: tide.tide_type,
      height: tide.tide_height_m,
      time: tide.tide_time
    })),
    location: selectedLocation === 'current' ? 'Lokasi Saat Ini' : selectedLocation,
    moonPhase: 'Full Moon',
    sunTimes: {
      sunrise: new Date().toISOString(),
      sunset: new Date().toISOString()
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Waves className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-800">Pasang Surut Real-time</CardTitle>
            <CardDescription className="text-slate-600">
              Data Terkini & Prediksi
            </CardDescription>
          </div>
        </div>
        
        <div className="mt-4">
          <LocationSelector 
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CurrentTideStatus currentTide={currentData.currentTide} />
        
        <SunMoonInfo 
          moonPhase={currentData.moonPhase}
          sunTimes={currentData.sunTimes}
        />

        <UpcomingTides nextTides={currentData.nextTides} />

        <TidalChart nextTides={currentData.nextTides} />
      </CardContent>
    </Card>
  );
};

export default TidalInfo;
