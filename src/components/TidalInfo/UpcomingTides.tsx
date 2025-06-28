
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TideData } from '@/types/tidal';

interface UpcomingTidesProps {
  nextTides: TideData[];
}

const UpcomingTides: React.FC<UpcomingTidesProps> = ({ nextTides }) => {
  if (nextTides.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">Jadwal Selanjutnya</h4>
      <div className="space-y-2">
        {nextTides.map((tide, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              {tide.type === 'high' ? (
                <TrendingUp className="h-4 w-4 text-slate-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-slate-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {tide.type === 'high' ? 'Pasang' : 'Surut'}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(tide.time).toLocaleString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {tide.height.toFixed(1)}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTides;
