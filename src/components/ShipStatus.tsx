
import React from 'react';
import { Ship, MapPin, Plus, Navigation, Anchor, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useShips } from '@/hooks/useShips';

const ShipStatus = () => {
  const { ships, loading } = useShips();
  
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-pulse">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeShip = ships.find(ship => ship.status === 'active') || ships[0];

  if (!activeShip) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800">Status Armada</CardTitle>
              <CardDescription className="text-slate-600">
                Monitoring kapal real-time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="text-center py-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto">
              <Ship className="h-10 w-10 text-blue-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Belum Ada Kapal Terdaftar</h3>
          <p className="text-slate-500 mb-6">Tambahkan kapal pertama Anda untuk mulai monitoring navigasi</p>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Daftarkan Kapal Baru
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'docked': return 'bg-blue-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Berlayar';
      case 'docked': return 'Berlabuh';
      case 'maintenance': return 'Perawatan';
      default: return 'Tidak Diketahui';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800">Status Armada</CardTitle>
              <CardDescription className="text-slate-600">
                Monitoring real-time
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(activeShip.status)} mr-2`}></div>
            Online
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ship Header */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800">{activeShip.name}</h3>
            <Badge className={`${getStatusColor(activeShip.status)} text-white`}>
              {getStatusText(activeShip.status)}
            </Badge>
          </div>
          {activeShip.type && (
            <p className="text-sm text-blue-700 font-medium">{activeShip.type}</p>
          )}
          {activeShip.call_sign && (
            <p className="text-xs text-blue-600">Call Sign: {activeShip.call_sign}</p>
          )}
        </div>

        {/* Navigation Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Kecepatan</span>
            </div>
            <p className="text-xl font-bold text-blue-800">{activeShip.current_speed}</p>
            <p className="text-xs text-blue-600">knots</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Heading</span>
            </div>
            <p className="text-xl font-bold text-green-800">{activeShip.current_heading}°</p>
            <p className="text-xs text-green-600">compass</p>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Posisi Terkini</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            {activeShip.current_lat && activeShip.current_lng ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Latitude</p>
                  <p className="text-sm font-mono text-slate-700">
                    {activeShip.current_lat.toFixed(6)}°
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Longitude</p>
                  <p className="text-sm font-mono text-slate-700">
                    {activeShip.current_lng.toFixed(6)}°
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-orange-600">Posisi belum tersedia</p>
              </div>
            )}
          </div>
        </div>

        {/* Ship Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
            Informasi Kapal
          </h4>
          <div className="space-y-2">
            {activeShip.flag && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Bendera</span>
                <span className="text-sm font-medium text-slate-800">{activeShip.flag}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Status Operasi</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  activeShip.status === 'active' 
                    ? 'border-green-200 text-green-700 bg-green-50' 
                    : 'border-gray-200 text-gray-700 bg-gray-50'
                }`}
              >
                {getStatusText(activeShip.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-slate-200">
          <Button variant="outline" size="sm" className="flex-1">
            <MapPin className="h-4 w-4 mr-2" />
            Lihat di Peta
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Navigation className="h-4 w-4 mr-2" />
            Rute Aktif
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipStatus;
