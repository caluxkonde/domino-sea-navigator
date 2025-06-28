
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TideData } from '@/types/tidal';

interface CurrentTideStatusProps {
  currentTide: TideData | null;
}

const CurrentTideStatus: React.FC<CurrentTideStatusProps> = ({ currentTide }) => {
  if (!currentTide) {
    return (
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-600 text-sm">Tidak ada data untuk lokasi ini</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {currentTide.type === 'high' ? (
            <TrendingUp className="h-5 w-5 text-blue-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-blue-600" />
          )}
          <div>
            <span className="font-semibold text-blue-800 text-sm sm:text-base">
              {currentTide.type === 'high' ? 'Pasang Tinggi' : 'Pasang Rendah'}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentTide.status === 'rising' ? 'bg-green-100 text-green-700' :
                currentTide.status === 'falling' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {currentTide.status === 'rising' ? '↗ Naik' :
                 currentTide.status === 'falling' ? '↘ Turun' :
                 '→ Stabil'}
              </span>
            </div>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-800">
          {currentTide.height.toFixed(1)}m
        </span>
      </div>
      <p className="text-xs sm:text-sm text-blue-700">
        {new Date(currentTide.time).toLocaleString('id-ID', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
};

export default CurrentTideStatus;
