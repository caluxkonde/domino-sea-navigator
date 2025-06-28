
import React from 'react';
import { TideData } from '@/types/tidal';

interface TidalChartProps {
  nextTides: TideData[];
}

const TidalChart: React.FC<TidalChartProps> = ({ nextTides }) => {
  if (nextTides.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="bg-slate-50 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600">Grafik 24 Jam</span>
        </div>
        <div className="relative h-12 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded overflow-hidden">
          {nextTides.map((tide, index) => (
            <div
              key={index}
              className={`absolute w-1.5 rounded-full ${
                tide.type === 'high' ? 'bg-blue-600' : 'bg-blue-400'
              }`}
              style={{
                left: `${(index * 20)}%`,
                height: `${Math.max(20, (tide.height / 3) * 100)}%`,
                bottom: '0',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TidalChart;
