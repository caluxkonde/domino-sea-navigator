
import React, { useState, useEffect } from 'react';
import { Waves, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TidalInfo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tidalData, setTidalData] = useState({
    currentHeight: 2.3,
    trend: 'rising',
    nextHigh: '14:30',
    nextLow: '20:45',
    highHeight: 3.2,
    lowHeight: 0.8
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate changing tidal data
      setTidalData(prev => ({
        ...prev,
        currentHeight: Math.round((2.0 + Math.sin(Date.now() / 100000) * 1.2) * 10) / 10
      }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const getTidalColor = (trend: string) => {
    return trend === 'rising' ? 'text-blue-600' : 'text-blue-800';
  };

  const getTidalIcon = (trend: string) => {
    return trend === 'rising' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Waves className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg text-slate-800">Info Pasang Surut</CardTitle>
            <CardDescription className="text-slate-600">
              Data real-time kondisi laut
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Tidal Height */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className={`font-bold text-2xl ${getTidalColor(tidalData.trend)}`}>
              {tidalData.currentHeight}m
            </span>
            <div className={getTidalColor(tidalData.trend)}>
              {getTidalIcon(tidalData.trend)}
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Ketinggian saat ini - {tidalData.trend === 'rising' ? 'Naik' : 'Turun'}
          </p>
        </div>

        {/* Tidal Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Surut: {tidalData.lowHeight}m</span>
            <span>Pasang: {tidalData.highHeight}m</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((tidalData.currentHeight - tidalData.lowHeight) / (tidalData.highHeight - tidalData.lowHeight)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Next Tidal Events */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center mb-2">
              <ArrowUp className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-800">Pasang</span>
            </div>
            <p className="text-lg font-bold text-blue-700">{tidalData.nextHigh}</p>
            <p className="text-xs text-blue-600">{tidalData.highHeight}m</p>
          </div>
          
          <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-center mb-2">
              <ArrowDown className="h-4 w-4 text-slate-600 mr-1" />
              <span className="text-sm font-medium text-slate-700">Surut</span>
            </div>
            <p className="text-lg font-bold text-slate-700">{tidalData.nextLow}</p>
            <p className="text-xs text-slate-600">{tidalData.lowHeight}m</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-200 pt-3">
          Terakhir diperbarui: {currentTime.toLocaleTimeString('id-ID')}
        </div>
      </CardContent>
    </Card>
  );
};

export default TidalInfo;
