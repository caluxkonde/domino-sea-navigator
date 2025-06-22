
import React from 'react';
import { MapPin, Ship } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NavigationMap = () => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg text-slate-800">Peta Navigasi</CardTitle>
            <CardDescription className="text-slate-600">
              Posisi dan rute kapal
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Simplified Map Visualization */}
        <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-64 overflow-hidden">
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b border-blue-300" style={{ height: '12.5%' }}></div>
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute border-r border-blue-300 h-full" style={{ left: `${i * 12.5}%`, width: '1px' }}></div>
            ))}
          </div>
          
          {/* Ship position */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <Ship className="h-8 w-8 text-blue-600 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
          
          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 20 80 Q 150 40 280 120"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="opacity-60"
            />
          </svg>
          
          {/* Waypoints */}
          <div className="absolute top-5 left-5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-8 right-8 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
        </div>
        
        {/* Map Legend */}
        <div className="mt-4 flex justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Kapal</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Tujuan</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationMap;
