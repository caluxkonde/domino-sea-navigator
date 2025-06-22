
import React from 'react';
import { Ship, LogOut, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TidalInfo from './TidalInfo';
import ShipStatus from './ShipStatus';
import NavigationMap from './NavigationMap';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Ship className="h-8 w-8 text-blue-600" />
                <Waves className="h-4 w-4 text-blue-400 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">NaviMarine</h1>
                <p className="text-sm text-slate-600">Dashboard Navigasi</p>
              </div>
            </div>
            
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ship Status */}
          <div className="lg:col-span-1">
            <ShipStatus />
          </div>
          
          {/* Middle Column - Navigation Map */}
          <div className="lg:col-span-1">
            <NavigationMap />
          </div>
          
          {/* Right Column - Tidal Information */}
          <div className="lg:col-span-1">
            <TidalInfo />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
