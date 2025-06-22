
import React, { useState } from 'react';
import { Ship, LogOut, Waves, Settings, Users, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import TidalInfo from './TidalInfo';
import ShipStatus from './ShipStatus';
import NavigationMap from './NavigationMap';
import ShipManagement from './ShipManagement';

const Dashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Ship },
    { id: 'ships', label: 'Manajemen Kapal', icon: Settings },
    { id: 'routes', label: 'Rute & Navigasi', icon: Route },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'ships':
        return <ShipManagement />;
      case 'routes':
        return (
          <div className="text-center py-12">
            <Route className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Rute & Navigasi</h3>
            <p className="text-slate-500">Fitur manajemen rute akan segera hadir</p>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ShipStatus />
            </div>
            <div className="lg:col-span-1">
              <NavigationMap />
            </div>
            <div className="lg:col-span-1">
              <TidalInfo />
            </div>
          </div>
        );
    }
  };

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
              onClick={signOut}
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
