
import React from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { locations } from '@/utils/tidalUtils';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        <MapPin className="h-4 w-4" />
        <span>Lokasi:</span>
      </div>
      
      <Select value={selectedLocation} onValueChange={onLocationChange}>
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
  );
};

export default LocationSelector;
