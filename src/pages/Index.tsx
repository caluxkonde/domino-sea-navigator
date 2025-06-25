
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import AppSidebar from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import TidalInfo from '@/components/TidalInfo';
import ShipManagement from '@/components/ShipManagement';
import NavigationMap from '@/components/NavigationMap';
import ContractManagement from '@/components/ContractManagement';
import AdminPanel from '@/components/AdminPanel';
import UserProfile from '@/components/UserProfile';
import BlogPage from '@/components/BlogPage';
import CVBuilder from '@/components/CVBuilder';
import CertificationPage from '@/components/CertificationPage';
import Leaderboard from '@/components/Leaderboard';
import { useAuth } from '@/hooks/useAuth';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />;
      case 'tides':
        return <TidalInfo />;
      case 'ships':
        return <ShipManagement />;
      case 'routes':
        return <NavigationMap />;
      case 'contracts':
        return <ContractManagement />;
      case 'admin':
        return <AdminPanel />;
      case 'profile':
        return <UserProfile />;
      case 'blog':
        return <BlogPage />;
      case 'cv-builder':
        return <CVBuilder />;
      case 'certifications':
        return <CertificationPage />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
