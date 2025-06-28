
import React from 'react';
import { Moon, Sunrise, Sunset } from 'lucide-react';

interface SunMoonInfoProps {
  moonPhase: string;
  sunTimes: {
    sunrise: string;
    sunset: string;
  };
}

const SunMoonInfo: React.FC<SunMoonInfoProps> = ({ moonPhase, sunTimes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-gradient-to-r from-orange-50 to-yellow-100 p-3 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-2 mb-1">
          <Sunrise className="h-4 w-4 text-orange-600" />
          <span className="text-xs font-medium text-orange-800">Matahari Terbit</span>
        </div>
        <p className="text-sm font-semibold text-orange-800">
          {new Date(sunTimes.sunrise).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-3 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-1">
          <Moon className="h-4 w-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-800">Fase Bulan</span>
        </div>
        <p className="text-sm font-semibold text-purple-800">{moonPhase}</p>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-pink-100 p-3 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2 mb-1">
          <Sunset className="h-4 w-4 text-red-600" />
          <span className="text-xs font-medium text-red-800">Matahari Tenggelam</span>
        </div>
        <p className="text-sm font-semibold text-red-800">
          {new Date(sunTimes.sunset).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default SunMoonInfo;
