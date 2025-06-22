
import React, { useState } from 'react';
import { LogOut, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import TidalInfo from './TidalInfo';
import ShipStatus from './ShipStatus';
import NavigationMap from './NavigationMap';
import ShipManagement from './ShipManagement';
import ContractManagement from './ContractManagement';
import AppSidebar from './AppSidebar';

const Dashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'ships':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Manajemen Kapal</h1>
              <p className="text-slate-600">Kelola dan pantau data kapal Anda</p>
            </div>
            <ShipManagement />
          </div>
        );
      case 'contracts':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Kontrak Nahkoda</h1>
              <p className="text-slate-600">Kelola kontrak dan pembayaran nahkoda</p>
            </div>
            <ContractManagement />
          </div>
        );
      case 'routes':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <Route className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Rute & Navigasi</h3>
              <p className="text-slate-500">Fitur manajemen rute akan segera hadir</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-600">Ringkasan informasi navigasi dan kapal</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
              <div className="order-1">
                <ShipStatus />
              </div>
              <div className="order-2">
                <NavigationMap />
              </div>
              <div className="order-3">
                <TidalInfo />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-40">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="hidden sm:block">
                    <nav className="text-sm text-slate-500">
                      <span className="capitalize">{activeTab === 'overview' ? 'Dashboard' : activeTab}</span>
                    </nav>
                  </div>
                </div>
                
                <Button 
                  onClick={signOut}
                  variant="outline" 
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Keluar</span>
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              {renderContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
