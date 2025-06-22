
import React from 'react';
import { Ship, MapPin, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useShips } from '@/hooks/useShips';

const ShipStatus = () => {
  const { ships, loading } = useShips();
  
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Loading ships...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const activeShip = ships.find(ship => ship.status === 'active') || ships[0];

  if (!activeShip) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Ship className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg text-slate-800">Status Kapal</CardTitle>
              <CardDescription className="text-slate-600">
                Belum ada kapal terdaftar
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="text-center py-8">
          <Ship className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Belum Ada Kapal</h3>
          <p className="text-slate-500 mb-4">Tambahkan kapal untuk melihat status navigasi</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kapal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Ship className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg text-slate-800">Status Kapal</CardTitle>
            <CardDescription className="text-slate-600">
              Informasi kapal aktif
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Ship Name */}
        <div className="text-center pb-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{activeShip.name}</h3>
          {activeShip.type && (
            <p className="text-sm text-slate-600">{activeShip.type}</p>
          )}
        </div>

        {/* Position */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Posisi</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            {activeShip.current_lat && activeShip.current_lng ? (
              <>
                <p className="text-sm text-slate-600">
                  Lat: {activeShip.current_lat.toFixed(6)}
                </p>
                <p className="text-sm text-slate-600">
                  Lng: {activeShip.current_lng.toFixed(6)}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Posisi belum diset</p>
            )}
          </div>
        </div>

        {/* Navigation Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">Kecepatan</p>
            <p className="text-lg font-semibold text-blue-800">{activeShip.current_speed} knots</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">Arah</p>
            <p className="text-lg font-semibold text-blue-800">{activeShip.current_heading}°</p>
          </div>
        </div>

        {/* Ship Details */}
        <div className="space-y-3">
          {activeShip.call_sign && (
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Call Sign</span>
              <span className="text-sm font-medium text-slate-800">{activeShip.call_sign}</span>
            </div>
          )}
          
          {activeShip.flag && (
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Bendera</span>
              <span className="text-sm font-medium text-slate-800">{activeShip.flag}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-600">Status</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              activeShip.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {activeShip.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipStatus;
