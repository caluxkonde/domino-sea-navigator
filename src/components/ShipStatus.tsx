
import React from 'react';
import { Ship, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ShipStatus = () => {
  const shipData = {
    name: 'MV Ocean Explorer',
    position: {
      lat: '-6.2088',
      lng: '106.8456'
    },
    speed: '12.5 knots',
    heading: '045°',
    depth: '125m',
    weather: 'Cerah',
    windSpeed: '8 knots'
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Ship className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg text-slate-800">Status Kapal</CardTitle>
            <CardDescription className="text-slate-600">
              Informasi kapal saat ini
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Ship Name */}
        <div className="text-center pb-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{shipData.name}</h3>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Posisi</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm text-slate-600">
              Lat: {shipData.position.lat}
            </p>
            <p className="text-sm text-slate-600">
              Lng: {shipData.position.lng}
            </p>
          </div>
        </div>

        {/* Navigation Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">Kecepatan</p>
            <p className="text-lg font-semibold text-blue-800">{shipData.speed}</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">Arah</p>
            <p className="text-lg font-semibold text-blue-800">{shipData.heading}</p>
          </div>
        </div>

        {/* Environmental Data */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Kedalaman</span>
            <span className="text-sm font-medium text-slate-800">{shipData.depth}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Cuaca</span>
            <span className="text-sm font-medium text-slate-800">{shipData.weather}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-600">Kec. Angin</span>
            <span className="text-sm font-medium text-slate-800">{shipData.windSpeed}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipStatus;
